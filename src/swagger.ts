import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function buildSwaggerDocument(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Venezuela Ayuda API')
    .setDescription(
      'API MVP para autenticacion, publicaciones, ofertas, chat y valoraciones de Venezuela Ayuda.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addServer('http://localhost:8000', 'Local')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: true,
  });

  document.paths = Object.fromEntries(
    Object.entries(document.paths).map(([path, value]) => [
      `/api/v1${path}`,
      value,
    ]),
  );

  return document;
}
