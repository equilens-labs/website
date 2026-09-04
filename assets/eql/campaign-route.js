// Apply reviewed, non-PII campaign identities to their contact route.
(function initCampaignRoute() {
  function bind() {
    const params = new URLSearchParams(window.location.search);
    const campaignRoute = window.eqlCampaignRouting?.match(params) || null;
    if (!campaignRoute) return;

    const link = document.querySelector(
      `[data-campaign-contact="${campaignRoute.contactTarget}"]`,
    );
    if (!link) return;

    const contactParams = new URLSearchParams({
      interest: campaignRoute.interest,
      route: campaignRoute.route,
      utm_source: campaignRoute.source,
      utm_medium: campaignRoute.medium,
      utm_campaign: campaignRoute.campaign,
    });
    if (campaignRoute.content) contactParams.set('utm_content', campaignRoute.content);

    link.href = '/contact/?' + contactParams.toString();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
