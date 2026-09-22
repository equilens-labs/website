// Apply reviewed, non-PII campaign identities to their contact route.
(function initCampaignRoute() {
  function bind() {
    const params = new URLSearchParams(window.location.search);
    const campaignRoute = window.eqlCampaignRouting?.match(params) || null;
    if (!campaignRoute) return;

    document.querySelectorAll('a[href]').forEach((link) => {
      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.pathname !== '/contact/') return;
      const target = link.getAttribute('data-campaign-contact');
      if (target && target !== campaignRoute.contactTarget) return;

      // Preserve the visitor's requested pack instead of turning a pack request
      // into an evaluation. Other offers retain their original contact links.
      const interest = destination.searchParams.has('interest')
        ? window.eqlCampaignRouting.getSingleParam(destination.searchParams, 'interest')
        : campaignRoute.interest;
      if (interest !== campaignRoute.interest && interest !== 'Procurement Pack') return;

      const contactParams = new URLSearchParams({
        interest,
        route: campaignRoute.route,
        utm_source: campaignRoute.source,
        utm_medium: campaignRoute.medium,
        utm_campaign: campaignRoute.campaign,
      });
      if (campaignRoute.content) contactParams.set('utm_content', campaignRoute.content);
      link.href = '/contact/?' + contactParams.toString();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
