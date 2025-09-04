"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProgressBar from "../../../components/ui/ProgressBar";
import CodeSection from "./CodeSection";
import type { ReferralViewProps } from "../types/types";
const REFERAL_LIMIT = 25;

const ReferralDesktop: React.FC<ReferralViewProps> = ({ data, sendingCode, onSendCode }) => {
  // Disable send when total referrals >= REFERAL_LIMIT
  const reachedCap = data.totalReferralsThisYear >= REFERAL_LIMIT;

  return (
    <div className="px-8 pt-10 pb-16 space-y-10">
      <Card className="p-10 bg-muted border-none">
        <div className="max-w-lg mx-auto">
          <div className="flex justify-center mb-6">
            <Image
              src="/refer-icon.png"
              alt="Coupon Icon"
              width={50}
              height={50}
              className="h-12 w-12"
              priority
            />
          </div>

          <div className="text-center space-y-2 mb-6">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
              <>
                Want <strong className="text-emerald-800">${data.offAmount}</strong> off <br /> your next order?
              </>
            </h1>
            <p className="text-xl text-muted-foreground mt-6">
              <strong className="text-emerald-800">Earn ${data.offAmount}</strong> for every friend you refer (up to {data.maxReferrals}).<br />
              They&apos;ll score ${data.friendDiscount} off their first order.
            </p>
          </div>

          <div className="space-y-2 mb-6 mt-6">
            <ProgressBar
              current={data.totalReferralsThisYear}
              max={data.maxReferrals}
              earnedAmount={data.earnedCredits}
            />
          </div>

          <div className="mb-6">
            <Button
              type="button"
              onClick={onSendCode}
              disabled={sendingCode || reachedCap}
              className="w-full bg-success hover:bg-success/90 text-success-foreground font-medium py-3 h-auto rounded-full cursor-pointer"
            >
              {sendingCode ? (
                <div className="flex items-center gap-2">
                  <span className="inline-block h-4 w-4" />
                  <span>Sending...</span>
                </div>
              ) : (
                <>Send Code Now</>
              )}
            </Button>
          </div>

          <CodeSection code={data.referralCode} />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Ready to use */}
        <Card className="p-4 md:p-6 bg-credit-bg border-none">
          <div className="flex items-center justify-between gap-3 md:gap-4">
            <div>
              <div className="text-xs md:text-sm text-muted-foreground">Ready to use:</div>
              <div className="text-2xl md:text-4xl font-extrabold text-credit-text">
                ${data.readyToUse.toFixed(2)}
              </div>
            </div>
            <Button className="bg-foreground text-background hover:bg-foreground/90 font-medium px-4 md:px-6 py-2 rounded-full">
              Use credit
            </Button>
          </div>
        </Card>

        <Card className="p-4 md:p-6 bg-muted border-none">
          <div className="text-center">
            <div className="text-xs md:text-sm text-muted-foreground mb-1">Total referrals this year</div>
            <div className="text-2xl md:text-3xl font-bold text-foreground">
              {data.totalReferralsThisYear}/{data.maxReferrals}
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-6 bg-muted border-none">
          <div className="text-center">
            <div className="text-xs md:text-sm text-muted-foreground mb-1">Credit redeemed</div>
            <div className="text-2xl md:text-3xl font-bold text-foreground">
              ${data.creditRedeemed.toFixed(2)}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReferralDesktop;
