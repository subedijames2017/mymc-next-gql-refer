import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLConfigModule } from './graphql/graphql.module';
import configuration from './config/configuration';

@Module({
  imports: [
    // global, makes process.env typed if you extend it
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    GraphQLConfigModule,
  ],
})
export class CoreModule {}
