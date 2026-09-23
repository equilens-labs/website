// Contact form: posts to the EU form endpoint (Formspark, EEA-hosted); no cookies.
// Attempts are counted after validation and the honeypot guard. Acceptance is
// counted only after HTTP 2xx; it does not establish inbox delivery.
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
    const singleInterest = window.eqlCampaignRouting?.getSingleParam(params, 'interest');
    const hasSingleMatchingInterest = matchedCampaign &&
      (singleInterest === matchedCampaign.interest || singleInterest === 'Procurement Pack');
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
    let inFlight = false;
    const context = document.getElementById('request-context');
    if (context && interestField?.value === 'Procurement Pack') {
      context.textContent = 'Request the buyer pack. We will reply with sample evidence, deployment and security material, and a commercial overview. Only name and email are required.';
    }

    function track(event) {
      if (typeof window.plausible === 'function') {
        window.plausible(event, { props: { surface: 'contact', cta: 'form-submit' } });
      }
    }

    function fieldValue(id) {
      return document.getElementById(id)?.value || '';
    }

    function buildSubject(interest, displayInterest) {
      if (campaignRoute && interest === 'Procurement Pack') return campaignRoute.packSubject;
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
      if (inFlight || !form.reportValidity()) return;

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

      inFlight = true;
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending…';
      }
      showStatus('Sending your message…');
      track('Contact Form Submit');
      const controller = new AbortController();
      let timedOut = false;
      const timeout = setTimeout(function () {
        timedOut = true;
        controller.abort();
      }, 15000);

      fetch(FORM_ENDPOINT, {
        signal: controller.signal,
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
          track('Enquiry Submitted');
        })
        .catch(function (error) {
          inFlight = false;
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Send message';
          }
          const rejected = error.message.startsWith('HTTP ');
          showStatus(
            timedOut || !rejected
              ? 'We could not confirm delivery. Your message may have arrived; we have not sent it again. You can contact us directly at'
              : 'The form service did not accept your message. Your entries are preserved. Please try again or email us at',
            buildMailto(subject, lines)
          );
        })
        .finally(function () {
          clearTimeout(timeout);
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
