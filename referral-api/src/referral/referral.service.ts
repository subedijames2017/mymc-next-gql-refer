// referral/referral.service.ts
import { Injectable } from '@nestjs/common';
import { getSummary, sendReferralCode } from '../mock/referral.seed';
import type { ReferralSummary } from './referral-summary.dto';

@Injectable()
export class ReferralService {
  getSummary(customerId: string): ReferralSummary {
    return getSummary(customerId);
  }

  sendCode(code: string) {
    // delegate to seed helper (keeps service thin)
    return sendReferralCode(code);
  }
}
