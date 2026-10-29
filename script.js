
const screens = [...document.querySelectorAll('[data-screen]')];
let current = 0;
const nav = document.getElementById('nav');

function show(n) {
  current = n;

  screens.forEach(s => {
    s.classList.toggle('active', Number(s.dataset.screen) === n);
  });

  nav.hidden = n === 0 || n === 4;
  document.getElementById('progress').style.width = `${n / 3 * 100}%`;

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (n === 1) {
    document.getElementById('nombre').focus({ preventScroll: true });
  }
}

document.getElementById('start').addEventListener('click', () => show(1));

document.getElementById('back').addEventListener('click', () => {
  show(Math.max(0, current - 1));
});

document.querySelectorAll('.next').forEach(b => {
  b.addEventListener('click', () => {
    const n = Number(b.dataset.next);

    if (n === 1 && !document.getElementById('nombre').value.trim()) {
      document.getElementById('err1').textContent =
        'Escribe tu nombre para continuar.';
      return;
    }

    document.getElementById('err1').textContent = '';
    show(n + 1);
  });
});

document.getElementById('nombre').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    document.querySelector('[data-next="1"]').click();
  }
});

document.getElementById('form').addEventListener('submit', async e => {
  e.preventDefault();

  const err = document.getElementById('err3');
  const participa = document.querySelector('input[name="participa"]:checked');

  if (!participa) {
    err.textContent = 'Selecciona una opción.';
    return;
  }

  if (!document.getElementById('privacy').checked) {
    err.textContent =
      'Confirma que has leído la información sobre el tratamiento de datos.';
    return;
  }

  err.textContent = '';

  const btn = document.getElementById('submit');
  btn.disabled = true;
  btn.textContent = 'Enviando…';

  try {
    const r = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: document.getElementById('nombre').value.trim(),
        truco: document.getElementById('truco').value.trim(),
        participa: participa.value,
        website: document.querySelector('[name="website"]').value
      })
    });

    if (!r.ok) {
      throw Error('No se ha podido guardar la respuesta. Inténtalo de nuevo.');
    }

    show(4);
  } catch (ex) {
    err.textContent = ex.message;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Enviar';
  }
});

// El enlace de privacidad se abre directamente desde index.html.
// No necesita ningún alert ni controlador de clic en JavaScript.
