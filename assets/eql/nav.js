// Guarded smooth scroll (hash links only)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  const h = a.getAttribute('href');
  if (!h || h === '#') return;
  a.addEventListener('click', e => {
    const t = document.querySelector(h);
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// Mobile nav toggle (accessible)
const toggle = document.querySelector('.nav-toggle');
const links = document.getElementById('nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.getAttribute('data-open') === 'true';
    links.setAttribute('data-open', String(!open));
    toggle.setAttribute('aria-expanded', String(!open));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.getAttribute('data-open') === 'true') {
      links.setAttribute('data-open', 'false');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
}

// Header opacity on scroll
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  navbar.style.background = (window.scrollY > 100)
    ? 'rgba(15, 23, 42, 0.98)'
    : 'rgba(15, 23, 42, 0.95)';
});

