# Estado del proyecto

Instantánea: **4 de septiembre de 2026**.

## Repositorio

- Ruta activa: `C:\Proyectos\Personal\Lynex\Lynex`.
- Rama: `main`.
- Base anterior a esta entrega: `51a98ef` (`2`).
- Esta instantánea describe la versión terminada que se publica en `main`; usá
  `git log -1` para consultar el identificador definitivo del commit.

No confundir con el scaffold hermano `C:\Proyectos\Personal\Lynex\lynex-app`.

## Implementado

- Portada comercial completa con una narrativa única para vender webs y sistemas.
- Wordmark provisional plateado sobre azul oscuro integrado en hero, cabecera, pie, metadata e imagen social.
- Paleta visual alineada con la referencia de marca y contenido visible desde el primer fotograma.
- Copy localizado para Paraguay y consistente en voseo.
- Secciones de problemas, dos ofertas, proceso, garantías, preguntas frecuentes y
  contacto.
- Configuración opcional por entorno para WhatsApp, teléfono, LinkedIn y precios.
- Metadata local, `Organization` + catálogo de `Service`, `FAQPage`, Open Graph
  actualizado, Apple icon, sitemap y manifest `es-PY`.
- Formulario con validación, honeypot, control temporal, rate limit, restricción de
  origen y envío con Resend.
- Menú móvil accesible, cierre por clic externo, Escape, navegación y resize.
- Páginas de error, error global y 404 coherentes con la marca.
- Build standalone, Docker multi-stage, headers de seguridad y CI.
- Exportación estática con `basePath` y despliegue automático en GitHub Pages.
- Verificación automática de `out/index.html`, anclas, rutas y recursos antes de publicar Pages.

## Validaciones realizadas

En este estado pasaron:

- `npm run lint`;
- `npm run typecheck`;
- `npm run build` y el postbuild standalone;
- rutas `/`, `/privacidad`, `/robots.txt`, `/sitemap.xml`,
  `/manifest.webmanifest`, `/opengraph-image` y `/apple-icon` con 200;
- una ruta inexistente con 404;
- API de contacto: payload inválido 400, envío demasiado rápido 200 silencioso,
  origen cruzado 403 y configuración Resend ausente 503;
- revisión visual de portada completa en desktop y móvil, y de la imagen Open
  Graph.
- build estático de Pages y comprobación del HTML: assets bajo `/Lynex`, privacidad
  correcta, contacto por correo y ausencia de `/api/contact`.

El 200 silencioso del envío rápido es intencional para no ayudar a bots. Falta un
envío real exitoso porque no hay credenciales Resend locales.

## Pendientes que requieren datos o servicios externos

1. GitHub Pages ya funciona como hosting público. Si se quiere usar `lynex.dev`,
   apuntar el DNS y configurarlo como dominio personalizado; seguía en parking en la
   última revisión.
2. Configurar el correo de `lynex.dev` y verificar SPF/DKIM/remitente en Resend.
3. Para recuperar el formulario web completo, desplegar también en un hosting con
   runtime Next.js, cargar los secretos de Resend y probar un contacto real.
4. Completar, si existen, WhatsApp, teléfono, LinkedIn y precios reales.
5. Reemplazar progresivamente garantías por casos, testimonios y resultados reales
   cuando Lynex los tenga.
6. Probar la imagen Docker en un entorno con Docker disponible.
7. Cambiar el rate limit en memoria por uno distribuido solo si el volumen o la
   infraestructura de múltiples instancias lo justifican.
8. Verificar el workflow de GitHub después de cada push a `main`.

No hay un bloqueo técnico para la web pública en Pages. El dominio personalizado y
el envío mediante formulario dependen de DNS, hosting con servidor y credenciales.
