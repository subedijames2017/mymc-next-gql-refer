// DTO-ish shape for your view layer
export interface ReferralViewData {
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
  
  // Decouple props from DOM events; make it readonly to avoid accidental mutation
  export interface ReferralViewProps {
    readonly data: ReferralViewData;
    readonly sendingCode: boolean;
    readonly onSendCode: () => void | Promise<void>;
  }


  export interface CreditSectionProps {
    amount: number;
    totalReferrals: number;
    maxReferrals: number;
    creditRedeemed: number;
    className?: string;
  }
  