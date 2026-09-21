// Contact form: posts to the EU form endpoint (Formspark, EEA-hosted); no cookies.
// Fallback path: direct email. Analytics: 'Contact Form Submit' fires on the submit
// event (attempt counter, tagged classes on the form); 'Enquiry Submitted' fires
// client-side only after an HTTP 2xx from the endpoint (server-confirmed conversion).
(function initContactForm() {
  var FORM_ENDPOINT = 'https://submit-form.com/iraaHLvvM';

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
      'Partnership':
        'I would like to discuss partnering as a consultancy or decisioning-platform vendor.',
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

    const statusEl = document.getElementById('form-status');
    const submitButton = form.querySelector('button[type="submit"]');

    function fieldValue(id) {
      return document.getElementById(id)?.value || '';
    }

    function buildSubject(interest, displayInterest) {
      return campaignRoute && interest === campaignRoute.interest
        ? campaignRoute.subject
        : interest
          ? 'FL-BSA enquiry: ' + displayInterest
          : 'FL-BSA enquiry';
    }

    function buildMailto(subject, lines) {
      return (
        'mailto:hello@equilens.io?subject=' +
        encodeURIComponent(subject) +
        '&body=' +
        encodeURIComponent(lines.join('\n'))
      );
    }

    function showStatus(text, mailtoHref) {
      if (!statusEl) return;
      statusEl.textContent = text;
      if (mailtoHref) {
        statusEl.appendChild(document.createTextNode(' '));
        const link = document.createElement('a');
        link.href = mailtoHref;
        link.textContent = 'hello@equilens.io';
        statusEl.appendChild(link);
        statusEl.appendChild(document.createTextNode('.'));
      }
      statusEl.hidden = false;
    }

    form.addEventListener('submit', function onSubmit(e) {
      e.preventDefault();

      const honeypot = fieldValue('hp-field');
      const name = fieldValue('name');
      const email = fieldValue('email');
      const org = fieldValue('organisation');
      const role = fieldValue('role');
      const region = fieldValue('region');
      const interest = fieldValue('interest');
      const displayInterest = displayInterests[interest] || interest;
      const message = fieldValue('message');
      const subject = buildSubject(interest, displayInterest);

      if (honeypot) {
        // Silently accept: no request, no analytics event.
        form.reset();
        showStatus('Thanks. Your message has been sent; we reply by email.');
        return;
      }

      const lines = [];
      if (name) lines.push('Name: ' + name);
      if (email) lines.push('Email: ' + email);
      if (org) lines.push('Organisation: ' + org);
      if (role) lines.push('Role: ' + role);
      if (region) lines.push('Region: ' + region);
      if (displayInterest) lines.push('Interest: ' + displayInterest);
      if (message) lines.push('', message);

      if (submitButton) submitButton.disabled = true;
      if (statusEl) statusEl.hidden = true;

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: name,
          email: email,
          organisation: org,
          role: role,
          region: region,
          interest: displayInterest,
          message: message,
          _honeypot: honeypot,
          _email: { subject: subject },
        }),
      })
        .then(function (response) {
          if (!response.ok) throw new Error('HTTP ' + response.status);
          form.reset();
          showStatus('Thanks. Your message has been sent; we reply by email.');
          if (submitButton) submitButton.textContent = 'Sent';
          if (typeof window.plausible === 'function') {
            window.plausible('Enquiry Submitted', {
              props: { surface: 'contact', cta: 'form-submit' },
            });
          }
        })
        .catch(function () {
          if (submitButton) submitButton.disabled = false;
          showStatus(
            'Sending failed. Please email us directly at',
            buildMailto(subject, lines)
          );
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
