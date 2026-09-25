// Paid-landing engagement milestones (E1) as aggregate Plausible custom events.
// Each event fires at most once per page view. No cookies, browser storage,
// identifiers or form contents; props are a static page variant, the trigger
// or CTA label, and a sanitised utm_content value when one is present.
//   Engaged Visit          >=10 s visible, OR one viewport scrolled past arrival, OR a proof click
//   Arrival CTA Seen       the arrival primary CTA is >=50% visible for 2 s continuously
//   Reached Evaluation CTA the evaluation CTA becomes >=50% visible
(function initEngagement() {
  const script = document.currentScript;
  const variant = script?.dataset.eqlVariant;
  if (!/^[a-z]$/.test(variant || '')) return;

  const ENGAGED_VISIBLE_MS = 10000;
  const ARRIVAL_CTA_MS = 2000;
  const fired = new Set();
  const pending = [];
  let flushTimer = null;
  let flushAttempts = 0;

  function baseProps() {
    const props = { variant };
    const values = new URLSearchParams(window.location.search).getAll('utm_content');
    if (values.length === 1 && /^[A-Za-z0-9_.-]{1,64}$/.test(values[0])) props.utm_content = values[0];
    return props;
  }

  function flush() {
    if (typeof window.plausible === 'function') {
      while (pending.length) {
        const [name, props] = pending.shift();
        window.plausible(name, { props });
      }
    }
    if (!pending.length || flushAttempts >= 40) {
      clearInterval(flushTimer);
      flushTimer = null;
      return;
    }
    flushAttempts += 1;
  }

  function send(name, extra) {
    if (fired.has(name)) return;
    fired.add(name);
    pending.push([name, Object.assign(baseProps(), extra)]);
    flush();
    // The analytics script loads with defer; hold early events briefly, then drop them.
    if (pending.length && !flushTimer) flushTimer = setInterval(flush, 500);
  }

  function engaged(trigger) {
    send('Engaged Visit', { trigger });
  }

  // Visible time accumulates only while the page is visible.
  let visibleMs = 0;
  let visibleSince = null;
  let visibleTimer = null;
  function startVisible() {
    if (visibleSince !== null || fired.has('Engaged Visit')) return;
    visibleSince = performance.now();
    visibleTimer = setTimeout(() => engaged('time'), Math.max(0, ENGAGED_VISIBLE_MS - visibleMs));
  }
  function stopVisible() {
    if (visibleSince === null) return;
    visibleMs += performance.now() - visibleSince;
    visibleSince = null;
    clearTimeout(visibleTimer);
  }

  // Arrival is the settled position after any fragment jump; scrolling a full
  // viewport further down counts as engagement.
  let arrivalY = null;
  function onScroll() {
    if (arrivalY === null || fired.has('Engaged Visit')) return;
    if (window.scrollY - arrivalY >= window.innerHeight) engaged('scroll');
  }

  function observe(selector, threshold, onVisible, onHidden) {
    const elements = document.querySelectorAll(selector);
    if (!elements.length || typeof IntersectionObserver !== 'function') return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) onVisible(entry.target, observer);
        else if (onHidden) onHidden(entry.target);
      }
    }, { threshold: [0, threshold] });
    elements.forEach((element) => observer.observe(element));
  }

  function bind() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') startVisible();
      else stopVisible();
    });
    if (document.visibilityState === 'visible') startVisible();

    document.addEventListener('click', (event) => {
      const link = event.target instanceof Element ? event.target.closest('a[class]') : null;
      if (link && link.className.includes('plausible-event-name=Proof+Asset+Click')) engaged('proof_click');
    }, true);

    const settle = () => setTimeout(() => {
      arrivalY = window.scrollY;
      window.addEventListener('scroll', onScroll, { passive: true });
    }, 0);
    if (document.readyState === 'complete') settle();
    else window.addEventListener('load', settle, { once: true });

    // Two seconds of continuous visibility while the page itself is visible.
    const arrivalTimers = new Map();
    const arrivalInView = new Set();
    function clearArrival(target) {
      clearTimeout(arrivalTimers.get(target));
      arrivalTimers.delete(target);
    }
    function startArrival(target) {
      if (arrivalTimers.has(target) || fired.has('Arrival CTA Seen')) return;
      if (document.visibilityState !== 'visible') return;
      arrivalTimers.set(target, setTimeout(() => {
        arrivalTimers.delete(target);
        send('Arrival CTA Seen', { cta: target.dataset.eqlArrivalCta });
      }, ARRIVAL_CTA_MS));
    }
    observe('[data-eql-arrival-cta]', 0.5, (target) => {
      arrivalInView.add(target);
      startArrival(target);
    }, (target) => {
      arrivalInView.delete(target);
      clearArrival(target);
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') arrivalInView.forEach(startArrival);
      else arrivalTimers.forEach((_, target) => clearArrival(target));
    });

    observe('[data-eql-evaluation-cta]', 0.5, (target, observer) => {
      send('Reached Evaluation CTA', { cta: target.dataset.eqlEvaluationCta });
      observer.disconnect();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();
})();
