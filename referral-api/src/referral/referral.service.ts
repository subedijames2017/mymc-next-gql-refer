// referral.service.ts
import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { getSummary, sendReferralCode } from '../mock/referral.seed';
import { ReferralSummary, SendResult } from './referral.types';

@Injectable()
export class ReferralService {
  getSummary(customerId: string): ReferralSummary {
    // getSummary should throw NotFoundException if customer missing
    return getSummary(customerId);
  }

  sendCode(code: string): SendResult {
    if (!code) throw new BadRequestException('code is required');

    // sendReferralCode should throw BadRequestException if code invalid
    return sendReferralCode(code);
  }
}
