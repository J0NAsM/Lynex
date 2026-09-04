# .context — Guía del proyecto Lynex

Documentación viva para entender este repositorio rápido, sin tener que leer todo el código.
Pensada tanto para personas nuevas como para agentes de IA que trabajen sobre el proyecto.

## Índice

| Archivo | Qué responde |
|---|---|
| [01-overview.md](01-overview.md) | Qué es Lynex, para qué existe el sitio, quién lo usa |
| [02-architecture.md](02-architecture.md) | Stack, mapa de archivos, cómo se renderiza cada ruta |
| [03-design-system.md](03-design-system.md) | Colores, tipografías, layout y convenciones de CSS |
| [04-contact-flow.md](04-contact-flow.md) | Formulario de contacto de punta a punta (validación, antispam, Resend) |
| [05-seo-metadata.md](05-seo-metadata.md) | Metadata, Open Graph, robots, sitemap, manifest, JSON-LD |
| [06-deployment.md](06-deployment.md) | Variables de entorno, build, Docker, Vercel, CI |
| [07-conventions.md](07-conventions.md) | Cómo escribir código aquí + trampas conocidas |
| [08-state.md](08-state.md) | Estado actual del repo, trabajo sin commitear y pendientes |

## Reglas de mantenimiento

- Un archivo = un tema. Si un tema crece, se parte; no se mezcla.
- Se documenta **el porqué**, no lo que el código ya dice solo.
- Si cambias comportamiento (validaciones, env vars, rutas, deploy), actualiza el archivo
  correspondiente **en el mismo commit**.
- `08-state.md` es el único archivo que caduca rápido: revísalo antes de confiar en él.

## Arranque rápido

```bash
npm ci
copy .env.example .env.local   # PowerShell / cmd
npm run dev                    # http://localhost:3000
npm run check                  # lint + typecheck + build (lo mismo que CI)
```
