// referral.service.ts
import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { getSummary, sendReferralCode } from './data/referral.seed';
import { ReferralSummary, SendResult } from './types/referral.types';

@Injectable()
export class ReferralService {
  getSummary(customerId: string): ReferralSummary {
    // getSummary should throw NotFoundException if customer missing
    return getSummary(customerId);
  }

  async sendCode(code: string): Promise<SendResult> {
    if (!code) throw new BadRequestException('code is required');
    
    // sendReferralCode should throw if code not found
    return await sendReferralCode(code);
  }
}
