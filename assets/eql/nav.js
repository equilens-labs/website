// Guarded smooth scroll (hash links only) - respects scroll-padding-top
document.querySelectorAll('a[href^="#"]').forEach(a => {
  const h = a.getAttribute('href');
  if (!h || h === '#') return;
  a.addEventListener('click', e => {
    const t = document.querySelector(h);
    if (t) {
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Set active nav link based on current page
(function setActiveNavLink() {
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkPath = new URL(link.href, window.location.origin).pathname;
    if (linkPath === currentPath || (currentPath !== '/' && linkPath !== '/' && currentPath.startsWith(linkPath))) {
      link.setAttribute('aria-current', 'page');
    }
  });
})();

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

// Product sub-nav active state
(function setProductSubnav() {
  const links = document.querySelectorAll('.product-subnav .subnav-link');
  if (!links.length) return;
  const path = window.location.pathname;
  const hash = window.location.hash;

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const url = new URL(href, window.location.origin);
    let active = false;

    const samePath = url.pathname === path;

    if (samePath) {
      if (!url.hash) {
        active = true;
      } else if (url.hash && url.hash === hash) {
        active = true;
      }
    }

    if (!active && url.hash === '#deployment' && path.startsWith('/fl-bsa/pricing')) {
      active = true;
    }
    if (!active && url.pathname === '/fl-bsa/legal/' && path.startsWith('/fl-bsa/legal')) {
      active = true;
    }
    if (!active && url.pathname === '/fl-bsa/whitepaper/' && path.startsWith('/fl-bsa/whitepaper')) {
      active = true;
    }
    if (!active && url.pathname === '/fl-bsa/' && path === '/fl-bsa/') {
      active = true;
    }

    if (active) {
      link.setAttribute('aria-current', 'true');
    } else {
      link.removeAttribute('aria-current');
    }
  });
})();
