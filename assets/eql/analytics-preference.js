// User-selected Plausible exclusion; no identifiers or network requests.
    (() => {
      const status = document.getElementById('status');
      const exclude = document.getElementById('exclude');
      const include = document.getElementById('include');
      const key = 'plausible_ignore';
      document.getElementById('preview').hidden = location.origin === 'https://equilens.io';
      function unavailable() {
        status.textContent = 'This browser could not save or read the preference. Exclusion is not confirmed.';
        exclude.disabled = true;
        include.hidden = true;
      }
      function refresh() {
        try {
          const ignored = localStorage.getItem(key) === 'true';
          status.textContent = ignored
            ? 'Excluded: your future visits from this browser will stay out of our website analytics.'
            : 'Not excluded: your visits from this browser may appear in our website analytics.';
          exclude.hidden = ignored;
          exclude.disabled = false;
          include.hidden = !ignored;
        } catch (_) { unavailable(); }
      }
      exclude.addEventListener('click', () => {
        try {
          localStorage.setItem(key, 'true');
          if (localStorage.getItem(key) !== 'true') return unavailable();
          refresh();
          include.focus();
        } catch (_) { unavailable(); }
      });
      include.addEventListener('click', () => {
        try {
          localStorage.removeItem(key);
          if (localStorage.getItem(key) === 'true') return unavailable();
          refresh();
          exclude.focus();
        } catch (_) { unavailable(); }
      });
      window.addEventListener('pageshow', refresh);
      window.addEventListener('focus', refresh);
      window.addEventListener('storage', refresh);
      refresh();
    })();
