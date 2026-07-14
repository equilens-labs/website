// Navigation behaviour for the statically baked nav
// (scripts/content/sync_nav_static.py bakes the markup at build time).

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
    const setOpen = (open) => {
      links.setAttribute('data-open', String(open));
      toggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('nav-open', open);
    };
    toggle.addEventListener('click', () => {
      const open = links.getAttribute('data-open') === 'true';
      setOpen(!open);
    });
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setOpen(false));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && links.getAttribute('data-open') === 'true') {
        setOpen(false);
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

// Scroll-spy for the TOC: highlights active section as user scrolls
function initScrollSpy() {
  const subnav = document.querySelector('.toc');
  if (!subnav) return;

  const links = subnav.querySelectorAll('.toc-link[href^="#"]');
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

initNavFeatures();
initScrollSpy();
