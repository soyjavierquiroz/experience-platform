# Content Engine v1

El contenido versionado vive en `content/tenants/<tenant>/`: `tenant.yaml`, `assets.yaml`, `program.yaml` y documentos de módulo en `modules/`. Los archivos usan sintaxis JSON compatible con YAML para mantener parsing estricto, diffs claros y edición sencilla en VS Code. No se admite HTML, JavaScript, scripts ni iframes editoriales.

Para añadir un módulo, crea el `.md` declarativo con metadata v1 y bloques, y agrégalo en `program.yaml`. Conserva cada `block.id`: respuestas y progreso dependen de su estabilidad. Un asset se declara una vez en `assets.yaml`; los bloques usan `assetRef`, nunca una URL de proveedor ni credenciales.

Video admite YouTube y Bunny mediante adaptadores normalizados. YouTube acepta ID o URL durante compilación y usa `youtube-nocookie.com`. Bunny requiere `libraryId` y `videoId`, sin API key ni subida. Vimeo y Wistia están reservados pero no implementados todavía; muestran un fallback controlado y no cargan SDKs.

La recomendación editorial mobile-first es 3:4. También se aceptan 4:5, 9:16, 16:9 y `custom` con `width`/`height`; el contenedor no recorta el video.

- `pnpm content:validate`: valida documentos, versiones, orden, IDs y referencias.
- `pnpm content:preview`: indica la ruta local `/dev/content-preview`; la ruta devuelve 404 en producción.
- `pnpm content:publish:dry-run`: requiere `DATABASE_URL`, compara e informa sin escribir.
- `pnpm content:publish`: publica en transacción e idempotentemente; omite drafts salvo `CONTENT_INCLUDE_DRAFTS=true`.

Para añadir otro provider, implementa un componente que reciba `ContentAsset`, traduzca eventos a `VideoEvent`, valida sus IDs y selecciónalo en `VideoPlayer`. Nunca aceptes HTML del creador ni registres URLs firmadas.
