// Reviewed, static, non-PII paid-campaign identities shared by landing and contact pages.
(function initCampaignRoutes(global) {
  // Enquiry context is separate from paid attribution. New candidate offers must
  // be explicitly declared here; arbitrary query values never become copy/labels.
  const enquiries = Object.freeze({
    'historical-review': Object.freeze({
      interest: 'Other',
      defaultMessage: 'I would like to discuss a historical lending-decision review.',
      subject: 'Equilens enquiry: Historical decision review',
      heading: 'Discuss this workflow',
      context: 'What decisions do you need to review, and who needs to check the result? Please do not send borrower records or other confidential data. Only your name and email are required.',
      nextStep: 'Equilens will reply by email to discuss the task and current availability. Any evaluation, price or delivery commitment is agreed separately.',
      submitLabel: 'Discuss this workflow',
      offerType: 'historical-review',
    }),
  });
  const routes = Object.freeze({
    'linkedin-historical-eu5-202610': Object.freeze({
      source: 'linkedin',
      medium: 'paid-social',
      campaign: 'equilens_historical_review_eu5_202610',
      content: 'single_image_v1',
      interest: 'Other',
      subject: 'Equilens enquiry: Historical decision review — LinkedIn EU5 Oct 2026',
      contactTarget: 'historical-review',
      enquiry: 'historical-review',
    }),
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
    // Focused October 2026 cells landing on /fl-bsa/evidence/. The interest and contact target
    // must equal that page's evaluation link so enquiries keep the campaign subject.
    'linkedin-flbsa-focus-eu-202610': Object.freeze({
      source: 'linkedin',
      medium: 'paid-social',
      campaign: 'flbsa_focus_eu_202610',
      content: 'single_image_v21_eu',
      interest: 'Controlled FL-BSA Pilot',
      subject: 'FL-BSA enquiry: Optional evaluation — LinkedIn EU focus Oct 2026',
      packSubject: 'FL-BSA enquiry: Procurement Pack — LinkedIn EU focus Oct 2026',
      contactTarget: 'controlled-pilot',
    }),
    'linkedin-flbsa-focus-uk-202610': Object.freeze({
      source: 'linkedin',
      medium: 'paid-social',
      campaign: 'flbsa_focus_uk_202610',
      content: 'single_image_v21_uk_a',
      interest: 'Controlled FL-BSA Pilot',
      subject: 'FL-BSA enquiry: Optional evaluation — LinkedIn UK focus Oct 2026',
      packSubject: 'FL-BSA enquiry: Procurement Pack — LinkedIn UK focus Oct 2026',
      contactTarget: 'controlled-pilot',
    }),
  });

  function getSingleParam(params, name) {
    const values = params.getAll(name);
    return values.length === 1 ? values[0] : null;
  }

  function match(params) {
    const route = getSingleParam(params, 'route');
    const config = route && Object.prototype.hasOwnProperty.call(routes, route) ? routes[route] : null;
    if (!config) return null;

    const matches =
      getSingleParam(params, 'utm_source') === config.source &&
      getSingleParam(params, 'utm_medium') === config.medium &&
      getSingleParam(params, 'utm_campaign') === config.campaign &&
      (!config.content || getSingleParam(params, 'utm_content') === config.content) &&
      (!params.has('interest') || getSingleParam(params, 'interest') === config.interest ||
        (config.packSubject && getSingleParam(params, 'interest') === 'Procurement Pack')) &&
      (!params.has('enquiry') || (config.enquiry && getSingleParam(params, 'enquiry') === config.enquiry));

    return matches ? Object.freeze({ route, ...config }) : null;
  }

  function enquiry(params) {
    const id = params.has('enquiry') ? getSingleParam(params, 'enquiry') : match(params)?.enquiry;
    const config = id && Object.prototype.hasOwnProperty.call(enquiries, id) ? enquiries[id] : null;
    return config && getSingleParam(params, 'interest') === config.interest
      ? Object.freeze({ id, ...config }) : null;
  }

  global.eqlCampaignRouting = Object.freeze({ getSingleParam, match, enquiry });
})(window);
