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
  expressApp.set('trust proxy', 1);
  expressApp.get('/', (request: Request, response: Response) => {
    const protocol =
      request.header('x-forwarded-proto') ?? request.protocol ?? 'http';
    const host = request.header('host') ?? `localhost:${port}`;
    const baseUrl = `${protocol}://${host}`;

    response.json({
      status: 'ok',
      service: 'venezuela-ayuda-api',
      apiBaseUrl: `${baseUrl}/api/v1`,
      docsUrl: `${baseUrl}/docs`,
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

  await app.listen(port, '0.0.0.0');
}
bootstrap();
