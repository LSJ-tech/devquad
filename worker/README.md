# devquad-contact (Cloudflare Worker)

Recibe el POST del formulario de contacto de [devquad.cl](https://devquad.cl) y envía el correo directamente vía el binding `send_email` de Cloudflare, sin depender de un servicio externo.

- **Ruta:** `devquad.cl/api/contact`
- **Envía a:** la dirección configurada como `destination_address` en `wrangler.jsonc` (debe estar verificada en Cloudflare → Email → Email Routing → Destination addresses).
- **Anti-spam:** honeypot (`_gotcha`) — si viene lleno, responde `ok` sin enviar nada.
- **Rate limit:** máx. 5 solicitudes por minuto por IP (binding `CONTACT_LIMITER`), responde `429` si se excede.

## Desplegar

```bash
cd worker
npx wrangler login   # una vez, autoriza con la cuenta de Cloudflare
npx wrangler deploy
```

## Ver logs en vivo

```bash
npx wrangler tail
```
