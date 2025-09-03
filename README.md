# Referral Program – Monorepo

A small, two-app monorepo that demonstrates a referral dashboard:

- **`referral-api/`** – NestJS + GraphQL server with an **in‑memory seed** (JSON-like data) that exposes:
  - `referralSummary(customerId)` – aggregated stats for a customer
  - `sendReferralCode(code)` – simulates sending a referral code and appends a new `INVITED` referral in-memory
- **`referral-web/`** – Next.js 14 app using Apollo Client to render the dashboard (Progress bar, credits, code actions, toast).

> Designed to be dead simple to run locally with `npm ci && npm run dev` in each folder.

---

## Repo Layout

```
.
├── referral-api/            # NestJS GraphQL API (port 4000)
│   ├── src/
│   │   ├── mock/referral.seed.ts     # In-memory data + derivation + send helper
│   │   └── referral/                 # Resolver, types/DTOs, service wrapper
│   ├── package.json
│   └── README.md (local api-specific notes, optional)
│
├── referral-web/            # Next.js UI (port 3000)
│   ├── src/
│   │   ├── app/
│   │   │   └── page.tsx               # ReferralDashboard entry
│   │   ├── graphql/queries.ts         # GQL operations
│   │   ├── hooks/useReferralData.ts   # Hook mapping API → UI model
│   │   └── components/referrals/…     # UI pieces (ProgressBar, CodeSection, etc.)
│   ├── public/refer-icon.png
│   └── package.json
│
└── README.md (this file)
```

---

## Prereqs

- Node.js 18+ (LTS recommended)
- pnpm or npm (the scripts below use **npm**; `pnpm` works too)
- Ports **3000** (web) and **4000** (api) must be free locally

---

## Quick Start

### 1) API

```bash
cd referral-api
npm install
npm run start:dev   # runs on http://localhost:4000/graphql
```

### 2) Web

```bash
cd referral-web
npm install
npm run dev         # runs on http://localhost:3000
---

## Assumptions & Shortcuts (explicit)

- **Email delivery** is mocked. `sendReferralCode` logs to console and adds a dummy `INVITED` referral.
- **Auth** is not enforced yet; the UI queries by `customerId` (default `cus_123`).
- **Storage** is **in-memory seed** only. No DB yet (see improvements below).
- **CORS**: Dev-friendly open policy on local.
- **Rates/abuse**: Not enforced in seed mode.

---

## Switching Data Backends (Seed vs DB)

Right now the API uses an **in-memory seed** in `src/mock/referral.seed.ts`. To keep the path to a DB simple:

- Add a data adapter in `src/referral/data.adapter.ts` with two implementations:
  - `MemoryAdapter` that delegates to the existing seed helpers (`getSummary`, `sendReferralCode`).
  - `MongoAdapter` when/if you add a DB.
- Toggle via env:
  ```
  # referral-api/.env
  DATA_BACKEND=memory   # or mongo (future)
  ```

> The GraphQL schema and DTOs **do not change**; only the service wiring swaps adapters.

---

## Example GraphQL Operations

### Query – Referral Summary
```graphql
query ExampleSummary {
  referralSummary(customerId: "cus_123") {
    customerId
    code
    program { rewardAmount friendDiscount maxReferrals }
    stats   { referredCountYear earnedTotal redeemedTotal availableCredit }
  }
}
```

### Mutation – Send Referral Code
Current seed returns success metadata and re-derives stats after adding a new `INVITED` entry.
```graphql
mutation SendCode {
  sendReferralCode(code: "0180YNUP") {
    ok
    message
    timestamp
    # In the current seed we also return stats for convenience:
    # stats { referredCountYear earnedTotal redeemedTotal availableCredit }
  }
}
```

If you extend your schema to return the **updated summary** directly (recommended):
```graphql
mutation SendCodeBetter {
  sendReferralCode(code: "0180YNUP") {
    ok
    message
    timestamp
    summary {
      customerId
      code
      program { rewardAmount friendDiscount maxReferrals }
      stats   { referredCountYear earnedTotal redeemedTotal availableCredit }
    }
  }
}
```

---

## Web Notes

- Apollo client is wired via `@apollo/client-integration-nextjs` provider.
- Toasts live under `src/components/ui/toast` and `src/hooks/use-toast`.
- The dashboard shows:
  - Hero card with “Send Code” (opens a send action; currently no friend form)
  - Progress bar (derived stats)
  - Credits strip (Ready to use / Total referrals YTD / Redeemed)

---

## Project-Specific Improvements & Observability

This app is a NestJS GraphQL API + Next.js UI with an in-memory seed. Below are focused, project-specific next steps.

### 1) Database Architecture (when moving off seed)
**Goal:** keep the same Pattern API/DTO shapes; add integrity & scale.

- **Rules**
  - Normalize emails (lowercase/trim) before insert/update.
  - Do **not** store `earnedTotal`, `redeemedTotal`, `availableCredit` → compute via aggregation (`$group`, `$sum`).
  - Optional: `invite_events` collection (for history/resends/audit).

### 2) Login & Authentication
**Goal:** ensure requests are scoped to the right customer.

- **Backend**
  - Issue **JWT** on login (demo token is fine for this project) with `customerId` claim.
  - Add a GraphQL auth guard that injects `customerId` into resolvers.
  - Rate limit: per-customer & per-IP (e.g., 10 invites/24h).
- **Frontend**
  - Store token in httpOnly cookie if you want SSR-friendly auth.
  - Attach `Authorization: Bearer <token>` on Apollo client.
  - Remove `customerId` from queries; derive from token on the server.

### 3) “Send Code” → Form Popup (collect friend details)
**Goal:** make the invite real instead of blind “send”.

- **UX**
  - Button opens a modal with fields: **Friend name** (optional), **Friend email** (required), optional message.
  - Disable submit while sending; show success toast, then refetch summary.
- **GraphQL**
  ```graphql
  input FriendInput { name: String, email: String! }

  mutation SendReferralCode($code: String!, $friend: FriendInput!) {
    sendReferralCode(code: $code, friend: $friend) {
      ok
      message
      timestamp
      summary {
        customerId
        code
        program { rewardAmount friendDiscount maxReferrals }
        stats   { referredCountYear earnedTotal redeemedTotal availableCredit }
      }
      error { code message } # if you adopt a typed error union
    }
  }
  ```
- **Validation**
  - Reject disposable domains; enforce one invite per `(referredBy, friend.email)`.
  - Idempotency key `(code, friend.email)` for 5–10 min to prevent accidental duplicates.

### 4) Observability (simple but useful)
- **Structured logs** (JSON)
  ```json
  {"event":"send_referral","customerId":"cus_123","friendEmailHash":"<sha256>","status":"success","ts":"2025-09-03T12:00:00Z","requestId":"..."}
  ```
  *Hash emails; don’t log PII.*
- **Counters (console now, Prometheus later)**
  - `referral.invites_sent_total{customerId}`
  - `referral.signups_total{customerId}`
  - `referral.redemptions_total{customerId}`
  - `referral.conversion_rate`
  - `referral.errors_total{operation}`
- **Tracing-lite**
  - Generate `requestId` per request; include in logs and GraphQL `extensions`.
- **Basic alerts**
  - Warn if `errors_total` spikes or conversion < threshold over 24h.

## License

MIT (for the purposes of the coding challenge).

---

Happy hacking! ✨
