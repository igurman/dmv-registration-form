import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {ExceptionsFilter} from "@/filter/exceptions.filter";

async function bootstrap() {
  const PORT = process.env.PORT ?? 5001;
  const FRONT_CORS_URL = process.env.FRONT_CORS_URL ?? 'http://localhost:3001';

  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: FRONT_CORS_URL });
  app.useGlobalFilters(new ExceptionsFilter());

  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Swagger')
      .setDescription('DMV Registration Form')
      .setVersion('1.0.0')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/swagger', app, documentFactory);
  }

  await app.listen(PORT);
  console.log(`Backend running on http://localhost:${PORT}`);
}

bootstrap();
