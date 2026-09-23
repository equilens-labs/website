// Reviewed, static, non-PII paid-campaign identities shared by landing and contact pages.
(function initCampaignRoutes(global) {
  const routes = Object.freeze({
    'ccd2-search-202609': Object.freeze({
      source: 'google',
      medium: 'cpc',
      campaign: 'ccd2_readiness_eu_202609',
      interest: 'Automated Creditworthiness Evidence Readiness',
      subject: 'FL-BSA enquiry: CCD2 readiness — EU Search Sep 2026',
      packSubject: 'FL-BSA enquiry: Procurement Pack — EU Search Sep 2026',
      contactTarget: 'ccd2-readiness',
    }),
    'linkedin-era-eea-202609': Object.freeze({
      source: 'linkedin',
      medium: 'paid-social',
      campaign: 'flbsa_era_eea_202609',
      content: 'single_image_v1',
      interest: 'Automated Creditworthiness Evidence Readiness',
      subject: 'FL-BSA enquiry: Evidence readiness — LinkedIn EEA Sep 2026',
      packSubject: 'FL-BSA enquiry: Procurement Pack — LinkedIn EEA Sep 2026',
      contactTarget: 'ccd2-readiness',
    }),
    'linkedin-flbsa-eu4-pilot-202609': Object.freeze({
      source: 'linkedin',
      medium: 'paid-social',
      campaign: 'flbsa_eu4_pilot_202609',
      content: 'single_image_v4',
      interest: 'Controlled FL-BSA Pilot',
      subject: 'FL-BSA enquiry: Optional evaluation — LinkedIn EU4 Sep 2026',
      packSubject: 'FL-BSA enquiry: Procurement Pack — LinkedIn EU4 Sep 2026',
      contactTarget: 'controlled-pilot',
    }),
    'linkedin-flbsa-uk-pilot-202609': Object.freeze({
      source: 'linkedin',
      medium: 'paid-social',
      campaign: 'flbsa_uk_pilot_202609',
      content: 'single_image_uk_a',
      interest: 'Controlled FL-BSA Pilot',
      subject: 'FL-BSA enquiry: Optional evaluation — LinkedIn UK Sep 2026',
      packSubject: 'FL-BSA enquiry: Procurement Pack — LinkedIn UK Sep 2026',
      contactTarget: 'controlled-pilot',
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
