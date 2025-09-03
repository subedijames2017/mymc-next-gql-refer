"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ProgressBar from "../ProgressBar";
import CodeSection from "../CodeSection";
import CreditSection from "../CreditSection";

export interface ReferralViewProps {
  data: {
    offAmount: number;
    friendDiscount: number;
    referralCode: string;
    totalCredits: number;
    readyToUse: number;
    totalReferralsThisYear: number;
    maxReferrals: number;
    creditRedeemed: number;
    earnedCredits: number;
  };
  sendingCode: boolean;
  onSendCode: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}

const ReferralMobile: React.FC<ReferralViewProps> = ({ data, sendingCode, onSendCode }) => {
  return (
    <div className="max-w-md mx-auto p-6 space-y-8">
      <div className="bg-muted p-4 rounded-xl">
        <div className="text-left space-y-4">
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
          <h1 className="text-2xl font-bold text-foreground leading-tight">
            <>
              Want <strong className="text-emerald-800">${data.offAmount}</strong> off <br /> your next order?
            </>
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            <strong className="text-emerald-800">Get ${data.offAmount}</strong> for every friend you refer (up to {data.maxReferrals}).<br />
            They&apos;ll score ${data.friendDiscount} off their first order.
          </p>
        </div>

          <ProgressBar
            current={data.totalReferralsThisYear}
            max={data.maxReferrals}
            earnedAmount={data.earnedCredits}
          />

          <Button
            type="button"
            onClick={onSendCode}
            disabled={sendingCode}
            className="w-full bg-success hover:bg-success/90 text-success-foreground font-medium py-3 h-auto rounded-3xl mb-6 cursor-pointer"
          >
            {sendingCode ? (
              <div className="flex items-center space-x-2">
                <span className="inline-block h-4 w-4">
                  {/* you can keep a spinner here if you prefer */}
                </span>
                <span>Sending...</span>
              </div>
            ) : (
              <>Send Code Now</>
            )}
          </Button>
        </div>

        <CodeSection code={data.referralCode} />
      </div>

      <div>
        <h2 className="text-md font-bold text-foreground mb-6">Your referral credits</h2>
      </div>

      <CreditSection
        amount={data.readyToUse}
        totalReferrals={data.totalReferralsThisYear}
        maxReferrals={data.maxReferrals}
        creditRedeemed={data.creditRedeemed}
      />
    </div>
  );
};

export default ReferralMobile;
