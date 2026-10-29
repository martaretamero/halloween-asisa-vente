# VENTE Halloween — actualización visual

Sube **todos los archivos y carpetas** a la raíz del repositorio existente en GitHub, sustituyendo los archivos anteriores. Conserva la estructura `public/assets/`.

En Vercel usa Framework **Other**, Root Directory `./` y Output Directory **`.`** (Override activado). Vercel desplegará automáticamente el commit.

**Imágenes originales:** `public/assets/asisa-vente.png` es una copia exacta de `Group 161.png`, sin modificaciones. `dientes.png` y `vente.png` también son copias exactas de los archivos proporcionados.

**Base de datos:** el proyecto mantiene `api/submit.js` y `supabase.sql`. Ejecuta `supabase.sql` en Supabase SQL Editor. En Vercel configura `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` como variables de entorno privadas y vuelve a desplegar. No pongas claves secretas en GitHub.

**Antes de publicar a participantes:** reemplaza el enlace provisional de privacidad por el aviso de ASISA correspondiente y verifica el consentimiento.


## Corrección de imágenes (29 octubre)
Los PNG están ahora en `assets/` directamente en la raíz, NO en `public/assets/`.
Con Vercel Output Directory `.` los recursos estarán accesibles en `/assets/...`.
Al actualizar GitHub, borra la antigua carpeta `public` para evitar confusiones.
No cambies los PNG ni el logotipo original.
