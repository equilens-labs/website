// Apply reviewed, non-PII campaign identities to their contact route.
(function initCampaignRoute() {
  function bind() {
    const params = new URLSearchParams(window.location.search);
    const isSeptemberSearch =
      params.get('route') === 'ccd2-search-202609' &&
      params.get('utm_source') === 'google' &&
      params.get('utm_medium') === 'cpc' &&
      params.get('utm_campaign') === 'ccd2_readiness_eu_202609';

    if (!isSeptemberSearch) return;

    const link = document.querySelector('[data-campaign-contact="ccd2-readiness"]');
    if (!link) return;

    link.href =
      '/contact/?interest=Automated%20Creditworthiness%20Evidence%20Readiness' +
      '&route=ccd2-search-202609';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
