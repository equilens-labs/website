(() => {
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if(!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    nav.toggleAttribute('hidden');
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && !nav.hasAttribute('hidden')) {
      btn.setAttribute('aria-expanded', 'false');
      nav.setAttribute('hidden', '');
      btn.focus();
    }
  });
})();

