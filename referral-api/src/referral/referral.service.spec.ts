import { Test } from '@nestjs/testing';
import { ReferralService } from './referral.service';

// Mock the seed functions used by the service
jest.mock('../mock/referral.seed', () => ({
  getSummary: jest.fn(),
  sendReferralCode: jest.fn(),
}));

import { getSummary, sendReferralCode } from '../mock/referral.seed';

describe('ReferralService', () => {
  let service: ReferralService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [ReferralService],
    }).compile();

    service = moduleRef.get(ReferralService);
  });

  it('getSummary should delegate to seed.getSummary and return its value', () => {
    const payload = {
      customerId: 'cus_123',
      code: '0180YNUP',
      program: { rewardAmount: 20, friendDiscount: 40, maxReferrals: 25 },
      stats: { referredCountYear: 4, earnedTotal: 80, redeemedTotal: 40, availableCredit: 40 },
    };
    (getSummary as jest.Mock).mockReturnValue(payload);

    const result = service.getSummary('cus_123');

    expect(getSummary).toHaveBeenCalledWith('cus_123');
    expect(result).toEqual(payload);
  });

  it('getSummary should bubble up errors from seed.getSummary', () => {
    (getSummary as jest.Mock).mockImplementation(() => {
      throw new Error('Customer not found');
    });

    expect(() => service.getSummary('nope')).toThrow('Customer not found');
    expect(getSummary).toHaveBeenCalledWith('nope');
  });

  it('sendCode should delegate to seed.sendReferralCode and return its value', () => {
    const response = {
      ok: true,
      message: 'Referral code 0180YNUP sent at 2025-01-01T00:00:00.000Z (added foo@bar.com)',
      timestamp: '2025-01-01T00:00:00.000Z',
      stats: { referredCountYear: 5, earnedTotal: 80, redeemedTotal: 40, availableCredit: 40 },
    };
    (sendReferralCode as jest.Mock).mockReturnValue(response);

    const result = service.sendCode('0180YNUP');

    expect(sendReferralCode).toHaveBeenCalledWith('0180YNUP');
    expect(result).toEqual(response);
  });
});
