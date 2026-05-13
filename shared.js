/* ══════════════════════════════════════
   SHARED.JS — The Secret Golf Club
══════════════════════════════════════ */

/* ── Modal ── */
function openModal(mode) {
  document.getElementById('modalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  mode === 'register' ? showRegister() : showLogin();
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}
function handleOverlayClick(e) {
  if (e.target.id === 'modalOverlay') closeModal();
}
function showLogin() {
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('registerForm').style.display = 'none';
  document.querySelector('.modal__title').textContent = 'Bienvenido';
  document.querySelector('.modal__sub').textContent = 'Inicia sesión para continuar';
}
function showRegister() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
  document.querySelector('.modal__title').textContent = 'Crear liga';
  document.querySelector('.modal__sub').textContent = 'Empieza gratis en 2 minutos';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ── Scroll reveal ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Mobile nav drawer ── */
function openDrawer() {
  document.getElementById('navDrawer').classList.add('open');
  document.getElementById('navBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  document.getElementById('navDrawer').classList.remove('open');
  document.getElementById('navBackdrop').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

/* ── FAQ toggle ── */
function toggleFaq(el) {
  const item = el.closest('.faq__item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq__item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

/* ── Open app / store (platform-aware) ── */
const TSGC_APP_STORE = 'https://apps.apple.com/es/app/the-secret-golf-club/id6737745285';
const TSGC_PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.gmail.fedegarcia30.TSGC&pcampaignid=update';

function detectPlatform() {
  const ua = navigator.userAgent || navigator.vendor || '';
  if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return 'ios';
  if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return 'ios'; /* iPadOS 13+ */
  if (/android/i.test(ua)) return 'android';
  return 'desktop';
}

function openApp() {
  const p = detectPlatform();
  if (p === 'ios') { window.location.href = TSGC_APP_STORE; return; }
  if (p === 'android') { window.location.href = TSGC_PLAY_STORE; return; }
  showAppPrompt();
}

function showAppPrompt() {
  let overlay = document.getElementById('appPromptOverlay');
  if (!overlay) overlay = createAppPrompt();
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeAppPrompt() {
  const overlay = document.getElementById('appPromptOverlay');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}
function createAppPrompt() {
  const overlay = document.createElement('div');
  overlay.id = 'appPromptOverlay';
  overlay.className = 'app-prompt-overlay';
  overlay.addEventListener('click', e => { if (e.target.id === 'appPromptOverlay') closeAppPrompt(); });
  overlay.innerHTML = ''
    + '<div class="app-prompt" role="dialog" aria-labelledby="appPromptTitle">'
    +   '<button class="app-prompt__close" aria-label="Cerrar" onclick="closeAppPrompt()">&#10005;</button>'
    +   '<div class="app-prompt__emblem">&#9971;</div>'
    +   '<h2 id="appPromptTitle" class="app-prompt__title">TSGC vive en tu m&oacute;vil</h2>'
    +   '<p class="app-prompt__sub">La aplicaci&oacute;n es exclusiva para iOS y Android. Desc&aacute;rgala en tu tel&eacute;fono para iniciar sesi&oacute;n.</p>'
    +   '<div class="store-badges">'
    +     '<a class="store-badge" href="' + TSGC_APP_STORE + '" target="_blank" rel="noopener" aria-label="Descargar en App Store">'
    +       '<span class="store-badge__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg></span>'
    +       '<span class="store-badge__lines"><span class="store-badge__kicker">Disponible en</span><span class="store-badge__brand">App Store</span></span>'
    +     '</a>'
    +     '<a class="store-badge" href="' + TSGC_PLAY_STORE + '" target="_blank" rel="noopener" aria-label="Conseguir en Google Play">'
    +       '<span class="store-badge__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.198-3.198l2.852 1.652c.713.413.713 1.443 0 1.857l-2.85 1.653L15.485 12l2.213-2.491zM5.864 2.658L16.802 8.99l-2.302 2.302-8.636-8.634z"/></svg></span>'
    +       '<span class="store-badge__lines"><span class="store-badge__kicker">Conseguir en</span><span class="store-badge__brand">Google Play</span></span>'
    +     '</a>'
    +   '</div>'
    +   '<p class="app-prompt__hint">&iquest;Ya tienes la app instalada? &Aacute;brela desde tu m&oacute;vil.</p>'
    + '</div>';
  document.body.appendChild(overlay);
  return overlay;
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAppPrompt(); });
