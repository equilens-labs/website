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

  let bestLink = null;
  let bestScore = -1;

  links.forEach(link => {
    link.removeAttribute('aria-current');
    const href = link.getAttribute('href');
    if (!href) return;

    const url = new URL(href, window.location.origin);
    const targetPath = url.pathname.replace(/\/?$/, '/');
    const targetHash = url.hash;

    let score = 0;

    if (path === targetPath) {
      score += 100;
    } else if (targetPath !== '/' && path.startsWith(targetPath)) {
      score += 50;
    }

    if (targetHash) {
      if (hash === targetHash) {
        score += 40;
      }
      if (path === targetPath && hash === targetHash) {
        score += 25;
      }
    } else if (path === targetPath) {
      score += 20;
    }

    if (score > bestScore) {
      bestScore = score;
      bestLink = link;
    }
  });

  if (bestLink) {
    bestLink.setAttribute('aria-current', 'page');
  } else if (links[0]) {
    links[0].setAttribute('aria-current', 'page');
  }
}

setProductSubnav();
window.addEventListener('hashchange', setProductSubnav);
