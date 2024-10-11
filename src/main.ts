import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  // initial values doesnt matter we just want to initialize the service

  const app = await NestFactory.create(AppModule, { cors: true });
  app.get(HttpAdapterHost);
  await app.listen(3000);
}
bootstrap();
