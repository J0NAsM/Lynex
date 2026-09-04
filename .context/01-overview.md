# 01 — Visión general

## Qué es

**Lynex** es un estudio de Asunción que vende dos servicios relacionados:

1. sitios web profesionales como puerta de entrada;
2. sistemas internos a medida cuando la operación ya no escala con planillas y herramientas sueltas.

Este repositorio contiene su sitio comercial. No es un SaaS: no tiene autenticación, usuarios
ni base de datos. El repositorio incluye una ruta de servidor para enviar el formulario cuando
el hosting soporta Node.js; GitHub Pages publica una variante estática con contacto por correo.

## Objetivo y narrativa

El objetivo es convertir una visita en una conversación de 30 minutos. Si se configura
WhatsApp, aparece como acceso directo. En un hosting con servidor queda disponible el
formulario; en GitHub Pages se ofrece un CTA directo por correo.

La landing cuenta una sola historia con dos ofertas, en este orden:

1. **Hero** — problema central, ubicación y CTA; el panel está rotulado como demo.
2. **Trust strip** — precio cerrado, entregas quincenales y propiedad del código.
3. **Servicios** (`#servicios`) — web profesional y sistema operativo a medida.
4. **Problemas** (`#problemas`) — tres síntomas reconocibles por el cliente.
5. **Proceso** (`#proceso`) — cuatro pasos desde conversación hasta publicación.
6. **Garantías** (`#garantias`) — compromisos comerciales sin inventar casos de éxito.
7. **Nosotros** (`#nosotros`) — equipo pequeño, comunicación directa y criterio honesto.
8. **FAQ** — precio, plazos, propiedad, cambios, hitos y primera versión pequeña.
9. **Contacto** (`#contacto`) — formulario o correo, WhatsApp opcional y ubicación.

## Idioma y honestidad comercial

- La interfaz usa español paraguayo y voseo (`<html lang="es-PY">`, locale `es_PY`).
- No se muestran testimonios, clientes ni métricas como resultados reales. El dashboard del
  hero es una demostración visual y así se indica dentro de la propia pieza.
- Aún no hay casos de clientes publicables. La sección de garantías sustituye temporalmente
  al portfolio, pero no debe confundirse con evidencia comercial.
- Las garantías, plazos y condiciones publicados deben coincidir con contratos y operación.

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
