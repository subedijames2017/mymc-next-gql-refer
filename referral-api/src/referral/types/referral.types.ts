import {
  Field,
  Float,
  ID,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

export enum ReferralStatus {
  INVITED = 'INVITED',
  SIGNED_UP = 'SIGNED_UP',
}
registerEnumType(ReferralStatus, { name: 'ReferralStatus' });

@ObjectType()
export class Friend {
  @Field() name: string;
  @Field() email: string;
}

@ObjectType()
export class Referral {
  @Field(() => ID) id: string;
  @Field(() => Friend) friend: Friend;
  @Field(() => ReferralStatus) status: ReferralStatus;
  @Field(() => Float) rewardEarned: number;
  @Field() createdAt: string;
}

@ObjectType()
export class Program {
  @Field(() => Float) rewardAmount: number;
  @Field(() => Float) friendDiscount: number;
  @Field(() => Int) maxReferrals: number;
}

@ObjectType()
export class CreditStats {
  @Field(() => Int) referredCountYear: number;
  @Field(() => Float) earnedTotal: number;
  @Field(() => Float) redeemedTotal: number;
  @Field(() => Float) availableCredit: number;
}

@ObjectType()
export class ReferralSummary {
  @Field(() => ID) customerId: string;
  @Field() code: string;
  @Field(() => Program) program: Program;
  @Field(() => CreditStats) stats: CreditStats;
}

@ObjectType()
export class SendResult {
  @Field() success: boolean;
  @Field() message: string;
  @Field() timestamp: string;
  @Field(() => CreditStats) stats: CreditStats;
}
