# El fantasma de VENTE — Vercel + Supabase

## 1. Supabase
1. Crea un proyecto en https://supabase.com.
2. Abre **SQL Editor**, pega `supabase.sql` y ejecútalo.
3. En **Project Settings → API** (o **Connect**) copia la URL del proyecto y la clave secreta `service_role` (o la clave de servicio compatible). **Nunca pongas esa clave en el HTML ni en GitHub.**
4. Las respuestas se consultan en **Table Editor → participaciones_vente**; allí puedes exportar CSV.

## 2. GitHub y Vercel
1. Sube el contenido de esta carpeta (no la carpeta contenedora) a un repositorio GitHub.
2. En Vercel, **Add New → Project → Import Git Repository**.
3. Framework Preset: **Other**. Root Directory: raíz del proyecto. No es necesario un build.
4. En **Settings → Environment Variables**, crea:
   - `SUPABASE_URL` = URL del proyecto Supabase.
   - `SUPABASE_SERVICE_ROLE_KEY` = clave de servicio secreta de Supabase.
5. Haz **Deploy**. Tras añadir o modificar variables, vuelve a desplegar.
6. Envía una participación de prueba y verifica la fila en Supabase.

## 3. Importante antes de publicar
- El enlace de «información sobre el tratamiento de datos» es un **marcador pendiente**: sustituye el `href="#"` y elimina el aviso temporal en `script.js` cuando tengas la URL de la política de privacidad y la información legal aprobadas por ASISA. No se debe publicar con el enlace pendiente.
- Confirma con ASISA la base jurídica, información al participante, plazo de conservación y acceso a los datos. La casilla actual solo confirma lectura; si se necesita consentimiento específico, el texto y el mecanismo deberán revisarse.
- Los textos visibles de la campaña y preguntas se han reproducido a partir de las capturas aportadas; los mensajes de validación y la casilla legal son añadidos técnicos.
- Los tres PNG originales se incluyen como archivos separados, sin retocar ni reexportar: `asisa-vente.png`, `vente-halloween.png`, `fantasmas.png`.
- El formulario no comprueba por sí mismo los leads registrados en otros sistemas ni decide quién cumple el reto: únicamente guarda la respuesta declarada.
- Para una campaña pública de alto volumen, añadir limitación de frecuencia y protección antispam en el endpoint.
