// Contact form: client-side mailto builder (no server submission).
(function initContactForm() {
  function bind() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function onSubmit(e) {
      e.preventDefault();

      const name = document.getElementById('name')?.value || '';
      const org = document.getElementById('organisation')?.value || '';
      const role = document.getElementById('role')?.value || '';
      const region = document.getElementById('region')?.value || '';
      const interest = document.getElementById('interest')?.value || '';
      const message = document.getElementById('message')?.value || '';

      const lines = [];
      if (name) lines.push('Name: ' + name);
      if (org) lines.push('Organisation: ' + org);
      if (role) lines.push('Role: ' + role);
      if (region) lines.push('Region: ' + region);
      if (interest) lines.push('Interest: ' + interest);
      if (message) lines.push('', message);

      const subject = interest ? 'FL-BSA enquiry: ' + interest : 'FL-BSA enquiry';
      const mailto =
        'mailto:equilens@equilens.io?subject=' +
        encodeURIComponent(subject) +
        '&body=' +
        encodeURIComponent(lines.join('\n'));

      window.location.href = mailto;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();

