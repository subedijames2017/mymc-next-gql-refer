# Referral Program – Monorepo

A small, two-app monorepo that demonstrates a referral dashboard:

- **`referral-api/`** – NestJS + GraphQL server with an **in-memory seed** (JSON-like data) that exposes:
  - `referralSummary(customerId)` – aggregated stats for a customer
  - `sendReferralCode(code)` – simulates sending a referral code and appends a new `INVITED` referral in memory
- **`referral-web/`** – Next.js 14 app using Apollo Client to render the dashboard (progress bar, credits, send code).

Designed to be dead simple to run locally.

---

## Repo Layout

```
.
├── referral-api/                      # NestJS GraphQL API (port 4000)
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts              # thin root: GraphQL + feature module
│   │   └── referral/
│   │       ├── referral.module.ts
│   │       ├── referral.resolver.ts   # GraphQL resolver (reads/mutations)
│   │       ├── referral.service.ts    # business logic (uses seed)
│   │       ├── dto/
│   │       │   └── referral-summary.dto.ts
│   │       ├── types/
│   │       │   └── referral.types.ts
│   │       └── data/
│   │           └── referral.seed.ts   # in-memory data + aggregators + send helper
│   ├── package.json
│   └── README.md (optional api notes)
│
├── referral-web/                      # Next.js UI (port 3000)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx               # renders <ReferralDashboard customerId="cus_123" />
│   │   │   └── providers.tsx          # ApolloProvider
│   │   ├── components/
│   │   │   └── ui/                    # generic UI-only bits
│   │   │       ├── ProgressBar.tsx
│   │   │       ├── button.tsx, card.tsx, ...
│   │   ├── features/
│   │   │   └── referrals/
│   │   │       ├── components/
│   │   │       │   ├── ReferralDashboard.tsx   # container (fetch once)
│   │   │       │   ├── ReferralMobile.tsx      # presentational
│   │   │       │   ├── ReferralDesktop.tsx     # presentational
│   │   │       │   ├── CodeSection.tsx
│   │   │       │   ├── CreditSection.tsx
│   │   │       │   ├── ReferralSkeleton.tsx
│   │   │       │   └── index.ts
│   │   │       ├── graphql/
│   │   │       │   ├── fragments.ts
│   │   │       │   ├── queries.ts
│   │   │       │   └── mutations.ts
│   │   │       ├── hooks/
│   │   │       │   ├── useReferralSummary.ts
│   │   │       │   └── useSendReferral.ts
│   │   │       └── types.ts           # light DTO types for the views
│   │   ├── lib/
│   │   │   ├── apollo-client.ts
│   │   │   └── env.ts
│   │   └── styles/globals.css
│   ├── public/refer-icon.png
│   └── package.json
│
└── README.md (this file)
```

---

## Prereqs

- Node.js 18+ (LTS recommended)
- npm or pnpm (examples use **npm**)
- Ports **3000** (web) and **4000** (api) free locally

---

## Quick Start

### 1) API

```bash
cd referral-api
npm install
npm run start:dev   # http://localhost:4000/graphql
```

### 2) Web

```bash
cd ../referral-web
npm install
npm run dev         # http://localhost:3000
```

## API – GraphQL Shape

The API is **code-first** (Nest GraphQL). DTOs drive the schema. Data is derived from `src/referral/data/referral.seed.ts`.

### Query: `referralSummary(customerId: String!): ReferralSummaryDTO`
```graphql
query ReferralSummary($customerId: String!) {
  referralSummary(customerId: $customerId) {
    customerId
    code
    program { rewardAmount friendDiscount maxReferrals }
    stats   { referredCountYear earnedTotal redeemedTotal availableCredit }
    referrals {
      id
      friend { name email }
      status
      rewardEarned
      createdAt
    }
  }
}
```

### Mutation: `sendReferralCode(code: String!): SendResult`
The seed simulates sending a code by **adding a new `INVITED` referral** and re-computing stats.

```graphql
mutation SendReferralCode($code: String!) {
  sendReferralCode(code: $code) {
    status       # "success" | "error" (seed)
    message
    timestamp
    stats { referredCountYear earnedTotal redeemedTotal availableCredit }
  }
}
```

> If you later prefer `{ ok: Boolean! }` instead of `status`, swap the DTO and keep the resolver mapping.

---

## Web – Data Flow

- **Apollo** is provided in `src/app/providers.tsx`; the client is created in `src/lib/apollo-client.ts`.
- **Feature-first**: all referral screens live under `src/features/referrals`.
- **Container + Views**: `ReferralDashboard` fetches once and renders **Mobile** or **Desktop** variants (presentational-only).
- **Fragments** keep operations consistent across queries/mutations.

### Hooks
- `useReferralSummary(customerId)` → wraps the `ReferralSummary` query.
- `useSendReferral()` → wraps the `SendReferralCode` mutation and `refetchQueries: ['ReferralSummary']`.

### Components
- `ReferralMobile` / `ReferralDesktop` share the same props interface (`ReferralViewProps`) defined in `features/referrals/types.ts`.
- `ProgressBar`, `Button`, `Card` live under `src/components/ui/` and are reused across features.

### Page
`src/app/page.tsx` renders:

```tsx
import { ReferralDashboard } from '@/features/referrals/components';

export default function Page() {
  return <ReferralDashboard customerId="cus_123" />;
}
```

---

## Assumptions & Shortcuts

- **Email delivery** is mocked; mutation logs and updates the in-memory dataset.
- **Auth** is omitted for the challenge; the UI uses a fixed `customerId` (`cus_123`).
- **Persistence** is in memory; no DB. (See “Improvements” for a DB path.)
- **CORS** is permissive for local dev.

---

## Switching Data Backends (Seed → DB)

Keep the GraphQL DTOs the same; switch only the service’s data source.

1. Add a repository/adapter in the API service layer (e.g., `ReferralRepository`).
2. Provide `MemoryRepository` (current seed) and a future `MongoRepository`/`PrismaRepository`.
3. Toggle via env:
   ```
   # referral-api/.env
   DATA_BACKEND=memory   # or "mongo" later
   ```

---

## Example UI Interaction

- Press **Send Code Now**:
  - Calls `sendReferralCode(code)`.
  - Shows “Sending…” (button `aria-busy`) during mutation.
  - On success: toast + refetch `ReferralSummary` to update credits/progress.

---

## Nice-to-Have Improvements

- **Friend form** in a modal (`name`, `email`) → extend mutation input.
- **Auth** (JWT) so the server derives `customerId` from the token, not the client.
- **Testing**:
  - API: service unit tests for `deriveStatsForCustomer`, `getSummary`.
  - Web: React Testing Library + `MockedProvider` for `ReferralDashboard`.
- **Observability**: structured logs for `send_referral` (hash PII), simple counters.

---

## License

MIT (for the purposes of the coding challenge).
