# Lynex

Sitio comercial de los sistemas propios de Lynex, ofrecidos a clientes mediante suscripción mensual. Está construido con Next.js, React y TypeScript e incluye landing responsive, identidad visual provisional, SEO técnico, imagen social, política de privacidad y un diagnóstico adaptativo de necesidades.

**Sitio publicado:** [j0nasm.github.io/Lynex](https://j0nasm.github.io/Lynex/)

## Desarrollo local

Requisitos: Node.js 20.9 o superior y npm.

```bash
npm ci
copy .env.example .env.local
npm run dev
```

Abrí `http://localhost:3000`. Para validar exactamente lo que revisa CI:

```bash
npm run check
```

## Variables de entorno

Copiá `.env.example` como `.env.local` y configurá:

- `NEXT_PUBLIC_SITE_URL`: URL pública final. Se usa en canonical, Open Graph, sitemap y robots.
- `NEXT_PUBLIC_CONTACT_EMAIL`: dirección que se muestra públicamente y usa el enlace de email alternativo.
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: número con código de país y solo dígitos.
- `NEXT_PUBLIC_CONTACT_PHONE`: el mismo número en formato visible e internacional.
- `NEXT_PUBLIC_INTAKE_API_URL`: URL completa de `/api/intake` cuando la portada está en un hosting estático y el backend vive en otro dominio. En un despliegue Next.js completo se omite.
- `DATABASE_URL`: conexión PostgreSQL donde se guardan primero las solicitudes, los adjuntos y la bandeja de correos pendientes.
- `RESEND_API_KEY`: clave de API de Resend.
- `CONTACT_TO_EMAIL`: dirección que recibirá las consultas.
- `CONTACT_FROM_EMAIL`: remitente perteneciente a un dominio verificado en Resend, por ejemplo `Lynex <contacto@lynex.dev>`.
- `CRON_SECRET`: secreto largo usado para proteger `/api/intake/retry`.
- `RATE_LIMIT_SECRET`: secreto distinto usado para anonimizar la dirección de red antes de aplicar el límite de envíos.
- `INTAKE_ALLOWED_ORIGINS`: orígenes adicionales permitidos, separados por coma, cuando la web y la API están en dominios distintos.

El contacto público actual está precargado en `.env.example` y en el despliegue de Pages. También podés completar estos datos comerciales opcionales; si quedan vacíos, el sitio los oculta sin mostrar placeholders:

- `NEXT_PUBLIC_LINKEDIN_URL`: URL completa del perfil de empresa.
- `NEXT_PUBLIC_WEB_PRICE_FROM` y `NEXT_PUBLIC_SYSTEM_PRICE_FROM`: precios mensuales visibles, incluyendo moneda y período. Si faltan, la web indica que varían según alcance y uso.

La API crea sus tablas e índices al recibir la primera solicitud. Cada envío se confirma únicamente después de guardarse en PostgreSQL. El correo HTML se procesa después de responder al usuario; si falla, permanece en la bandeja de salida y `/api/intake/retry` lo retoma con espera progresiva. Nunca expongas claves, la conexión de base de datos ni secretos con el prefijo `NEXT_PUBLIC_`.

## Publicación automática en GitHub Pages

Cada push a `main` ejecuta `.github/workflows/pages.yml`, genera `out/index.html` con el prefijo `/Lynex` y lo publica en GitHub Pages. La portada enlaza Servicios, Problemas, Proceso, Garantías, Nosotros, Preguntas, Contacto y la política de privacidad. Antes de subirla, el workflow comprueba que el índice, esas secciones, sus enlaces y los recursos de marca realmente existan.

Como Pages no ejecuta Node.js ni rutas `POST`, el formulario necesita un backend independiente. Creá la variable de repositorio `INTAKE_API_URL` con la URL completa de `/api/intake`; el workflow la incorpora como `NEXT_PUBLIC_INTAKE_API_URL`. Si todavía no existe esa variable, el recorrido y el autoguardado funcionan, pero el último paso informa claramente que el envío seguro aún no está conectado y conserva el borrador en el dispositivo.

El workflow define internamente `GITHUB_PAGES=true` y `NEXT_PUBLIC_STATIC_HOSTING=true`, desactiva las rutas del servidor únicamente dentro del runner y sube la carpeta `out`. No hace falta commitear archivos generados. La fuente del índice es `src/app/page.tsx`; Next.js produce el `index.html` final durante el build.

## Cómo funciona el diagnóstico

- Muestra una pregunta principal por pantalla, una barra de progreso y ramas diferentes para una idea definida, una idea general, un proceso por mejorar, el reemplazo de un sistema o una consulta de viabilidad.
- Guarda el borrador automáticamente en el navegador. Los archivos se eligen al final porque el navegador no los conserva en el autoguardado.
- Admite hasta 5 archivos de 8 MB cada uno y 15 MB en total: PDF, Word, Excel, imágenes y texto.
- Genera una clasificación interna con tipo, complejidad, módulos probables, plataformas, integraciones, prioridad, nivel de definición y próximos pasos.
- Guarda solicitud, clasificación, adjuntos y correo pendiente dentro de una única transacción. Solo después responde al usuario y programa el correo.
- Envía un correo responsive en lenguaje natural, con resumen ejecutivo, todas las secciones relevantes, identificador y hora de Paraguay. La dirección receptora nunca se incluye en el frontend.

## Identidad visual provisional

`public/lynex-wordmark.svg` conserva la pieza horizontal azul oscuro y plateada usada cuando aparece solo el nombre de la empresa. `src/components/brand-wordmark.tsx` contiene la versión compacta y reutilizable de cabecera, pie y páginas internas. Ambas representan un wordmark provisional y pueden sustituirse cuando exista el logo definitivo.

## Publicar en Vercel

1. Importá este repositorio en Vercel.
2. Añadí las variables públicas, `DATABASE_URL`, las tres variables de correo y los dos secretos en **Project Settings → Environment Variables**.
3. Desplegá. Vercel detectará Next.js automáticamente.
4. Asociá el dominio y confirmá que `NEXT_PUBLIC_SITE_URL` coincide con la URL canónica; volvé a desplegar si cambiás esa variable.
5. Enviá un diagnóstico real, confirmá que se guardó en PostgreSQL y revisá la entrega en Resend.

`vercel.json` programa un reintento diario, compatible también con el plan Hobby. En Vercel Pro podés cambiarlo a `*/10 * * * *`. Si el proveedor de hosting no ejecuta esa programación, llamá `GET /api/intake/retry` con `Authorization: Bearer <CRON_SECRET>` desde su programador de tareas cada 10 minutos.

## Publicar con Docker

```bash
docker build \
  --build-arg NEXT_PUBLIC_SITE_URL=https://lynex.dev \
  --build-arg NEXT_PUBLIC_CONTACT_EMAIL=martinezlynex@gmail.com \
  --build-arg NEXT_PUBLIC_WHATSAPP_NUMBER=595986914726 \
  --build-arg "NEXT_PUBLIC_CONTACT_PHONE=+595 986 914 726" \
  -t lynex-web .
docker run --rm -p 3000:3000 \
  -e DATABASE_URL=postgresql://usuario:clave@servidor:5432/lynex \
  -e RESEND_API_KEY=tu_clave \
  -e CONTACT_TO_EMAIL=martinezlynex@gmail.com \
  -e "CONTACT_FROM_EMAIL=Lynex <contacto@lynex.dev>" \
  -e CRON_SECRET=tu_secreto_de_reintentos \
  -e RATE_LIMIT_SECRET=tu_secreto_de_limites \
  lynex-web
```

El contenedor usa la salida `standalone` de Next.js y se ejecuta como usuario sin privilegios. En producción, colocá HTTPS delante del contenedor y configurá un programador externo para llamar a `/api/intake/retry` cada 10 minutos.

También podés probar la compilación standalone sin Docker con `npm run build` y `npm start`. Definí `PORT` si necesitás un puerto distinto de 3000.

## Comprobaciones posteriores

- Visitá `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest` y `/opengraph-image`.
- Probá las cinco ramas del diagnóstico, volver/continuar, autoguardado, adjuntos y resumen tanto en móvil como en escritorio.
- Confirmá que la URL canónica y la vista previa social usan el dominio final.
- Confirmá en PostgreSQL que una solicitud sigue existiendo aunque Resend esté temporalmente desactivado; luego ejecutá el reintento y verificá el cambio a enviado.
- Revisá que el correo no llegue a spam y configurá SPF/DKIM según indique tu proveedor.
