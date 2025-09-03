"use client";

import { useMemo, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_REFERRAL_SUMMARY, SEND_REFERRAL_CODE } from "@/graphql/queries";
import { toast } from "@/hooks/use-toast";

/* ---------------- UI Types ---------------- */
export interface Referral {
  id: string;
  name: string;
  status: "PENDING" | "JOINED" | "COMPLETED";
  rewardCredits: number;
  createdAt?: string;
}

export interface ReferralData {
  offAmount: number;
  friendDiscount: number;
  referralCode: string;
  totalCredits: number;
  readyToUse: number;
  totalReferralsThisYear: number;
  maxReferrals: number;
  creditRedeemed: number;
  earnedCredits: number;
}

/* ---------------- GraphQL response types ---------------- */
type GqlReferralSummary = {
  referralSummary: {
    customerId: string;
    code: string;
    program: {
      rewardAmount: number;
      friendDiscount: number;
      maxReferrals: number;
    };
    stats: {
      referredCountYear: number;
      earnedTotal: number;
      redeemedTotal: number;
      availableCredit: number;
    };
  };
};

type GqlSendReferralCodeResult = {
  sendReferralCode: { message: string; timestamp: string };
};

/* ---------------- Hook ---------------- */
// By default we use "cus_123" as the demo customer ID
export const useReferralData = (customerId: string = "cus_123") => {
  const { data, loading, error, refetch } = useQuery<GqlReferralSummary>(
    GET_REFERRAL_SUMMARY,
    {
      variables: { customerId },
      fetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    }
  );

  const [mutateSend, { loading: sendingCode }] =
    useMutation<GqlSendReferralCodeResult>(SEND_REFERRAL_CODE);

  // Map GraphQL summary -> UI model
  const mapped: ReferralData | null = useMemo(() => {
    const g = data?.referralSummary;
    if (!g) return null;

    const earned = g.stats.earnedTotal ?? 0;
    const redeemed = g.stats.redeemedTotal ?? 0;
    const ready = g.stats.availableCredit ?? Math.max(0, earned - redeemed);

    return {
      offAmount: g.program.rewardAmount,
      friendDiscount: g.program.friendDiscount,
      referralCode: g.code,
      totalCredits: earned,
      readyToUse: ready,
      totalReferralsThisYear: g.stats.referredCountYear ?? 0,
      maxReferrals: g.program.maxReferrals ?? 0,
      creditRedeemed: redeemed,
      earnedCredits: earned,
    };
  }, [data]);

  /**
   * Click-safe sender:
   * - Accepts either a code string OR a click-like event
   * - Prevents default + stops propagation if an event is provided
   * - Falls back to the mapped referralCode if no string is provided
   */
  const sendReferralCode = useCallback(
    async (
      arg?: string | { preventDefault?: () => void; stopPropagation?: () => void }
    ) => {
      // Swallow form-submit behavior if a click event sneaks through
      if (arg && typeof arg !== "string") {
        arg.preventDefault?.();
        arg.stopPropagation?.();
      }

      const code = typeof arg === "string" ? arg : mapped?.referralCode;

      if (!code) {
        toast({
          title: "Missing code",
          description: "Referral code is not available right now.",
          variant: "destructive",
        });
        return {
          ok: false,
          message: "Referral code missing",
          timestamp: new Date().toISOString(),
        };
      }

      try {
        const res = await mutateSend({ variables: { code } });
        const message =
          res.data?.sendReferralCode?.message ??
          `Referral code ${code} sent successfully`;

        // Optional refresh
        await refetch();

        toast({ title: "Code sent!", description: message });

        return {
          ok: true,
          message,
          timestamp:
            res.data?.sendReferralCode?.timestamp ?? new Date().toISOString(),
        };
      } catch (e: any) {
        toast({
          title: "Error",
          description:
            e?.message ?? "Failed to send referral code. Please try again.",
          variant: "destructive",
        });
        return {
          ok: false,
          message: e?.message ?? "Failed to send referral code",
          timestamp: new Date().toISOString(),
        };
      }
    },
    [mutateSend, refetch, mapped?.referralCode]
  );

  const busy = loading || sendingCode;

  return {
    data: mapped,
    loading,
    sendingCode,
    busy,
    error: error ? error.message : null,
    sendReferralCode,
    refetch,
  };
};
