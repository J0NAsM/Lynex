# 04 — Flujo de contacto

La funcionalidad une `src/components/contact-form.tsx` con
`src/app/api/contact/route.ts`.

Hay dos modos de despliegue:

- servidor Next.js/Vercel/Docker: formulario completo y envío mediante Resend;
- GitHub Pages: tarjeta `mailto:` porque el hosting es estático y no ejecuta rutas
  `POST`.

## Cliente

Estados: `idle → submitting → success | error`.

Si `NEXT_PUBLIC_STATIC_HOSTING=true`, el componente devuelve antes una tarjeta de
correo y no incluye ninguna referencia a `/api/contact` en el HTML generado.

- Envía `{ name, email, message, website, elapsed }` como JSON.
- `website` es un honeypot invisible; `elapsed` mide milisegundos desde la hidratación.
- Usa validación HTML nativa: nombre 2–80, email hasta 254 y mensaje 20–3000.
- Deshabilita el botón durante el envío y muestra errores con `role="alert"`.
- Tras éxito resetea el formulario, muestra `role="status"` y enfoca el título.
- El enlace alternativo usa `site.email`, nunca una dirección duplicada.

`Date.now()` solo puede ejecutarse en efectos o handlers. Llamarlo al inicializar un `useRef`
durante render viola la regla de pureza de React y hace fallar ESLint.

## Servidor: orden de controles

1. Comprueba same-origin contra `x-forwarded-host`/`host`; origen distinto → `403`.
2. Rate limit por primera IP: 5 intentos cada 10 minutos → `429`.
3. Parsea JSON → `400` si es inválido.
4. Honeypot lleno → éxito falso `200`, sin correo.
5. Tiempo de llenado menor a 2 segundos → éxito falso `200`, sin correo.
6. Normaliza nombre a una línea, email a minúsculas y valida longitudes → `400`.
7. Comprueba `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` → `503` si faltan.
8. Escapa HTML y envía texto + HTML por Resend con `User-Agent` y timeout de 10
   segundos; rechazo, error de red o timeout del proveedor → `502`.
9. Entrega aceptada → `{ ok: true }`.

El asunto usa el nombre normalizado sin saltos. En HTML se escapan `& < > " '` antes de
convertir saltos de línea a `<br />`.

## Límites deliberados

El rate limit usa un `Map` en memoria, se reinicia con el proceso y no se comparte entre
instancias serverless. Al superar 500 claves intenta purgar entradas vencidas. Para tráfico
alto debe reemplazarse por WAF o almacenamiento distribuido.

La API compila sin secretos, pero responde `503` hasta configurar las tres variables privadas.
`CONTACT_FROM_EMAIL` debe pertenecer a un dominio verificado en Resend. Nunca expongas
`RESEND_API_KEY` con prefijo `NEXT_PUBLIC_`.
