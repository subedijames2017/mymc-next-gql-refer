import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { ReferralModule } from './referral/referral.module';

@Module({
  imports: [
    CoreModule,      // framework & cross-cutting
    ReferralModule,  // feature module(s)
  ],
})
export class AppModule {}
