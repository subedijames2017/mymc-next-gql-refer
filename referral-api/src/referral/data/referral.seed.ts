import type { ReferralSummary } from '../dto/referral-summary.dto';
import type { ReferralResponse } from '../dto/referal-response.sto';

/** Status of a referral invitation lifecycle. */
export type ReferralStatus = 'INVITED' | 'SIGNED_UP';

/** A single referral record (friend invited by a customer). */
export interface Referral {
  id: string;
  friend: { name: string; email: string };
  status: ReferralStatus;          // "INVITED" | "SIGNED_UP"
  rewardEarned: number;            // $20 when SIGNED_UP, else 0
  createdAt: string;               // ISO 8601 timestamp (UTC)
  referredBy: string;              // customerId
}


export interface Redemption {
  id: string;
  amount: number;                  // dollars redeemed (positive)
  createdAt: string;               // ISO 8601 timestamp (UTC)
  redeemedBy: string;              // customerId
}


export interface Customer {
  id: string;
  code: string;
  offAmount: number;               // amount the referrer earns per sign-up (e.g. 20)
  friendDiscount: number;          // discount the friend gets on first order (e.g. 40)
  maxReferrals: number;            // program cap
}

// In-memory "database" of customers, referrals, and redemptions.
export interface ReferralDataSet {
  customers: Customer[];
  referrals: Referral[];
  redemptions: Redemption[];
}

export const referralData: ReferralDataSet = {
  // NOTE: In a real app customer codes would be unique and randomly generated and can be very different from data below
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

// Sample data for generating random friend names and email addresses.
const FIRST = ['Alex','Priya','Tom','Sara','Ivy','Zoe','Omar','Liam','Nora','Elena','Miles','Jun','Aria','Mateo','Ava'];
const LAST  = ['Chen','Singh','Lee','Park','Nguyen','Ali','Brown','Garcia','Rao','Kim','Silva','Mehta','Khan','Patel','Lopez'];
const DOMAINS = ['example.com','mail.test','inbox.dev','postbox.app'];

// Pick a random element from an array.
function rand<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)]; }

// Simplistic slugifier: lowercase, strip non-alpha.
function slug(s: string)   { return s.toLowerCase().replace(/[^a-z]+/g, ''); }

// Generate a random friend name and email address.
function randomFriend() {
  const first = rand(FIRST);
  const last  = rand(LAST);
  const token = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return {
    name: `${first} ${last}`,
    email: `${slug(first)}.${slug(last)}${token}@${rand(DOMAINS)}`,
  };
}

// Compute Next referral ID by finding max existing numeric suffix and adding 1.
function nextReferralId() {
  const max = referralData.referrals.reduce((m, r) => {
    const n = Number(String(r.id).replace(/\D+/g, '')) || 0;
    return Math.max(m, n);
  }, 0);
  return `r${max + 1}`;
}

/** Find a customerId given a referral `code`. Returns null if not found. */
function findCustomerIdByCode(code: string): string | null {
  const c = referralData.customers.find((x) => x.code === code);
  return c?.id ?? null;
}

//Custom Function To drive Stats for a customer
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
// simple non-blocking delay
const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

// Simulate sending a referral code by creating a new "INVITED" referral record.
export async function sendReferralCode(code: string): Promise<ReferralResponse> {
  const customerId = findCustomerIdByCode(code) ?? 'cus_123';

  const newReferral: Referral = {
    id: nextReferralId(),
    friend: randomFriend(),
    status: 'INVITED',
    rewardEarned: 0,
    createdAt: new Date().toISOString(),
    referredBy: customerId,
  };
  referralData.referrals.push(newReferral);

  const summary = getSummary(customerId);

  await sleep(1000); // 2s delay

  // local date+time string
  const timestamp = new Date().toLocaleString();

  const message = `Referral code ${code} sent at ${timestamp} (added ${newReferral.friend.email})`;

  return {
    success: true,
    message,
    timestamp,
    stats: summary.stats,
  };
}
