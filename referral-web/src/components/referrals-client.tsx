"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CouponIcon from "./CouponIcon";
import ProgressBar from "./ProgressBar";
import CodeSection from "./CodeSection";
import CreditSection from "./CreditSection";
import Image from "next/image";


// GraphQL-powered hook aligned to new seed/getSummary
import { useReferralData } from "@/hooks/useReferralData";

const ReferralDashboard: React.FC = () => {
  const { data, loading, error, sendingCode, sendReferralCode } = useReferralData();

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Alert className="max-w-md">
          <AlertDescription>
            {error ?? "Unable to fetch referral data."} Please refresh the page to try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  // --- Loading whenever we don't have data yet (initial load/refetch) ---
  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading your referral data...</span>
        </div>
      </div>
    );
  }



  // No data fallback (should be rare)
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Alert className="max-w-md">
          <AlertDescription>We couldn’t find your referral data right now.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleSendCode = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();
    let sentCode = await sendReferralCode(data.referralCode);
    console.log("🚀 ~ handleSendCode ~ sentCode:", sentCode)
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ---------- Mobile ---------- */}
      <div className="md:hidden max-w-md mx-auto p-6 space-y-8">
        <div className="bg-muted p-4 rounded-xl">
          <div className="text-left space-y-4">
            <div className="flex justify-left">
              <Image
                src="/refer-icon.png"
                alt="Coupon Icon"
                width={50}
                height={50}
                className="h-12 w-12"
              />
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-foreground leading-tight">
                <>
                  Want <strong className="text-emerald-800">${data.offAmount}</strong> off <br /> your next order?
                </>
              </h1>
              <p className="text-muted-foreground leading-relaxed"> <strong className="text-emerald-800"> Get ${data.offAmount.toString()}</strong>  for every friend you refer(up to 25).<br></br> They'll score ${data.friendDiscount.toString()} off tehir first order.</p>
            </div>

            <ProgressBar
              current={data.totalReferralsThisYear}
              max={data.maxReferrals}
              earnedAmount={data.earnedCredits}
            />
            <Button
              type="button"
              onClick={handleSendCode}
              disabled={sendingCode}
              className="w-full bg-success hover:bg-success/90 text-success-foreground font-medium py-3 h-auto rounded-3xl mb-6 cursor-pointer"
            >
              {sendingCode ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
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

      {/* ---------- Desktop ---------- */}
      <div className="hidden md:block">
        <div className="px-8 pt-10 pb-16 space-y-10">
          {/* Section 1: Main referral card */}
          <Card className="p-10 bg-muted border-none">
            <div className="max-w-lg mx-auto">
              <div className="flex justify-center mb-6">
                <Image
                  src="/refer-icon.png"
                  alt="Coupon Icon"
                  width={50}
                  height={50}
                  className="h-12 w-12"
                />
              </div>

              <div className="text-center space-y-2 mb-6">
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                  <>
                    Want <strong className="text-emerald-800">${data.offAmount}</strong> off <br /> your next order?
                  </>
                </h1>
                <p className="text-xl text-muted-foreground mt-6"><strong className="text-emerald-800">Earn ${data.offAmount.toString()}</strong>  for every friend you refer(up to 25).<br></br> They'll score ${data.friendDiscount.toString()} off tehir first order.</p>
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
                  onClick={handleSendCode}
                  disabled={sendingCode}
                  className="w-full bg-success hover:bg-success/90 text-success-foreground font-medium py-3 h-auto rounded-full cursor-pointer"
                >
                  {sendingCode ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
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

          {/* Section 2: Credits / stats strip */}
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

            {/* Total referrals this year */}
            <Card className="p-4 md:p-6 bg-muted border-none">
              <div className="text-center">
                <div className="text-xs md:text-sm text-muted-foreground mb-1">Total referrals this year</div>
                <div className="text-2xl md:text-3xl font-bold text-foreground">
                  {data.totalReferralsThisYear}/{data.maxReferrals}
                </div>
              </div>
            </Card>

            {/* Credit redeemed */}
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
      </div>
    </div>
  );
};

export default ReferralDashboard;
