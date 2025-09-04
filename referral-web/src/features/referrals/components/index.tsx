"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useReferralData } from "@/features/referrals/hooks/useReferralData";
import ReferralMobile from "./ReferralMobile";
import ReferralDesktop from "./ReferralDesktop";

const ReferralDashboard: React.FC = () => {
  const { data, loading, error, sendingCode, sendReferralCode } = useReferralData();

  // Error
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

  // Initial / refetch loading (no data yet)
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

  const handleSendCode = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();
    await sendReferralCode(data.referralCode);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile */}
      <div className="md:hidden">
        <ReferralMobile
          data={data}
          sendingCode={sendingCode}
          onSendCode={handleSendCode}
        />
      </div>

      {/* Desktop / Tablet */}
      <div className="hidden md:block">
        <ReferralDesktop
          data={data}
          sendingCode={sendingCode}
          onSendCode={handleSendCode}
        />
      </div>
    </div>
  );
};

export default ReferralDashboard;
