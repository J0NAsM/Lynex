# Convenciones y trampas conocidas

## Contenido y tono

- Escribí en español de Paraguay y con voseo: `podés`, `contanos`, `elegí`.
- Lynex vende dos entradas SaaS: sitios web administrados y sistemas para la operación.
- La narrativa parte del problema operativo y termina en una conversación, no en
  una lista de tecnologías.
- Todo se comercializa como SaaS. El cliente contrata acceso, operación, mantenimiento
  y mejoras mediante un plan; el precio mensual varía según alcance, usuarios,
  integraciones y nivel de servicio.
- Lynex conserva la propiedad de sus soluciones. No uses la propiedad ni la entrega
  del código como argumento comercial y no prometas repositorios o transferencias.
- No inventes clientes, testimonios, métricas ni casos. Mientras no existan, se
  muestran proceso, garantías y una interfaz marcada como `DEMO OPERATIVA`.
- Los precios, enlaces y canales opcionales se muestran solo cuando tienen datos
  reales configurados.

## Organización del código

- Usá Server Components por defecto. Agregá `"use client"` solo cuando haya estado,
  efectos o APIs del navegador.
- Los datos globales y ofertas viven en `src/lib/site.ts`.
- El contenido editorial de la portada se agrupa en arreglos cercanos a la página:
  síntomas, pasos, compromisos y preguntas frecuentes.
- Reutilizá `SectionHeading` y los componentes existentes antes de crear otra
  abstracción.
- Mantené el CSS en `src/app/globals.css` con las variables y breakpoints actuales.

## Seguridad y runtime

- No calcules `Date.now()`, números aleatorios ni valores impuros durante el render
  de React. Inicializalos en un efecto o dentro de un manejador de evento.
- Escapá siempre `<` como `\\u003c` al serializar JSON-LD dentro de `<script>`.
- Si agregás recursos de terceros, revisá la Content Security Policy de
  `next.config.ts`; no la abras de forma general.
- Validá en el servidor incluso cuando el cliente ya valida.
- El límite de contactos actual vive en memoria. Funciona por instancia, pero no
  sustituye un rate limiter compartido cuando haya varias réplicas o tráfico alto.

## Configuración

- Toda variable `NEXT_PUBLIC_*` se resuelve en el build.
- `NEXT_PUBLIC_STATIC_HOSTING` es una excepción interna del workflow de Pages; no
  debe activarse en Vercel ni Docker.
- Si agregás una variable pública, actualizá también `.env.example`, `README.md`,
  `Dockerfile` y `.context/06-deployment.md`.
- Si agregás una ruta indexable, actualizá sitemap, metadata y esta documentación.
- No guardes secretos, `.env.local`, builds ni artefactos de pruebas visuales.

## Calidad mínima antes de entregar

```bash
npm run check
git diff --check
```

Después probá como mínimo `/`, `/privacidad`, los assets dinámicos y una ruta 404.
En modo servidor, probá también los estados 400/403/503 del contacto. En modo Pages,
confirmá que el HTML usa `/Lynex/_next/`, enlaza `/Lynex/privacidad/`, muestra el CTA
de correo y no contiene `/api/contact`. Un envío real solo se valida con Resend.

## Estructura duplicada del workspace

El repositorio real está en `C:\Proyectos\Personal\Lynex\Lynex`. Existe además
`C:\Proyectos\Personal\Lynex\lynex-app`, que era un scaffold separado y no forma
parte de este producto. Confirmá la raíz antes de editar, desplegar o ejecutar Git.
