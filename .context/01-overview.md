# 01 — Visión general

## Qué es

**Lynex** es un estudio de Carapeguá que vende dos servicios relacionados:

1. sitios web administrados como servicio;
2. acceso mensual a sistemas desarrollados y administrados por Lynex cuando las planillas y herramientas sueltas ya no alcanzan.

Lynex desarrolla sus propios productos y vende a cada cliente el derecho de usarlos mediante
una suscripción mensual. No desarrolla un SaaS exclusivo para cada empresa. Este repositorio
contiene solo el sitio comercial, por eso no implementa la autenticación, los usuarios ni las
plataformas ofrecidas. Incluye una ruta de servidor para enviar el formulario cuando el hosting
soporta Node.js; GitHub Pages publica una variante estática con contacto directo.

## Objetivo y narrativa

El objetivo es convertir una visita en una conversación de 30 minutos. Si se configura
WhatsApp, aparece como acceso directo. En un hosting con servidor queda disponible el
formulario; en GitHub Pages se ofrece un CTA directo por correo.

La landing cuenta una sola historia con dos ofertas, en este orden:

1. **Hero** — problema central, ubicación, CTA y wordmark provisional; el panel está rotulado como demo.
2. **Trust strip** — sistemas Lynex, suscripción mensual y soporte.
3. **Servicios** (`#servicios`) — presencia web administrada y acceso a productos Lynex.
4. **Problemas** (`#problemas`) — tres síntomas reconocibles por el cliente.
5. **Proceso** (`#proceso`) — cuatro pasos desde conversación hasta publicación.
6. **Garantías** (`#garantias`) — compromisos comerciales sin inventar casos de éxito.
7. **Nosotros** (`#nosotros`) — equipo pequeño, comunicación directa y criterio honesto.
8. **FAQ** (`#preguntas`) — precio mensual variable, catálogo de sistemas, activación, suscripción y cambios de plan.
9. **Contacto** (`#contacto`) — formulario o correo, WhatsApp opcional y ubicación.

## Idioma y honestidad comercial

- La interfaz usa español paraguayo y voseo (`<html lang="es-PY">`, locale `es_PY`).
- No se muestran testimonios, clientes ni métricas como resultados reales. El dashboard del
  hero es una demostración visual y así se indica dentro de la propia pieza.
- Aún no hay casos de clientes publicables. La sección de garantías sustituye temporalmente
  al portfolio, pero no debe confundirse con evidencia comercial.
- Las garantías, plazos y condiciones publicados deben coincidir con contratos y operación.
- No se comunica entrega ni propiedad del código al cliente. Se vende acceso mensual a
  productos de Lynex; no un desarrollo SaaS nuevo o exclusivo para cada cliente.

## Dónde vive el contenido

- `src/app/page.tsx`: `symptoms`, `steps`, `commitments`, `faqs` y toda la narrativa.
- `src/lib/site.ts`: datos del negocio, ofertas, precios opcionales y enlaces de contacto.
- Las variables `NEXT_PUBLIC_*` permiten cambiar datos públicos sin editar componentes,
  pero requieren reconstruir el sitio.

## Qué no existe (intencionalmente)

- Sin analítica ni cookies de marketing.
- Sin CMS, blog, i18n ni modo oscuro.
- Sin portfolio hasta contar con casos o demos honestamente identificadas.
- Sin tests unitarios; la red de seguridad actual es `npm run check` más pruebas de runtime.
