# 01 — Visión general

## Qué es

**Lynex** es una empresa de desarrollo de software a medida. Este repositorio contiene su
**sitio comercial**: una landing de una sola página más una página legal.

No es un producto SaaS, no tiene usuarios autenticados, no tiene base de datos.
Es un sitio de captación: explica qué hace Lynex y recoge consultas por formulario.

## Objetivo del sitio

Un único objetivo de conversión: **que un visitante escriba una consulta y la envíe**.
Todo lo demás (servicios, proceso, FAQ) existe para reducir la fricción hasta ese envío.

Todos los CTA de la página apuntan al mismo ancla `#contacto`.

## Idioma y tono

- Todo el contenido de cara al usuario está en **español** (`<html lang="es">`, `locale: es_ES`).
- Los comentarios y mensajes de commit también están en español.
- Tono comercial pero sobrio: sin promesas de cifras, sin testimonios falsos, sin logos de
  clientes inventados. La sección de "Resultados" es deliberadamente genérica
  (`.project-placeholder`) porque **todavía no hay casos reales publicables**.

## Estructura de la narrativa (orden de la landing)

1. **Hero** — propuesta de valor + panel ilustrativo (una maqueta SVG, no datos reales)
2. **Trust strip** — tres beneficios en una línea
3. **Servicios** (`#servicios`) — 6 tarjetas
4. **Soluciones** (`#soluciones`) — banda oscura, 10 dominios de negocio
5. **Proceso** (`#proceso`) — 6 pasos, de descubrimiento a evolución
6. **Resultados** (`#resultados`) — compromiso genérico, placeholder para casos reales
7. **Nosotros** (`#nosotros`) — 3 diferenciales
8. **Tecnologías** — banda lima con tags de stack
9. **FAQ** — 6 preguntas, acordeón
10. **Contacto** (`#contacto`) — formulario
11. **Footer**

Todo ese contenido vive como **constantes al principio de `src/app/page.tsx`**
(`services`, `solutions`, `technologies`, `process`, `faqs`). Para editar copy no hace falta
tocar JSX: se editan esos arrays.

## Datos de contacto

- Email público: `hola@lynex.dev` por defecto, configurable con
  `NEXT_PUBLIC_CONTACT_EMAIL` y centralizado en `src/lib/site.ts`.
- Dominio previsto: `https://lynex.dev`.

## Qué NO existe (y es intencional)

- Sin analítica ni cookies de terceros — así lo declara la política de privacidad.
- Sin CMS: el copy es código.
- Sin tests automatizados: la red de seguridad es `npm run check` (lint + types + build).
- Sin blog, sin i18n, sin modo oscuro.
