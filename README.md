# Experience Platform

Foundation multi-tenant para experiencias digitales. El primer tenant es **Mujer, No Le Escribas**.

## Desarrollo

Requiere Node 24 y Corepack.

```bash
corepack enable
pnpm install
pnpm dev
```

Validación: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` y, después del build, `pnpm test:e2e`.

## Docker y producción

`pnpm docker:build` crea `experience-platform:bootstrap`. En el Swarm de un nodo se usa directamente la imagen local, evitando un registry prematuro. Despliegue: `docker stack deploy -c infrastructure/stack.prod.yml experience-platform`.

La resolución del tenant está detrás de `TenantResolver`; hoy usa configuración estática por hostname y fallback local. No utiliza todavía PostgreSQL, Redis ni servicios externos.
