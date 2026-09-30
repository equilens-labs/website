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
        'Please send the FL-BSA buyer and procurement pack.',
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
    const heading = document.getElementById('contact-form-heading');
    const extraFields = document.getElementById('contact-extra-fields');
    const nextStep = document.getElementById('request-next-step');
    const defaultContext = context?.textContent || '';
    const defaultNextStep = nextStep?.textContent || '';
    let optionalDetails = null;
    let previousInterest = interestField?.value || '';

    function isPackRequest() { return interestField?.value === 'Procurement Pack'; }
    function isEvaluationRequest() { return interestField?.value === 'Controlled FL-BSA Pilot'; }
    function submitLabel() {
      return isPackRequest() ? 'Send me the pack' : isEvaluationRequest() ? 'Ask about an evaluation' : 'Send message';
    }
    function updateRequestMode() {
      const pack = isPackRequest();
      const evaluation = isEvaluationRequest();
      const compact = pack || evaluation;
      if (heading) heading.textContent = pack ? 'Request the pack' : evaluation ? 'Ask about an FL‑BSA evaluation' : 'Send us a message';
      if (context) context.textContent = pack
        ? 'We will email you sample evidence, deployment and security material, and a commercial overview.'
        : evaluation ? 'We will reply by email about fit and current availability. Only your name and email are required.' : defaultContext;
      if (nextStep) nextStep.textContent = evaluation
        ? 'We will reply by email about an optional, customer-hosted FL-BSA evaluation for one regulated-credit workflow. We will confirm fit and current availability before any next step.'
        : defaultNextStep;
      if (submitButton && !inFlight) submitButton.textContent = submitLabel();
      if (compact && extraFields && !optionalDetails) {
        optionalDetails = document.createElement('details');
        optionalDetails.className = 'request-details';
        const summary = document.createElement('summary');
        summary.textContent = 'Add optional details';
        extraFields.replaceWith(optionalDetails);
        optionalDetails.append(summary, extraFields);
      } else if (!compact && optionalDetails) {
        optionalDetails.replaceWith(extraFields);
        optionalDetails = null;
      }
      if (optionalDetails) optionalDetails.id = pack ? 'pack-details' : 'evaluation-details';
    }
    updateRequestMode();
    interestField?.addEventListener('change', () => {
      if (messageField && messageField.value === (defaultMessages[previousInterest] || '')) {
        messageField.value = defaultMessages[interestField.value] || '';
      }
      previousInterest = interestField.value;
      updateRequestMode();
    });

    function offerType() {
      const types = {
        'Procurement Pack': 'pack', 'Controlled FL-BSA Pilot': 'evaluation',
        'Guided Pilot Access': 'evaluation', 'Security Pack': 'security',
        'Partnership': 'partner', 'Evidence Readiness Assessment': 'readiness',
        'Automated Creditworthiness Evidence Readiness': 'readiness', 'Pricing': 'pricing',
      };
      return types[interestField?.value] || 'generic';
    }

    // Analytics must never block contact, or include entered values / populated URLs.
    function track(event, labels = {}, diagnostic = false) {
      try {
        if (typeof window.plausible === 'function') {
          window.plausible(event, {
            props: { surface: 'contact', cta: 'form-submit', offer_type: offerType(), ...labels },
            ...(diagnostic ? { interactive: false } : {}),
          });
        }
      } catch (_) { /* The enquiry path remains usable if analytics fails. */ }
    }

    const fieldIds = new Set(['name', 'email', 'organisation', 'role', 'region', 'interest', 'message']);
    let started = false;
    const invalidSeen = new Set();
    function recordStart(event) {
      if (!started && fieldIds.has(event.target.id) && !fieldValue('hp-field')) {
        started = true;
        track('Contact Form Started', { cta: 'form-edit' }, true);
      }
    }
    form.addEventListener('input', recordStart);
    form.addEventListener('change', recordStart);
    form.addEventListener('invalid', function (event) {
      if (!fieldIds.has(event.target.id) || fieldValue('hp-field')) return;
      const validity = event.target.validity;
      const reason = validity.valueMissing ? 'required' : validity.typeMismatch || validity.patternMismatch ? 'format' : 'other';
      const key = event.target.id + ':' + reason;
      if (invalidSeen.has(key)) return;
      invalidSeen.add(key);
      track('Contact Form Invalid', { cta: 'form-validation', field: event.target.id, reason: reason }, true);
    }, true);

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
        // Never tag this link: the tagged tracker copies its PII-bearing href.
        link.addEventListener('click', function () {
          track('Contact Email Click', { cta: 'error-fallback' });
        });
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
      const packRequest = isPackRequest();
      const submittedOffer = offerType();

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
          showStatus(packRequest
            ? 'Thanks. Your pack request has been received; we will reply by email.'
            : 'Thanks. Your message has been sent; we reply by email.');
          if (submitButton) submitButton.textContent = 'Sent';
          track('Enquiry Submitted', { offer_type: submittedOffer });
        })
        .catch(function (error) {
          inFlight = false;
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = submitLabel();
          }
          const rejected = error.message.startsWith('HTTP ');
          track('Contact Form Error', {
            offer_type: submittedOffer,
            reason: timedOut ? 'timeout' : rejected ? 'rejected' : 'network',
          }, true);
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
    // The HTML fallback stays visible and disabled unless binding fully succeeds.
    if (statusEl) { statusEl.hidden = true; statusEl.textContent = ''; }
    if (submitButton) submitButton.disabled = false;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
