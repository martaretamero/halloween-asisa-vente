const screens = [...document.querySelectorAll('[data-screen]')];
const nav = document.getElementById('nav');
const progress = document.getElementById('progress');
let current = 0;
function show(n) {
  current = n;
  screens.forEach(s => s.classList.toggle('active', Number(s.dataset.screen) === n));
  nav.hidden = n === 0 || n === 7;
  progress.style.width = `${Math.min(n / 6, 1) * 100}%`;
  window.scrollTo({top: 0, behavior: 'smooth'});
  const focusId = {1:'nombre',2:'dni',3:'email',4:'truco'}[n];
  if (focusId) document.getElementById(focusId).focus({preventScroll:true});
}
function validate(n) {
  const err = document.getElementById('err' + n);
  if (err) err.textContent = '';
  let message = '';
  if (n === 1 && !document.getElementById('nombre').value.trim()) message = 'Escribe tu nombre para continuar.';
  if (n === 2 && !/^\d{8}[A-Z]$/.test(document.getElementById('dni').value.trim().toUpperCase())) message = 'Introduce un DNI válido (8 números y una letra).';
  if (n === 2 && !message) {
    const value = document.getElementById('dni').value.trim().toUpperCase();
    if ('TRWAGMYFPDXBNJZSQVHLCKE'[Number(value.slice(0,8)) % 23] !== value[8]) message = 'La letra del DNI no es correcta.';
  }
  if (n === 3 && !document.getElementById('email').validity.valid) message = 'Introduce un correo electrónico válido.';
  if (n === 5) {
    if (!document.querySelector('input[name="participa"]:checked')) message = 'Selecciona una opción.';
    else if (!document.getElementById('privacy').checked) message = 'Confirma que has leído la información sobre el tratamiento de datos.';
  }
  if (message && err) err.textContent = message;
  return !message;
}
document.getElementById('start').addEventListener('click', () => show(1));
document.getElementById('back').addEventListener('click', () => show(Math.max(0, current - 1)));
document.querySelectorAll('.next').forEach(b => b.addEventListener('click', () => {
  const n = Number(b.dataset.next);
  if (validate(n)) show(n + 1);
}));
document.getElementById('mission-next').addEventListener('click', () => {
  if (validate(5)) show(6);
});
['nombre','dni','email'].forEach((id, index) => document.getElementById(id).addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); document.querySelector(`[data-next="${index + 1}"]`).click(); }
}));
document.getElementById('form').addEventListener('submit', async e => {
  e.preventDefault();
  for (const n of [1,2,3,5]) if (!validate(n)) { show(n); return; }
  const err = document.getElementById('err6');
  err.textContent = '';
  const btn = document.getElementById('submit');
  btn.disabled = true;
  btn.textContent = 'Enviando…';
  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        nombre: document.getElementById('nombre').value.trim(),
        dni: document.getElementById('dni').value.trim().toUpperCase(),
        email: document.getElementById('email').value.trim().toLowerCase(),
        truco: document.getElementById('truco').value.trim(),
        participa: document.querySelector('input[name="participa"]:checked').value,
        website: document.querySelector('[name="website"]').value
      })
    });
    if (!response.ok) throw new Error('No se ha podido guardar la respuesta. Inténtalo de nuevo.');
    show(7);
  } catch (error) {
    err.textContent = error.message;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Enviar respuestas';
  }
});
