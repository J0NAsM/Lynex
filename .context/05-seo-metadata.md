# 05 — SEO y metadata

## La URL canónica manda

`src/lib/site.ts` es la fuente única:

```ts
url: (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://lynex.dev").replace(/\/$/, "")
```

Se normaliza quitando la barra final. De ahí beben `metadataBase`, Open Graph, `robots.txt`,
`sitemap.xml` y el JSON-LD.

**`NEXT_PUBLIC_SITE_URL` se inyecta en tiempo de build.** Si la cambias, hay que **volver a
desplegar**; no basta con reiniciar. En Docker se pasa como `--build-arg`.

## Metadata global — `layout.tsx`

- Título con plantilla: `"%s | Lynex"`, y por defecto
  `"Lynex | Software a medida para negocios que avanzan"`.
- `alternates.canonical: "/"` (resuelto contra `metadataBase`).
- Open Graph completo con `locale: "es_ES"`, `type: "website"` e imagen 1200x630.
- Twitter card `summary_large_image`.
- `robots: { index: true, follow: true }`.
- `manifest: "/manifest.webmanifest"`, icono `/icon.svg`.
- `viewport`: `themeColor: "#132b28"`, `colorScheme: "light"`.

## JSON-LD

`layout.tsx` inyecta un schema `Organization` (nombre, url, email, `contactPoint` de tipo
`sales` en español) mediante `dangerouslySetInnerHTML`.

Antes de inyectarlo hace `.replaceAll("<", "\\u003c")` — es la protección contra que un valor
cierre el `<script>`. Si añades campos al schema, **mantén ese escapado**.

## Imagen social — `opengraph-image.tsx`

Generada en build con `next/og` (`ImageResponse`), 1200x630 PNG. Es JSX, pero con las
limitaciones de Satori: solo un subconjunto de CSS, y **todo contenedor con hijos necesita
`display: flex` explícito**. Si añades un `<div>` sin `display`, la generación falla.

Los colores están escritos a mano (`#132b28`, `#ff735c`, `#d4f36a`) porque no puede leer las
variables CSS. Ver la nota de duplicación en [03-design-system.md](03-design-system.md).

Verificación: abrir `/opengraph-image` en el navegador.

## robots.txt

Permite todo excepto `/api/`, declara `sitemap` y `host`. Que `/api/` esté bloqueado es
intencional: la ruta de contacto no debe indexarse.

## sitemap.xml

Solo dos URLs, y es correcto — el sitio tiene dos páginas:

- `/` → `changeFrequency: monthly`, `priority: 1`
- `/privacidad` → `changeFrequency: yearly`, `priority: 0.2`

**Si añades una página, añádela aquí.** Es el paso que más se olvida.

## manifest.webmanifest

PWA mínima: `display: standalone`, `lang: "es"`, `background_color: #f5f7f3`,
`theme_color: #132b28`, icono SVG único con `sizes: "any"`.

## Página de privacidad

`/privacidad` tiene su propia `metadata` con `canonical` propio. Su contenido declara que el
sitio **no usa cookies de analítica ni publicitarias** — si algún día se añade analítica, hay
que actualizar ese texto y la fecha de "Última actualización" (hoy: 3 de septiembre de 2026).

## Checklist tras un despliegue

- [ ] `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest` y `/opengraph-image` responden
- [ ] La URL canónica del HTML coincide con el dominio final
- [ ] La vista previa social se ve bien (validador de X/LinkedIn/WhatsApp)
- [ ] El formulario entrega y el correo no cae en spam (revisar SPF/DKIM en Resend)
