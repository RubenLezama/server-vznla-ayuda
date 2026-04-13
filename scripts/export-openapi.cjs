require('reflect-metadata');

const { writeFileSync, mkdirSync } = require('node:fs');
const { join } = require('node:path');
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/src/app.module');
const { buildSwaggerDocument } = require('../dist/src/swagger');

async function main() {
  const app = await NestFactory.create(AppModule, { logger: false });
  await app.init();

  const document = buildSwaggerDocument(app);
  const outputDir = join(process.cwd(), 'docs', 'yaak');
  const outputFile = join(outputDir, 'venezuela-ayuda-openapi.json');

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(outputFile, JSON.stringify(document, null, 2), 'utf8');

  await app.close();
  console.log(`OpenAPI exportado en ${outputFile}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
