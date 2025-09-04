import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReferralService } from './referral.service';
import { ReferralSummary, SendResult } from './types/referral.types';

@Resolver()
export class ReferralResolver {
  constructor(private readonly referralService: ReferralService) {}

  @Query(() => ReferralSummary)
  referralSummary(@Args('customerId') customerIdRaw: string) {
    const customerId = (customerIdRaw ?? '').trim();
    if (!customerId) {
      throw new BadRequestException('customerId is required');
    }

    try {
      return this.referralService.getSummary(customerId);
    } catch (err) {
      // If the service threw a Nest exception (e.g., NotFoundException),
      // just rethrow; otherwise wrap in 500.
      if (err && typeof err === 'object' && 'getStatus' in (err as any)) {
        throw err as any;
      }
      throw new InternalServerErrorException(
        'Failed to load referral summary',
      );
    }
  }

  @Mutation(() => SendResult)
  sendReferralCode(@Args('code') codeRaw: string) {
    const code = (codeRaw ?? '').trim();
    if (!code) {
      throw new BadRequestException('code is required');
    }

    try {
      return this.referralService.sendCode(code);
    } catch (err) {
      if (err && typeof err === 'object' && 'getStatus' in (err as any)) {
        throw err as any;
      }
      throw new InternalServerErrorException('Failed to send referral code');
    }
  }
}
