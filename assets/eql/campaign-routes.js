// Reviewed, static, non-PII paid-campaign identities shared by landing and contact pages.
(function initCampaignRoutes(global) {
  const routes = Object.freeze({
    'ccd2-search-202609': Object.freeze({
      source: 'google',
      medium: 'cpc',
      campaign: 'ccd2_readiness_eu_202609',
      interest: 'Automated Creditworthiness Evidence Readiness',
      subject: 'FL-BSA enquiry: CCD2 readiness — EU Search Sep 2026',
    }),
    'linkedin-era-eea-202609': Object.freeze({
      source: 'linkedin',
      medium: 'paid-social',
      campaign: 'flbsa_era_eea_202609',
      content: 'single_image_v1',
      interest: 'Automated Creditworthiness Evidence Readiness',
      subject: 'FL-BSA enquiry: Evidence readiness — LinkedIn EEA Sep 2026',
    }),
  });

  function getSingleParam(params, name) {
    const values = params.getAll(name);
    return values.length === 1 ? values[0] : null;
  }

  function match(params) {
    const route = getSingleParam(params, 'route');
    const config = route ? routes[route] : null;
    if (!config) return null;

    const matches =
      getSingleParam(params, 'utm_source') === config.source &&
      getSingleParam(params, 'utm_medium') === config.medium &&
      getSingleParam(params, 'utm_campaign') === config.campaign &&
      (!config.content || getSingleParam(params, 'utm_content') === config.content);

    return matches ? Object.freeze({ route, ...config }) : null;
  }

  global.eqlCampaignRouting = Object.freeze({ getSingleParam, match });
})(window);
