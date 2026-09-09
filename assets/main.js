/* ==========================================================================
   O Campista — Landing de inauguração
   Vanilla JS, sem dependências. Ajuste as constantes abaixo antes de publicar.
   ========================================================================== */

/**
 * URL pública final do site (usada nos botões de compartilhamento e nas OG tags).
 * Ao apontar um domínio próprio para o GitHub Pages, troque por ele e atualize
 * og:url, og:image, twitter:image e canonical no index.html.
 */
const SITE_URL = 'https://lipilemos.github.io/o-campista-landing/';

/** Texto usado ao compartilhar nas redes. */
const SHARE_TEXT =
  'O Campista chegou! Mapa de campings, check-in por GPS, clima e presentes escondidos — e tem sorteio de kit de camping na inauguração.';

/**
 * Endpoint que recebe o cadastro da lista de espera (Formspree, Google Form, etc.).
 * Deixe vazio para o formulário cair no fallback de e-mail (mailto:).
 */
const FORM_ENDPOINT = '';

/** E-mail que recebe os cadastros quando FORM_ENDPOINT está vazio. */
const FALLBACK_EMAIL = 'contato@ocampista.com.br';

const STORAGE_THEME_KEY = 'ocampista-theme';

/* ------------------------------------------------------------------ Tema */

const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeLabel = document.getElementById('theme-label');

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  const isDark = theme === 'dark';
  themeIcon.textContent = isDark ? '☀️' : '🌙';
  themeLabel.textContent = isDark ? 'Ativar tema claro' : 'Ativar tema escuro';
  themeToggle.setAttribute('aria-pressed', String(isDark));
}

function initTheme() {
  let stored = null;
  try {
    stored = localStorage.getItem(STORAGE_THEME_KEY);
  } catch {
    stored = null;
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(stored || (prefersDark ? 'dark' : 'light'));
}

themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try {
    localStorage.setItem(STORAGE_THEME_KEY, next);
  } catch {
    /* modo privado: apenas ignora a persistência */
  }
});

initTheme();

/* ---------------------------------------------------------- Menu mobile */

const navToggle = document.getElementById('nav-toggle');
const siteNav = document.getElementById('site-nav');

function setNav(open) {
  siteNav.classList.toggle('is-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
}

navToggle.addEventListener('click', () => {
  setNav(!siteNav.classList.contains('is-open'));
});

siteNav.addEventListener('click', (event) => {
  if (event.target.closest('a')) setNav(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && siteNav.classList.contains('is-open')) {
    setNav(false);
    navToggle.focus();
  }
});

/* --------------------------------------------------------------- Toast */

const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 3000);
}

/* ------------------------------------------------- Formulário do sorteio */

const form = document.getElementById('waitlist-form');
const feedback = document.getElementById('form-feedback');

const fields = {
  nome: { input: document.getElementById('nome'), error: document.getElementById('erro-nome') },
  email: { input: document.getElementById('email'), error: document.getElementById('erro-email') },
  aceite: {
    input: document.getElementById('aceite'),
    error: document.getElementById('erro-aceite'),
  },
};

function setError(field, message) {
  field.error.textContent = message;
  field.input.setAttribute('aria-invalid', message ? 'true' : 'false');
}

function validate() {
  const errors = [];

  const nome = fields.nome.input.value.trim();
  setError(fields.nome, nome.length >= 2 ? '' : 'Informe seu nome.');
  if (nome.length < 2) errors.push(fields.nome);

  const email = fields.email.input.value.trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  setError(fields.email, emailOk ? '' : 'Informe um e-mail válido.');
  if (!emailOk) errors.push(fields.email);

  const aceite = fields.aceite.input.checked;
  setError(fields.aceite, aceite ? '' : 'É preciso aceitar para participar do sorteio.');
  if (!aceite) errors.push(fields.aceite);

  return errors;
}

function showSuccess(nome) {
  form.hidden = true;
  feedback.innerHTML = '';
  const box = document.createElement('p');
  box.className = 'form-success';
  box.textContent = `🎉 Prontinho, ${nome}! Você está na lista e concorrendo ao kit de camping. Fique de olho no seu e-mail.`;
  feedback.appendChild(box);
  box.setAttribute('tabindex', '-1');
  box.focus();
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const errors = validate();
  if (errors.length) {
    errors[0].input.focus();
    return;
  }

  const nome = fields.nome.input.value.trim();
  const email = fields.email.input.value.trim();

  if (!FORM_ENDPOINT) {
    // Sem backend configurado: abre o cliente de e-mail do visitante.
    const assunto = encodeURIComponent('Quero participar do sorteio de inauguração');
    const corpo = encodeURIComponent(`Nome: ${nome}\nE-mail: ${email}`);
    window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${assunto}&body=${corpo}`;
    showSuccess(nome);
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = 'Enviando...';

  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ nome, email }),
    });
    if (!response.ok) throw new Error('Falha no envio');
    showSuccess(nome);
  } catch {
    button.disabled = false;
    button.textContent = 'Quero concorrer ao kit 🎒';
    setError(fields.email, 'Não conseguimos enviar agora. Tente novamente em instantes.');
    fields.email.input.focus();
  }
});

/* ------------------------------------------------------- Compartilhamento */

const shareUrls = {
  whatsapp: () => `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${SITE_URL}`)}`,
  telegram: () =>
    `https://t.me/share/url?url=${encodeURIComponent(SITE_URL)}&text=${encodeURIComponent(SHARE_TEXT)}`,
  x: () =>
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(SITE_URL)}&text=${encodeURIComponent(SHARE_TEXT)}`,
};

document.querySelectorAll('[data-share]').forEach((button) => {
  button.addEventListener('click', async () => {
    const rede = button.dataset.share;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'O Campista', text: SHARE_TEXT, url: SITE_URL });
        return;
      } catch {
        /* usuário cancelou: segue para o link da rede */
      }
    }

    window.open(shareUrls[rede](), '_blank', 'noopener');
  });
});

document.getElementById('copy-link').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(SITE_URL);
    showToast('Link copiado! 🔗');
  } catch {
    const helper = document.createElement('input');
    helper.value = SITE_URL;
    document.body.appendChild(helper);
    helper.select();
    document.execCommand('copy');
    helper.remove();
    showToast('Link copiado! 🔗');
  }
});

/* ------------------------------------------------------------- Revelação */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealables = document.querySelectorAll('.reveal');

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealables.forEach((el) => el.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return;
        entry.target.style.animationDelay = `${Math.min(index * 60, 240)}ms`;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
  );

  revealables.forEach((el) => observer.observe(el));
}

/* ----------------------------------------------------------------- Ano */

document.getElementById('ano').textContent = String(new Date().getFullYear());
