import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Express adapter is used (because of @nestjs/platform-express)
  app.enableCors({ origin: ['http://localhost:3000'] });
  await app.listen(4000);
  console.log('🚀 GraphQL at http://localhost:4000/graphql');
}
bootstrap();
