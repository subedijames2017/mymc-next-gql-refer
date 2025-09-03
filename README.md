
# MYMC Monorepo — Referral Demo (API + Web)

This repository contains **two apps**:

```
.
├─ referral-api   # NestJS GraphQL API (in-memory seed data)
└─ referral-web   # Next.js web (Apollo Client)
```

- **API**: exposes `referralSummary(customerId)` and `sendReferralCode(code)`
- **Web**: small dashboard that consumes the API; shows summary and triggers the mutation

---

## Requirements

- **Node.js 18+** and **npm 9+**
- Two terminals (one for API, one for web)

> We use **in-memory/JSON seed data** for simplicity, per challenge brief.

---

## Quick Start (straightforward, no shortcuts)

### 1) Start the API (NestJS)

```bash
cd referral-api
npm install
npm run start:dev      # serves at http://localhost:4000/graphql
```

You should see the GraphQL Playground at **http://localhost:4000/graphql**.

### 2) Start the Web (Next.js)

```bash
cd referral-web
npm install
# Set your API endpoint for the web app:
# If not already present, create .env.local with the following line:
# NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
npm run dev            # serves at http://localhost:3000
```

Open **http://localhost:3000**.

---

## How Data Works (JSON / In‑Memory)

The API uses **in-memory seed data** (see `referral-api/src/mock/referral.seed.ts`).  
Key behavior:

- `referralSummary(customerId)` returns a computed summary from the seed for the given customer.
- `sendReferralCode(code)` **simulates** sending a referral code:
  - Finds the customer by `code` (falls back to `cus_123` if not found).
  - Appends a new **INVITED** referral to the in-memory list (random friend).
  - Returns `{ ok, message, timestamp, stats }` where `stats` reflect updated totals.

> **Note:** Because this is in-memory, state resets on server restart.

### Switching to a DB (optional, if you choose to extend later)
- Replace the seed imports in `referral.service.ts` with a repository/provider that reads/writes from your DB (SQLite/Mongo).
- Mirror the same interface (`getSummary`, `sendReferralCode`) so your resolver stays unchanged.
- This is not required for the challenge, but the service was kept thin to make a DB swap easy.

---

## Example GraphQL Operations

**Query (summary):**
```graphql
query {
  referralSummary(customerId: "cus_123") {
    customerId
    code
    program {
      rewardAmount
      friendDiscount
      maxReferrals
    }
    stats {
      referredCountYear
      earnedTotal
      redeemedTotal
      availableCredit
    }
  }
}
```

**Sample Response:**
```json
{
  "data": {
    "referralSummary": {
      "customerId": "cus_123",
      "code": "0180YNUP",
      "program": { "rewardAmount": 20, "friendDiscount": 40, "maxReferrals": 25 },
      "stats": { "referredCountYear": 4, "earnedTotal": 80, "redeemedTotal": 40, "availableCredit": 40 }
    }
  }
}
```

**Mutation (send code):**
```graphql
mutation {
  sendReferralCode(code: "0180YNUP") {
    ok
    message
    timestamp
    stats {
      referredCountYear
      earnedTotal
      redeemedTotal
      availableCredit
    }
  }
}
```

**Sample Response:**
```json
{
  "data": {
    "sendReferralCode": {
      "ok": true,
      "message": "Referral code 0180YNUP sent at 2025-06-01T12:34:56.789Z (added john.doe1234@example.com)",
      "timestamp": "2025-06-01T12:34:56.789Z",
      "stats": { "referredCountYear": 5, "earnedTotal": 80, "redeemedTotal": 40, "availableCredit": 40 }
    }
  }
}
```

---

## Scripts

### API (`referral-api/package.json`)
- `npm run start:dev` — Nest dev mode with hot reload  
- `npm run build` — compile to `dist/`  
- `npm run start:prod` — start compiled app (`node dist/main`)  
- `npm test` — if configured by Nest (optional)

### Web (`referral-web/package.json`)
- `npm run dev` — Next.js dev server  
- `npm run build` — production build  
- `npm start` — start production server  
- `npm run lint` — run ESLint (if configured)

---

## Assumptions / Shortcuts

- No authentication; one public referral dashboard.
- No email is actually sent—the mutation simulates success and updates the in-memory dataset.
- A single GraphQL endpoint is used by the web app, provided via `NEXT_PUBLIC_GRAPHQL_ENDPOINT`.
- Styling via Tailwind/shadcn (you can tweak tokens in `tailwind.config.ts` / `globals.css`).

---

## Troubleshooting

- **Web can’t reach API:** ensure the API is running at `http://localhost:4000/graphql` and your `.env.local` matches.
- **CORS**: Nest GraphQL typically enables CORS by default; if you customized it, re-enable CORS in `main.ts`.
- **Lockfile mismatch with `npm ci`**: run `npm install` once to update `package-lock.json`, commit it, then `npm ci` works again.

---

## License

For the purposes of the coding challenge. Use as a reference/starter.
