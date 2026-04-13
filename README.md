# Venezuela Ayuda API

Backend MVP para **Venezuela Ayuda**, construido con **NestJS + Prisma + PostgreSQL**.

La idea de este backend es sentar una base limpia y entendible para el proyecto: autenticacion, publicaciones, ofertas para ayudar, chat en vivo y valoraciones simples. No intenta resolver todo de una vez; intenta resolver bien lo minimo viable para que el producto pueda empezar a moverse.

## Qué incluye este MVP

- Registro e inicio de sesion con JWT
- Perfil basico de usuario
- Publicaciones de tipo `REQUEST` o `DONATION`
- Filtros basicos para explorar publicaciones
- Ofertas para ayudar en una publicacion
- Creacion automatica de una sala de chat por oferta
- Chat por REST y por WebSocket
- Confirmacion de ayuda completada
- Review simple con rating y mensaje de agradecimiento
- Swagger/OpenAPI para documentacion
- Archivo OpenAPI para importar en Yaak
- Prisma con migraciones y seed

## Stack 🧱

- Node.js `22 LTS`
- NestJS `11`
- PostgreSQL `17`
- Prisma `6`
- pnpm
- Socket.IO

## Qué es Socket.IO 💬

`Socket.IO` es una librería para comunicación en tiempo real entre frontend y backend.

En este proyecto se usa para el chat. Eso significa que:

- un usuario envia un mensaje
- el backend lo recibe al instante
- el otro usuario lo ve casi en tiempo real

Sin `Socket.IO`, el frontend tendría que estar preguntando cada pocos segundos si hay mensajes nuevos. Con `Socket.IO`, el servidor puede empujar los eventos apenas pasan.

En corto:

- `REST` sirve para operaciones normales como login, crear posts o aceptar ofertas
- `Socket.IO` sirve para eventos en vivo como el chat

## Estructura rápida 📁

```text
src/
  auth/       registro, login, jwt
  users/      perfil del usuario
  posts/      publicaciones
  offers/     intencion de ayuda / match basico
  chat/       salas, mensajes y websocket
  reviews/    agradecimientos y rating
  prisma/     servicio global de Prisma
  common/     decorators, guards y middleware
prisma/
  schema.prisma
  migrations/
  seed.ts
docs/yaak/
  venezuela-ayuda-openapi.json
scripts/
  ensure-env.cjs
  export-openapi.cjs
```

## Requisitos ✅

- Node.js `22 LTS`
- pnpm
- PostgreSQL `17`

Si trabajas en **WSL/Linux**, usa la terminal normal.

Si trabajas en **Windows**, puedes correr el proyecto sin WSL siempre que tengas:

- Node 22 instalado
- pnpm instalado
- PostgreSQL 17 instalado y corriendo

## Variables de entorno ⚙️

Existe un archivo de ejemplo: [.env.example](/home/ruben/repo/server-vznla-ayuda/.env.example:1)

Crea tu `.env` a partir de ese archivo.

### WSL / Linux

```bash
cp .env.example .env
```

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

Variables principales:

```env
PORT=8000
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/venezuela_ayuda_dev?schema=public"
JWT_SECRET="change-this-in-real-projects"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:3001,http://127.0.0.1:3001,http://localhost:5173,http://127.0.0.1:5173"
```

## Instalación 🚀

### WSL / Linux

```bash
pnpm install
```

### Windows PowerShell

```powershell
pnpm install
```

## Prisma explicado simple 🗃️

Prisma es la capa que conecta el backend con PostgreSQL.

Piensalo asi:

- **PostgreSQL** es la base de datos real
- **Prisma schema** describe tablas, enums y relaciones
- **Prisma Client** es el cliente TypeScript que usa NestJS para consultar y guardar datos
- **Migraciones** son cambios versionados de la base de datos
- **Seed** son datos iniciales para probar rapido

En este proyecto Prisma vive principalmente en:

- [prisma/schema.prisma](/home/ruben/repo/server-vznla-ayuda/prisma/schema.prisma:1)
- [prisma/seed.ts](/home/ruben/repo/server-vznla-ayuda/prisma/seed.ts:1)
- [src/prisma/prisma.service.ts](/home/ruben/repo/server-vznla-ayuda/src/prisma/prisma.service.ts:1)

## Primer arranque local 🏁

Este es el flujo recomendado la primera vez.

Si quieres una version corta y automatica, puedes usar:

```bash
pnpm dev:first-run
```

Ese comando:

- crea `.env` si no existe
- instala dependencias
- genera Prisma Client
- crea la migracion inicial
- carga el seed
- levanta el servidor

### 1. Generar el cliente de Prisma

```bash
pnpm db:generate
```

### 2. Crear o aplicar migraciones

Si es la primera vez y estas desarrollando localmente:

```bash
pnpm db:migrate --name init
```

Si el proyecto ya trae migraciones y solo quieres aplicarlas:

```bash
pnpm db:deploy
```

### 3. Poblar datos de prueba

```bash
pnpm db:seed
```

### 4. Levantar el backend

```bash
pnpm start:dev
```

La API quedara disponible en:

- `http://localhost:8000/`
- `http://localhost:8000/api/v1`
- Swagger: `http://localhost:8000/docs`

## Esto no se hace cada vez 🔁

No. Ese bloque completo es para la **primera vez** o cuando estas montando el proyecto desde cero en una maquina nueva.

Este fue el bloque:

```bash
pnpm install
cp .env.example .env
pnpm db:generate
pnpm db:migrate --name init
pnpm db:seed
pnpm start:dev
```

### Lo que haces solo la primera vez

```bash
pnpm install
cp .env.example .env
pnpm db:generate
pnpm db:migrate --name init
pnpm db:seed
```

### Lo que normalmente haces cada vez que quieres correr el backend

```bash
pnpm start:dev
```

O si quieres que el comando se asegure de que `.env` exista:

```bash
pnpm dev:up
```

## Flujo diario recomendado 🧭

Si no cambiaste dependencias ni Prisma, normalmente basta con esto:

```bash
pnpm start:dev
```

## Cuando sí debes correr otros comandos otra vez

- `pnpm install`
  Solo cuando cambie `package.json` o bajes el proyecto por primera vez.

- `cp .env.example .env`
  Solo la primera vez. Despues solo editas tu `.env` si hace falta.

- `pnpm db:generate`
  Cuando cambie `prisma/schema.prisma` o despues de instalar dependencias desde cero.

- `pnpm db:migrate --name ...`
  Cuando tu mismo hagas un cambio nuevo en el schema y quieras crear una nueva migracion.

- `pnpm db:deploy`
  Cuando ya existen migraciones creadas y solo quieres aplicarlas en otra maquina.

- `pnpm db:seed`
  Solo cuando quieras volver a cargar datos de prueba.

- `pnpm db:reset`
  Solo cuando quieras borrar y reconstruir la base completa en desarrollo.

## Scripts útiles nuevos 🛠️

```bash
pnpm dev:first-run
pnpm dev:up
pnpm dev:reset
```

Qué hace cada uno:

- `pnpm dev:first-run`
  Ideal para una maquina nueva o para la primera instalacion en Windows o WSL/Linux.

- `pnpm dev:up`
  Levanta el backend y se asegura de que `.env` exista.

- `pnpm dev:reset`
  Reinicia la base de desarrollo y vuelve a cargar el seed.

## URL base correcta 🌐

Ahora el backend responde tambien en la raiz:

```text
http://localhost:8000/
```

Esa URL devuelve un JSON simple con este formato:

```json
{
  "status": "ok",
  "service": "venezuela-ayuda-api",
  "apiBaseUrl": "http://localhost:8000/api/v1",
  "docsUrl": "http://localhost:8000/docs"
}
```

Eso incluye:

- estado del servicio
- `apiBaseUrl`
- `docsUrl`

La base real de la API sigue siendo:

```text
http://localhost:8000/api/v1
```

Y Swagger sigue viviendo en:

```text
http://localhost:8000/docs
```

## Flujo normal cuando cambies el schema 🧬

Cuando edites `prisma/schema.prisma`, usa este flujo:

1. Cambia el schema
2. Crea la migracion
3. Prisma actualiza la base
4. Prisma regenera el cliente

Comando:

```bash
pnpm db:migrate --name describe_tu_cambio
```

Ejemplo:

```bash
pnpm db:migrate --name add_user_location
```

## Comandos útiles 📌

```bash
pnpm start:dev
pnpm build
pnpm test
pnpm db:generate
pnpm db:migrate --name init
pnpm db:deploy
pnpm db:reset
pnpm db:seed
pnpm db:studio
pnpm docs:generate
```

## Yaak 📬

Este proyecto genera un archivo OpenAPI que puedes importar en Yaak para tener todos los endpoints listos.

Genéralo así:

```bash
pnpm docs:generate
```

Archivo generado:

- [docs/yaak/venezuela-ayuda-openapi.json](/home/ruben/repo/server-vznla-ayuda/docs/yaak/venezuela-ayuda-openapi.json:1)

En Yaak, importa ese JSON como especificacion OpenAPI.

## Cómo probar los endpoints 🧪

Tienes tres formas comodas:

### 1. Swagger, la más rápida

Levanta el proyecto:

```bash
pnpm dev:up
```

Luego abre:

- `http://localhost:8000/docs`

Flujo recomendado en Swagger:

1. Probar `POST /auth/login`
2. Copiar el `accessToken`
3. Pulsar `Authorize`
4. Pegar el token como `Bearer TU_TOKEN`
5. Probar rutas protegidas como:
   - `GET /auth/me`
   - `POST /posts`
   - `GET /offers`
   - `GET /chat/rooms`

### 2. Yaak, para trabajar más cómodo

1. Genera o regenera el archivo OpenAPI:

```bash
pnpm docs:generate
```

2. En Yaak importa este archivo:

- [docs/yaak/venezuela-ayuda-openapi.json](/home/ruben/repo/server-vznla-ayuda/docs/yaak/venezuela-ayuda-openapi.json:1)

3. Ejecuta primero:

- `POST /auth/login`

4. Copia el `accessToken`

5. En Yaak agrega un header:

```text
Authorization: Bearer TU_TOKEN
```

6. Ahora ya puedes probar las rutas protegidas.

## Comandos para matar un puerto ocupado 🧯

Si alguna vez el backend no arranca porque el puerto `8000` ya esta ocupado, puedes liberar el puerto antes de volver a levantar el proyecto.

### Opción 1: usando kill-port con npm

Instalacion global:

```bash
npm install -g kill-port
```

Uso:

```bash
kill-port 8000
```

Si quieres matar varios:

```bash
kill-port 8000 5432
```

### Opción 2: WSL / Linux desde terminal

Ver que proceso usa el puerto:

```bash
lsof -i :8000
```

Matar el puerto directamente:

```bash
fuser -k 8000/tcp
```

O con `lsof` + `kill`:

```bash
kill -9 $(lsof -t -i:8000)
```

### Opción 3: Windows desde terminal

Ver el proceso que usa el puerto:

```powershell
netstat -ano | findstr :8000
```

Luego matar el PID:

```powershell
taskkill /PID TU_PID /F
```

### Recomendación práctica

Si quieres algo simple y que funcione tanto en Windows como en WSL/Linux, la opcion mas comoda suele ser:

```bash
npm install -g kill-port
kill-port 8000
```

### 3. Con usuarios de prueba del seed

Puedes entrar con cualquiera de estos dos:

- `donante@venezuela-ayuda.org`
- `clinica@venezuela-ayuda.org`

Contraseña:

```text
Password123*
```

### Orden recomendado para probar el MVP

1. `POST /auth/login`
2. `GET /posts`
3. `POST /posts/:postId/offers`
4. `GET /offers`
5. `PATCH /offers/:offerId/status`
6. `GET /chat/rooms`
7. `GET /chat/rooms/:roomId/messages`
8. `POST /chat/rooms/:roomId/messages`
9. `POST /reviews`

### Ejemplo rápido de prueba real

Primero login:

```json
{
  "email": "donante@venezuela-ayuda.org",
  "password": "Password123*"
}
```

Luego usa el token en rutas protegidas.

Por ejemplo, para crear una publicacion:

```json
{
  "title": "Donacion de alimentos no perecederos",
  "description": "Tengo arroz, pasta y granos para entregar en Caracas esta semana.",
  "type": "DONATION",
  "category": "FOOD",
  "urgency": "MEDIUM",
  "quantityNeeded": 8,
  "city": "Caracas",
  "state": "Distrito Capital",
  "country": "Venezuela"
}
```

## Endpoints principales 🔌

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

### Users

- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me`

### Posts

- `POST /api/v1/posts`
- `GET /api/v1/posts`
- `GET /api/v1/posts/:postId`
- `PATCH /api/v1/posts/:postId`

### Offers

- `POST /api/v1/posts/:postId/offers`
- `GET /api/v1/offers`
- `GET /api/v1/offers/:offerId`
- `PATCH /api/v1/offers/:offerId/status`

### Chat

- `GET /api/v1/chat/rooms`
- `GET /api/v1/chat/rooms/:roomId/messages`
- `POST /api/v1/chat/rooms/:roomId/messages`

Socket namespace:

- `ws://localhost:8000/chat`

Eventos:

- `join_room`
- `send_message`
- `message_created`

### Reviews

- `POST /api/v1/reviews`
- `GET /api/v1/reviews/me/received`

## Seed incluido 🌱

El seed crea:

- un usuario persona
- un usuario tipo organizacion
- una solicitud abierta
- una donacion abierta

Credenciales de prueba:

- `donante@venezuela-ayuda.org`
- `clinica@venezuela-ayuda.org`
- contrasena para ambos: `Password123*`

## Decisiones de este MVP 🧠

Para mantener la base limpia y no sobrecargar el primer sprint:

- JWT simple, sin refresh tokens todavia
- una sala de chat por oferta
- review sencilla despues de completar la ayuda
- sin adjuntos, sin notificaciones push y sin moderacion avanzada por ahora

## Si algo no levanta 🚨

Revisa en este orden:

1. `node -v` debe ser `22.x`
2. PostgreSQL debe estar corriendo
3. `DATABASE_URL` debe apuntar a la base correcta
4. `pnpm db:generate`
5. `pnpm db:migrate --name init`
6. `pnpm start:dev`

## Nota para el equipo 🤝

Este backend esta pensado para que una persona trabajando en WSL y otra en Windows puedan compartir el mismo proyecto sin pelearse con el entorno. Mientras ambas usen:

- Node 22
- PostgreSQL 17
- pnpm

el flujo deberia ser el mismo.
