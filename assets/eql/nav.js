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
function setProductSubnav() {
  const links = document.querySelectorAll('.product-subnav .subnav-link');
  if (!links.length) return;
  const path = window.location.pathname.replace(/\/?$/, '/');
  const hash = window.location.hash;

  let anyActive = false;

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const url = new URL(href, window.location.origin);
    const targetPath = url.pathname.replace(/\/?$/, '/');
    const targetHash = url.hash;
    let active = false;

    if (targetPath === path) {
      if (!targetHash) {
        active = true;
      } else if (targetHash === hash) {
        active = true;
      }
    }

    if (!active && targetHash && targetPath === '/fl-bsa/' && hash === targetHash) {
      active = true;
    }
    if (!active && targetHash === '#deployment' && path.startsWith('/fl-bsa/pricing/')) {
      active = true;
    }
    if (!active && path.startsWith(targetPath) && !targetHash && targetPath !== '/fl-bsa/') {
      active = true;
    }

    if (active) {
      link.setAttribute('aria-current', 'true');
      anyActive = true;
    } else {
      link.removeAttribute('aria-current');
    }
  });

  if (!anyActive && links[0]) {
    links[0].setAttribute('aria-current', 'true');
  }
}

setProductSubnav();
window.addEventListener('hashchange', setProductSubnav);

function setFooterYear() {
  const yearTarget = document.getElementById('y');
  if (!yearTarget) return;
  const currentYear = new Date().getFullYear();
  yearTarget.textContent = String(currentYear);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setFooterYear);
} else {
  setFooterYear();
}
