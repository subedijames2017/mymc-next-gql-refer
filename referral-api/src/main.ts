import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS – read from env or fallback
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') ?? ['http://localhost:3000'];
  app.enableCors({ origin: allowedOrigins });

  const port = Number(process.env.PORT) || 4000;
  await app.listen(port);
  
  console.log(`🚀 GraphQL at http://localhost:${port}/graphql`);
}
bootstrap();
