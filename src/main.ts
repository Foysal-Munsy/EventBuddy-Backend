import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      // disableErrorMessages: false,
    }),
  );
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.Frontend_URL, // frontend URL
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
