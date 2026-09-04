# 08 — Estado actual

> Instantánea del **3 de septiembre de 2026**. Es el archivo que caduca más rápido de
> `.context/`; verifica con `git status` antes de fiarte de él.

## Las dos carpetas del workspace

```
C:\Proyectos\Personal\Lynex\
├── Lynex\        ← EL PROYECTO REAL (repo git, es donde vive este .context)
└── lynex-app\    ← scaffold de create-next-app sin tocar
```

`lynex-app/` contiene solo `src/app/{layout,page,globals.css}` con el contenido por defecto de
`create-next-app`, el README de plantilla y **no es un repositorio git**. Todo el trabajo real
está en `Lynex/`.

**Pendiente de decisión:** borrar `lynex-app/` o dejarla. Ahora mismo solo genera confusión
sobre cuál es el proyecto.

## Estado de git

Repositorio: `https://github.com/J0NAsM/Lynex.git`, rama `main`.

Historial: dos commits (`321b5e1 Initial commit`, `b40eaaa 1`).

**Hay trabajo sin commitear**, y es casi todo el sitio. Modificados:

```
.gitignore  README.md  next.config.ts  package.json
src/app/globals.css  src/app/layout.tsx  src/app/page.tsx
src/app/robots.ts  src/app/sitemap.ts
```

Sin seguimiento:

```
.dockerignore  .env.example  .github/  Dockerfile  package-lock.json
public/  scripts/
src/app/api/  src/app/manifest.ts  src/app/not-found.tsx
src/app/opengraph-image.tsx  src/app/privacidad/
src/components/  src/lib/
```

Es decir: **el formulario de contacto, el layout, el Dockerfile, el CI y toda la capa de SEO
todavía no están en el remoto.** Primera tarea recomendada: commitear esto con un mensaje
descriptivo (`b40eaaa` se llama literalmente "1").

Comprueba que `package-lock.json` entra en el commit — el CI usa `npm ci` y sin el lockfile
falla.

## Qué está terminado

- Landing completa, responsive y accesible
- Página de privacidad y 404
- Formulario de contacto funcional con antispam y rate limit
- SEO técnico completo (metadata, OG generado, robots, sitemap, manifest, JSON-LD)
- Cabeceras de seguridad y CSP estricta
- Build standalone + Dockerfile + workflow de CI

## Pendientes conocidos

| Tema | Detalle |
|---|---|
| Commitear el trabajo | Ver arriba; es lo más urgente |
| Decidir sobre `lynex-app/` | Borrarla o justificar por qué está |
| Casos reales | La sección "Resultados" es un placeholder genérico a la espera de proyectos publicables |
| Dominio | `lynex.dev` sigue en parking y sin MX a 2026-09-03; apuntarlo al hosting y configurar correo/SPF/DKIM antes de producción |
| Rate limit distribuido | Solo si el tráfico lo justifica ([04](04-contact-flow.md)) |
| Tests | No hay ninguno. `npm run check` es toda la red de seguridad |
