import { gql } from "@apollo/client";

export const GET_REFERRAL_SUMMARY = gql`
  query ReferralSummary($customerId: String!) {
    referralSummary(customerId: $customerId) {
      customerId
      code
      program {
        rewardAmount
        friendDiscount
        maxReferrals
      }
      stats {
        referredCountYear
        earnedTotal
        redeemedTotal
        availableCredit
      }
    }
  }
`;

export const SEND_REFERRAL_CODE = gql`
  mutation SendReferralCode($code: String!) {
    sendReferralCode(code: $code) {
      ok
      message
      timestamp
      stats {
        referredCountYear
        earnedTotal
        redeemedTotal
        availableCredit
      }
    }
  }
`;

