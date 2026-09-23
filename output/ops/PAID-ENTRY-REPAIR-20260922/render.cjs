const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const base = 'http://127.0.0.1:8767';
const route = 'route=linkedin-flbsa-uk-pilot-202609&utm_source=linkedin&utm_medium=paid-social&utm_campaign=flbsa_uk_pilot_202609&utm_content=single_image_uk_a';
const result = { started: new Date().toISOString(), cases: [], blocked: [], errors: [] };
(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    for (const width of [375, 768, 1280]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, serviceWorkers: 'block' });
      await context.route('**/*', async interception => {
        const request = interception.request(), url = new URL(request.url());
        if (url.origin === base && ['GET', 'HEAD'].includes(request.method())) return interception.continue();
        result.blocked.push({ url: request.url(), method: request.method() });
        return interception.abort('blockedbyclient');
      });
      const page = await context.newPage();
      page.on('pageerror', error => result.errors.push(error.message));
      await page.goto(base + '/fl-bsa/?' + route + '#controlled-pilot', { waitUntil: 'networkidle' });
      await page.evaluate(async () => {
        await document.fonts.ready;
        // Let the initial smooth anchor scroll finish before recording its arrival view.
        await new Promise(resolve => {
          let last = scrollY, stable = 0;
          function frame() { stable = Math.abs(scrollY - last) < 1 ? stable + 1 : 0; last = scrollY;
            if (stable >= 12) resolve(); else requestAnimationFrame(frame); }
          requestAnimationFrame(frame);
        });
      });
      const landing = await page.evaluate(() => {
        const rect = document.querySelector('[data-campaign-contact="controlled-pilot"]').getBoundingClientRect();
        return { ctaTop: rect.top, ctaBottom: rect.bottom, scrollY,
          overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth };
      });
      await page.screenshot({ path: path.join(__dirname, `landing-${width}.png`) });
      await page.locator('[data-campaign-contact="controlled-pilot"]').click();
      await page.waitForURL(url => url.pathname === '/contact/');
      const contact = await page.evaluate(() => ({
        fieldTop: document.getElementById('name').getBoundingClientRect().top,
        submitTop: document.querySelector('button[type="submit"]').getBoundingClientRect().top,
        interest: document.getElementById('interest').value,
        route: new URLSearchParams(location.search).get('route'),
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
      }));
      await page.screenshot({ path: path.join(__dirname, `contact-${width}.png`) });
      await page.screenshot({ path: path.join(__dirname, `contact-${width}-full.png`), fullPage: true });
      result.cases.push({ width, landing, contact });
      if (landing.overflow > 1 || contact.overflow > 1 || landing.ctaTop < 0 || landing.ctaBottom > 900 || contact.route !== 'linkedin-flbsa-uk-pilot-202609') {
        result.errors.push(`Unexpected landing/contact geometry or route at ${width}px`);
      }
      await context.close();
    }
  } finally { await browser.close(); }
})().catch(error => result.errors.push(error.message)).finally(() => {
  result.finished = new Date().toISOString();
  fs.writeFileSync(path.join(__dirname, 'render.json'), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify({ cases: result.cases, errors: result.errors }));
  if (result.errors.length) process.exitCode = 1;
});
