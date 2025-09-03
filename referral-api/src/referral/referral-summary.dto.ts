// dto/referral-summary.ts

export type ReferralSummary = {
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
  