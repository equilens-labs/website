// Count missing-page outcomes without sending the requested path, query or referrer.
// https://plausible.io/docs/events-api — no credentials or persistent identifier.
(function () {
  if (!['equilens.io', 'www.equilens.io'].includes(location.hostname)) return;
  if (navigator.webdriver || window._phantom || window.__nightmare || window.Cypress) return;
  try {
    if (localStorage.getItem('plausible_ignore') === 'true') return;
  } catch (_) { return; } // If the preference cannot be read, fail closed.
  if (typeof window.fetch !== 'function') return;
  fetch('https://plausible.io/api/event', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
    keepalive: true,
    body: JSON.stringify({
      name: '404', domain: 'equilens.io', url: 'https://equilens.io/404.html',
      interactive: false, props: { surface: 'not-found' },
    }),
  }).catch(function () { /* Analytics cannot affect the recovery links. */ });
})();
