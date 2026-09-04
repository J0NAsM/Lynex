# SEO y metadata

## Fuente de verdad

La URL pública, los datos de contacto y los enlaces opcionales viven en
`src/lib/site.ts`. La URL se obtiene de `NEXT_PUBLIC_SITE_URL`, se normaliza sin
barra final y se reutiliza en metadata, canonicales, sitemap y datos estructurados.

La página apunta a búsquedas e intención comercial de Paraguay:

- idioma HTML: `es-PY`;
- locale de Open Graph: `es_PY`;
- título por defecto: `Lynex | Soluciones web y sistemas SaaS en Carapeguá`;
- propuesta: sitios web administrados y sistemas SaaS para empresas;
- área de servicio declarada: Paraguay, con domicilio comercial en Carapeguá.

No agregues ciudades, reseñas, clientes, premios o métricas que Lynex todavía no
pueda demostrar.

## Metadata general

`src/app/layout.tsx` define:

- `metadataBase` y canonical raíz;
- plantilla de títulos;
- descripción, keywords, autores y categoría;
- Open Graph y Twitter Card;
- reglas de indexación para buscadores;
- color del navegador y viewport.

La política de privacidad sobrescribe su título, descripción y canonical en
`src/app/privacidad/page.tsx`.

## Datos estructurados

Se publican dos bloques JSON-LD:

1. `Organization`, en el layout: identidad, URL, logo, email, teléfono opcional,
   domicilio, zona atendida y un `OfferCatalog` con dos entidades `Service`.
2. `FAQPage`, en la portada: las mismas preguntas y respuestas visibles en la
   sección de preguntas frecuentes.

Antes de insertarlos en HTML se escapa `<` con
`.replaceAll("<", "\\u003c")`. Esta defensa no debe retirarse: evita que datos
configurables puedan cerrar la etiqueta `<script>`.

Cada afirmación del schema debe seguir coincidiendo con el contenido visible y
con la realidad comercial.

No uses `ProfessionalService`: Schema.org lo marca como obsoleto y recomienda
modelar el proveedor y los servicios por separado.

## Imágenes sociales e iconos

- `src/app/opengraph-image.tsx`: imagen dinámica de 1200 × 630 para Open Graph y
  Twitter, con la propuesta de webs y sistemas en Paraguay.
- `src/app/icon.svg`: favicon vectorial.
- `src/app/apple-icon.tsx`: icono PNG dinámico de 180 × 180 para Apple.
- `public/lynex-wordmark.svg`: imagen de identidad provisional usada también como `logo` de la organización.

En GitHub Pages, el postbuild copia las dos rutas generadas a nombres `.png` y la
metadata usa esas URLs. Esto evita que el host estático las entregue como
`application/octet-stream`.

Las imágenes dinámicas usan `ImageResponse`/Satori. Sus contenedores deben
declarar `display: flex`; Satori no interpreta todo CSS del navegador.

## Archivos para crawlers

- `src/app/robots.ts`: permite rastrear el sitio y enlaza el sitemap.
- `src/app/sitemap.ts`: incluye `/` y `/privacidad`; la fecha se calcula en el
  build.
- `src/app/manifest.ts`: manifiesto en `es-PY`, nombre, descripción, colores e
  icono.

Al crear una ruta pública indexable, agregala al sitemap y decidí explícitamente
su canonical y metadata.
