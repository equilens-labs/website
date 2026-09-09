// Contact form: client-side mailto builder (no server submission).
(function initContactForm() {
  function bind() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    const interestParam = params.get('interest');
    const messageParam = params.get('message');
    const interestField = document.getElementById('interest');
    const messageField = document.getElementById('message');
    const defaultMessages = {
      'Procurement Pack':
        'Please send the FL-BSA buyer and procurement pack and help scope a readiness conversation.',
      'Security Pack': 'Please send the FL-BSA security pack and vendor questionnaire materials.',
      'Evidence Readiness Assessment':
        'I would like to discuss whether one credit workflow is ready for a fair-outcomes evidence test.',
      'Automated Creditworthiness Evidence Readiness':
        'I would like to discuss evidence readiness for one automated creditworthiness workflow.',
      'Controlled FL-BSA Pilot':
        'I would like to discuss an optional, customer-hosted FL-BSA evaluation for one regulated-credit workflow.',
    };
    const displayInterests = {
      'Controlled FL-BSA Pilot': 'Optional FL-BSA evaluation',
      'Guided Pilot Access': 'Guided pre-release access',
    };
    const matchedCampaign = window.eqlCampaignRouting?.match(params) || null;
    const hasSingleMatchingInterest =
      matchedCampaign &&
      window.eqlCampaignRouting.getSingleParam(params, 'interest') === matchedCampaign.interest;
    const campaignRoute = hasSingleMatchingInterest ? matchedCampaign : null;

    if (interestParam && interestField) {
      const options = Array.from(interestField.options || []);
      if (options.some((option) => option.value === interestParam)) {
        interestField.value = interestParam;
      }
    }

    if (messageField && !messageField.value) {
      messageField.value = messageParam || defaultMessages[interestParam] || '';
    }

    form.addEventListener('submit', function onSubmit(e) {
      e.preventDefault();

      const name = document.getElementById('name')?.value || '';
      const org = document.getElementById('organisation')?.value || '';
      const role = document.getElementById('role')?.value || '';
      const region = document.getElementById('region')?.value || '';
      const interest = document.getElementById('interest')?.value || '';
      const displayInterest = displayInterests[interest] || interest;
      const message = document.getElementById('message')?.value || '';

      const lines = [];
      if (name) lines.push('Name: ' + name);
      if (org) lines.push('Organisation: ' + org);
      if (role) lines.push('Role: ' + role);
      if (region) lines.push('Region: ' + region);
      if (displayInterest) lines.push('Interest: ' + displayInterest);
      if (message) lines.push('', message);

      const subject =
        campaignRoute && interest === campaignRoute.interest
          ? campaignRoute.subject
          : interest
            ? 'FL-BSA enquiry: ' + displayInterest
            : 'FL-BSA enquiry';
      const mailto =
        'mailto:hello@equilens.io?subject=' +
        encodeURIComponent(subject) +
        '&body=' +
        encodeURIComponent(lines.join('\n'));

      const mailtoLink = document.createElement('a');
      mailtoLink.href = mailto;
      mailtoLink.hidden = true;
      mailtoLink.setAttribute('aria-hidden', 'true');
      document.body.appendChild(mailtoLink);
      mailtoLink.click();
      mailtoLink.remove();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
