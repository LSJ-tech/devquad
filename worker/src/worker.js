const ALLOWED_ORIGIN = 'https://devquad.cl';
const TO_ADDRESS = 'logan.silva.jara@outlook.com';
const FROM_ADDRESS = 'formulario@devquad.cl';

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ ok: false, error: 'method_not_allowed' }, 405);
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const { success } = await env.CONTACT_LIMITER.limit({ key: ip });
    if (!success) {
      return jsonResponse({ ok: false, error: 'rate_limited' }, 429);
    }

    let data;
    try {
      data = await request.json();
    } catch (error) {
      return jsonResponse({ ok: false, error: 'invalid_json' }, 400);
    }

    // Honeypot: si viene lleno, es un bot. Respondemos "ok" sin enviar nada.
    if (data._gotcha) {
      return jsonResponse({ ok: true });
    }

    const nombre = (data.nombre || '').toString().trim().slice(0, 200);
    const email = (data.email || '').toString().trim().slice(0, 200);
    const proyecto = (data.proyecto || '').toString().trim().slice(0, 200);
    const mensaje = (data.mensaje || '').toString().trim().slice(0, 5000);

    if (!nombre || !email || !mensaje) {
      return jsonResponse({ ok: false, error: 'missing_fields' }, 400);
    }

    const subject = proyecto ? `Consulta: ${proyecto}` : 'Consulta desde devquad.cl';
    const text = [`Nombre: ${nombre}`, `Email: ${email}`, proyecto ? `Proyecto: ${proyecto}` : null, '', mensaje]
      .filter((line) => line !== null)
      .join('\n');

    try {
      await env.EMAIL.send({
        to: TO_ADDRESS,
        from: FROM_ADDRESS,
        subject,
        text,
        replyTo: email,
      });
    } catch (error) {
      console.error('send_failed:', error && error.message ? error.message : error);
      return jsonResponse({ ok: false, error: 'send_failed' }, 502);
    }

    return jsonResponse({ ok: true });
  },
};
