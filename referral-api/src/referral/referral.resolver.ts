import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReferralService } from './referral.service';
import { ReferralSummary, SendResult } from './referral.types';

@Resolver()
export class ReferralResolver {
  constructor(private readonly svc: ReferralService) {}

  @Query(() => ReferralSummary)
  referralSummary(@Args('customerId') customerId: string) {
    return this.svc.getSummary(customerId);
  }

  @Mutation(() => SendResult)
  sendReferralCode(@Args('code') code: string) {
    return this.svc.sendCode(code);
  }
}
