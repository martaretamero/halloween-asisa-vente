
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { nombre, truco, participa, website } = req.body || {};

    if (website) {
      return res.status(200).json({ ok: true });
    }

    if (
      typeof nombre !== 'string' ||
      !nombre.trim() ||
      nombre.length > 160 ||
      typeof truco !== 'string' ||
      truco.length > 5000 ||
      !['¡Me apunto al reto!', 'Esta vez no participo.'].includes(participa)
    ) {
      return res.status(400).json({ error: 'Datos inválidos' });
    }

    const rawUrl = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!rawUrl || !key) {
      console.error('Faltan variables de entorno de Supabase');
      return res.status(503).json({ error: 'Servicio sin configurar' });
    }

    const baseUrl = rawUrl.trim()
      .replace(/\/+$/, '')
      .replace(/\/rest\/v1$/, '');

    const parsedUrl = new URL(baseUrl);

    if (
      parsedUrl.protocol !== 'https:' ||
      !parsedUrl.hostname.endsWith('.supabase.co') ||
      parsedUrl.pathname !== '/'
    ) {
      console.error('SUPABASE_URL tiene un formato incorrecto');
      return res.status(503).json({ error: 'Configuración incorrecta' });
    }

    const response = await fetch(
      `${baseUrl}/rest/v1/participaciones_vente`,
      {
        method: 'POST',
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal'
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          truco: truco.trim(),
          participa
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase error', response.status, errorText);

      return res.status(500).json({
        error: 'No se pudo guardar la respuesta'
      });
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error('Error al enviar formulario:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
}
