# 04 — Flujo de contacto

Es la única funcionalidad real del sitio. Dos archivos:
`src/components/contact-form.tsx` (cliente) y `src/app/api/contact/route.ts` (servidor).

## Cliente — `ContactForm`

Máquina de estados de cuatro valores: `idle → submitting → success | error`.

- Envía JSON con `{ name, email, message, website }` a `POST /api/contact`.
- En éxito: `form.reset()` y se sustituye el formulario por un panel de confirmación
  (`role="status"`, `aria-live="polite"`) con un botón "Enviar otro mensaje" que vuelve a `idle`.
- En error: muestra el `message` que devuelve la API en un `<p role="alert">`, más un enlace
  `mailto:` como salida alternativa.
- El botón se deshabilita mientras `submitting`.
- Validación nativa del navegador activa (`required`, `type="email"`, `minLength`, `maxLength`)
  **además** de la del servidor. Los límites de ambos lados deben coincidir.

## Servidor — `POST /api/contact`

Las comprobaciones se aplican **en este orden**, y el orden importa:

1. **Same-origin.** Compara la cabecera `Origin` con `x-forwarded-host` (o `host`).
   Si no hay `Origin` o no hay `host`, **deja pasar** — para no romper clientes legítimos que
   no envían `Origin`. Si no coincide → `403`.
2. **Rate limit.** Máximo **5 intentos por 10 minutos**, con clave por IP
   (`x-forwarded-for` → `x-real-ip` → `"anonymous"`). Si se supera → `429`.
3. **Parseo del JSON.** Si falla → `400`.
4. **Honeypot.** El campo `website` está oculto por CSS (`.form-honeypot`, fuera de pantalla) y
   con `tabIndex={-1}`. Si viene relleno, se responde **`{ ok: true }` con 200 y no se envía
   nada**: el bot cree que funcionó. No lo cambies a un error — delataría la trampa.
5. **Validación de campos.** `name` 2–80, `email` ≤254 y contra un regex simple, `message`
   20–3000. Cualquier fallo → `400` con un mensaje genérico único (no dice qué campo falló).
6. **Config de email.** Si falta `RESEND_API_KEY`, `CONTACT_TO_EMAIL` o `CONTACT_FROM_EMAIL`
   → log a `console.error` y `503` "no disponible temporalmente". Esto es deliberado: el sitio
   **compila y funciona sin las variables**, solo el formulario se degrada.
7. **Envío.** `fetch` a `https://api.resend.com/emails` con `reply_to` = email del visitante,
   asunto `Nueva consulta de {nombre}`, cuerpo en texto plano y en HTML. Si Resend responde
   no-OK → log + `502`.
8. Éxito → `{ ok: true }`.

## Detalles de seguridad que no debes tocar sin pensarlo

- **Escapado HTML.** `escapeHtml()` se aplica a nombre, email y mensaje antes de meterlos en
  el cuerpo HTML del correo, y los saltos de línea se convierten en `<br />` **después** de
  escapar. Invertir ese orden reintroduciría inyección de HTML en la bandeja de entrada.
- **El email se normaliza a minúsculas** (`.toLowerCase()`).
- La versión en texto plano del correo usa los valores **sin escapar** — correcto, porque ahí
  no se interpreta HTML.

## Limitación conocida del rate limit

`attempts` es un `Map` **en memoria del proceso**. Eso significa:

- Se reinicia en cada despliegue o reinicio del contenedor.
- **No se comparte entre instancias.** En Vercel serverless o con varias réplicas, el límite
  real es de 5 intentos *por instancia*, no global.
- Cuando supera 1000 entradas, elimina las que ya caducaron. Esto evita crecimiento residual
  en un proceso largo, aunque no convierte el límite en distribuido. Con tráfico serio,
  mover el contador a Redis/Upstash o a una capa de WAF.

## Variables de entorno implicadas

Ver [06-deployment.md](06-deployment.md). Resumen: `RESEND_API_KEY`, `CONTACT_TO_EMAIL` y
`CONTACT_FROM_EMAIL`. **`RESEND_API_KEY` nunca debe llevar el prefijo `NEXT_PUBLIC_`** — eso
la publicaría en el bundle del navegador.

`CONTACT_FROM_EMAIL` tiene que pertenecer a un dominio verificado en Resend, con el formato
`Lynex <contacto@dominio-verificado.com>`. Si no, Resend rechaza el envío y verás el `502`.

## Cómo probarlo en local

Con las tres variables en `.env.local`, `npm run dev` y un envío real desde el formulario.
Sin ellas, la ruta responde `503` y el formulario muestra el aviso de indisponibilidad con el
enlace `mailto:` — que es exactamente el comportamiento esperado en ese caso.
