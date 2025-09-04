export type ReferralResponse = {
    success: boolean;
    message: string;
    timestamp: string,
    stats: {
      referredCountYear: number;
      earnedTotal: number;
      redeemedTotal: number;
      availableCredit: number;
    };
  };
  