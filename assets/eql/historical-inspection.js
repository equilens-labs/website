// Aggregate click/visibility/opening signals for the historical public-data example.
// These signals do not establish reading, comprehension, buyer identity or intent.
(function historicalInspection() {
  if (window.location.pathname !== '/examples/historical-decision-review/') return;

  const sent = new Set();
  const pending = new Map();
  let flushTimer = null;
  let attempts = 0;

  function flush() {
    attempts += 1;
    if (typeof window.plausible === 'function') {
      for (const [name, asset] of pending) {
        try {
          window.plausible(name, { props: { surface: 'historical-review', asset } });
          pending.delete(name);
        } catch (_) {
          // Analytics must never interfere with the example or enquiry flow.
        }
      }
    }
    if (!pending.size || attempts >= 20) {
      clearInterval(flushTimer);
      flushTimer = null;
    }
  }

  function send(name, asset) {
    if (sent.has(name)) return;
    sent.add(name);
    pending.set(name, asset);
    flush();
    if (pending.size && attempts < 20 && !flushTimer) flushTimer = setInterval(flush, 500);
  }

  // Tagged anchors attach the resolved href (including the current query) as a
  // custom URL property. Send only these fixed labels through the normal tracker.
  // Retain at most 20 early activations for up to 10 seconds while it loads.
  let pendingClicks = 0;
  let clickTimer = null;
  let clickDeadline = 0;
  function clearClicks() {
    clearTimeout(clickTimer);
    clickTimer = null;
    pendingClicks = 0;
  }
  function flushClicks() {
    clickTimer = null;
    if (Date.now() >= clickDeadline) { clearClicks(); return; }
    if (typeof window.plausible === 'function') {
      const count = pendingClicks;
      pendingClicks = 0;
      for (let i = 0; i < count; i += 1) {
        try {
          window.plausible('Review Example Click', {
            props: { surface: 'historical-review', cta: 'hero-example', asset: 'comparison-table' }
          });
        } catch (_) {
          // Do not retry an ambiguous throw or interfere with native navigation.
        }
      }
    } else if (Date.now() < clickDeadline) {
      clickTimer = setTimeout(flushClicks, 500);
    } else clearClicks();
  }
  const exampleLink = document.querySelector('[data-eql-review-example-link]');
  if (exampleLink) exampleLink.addEventListener('click', () => {
    if (pendingClicks && Date.now() >= clickDeadline) clearClicks();
    pendingClicks = Math.min(pendingClicks + 1, 20);
    if (clickTimer === null) {
      clickDeadline = Date.now() + 10000;
      flushClicks();
    }
  });
  window.addEventListener('pagehide', clearClicks);

  const table = document.querySelector('[data-eql-review-table]');
  if (table && typeof IntersectionObserver === 'function') {
    let inView = false;
    let dwellTimer = null;
    const stop = () => {
      clearTimeout(dwellTimer);
      dwellTimer = null;
    };
    const start = () => {
      if (!inView || document.visibilityState !== 'visible' || dwellTimer || sent.has('Review Example Seen')) return;
      dwellTimer = setTimeout(() => {
        dwellTimer = null;
        if (!inView || document.visibilityState !== 'visible') return;
        send('Review Example Seen', 'comparison-table');
        observer.disconnect();
      }, 2000);
    };
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        inView = entry.isIntersecting && entry.intersectionRatio >= 0.5;
        if (inView) start();
        else stop();
      }
    }, { threshold: [0, 0.5] });
    observer.observe(table);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') start();
      else stop();
    });
    window.addEventListener('pagehide', stop);
  }

  const report = document.querySelector('[data-eql-review-report]');
  if (report) report.addEventListener('toggle', () => {
    if (report.open && document.visibilityState === 'visible') send('Review Report Opened', 'report-context');
  });
}());
