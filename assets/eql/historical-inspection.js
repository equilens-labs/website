// Aggregate visibility/opening signals for the historical public-data example.
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
