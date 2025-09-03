// mock/referral.seed.ts

// If you want exact typing at the source, keep this import.
// If your ReferralSummary DTO does NOT include `referrals`, either
// remove the `referrals` block below or change the return type to add `referrals?: Referral[]`.
import type { ReferralSummary } from '../referral/referral-summary.dto';

/* ---------------- Types ---------------- */
export type ReferralStatus = 'INVITED' | 'SIGNED_UP';

export interface Referral {
  id: string;
  friend: { name: string; email: string };
  status: ReferralStatus;          // "INVITED" | "SIGNED_UP"
  rewardEarned: number;            // $20 when SIGNED_UP, else 0
  createdAt: string;               // ISO
  referredBy: string;              // customerId
}

export interface Redemption {
  id: string;
  amount: number;                  // dollars redeemed (positive)
  createdAt: string;               // ISO
  redeemedBy: string;              // customerId
}

export interface Customer {
  id: string;
  code: string;
  offAmount: number;               // you earn per sign-up (e.g. 20)
  friendDiscount: number;          // friend gets off first order (e.g. 40)
  maxReferrals: number;
}

export interface ReferralDataSet {
  customers: Customer[];
  referrals: Referral[];
  redemptions: Redemption[];
}

/* ---------------- Seed (multi-customer; filtered at read time) ---------------- */
export const referralData: ReferralDataSet = {
  customers: [
    { id: 'cus_123', code: '0180YNUP', offAmount: 20, friendDiscount: 40, maxReferrals: 25 },
    { id: 'cus_456', code: 'ZZ9PLUTO', offAmount: 15, friendDiscount: 25, maxReferrals: 15 },
  ],

  referrals: [
    // ---- belongs to cus_123 ----
    { id: 'r1', friend: { name: 'Alex Chen',  email: 'alex@example.com'  }, status: 'SIGNED_UP', rewardEarned: 20, createdAt: '2025-02-01T10:12:00Z', referredBy: 'cus_123' },
    { id: 'r2', friend: { name: 'Priya Singh',email: 'priya@example.com' }, status: 'INVITED',   rewardEarned: 0,  createdAt: '2025-02-20T15:31:00Z', referredBy: 'cus_123' },
    { id: 'r3', friend: { name: 'Tom Lee',    email: 'tom@example.com'   }, status: 'SIGNED_UP', rewardEarned: 20, createdAt: '2025-03-03T09:05:00Z', referredBy: 'cus_123' },
    { id: 'r4', friend: { name: 'Sara Park',  email: 'sara@example.com'  }, status: 'INVITED',   rewardEarned: 0,  createdAt: '2025-03-18T18:22:00Z', referredBy: 'cus_123' },
    { id: 'r5', friend: { name: 'Ivy Nguyen', email: 'ivy@example.com'   }, status: 'SIGNED_UP', rewardEarned: 20, createdAt: '2025-04-18T14:20:00Z', referredBy: 'cus_123' },
    { id: 'r6', friend: { name: 'Zoe Park',   email: 'zoe@example.com'   }, status: 'SIGNED_UP', rewardEarned: 20, createdAt: '2025-05-12T09:15:00Z', referredBy: 'cus_123' },
    { id: 'r7', friend: { name: 'Omar Ali',   email: 'omar@example.com'  }, status: 'SIGNED_UP', rewardEarned: 20, createdAt: '2025-05-25T19:41:00Z', referredBy: 'cus_123' },

    // ---- belongs to cus_456 ----
    { id: 'r8', friend: { name: 'Maya Rao',   email: 'maya@example.com'  }, status: 'SIGNED_UP', rewardEarned: 20, createdAt: '2025-03-09T11:00:00Z', referredBy: 'cus_456' },
    { id: 'r9', friend: { name: 'Luca B.',    email: 'luca@example.com'  }, status: 'INVITED',   rewardEarned: 0,  createdAt: '2025-04-01T12:00:00Z', referredBy: 'cus_456' },
  ],

  redemptions: [
    { id: 'redeem1', amount: 40, createdAt: '2025-05-20T10:00:00Z', redeemedBy: 'cus_123' },
    { id: 'redeem2', amount: 15, createdAt: '2025-06-10T12:00:00Z', redeemedBy: 'cus_456' },
  ],
} as const;

/* ---------------- tiny helpers ---------------- */
const FIRST = ['Alex','Priya','Tom','Sara','Ivy','Zoe','Omar','Liam','Nora','Elena','Miles','Jun','Aria','Mateo','Ava'];
const LAST  = ['Chen','Singh','Lee','Park','Nguyen','Ali','Brown','Garcia','Rao','Kim','Silva','Mehta','Khan','Patel','Lopez'];
const DOMAINS = ['example.com','mail.test','inbox.dev','postbox.app'];

function rand<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)]; }
function slug(s: string)   { return s.toLowerCase().replace(/[^a-z]+/g, ''); }

function randomFriend() {
  const first = rand(FIRST);
  const last  = rand(LAST);
  const token = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return {
    name: `${first} ${last}`,
    email: `${slug(first)}.${slug(last)}${token}@${rand(DOMAINS)}`,
  };
}

function nextReferralId() {
  const max = referralData.referrals.reduce((m, r) => {
    const n = Number(String(r.id).replace(/\D+/g, '')) || 0;
    return Math.max(m, n);
  }, 0);
  return `r${max + 1}`;
}

function findCustomerIdByCode(code: string): string | null {
  const c = referralData.customers.find((x) => x.code === code);
  return c?.id ?? null;
}

/* ---------------- Derivers & selectors ---------------- */
export function deriveStatsForCustomer(customerId: string) {
  const nowYear = new Date().getFullYear();

  const refs = referralData.referrals.filter((r) => r.referredBy === customerId);
  const reds = referralData.redemptions.filter((x) => x.redeemedBy === customerId);

  const referredCountYear = refs.filter(
    (r) => r.status === 'INVITED' && new Date(r.createdAt).getFullYear() === nowYear,
  ).length;

  const earnedTotal = Number(refs.reduce((s, r) => s + (r.rewardEarned || 0), 0).toFixed(2));
  const redeemedTotal = Number(reds.reduce((s, x) => s + (x.amount || 0), 0).toFixed(2));
  const availableCredit = Number((earnedTotal - redeemedTotal).toFixed(2));

  return { referredCountYear, earnedTotal, redeemedTotal, availableCredit };
}

/**
 * Pure aggregator returning the summary.
 * If your DTO doesn't include `referrals`, remove that property below.
 */
export function getSummary(
  customerId: string,
): ReferralSummary & { referrals?: Referral[] } {
  const customer = referralData.customers.find((c) => c.id === customerId);
  if (!customer) throw new Error('Customer not found');

  const stats = deriveStatsForCustomer(customerId);

  // include referrals; GraphQL can choose not to select them
  const referrals = referralData.referrals
    .filter((r) => r.referredBy === customerId)
    .slice()
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  return {
    customerId,
    code: customer.code,
    program: {
      rewardAmount: customer.offAmount,
      friendDiscount: customer.friendDiscount,
      maxReferrals: customer.maxReferrals,
    },
    stats,
    referrals,
  };
}

/* ---------------- Mutation-like helper ---------------- */
/**
 * Adds a new INVITED referral for the customer resolved by `code`,
 * then returns an enriched payload including the updated summary.
 * If `code` isn't found, it defaults to cus_123 so the demo keeps working.
 */
export function sendReferralCode(code: string) {
  const customerId = findCustomerIdByCode(code) ?? 'cus_123';

  // append a new INVITED referral
  const newReferral: Referral = {
    id: nextReferralId(),
    friend: randomFriend(),
    status: 'INVITED',
    rewardEarned: 0,
    createdAt: new Date().toISOString(),
    referredBy: customerId,
  };
  referralData.referrals.push(newReferral);

  // recompute
  const summary  = getSummary(customerId);

  const timestamp = new Date().toISOString();
  const message   = `Referral code ${code} sent at ${timestamp} (added ${newReferral.friend.email})`;

  return {
    ok: true,
    message,
    timestamp,
    stats: summary.stats, // send stats directly
  };
}
