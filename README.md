# Lynex

Sitio comercial de los sistemas propios de Lynex, ofrecidos mediante suscripción mensual. Está construido con Next.js, React y TypeScript e incluye una portada responsive, un configurador de pedidos y un panel privado para consultar las solicitudes recibidas.

**Sitio estático publicado:** [j0nasm.github.io/Lynex](https://j0nasm.github.io/Lynex/)

## Desarrollo local

Requisitos: Node.js 20.9 o superior y npm.

```bash
npm ci
copy .env.example .env.local
npm run dev
```

Abrí `http://localhost:3000`. El panel privado está en `http://localhost:3000/admin/pedidos`.

## Acceso directo en el escritorio (Windows)

Para levantar el proyecto sin abrir una terminal:

```powershell
npm run acceso-directo
```

Eso crea el acceso directo **Lynex** en el escritorio. Al abrirlo, `scripts/iniciar-lynex.ps1`:

- verifica que Node.js 20.9 o superior esté instalado;
- instala las dependencias si todavía no están;
- crea `.env.local` a partir de `.env.example` con secretos nuevos y muestra una vez la contraseña del panel;
- si el puerto 3000 está ocupado por otro programa, busca el siguiente libre;
- si el sitio ya está corriendo, solo abre el navegador;
- levanta `next dev` y abre la portada cuando el servidor responde.

La ventana muestra los registros del servidor. Cerrarla o pulsar `Ctrl+C` detiene el sitio.

Para validar el proyecto completo:

```bash
npm run check
```

## Variables de entorno

Copiá `.env.example` como `.env.local` y configurá:

- `NEXT_PUBLIC_SITE_URL`: URL pública final usada en canonical, Open Graph, sitemap y robots.
- `NEXT_PUBLIC_CONTACT_EMAIL`: correo público de contacto.
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: número con código de país y solo dígitos.
- `NEXT_PUBLIC_CONTACT_PHONE`: el mismo número en formato visible e internacional.
- `NEXT_PUBLIC_INTAKE_API_URL`: URL completa de `/api/intake` cuando la portada está en GitHub Pages y el servidor vive en otro dominio. En un despliegue Next.js completo se omite.
- `INTAKE_DATA_DIR`: carpeta privada donde se guardan los pedidos y adjuntos. El valor predeterminado es `./data`.
- `ADMIN_PASSWORD`: contraseña del panel `/admin/pedidos`, con un mínimo de 12 caracteres.
- `ADMIN_SESSION_SECRET`: secreto largo y aleatorio usado para firmar la sesión administrativa.
- `RATE_LIMIT_SECRET`: secreto distinto usado para anonimizar la dirección de red antes de aplicar límites de envío.
- `INTAKE_ALLOWED_ORIGINS`: orígenes adicionales permitidos cuando la web y la API usan dominios distintos.

También podés configurar `NEXT_PUBLIC_LINKEDIN_URL`, `NEXT_PUBLIC_WEB_PRICE_FROM` y `NEXT_PUBLIC_SYSTEM_PRICE_FROM`. Si quedan vacíos, el sitio oculta esos datos.

Nunca uses el prefijo `NEXT_PUBLIC_` para contraseñas o secretos.

## Almacenamiento sin base de datos

Cada pedido se guarda dentro de `INTAKE_DATA_DIR/pedidos/<identificador>`:

- `pedido.json` contiene las respuestas, datos de contacto, fecha y clasificación.
- `archivos/` contiene los documentos adjuntos.

La escritura se realiza primero en una carpeta temporal y luego se publica mediante un cambio de nombre atómico. Así no aparece un pedido incompleto en el panel si una escritura falla.

El panel `/admin/pedidos` permite:

- Iniciar sesión mediante una contraseña privada.
- Consultar todos los pedidos, del más reciente al más antiguo.
- Ver el detalle completo y el análisis automático.
- Abrir el correo o teléfono del cliente.
- Descargar los archivos adjuntos de forma protegida.

La cookie administrativa es `HttpOnly`, está firmada y vence después de 12 horas. La página y las descargas vuelven a verificar la sesión en el servidor.

Respaldar los pedidos consiste simplemente en copiar la carpeta configurada en `INTAKE_DATA_DIR`.

## Cómo funciona el pedido guiado

- Presenta una pregunta por pantalla y adapta el recorrido a la necesidad del cliente.
- Guarda el borrador automáticamente en el navegador del cliente.
- Admite hasta 5 archivos de 8 MB cada uno y 15 MB en total: PDF, Word, Excel, imágenes y texto.
- Valida nuevamente toda la información en el servidor.
- Genera un identificador y una clasificación interna.
- Guarda el pedido antes de mostrar la confirmación al cliente.

## GitHub Pages

GitHub Pages solo puede publicar la portada estática: no ejecuta Node.js, no recibe solicitudes y no puede guardar archivos.

Para conservar la portada en Pages, desplegá además esta aplicación como servidor Next.js/Docker y configurá la variable de repositorio `INTAKE_API_URL` con la URL pública de su endpoint `/api/intake`. El panel privado estará en el dominio del servidor, dentro de `/admin/pedidos`.

Si `INTAKE_API_URL` no está configurada, la versión de Pages muestra las opciones directas de correo y WhatsApp. El workflow excluye las rutas privadas durante la exportación estática.

## Publicar con Docker

El contenedor incluye `/app/data` como volumen. Debe montarse un volumen persistente para conservar los pedidos entre reinicios:

```bash
docker build \
  --build-arg NEXT_PUBLIC_SITE_URL=https://lynex.dev \
  --build-arg NEXT_PUBLIC_CONTACT_EMAIL=martinezlynex@gmail.com \
  --build-arg NEXT_PUBLIC_WHATSAPP_NUMBER=595986914726 \
  --build-arg "NEXT_PUBLIC_CONTACT_PHONE=+595 986 914 726" \
  -t lynex-web .

docker volume create lynex-data

docker run --rm -p 3000:3000 \
  -v lynex-data:/app/data \
  -e ADMIN_PASSWORD=una-contraseña-muy-larga \
  -e ADMIN_SESSION_SECRET=un-secreto-diferente-muy-largo \
  -e RATE_LIMIT_SECRET=otro-secreto-muy-largo \
  lynex-web
```

En producción, colocá HTTPS delante del contenedor. El proceso se ejecuta como usuario sin privilegios y el volumen de datos queda preparado para escritura.

Los hosts con sistema de archivos efímero, como una función serverless sin volumen persistente, no sirven para este modo de almacenamiento: los pedidos podrían desaparecer al reiniciar o reemplazar la instancia.

## Comprobaciones posteriores

- Realizá un pedido de prueba y verificá que aparezca en `/admin/pedidos`.
- Cerrá sesión y confirmá que el detalle y los adjuntos no sean accesibles.
- Reiniciá el servidor y comprobá que el pedido siga presente.
- Probá el recorrido, autoguardado, archivos y panel tanto en móvil como en escritorio.
- Incluí `INTAKE_DATA_DIR` en las copias de seguridad del servidor.
