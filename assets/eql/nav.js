// Render navigation from config
(async function renderNav() {
  const placeholder = document.getElementById('nav-placeholder');
  if (!placeholder) return;

  try {
    const response = await fetch('/config/web/nav.json');
    if (!response.ok) throw new Error('Failed to load nav config');
    const config = await response.json();
    const brandCompactImg = config.brand.imgCompact || '/brand/symbol/equilens-symbol.svg';

    const navLinks = config.links.map(link =>
      `<a href="${link.href}" class="nav-link">${link.label}</a>`
    ).join('');

    const navHTML = `
<nav class="navbar site-nav" role="navigation" aria-label="Primary">
  <div class="navbar-content">
    <a href="${config.brand.href}" class="logo" aria-label="Equilens home">
      <img class="logo-wordmark" src="${config.brand.img}" alt="${config.brand.alt}" width="196" height="39">
      <img class="logo-symbol" src="${brandCompactImg}" alt="" width="64" height="64" aria-hidden="true">
    </a>
    <button class="nav-toggle" aria-controls="nav-links" aria-expanded="false">Menu</button>
    <div id="nav-links" class="nav-links" data-open="false">
      ${navLinks}
    </div>
  </div>
</nav>`;

    placeholder.outerHTML = navHTML;

    // Initialize nav functionality after rendering
    initNavFeatures();
  } catch (error) {
    console.error('Nav render failed:', error);
  }
})();

// Initialize nav features (called after nav is rendered)
function initNavFeatures() {
  // Set active nav link based on current page
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkPath = new URL(link.href, window.location.origin).pathname;
    if (linkPath === currentPath || (currentPath !== '/' && linkPath !== '/' && currentPath.startsWith(linkPath))) {
      link.setAttribute('aria-current', 'page');
    }
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

  // Guarded smooth scroll (hash links only) - respects scroll-padding-top
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    const h = a.getAttribute('href');
    if (!h || h === '#') return;
    a.addEventListener('click', e => {
      const t = document.querySelector(h);
      if (t) {
        e.preventDefault();
        t.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update URL hash and trigger active state update
        history.pushState(null, '', h);
        // Update TOC active state immediately after click
        updateTocActiveState(h);
        // Pause scroll spy to prevent it from overriding the click-based update
        pauseScrollSpy(800);
      }
    });
  });
}

// Flag to temporarily pause scroll spy after click
let scrollSpyPaused = false;
let scrollSpyPauseTimeout = null;

// Update TOC active state for a specific hash
function updateTocActiveState(hash) {
  const toc = document.querySelector('.toc');
  if (!toc) return;

  const links = toc.querySelectorAll('.toc-link[href^="#"]');
  links.forEach(link => {
    link.removeAttribute('aria-current');
    if (link.getAttribute('href') === hash) {
      link.setAttribute('aria-current', 'location');
    }
  });
}

// Pause scroll spy temporarily (used after click)
function pauseScrollSpy(duration) {
  scrollSpyPaused = true;
  if (scrollSpyPauseTimeout) clearTimeout(scrollSpyPauseTimeout);
  scrollSpyPauseTimeout = setTimeout(() => {
    scrollSpyPaused = false;
  }, duration);
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

// Scroll-spy for subnav: highlights active section as user scrolls
function initScrollSpy() {
  const subnav = document.querySelector('.toc') || document.querySelector('.section-nav') || document.querySelector('.product-subnav');
  if (!subnav) return;

  const links = subnav.querySelectorAll('.toc-link[href^="#"], .section-nav-link[href^="#"], .subnav-link[href^="#"]');
  if (!links.length) return;

  // Get all target sections
  const sections = [];
  links.forEach(link => {
    const targetId = link.getAttribute('href').substring(1);
    const section = document.getElementById(targetId);
    if (section) {
      sections.push({ id: targetId, el: section, link: link });
    }
  });

  if (!sections.length) return;

  // Throttled scroll handler
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateActiveSection();
      ticking = false;
    });
  }

  function updateActiveSection() {
    // Skip if scroll spy is paused (e.g., after a click)
    if (scrollSpyPaused) return;

    // Account for sticky nav height (approx 120px for main nav + subnav)
    const scrollPos = window.scrollY + 140;
    let activeSection = sections[0];

    // Check if we're at the bottom of the page
    const atBottom = (window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 50);

    if (atBottom && sections.length > 0) {
      // If at bottom, highlight the last section
      activeSection = sections[sections.length - 1];
    } else {
      // Find the section closest to or above the viewport
      for (const section of sections) {
        if (section.el.offsetTop <= scrollPos) {
          activeSection = section;
        }
      }
    }

    // Update aria-current
    links.forEach(link => link.removeAttribute('aria-current'));
    if (activeSection) {
      activeSection.link.setAttribute('aria-current', 'location');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateActiveSection(); // Initial state
}

setProductSubnav();
window.addEventListener('hashchange', setProductSubnav);
initScrollSpy();

