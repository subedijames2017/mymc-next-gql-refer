'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ProgressBar from '@/components/ui/ProgressBar';
import CodeSection from './CodeSection';
import CreditSection from './CreditSection';
import type { ReferralViewProps } from '../types/types';
const REFERAL_LIMIT = 25;


export default function ReferralMobile({ data, sendingCode, onSendCode }: ReferralViewProps) {
  const {
    offAmount,
    friendDiscount,
    referralCode,
    totalReferralsThisYear,
    maxReferrals,
    creditRedeemed,
    readyToUse,
    earnedCredits,
  } = data;
  const reachedCap = data.totalReferralsThisYear >= REFERAL_LIMIT;

  return (
    <div className="mx-auto max-w-md space-y-8 p-6">
      <div className="rounded-xl bg-muted p-4">
        <div className="space-y-4 text-left">
          <div className="flex justify-left">
            <Image
              src="/refer-icon.png"
              alt="Coupon Icon"
              width={50}
              height={50}
              className="h-12 w-12"
              priority
            />
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl font-bold leading-tight text-foreground">
              <>
                Want <strong className="text-emerald-800">${offAmount}</strong> off <br /> your next order?
              </>
            </h1>
            <p className="leading-relaxed text-muted-foreground">
              <strong className="text-emerald-800">Get ${offAmount}</strong> for every friend you refer (up to {maxReferrals}).<br />
              They&apos;ll score ${friendDiscount} off their first order.
            </p>
          </div>

          <ProgressBar current={totalReferralsThisYear} max={maxReferrals} earnedAmount={earnedCredits} />

          <Button
            type="button"
            onClick={() => onSendCode()} 
            disabled={sendingCode || reachedCap}
            aria-busy={sendingCode}
            className="mb-6 h-auto w-full cursor-pointer rounded-3xl bg-success py-3 font-medium text-success-foreground hover:bg-success/90"
          >
            {sendingCode ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4" aria-hidden />
                <span>Sending…</span>
              </span>
            ) : (
              <>Send Code Now</>
            )}
          </Button>
        </div>

        <CodeSection code={referralCode} />
      </div>

      <div>
        <h2 className="mb-6 text-md font-bold text-foreground">Your referral credits</h2>
      </div>

      <CreditSection
        amount={readyToUse}
        totalReferrals={totalReferralsThisYear}
        maxReferrals={maxReferrals}
        creditRedeemed={creditRedeemed}
      />
    </div>
  );
}
