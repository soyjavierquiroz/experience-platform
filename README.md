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

Validación: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:integration`, `pnpm build` y `pnpm test:e2e`.

## Datos y producción

Las migraciones SQL versionadas viven en `drizzle/`; producción ejecuta migración y seed idempotente antes de iniciar Next.js. No se usa `drizzle push`.

Los secretos se leen desde `VARIABLE` en desarrollo o `VARIABLE_FILE` en Swarm. El stack espera los secrets `experience_database_url_v1`, `experience_auth_secret_v1`, `experience_aws_access_key_id_v1` y `experience_aws_secret_access_key_v1`. La resolución del tenant usa PostgreSQL en runtime; el resolver estático existe solo para tests, desarrollo explícito y build sin conexión.
