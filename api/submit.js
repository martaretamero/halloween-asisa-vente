export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({error:'Método no permitido'});
  }
  try {
    const {nombre, dni, email, truco, participa, website} = req.body || {};
    if (website) return res.status(200).json({ok:true});
    const validDni = typeof dni === 'string' && /^\d{8}[A-Z]$/.test(dni.trim().toUpperCase());
    const dniNorm = validDni ? dni.trim().toUpperCase() : '';
    const validLetter = validDni && 'TRWAGMYFPDXBNJZSQVHLCKE'[Number(dniNorm.slice(0,8)) % 23] === dniNorm[8];
    const validEmail = typeof email === 'string' && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (typeof nombre !== 'string' || !nombre.trim() || nombre.length > 160 ||
        !validLetter || !validEmail || typeof truco !== 'string' || truco.length > 5000 ||
        !['¡Me apunto al reto!', 'Esta vez no participo.'].includes(participa)) {
      return res.status(400).json({error:'Datos inválidos'});
    }
    const rawUrl = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!rawUrl || !key) return res.status(503).json({error:'Servicio sin configurar'});
    const base = rawUrl.trim().replace(/\/+$/,'').replace(/\/rest\/v1$/,'');
    const parsed = new URL(base);
    if (parsed.protocol !== 'https:' || !parsed.hostname.endsWith('.supabase.co') || parsed.pathname !== '/') {
      return res.status(503).json({error:'Configuración incorrecta'});
    }
    const response = await fetch(`${base}/rest/v1/participaciones_vente`, {
      method:'POST',
      headers:{apikey:key, Authorization:`Bearer ${key}`, 'Content-Type':'application/json', Prefer:'return=minimal'},
      body:JSON.stringify({nombre:nombre.trim(), dni:dniNorm, email:email.trim().toLowerCase(), truco:truco.trim(), participa})
    });
    if (!response.ok) {
      // No registrar valores del participante ni respuestas completas de Supabase.
      console.error('Supabase insert failed; HTTP status:', response.status);
      return res.status(500).json({error:'No se pudo guardar'});
    }
    return res.status(200).json({ok:true});
  } catch (_) {
    console.error('Error procesando envío');
    return res.status(500).json({error:'Error interno'});
  }
}
