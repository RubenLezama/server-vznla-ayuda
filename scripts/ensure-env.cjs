const fs = require('node:fs');
const path = require('node:path');

const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), '.env.example');

if (!fs.existsSync(envPath)) {
  fs.copyFileSync(envExamplePath, envPath);
  console.log('.env no existia. Se creo automaticamente desde .env.example');
} else {
  console.log('.env ya existe. No se modifico.');
}
