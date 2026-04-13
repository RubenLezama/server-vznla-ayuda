import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AppModule } from './app.module';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { buildSwaggerDocument } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 8000;
  const origins = (configService.get<string>('CORS_ORIGIN') ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.setGlobalPrefix('api/v1');
  app.use(cookieParser());
  app.use(new RequestLoggerMiddleware().use);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.enableCors({
    origin: origins.length ? origins : true,
    credentials: true,
  });

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get('/', (_request: Request, response: Response) => {
    response.json({
      status: 'ok',
      service: 'venezuela-ayuda-api',
      apiBaseUrl: `http://localhost:${port}/api/v1`,
      docsUrl: `http://localhost:${port}/docs`,
    });
  });

  const swaggerDocument = buildSwaggerDocument(app);
  const { SwaggerModule } = await import('@nestjs/swagger');
  SwaggerModule.setup('docs', app, swaggerDocument, {
    customSiteTitle: 'Venezuela Ayuda API',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(port);
}
bootstrap();
