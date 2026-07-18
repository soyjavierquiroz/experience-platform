# Experience Platform

Aplicación Next.js multi-tenant. El primer tenant es **Mujer, No Le Escribas**.

## Desarrollo

Requiere Node 24, PostgreSQL 16 y Corepack. Copia `.env.example` a `.env.local` con valores locales, luego:

```bash
corepack enable
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Validación: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:integration`, `pnpm build` y `pnpm test:e2e`. `pnpm email:preview` genera cinco previews locales en `.tmp/email-previews/` sin base de datos ni AWS.

## Datos y producción

Las migraciones SQL versionadas viven en `drizzle/`; producción ejecuta migración y seed idempotente antes de iniciar Next.js. No se usa `drizzle push`.

Los secretos se leen desde `VARIABLE` en desarrollo o `VARIABLE_FILE` en Swarm. La resolución del tenant usa PostgreSQL en runtime; el resolver estático existe solo para tests, desarrollo explícito y build sin conexión.

## Modo email desactivado

Es el estado actual intencional: `EMAIL_ENABLED=false`, `EMAIL_PROVIDER=disabled` y `AUTH_EMAIL_OTP_ENABLED=false`. No se leen credenciales AWS, no se crea un cliente SES y el acceso informa que el email estará disponible próximamente.

## Activación futura de AWS SES

1. Verificar el dominio o remitente en SES.
2. Definir la región real de SES.
3. Crear los dos secrets de Swarm para las credenciales autorizadas.
4. Montarlos en `stack.prod.yml` mediante `AWS_ACCESS_KEY_ID_FILE` y `AWS_SECRET_ACCESS_KEY_FILE`.
5. Cambiar a `EMAIL_ENABLED=true`, `EMAIL_PROVIDER=ses` y `AUTH_EMAIL_OTP_ENABLED=true`.
6. Construir una imagen inmutable y desplegar el stack.
7. Probar el OTP con un destinatario autorizado.
