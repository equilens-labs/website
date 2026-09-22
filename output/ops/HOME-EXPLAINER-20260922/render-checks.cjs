const { chromium } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('fs');
const path = require('path');
const base = new URL(process.env.EQL_BASE_URL || 'http://127.0.0.1:8765');
if (base.protocol !== 'http:' || !['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname)) {
  throw new Error('This review requires a loopback HTTP server.');
}
const result = { started: new Date().toISOString(), origin: base.origin, cases: [], interactions: [], network: { localReads: 0, blocked: [] }, errors: [] };
const assert = (condition, message) => { if (!condition) throw new Error(message); };
async function guardedContext(browser, options) {
  const context = await browser.newContext({ serviceWorkers: 'block', ...options });
  await context.route('**/*', async route => {
    const request = route.request(), url = new URL(request.url());
    if (url.origin === base.origin && ['GET', 'HEAD'].includes(request.method())) {
      result.network.localReads++;
      await route.continue();
    } else {
      result.network.blocked.push({ method: request.method(), url: request.url() });
      await route.abort('blockedbyclient');
    }
  });
  return context;
}
(async () => {
  for (const [engine, browserType] of [['chromium', chromium]]) {
    const browser = await browserType.launch(engine === 'chromium' ? { executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' } : {});
    try {
    for (const width of engine === 'chromium' ? [320, 375, 699, 700, 768, 1280] : [375, 1280]) {
      const context = await guardedContext(browser, { viewport: { width, height: 900 } });
      const page = await context.newPage();
      let pageErrors = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      for (const fontPercent of engine === 'chromium' ? [100, 200] : [100]) {
      pageErrors = [];
      const response = await page.goto(base.href, { waitUntil: 'networkidle' });
      await page.evaluate(async fontPercent => {
        // Text-resize probe only: this is not native browser zoom.
        document.documentElement.style.fontSize = `${fontPercent}%`;
        await document.fonts.ready;
        for (const image of document.images) { image.loading = 'eager'; await image.decode().catch(() => {}); }
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      }, fontPercent);
      const geometry = await page.evaluate(() => ({
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        diagramOverflow: document.querySelector('.home-evidence').scrollWidth - document.querySelector('.home-evidence').clientWidth,
        diagramWidth: document.querySelector('.home-evidence').getBoundingClientRect().width,
        rootFontSize: getComputedStyle(document.documentElement).fontSize,
        h1s: document.querySelectorAll('h1').length,
        mains: document.querySelectorAll('main').length,
        missingImages: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src),
        diagramName: document.querySelector('.home-evidence').innerText,
        metadata: document.querySelector('meta[name="description"]').content,
        canonical: document.querySelector('link[rel="canonical"]').href,
      }));
      const axe = fontPercent === 100 && (engine !== 'chromium' || [320, 768, 1280].includes(width))
        ? await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
        : null;
      const record = { engine, version: browser.version(), width, fontPercent, status: response.status(), ...geometry, pageErrors, axeViolations: axe?.violations.map(item => ({ id: item.id, impact: item.impact, targets: item.nodes.map(node => node.target) })) ?? null };
      result.cases.push(record);
      if (engine === 'chromium' && fontPercent === 100 && [320, 375, 768, 1280].includes(width)) {
        await page.screenshot({ path: path.join(__dirname, `home-${width}-viewport.png`) });
        await page.screenshot({ path: path.join(__dirname, `home-${width}-full.png`), fullPage: true });
      }

      if (!(record.status === 200 && record.overflow <= 1 && record.diagramOverflow <= 1 && record.h1s === 1 && record.mains === 1 && !record.missingImages.length && !pageErrors.length && !record.axeViolations?.length)) {
        result.errors.push(JSON.stringify(record));
        await page.screenshot({ path: path.join(__dirname, `review-${engine}-${width}-font${fontPercent}.png`), fullPage: true });
      }
      if (!/Synthetic demo[\s\S]*36\.4%[\s\S]*56\.0%[\s\S]*19\.6[\s\S]*Report · Metrics · Manifest/i.test(record.diagramName)) result.errors.push('The evidence figure must expose readable demo values and outputs.');
      if (engine === 'chromium' && width === 375 && fontPercent === 100) {
        await page.locator('.skip-to-content').focus();
        await page.keyboard.press('Enter');
        assert(await page.locator('main').evaluate(element => element === document.activeElement), 'Skip link must focus main');
        await page.keyboard.press('Tab');
        assert(await page.getByRole('link', { name: 'Explore FL-BSA', exact: true }).evaluate(element => element === document.activeElement), 'First main keyboard target must be the product CTA');
        await page.keyboard.press('Enter');
        await page.waitForURL(base.origin + '/fl-bsa/');
        result.interactions.push('Keyboard product CTA reaches /fl-bsa/');
        await page.goto(base.href, { waitUntil: 'networkidle' });
        await page.getByRole('link', { name: 'Request buyer pack', exact: true }).click();
        await page.waitForURL(url => url.pathname === '/contact/' && url.searchParams.get('interest') === 'Procurement Pack');
        assert(await page.locator('#interest').inputValue() === 'Procurement Pack', 'Buyer pack must prefill the intended request');
        result.interactions.push('Buyer pack CTA reaches contact with Procurement Pack selected; no fields entered or form submitted');
      }
      }
      await context.close();
    }
    if (engine === 'chromium') {
    const context = await guardedContext(browser, { javaScriptEnabled: false, viewport: { width: 375, height: 900 } });
    const page = await context.newPage();
    await page.goto(base.href, { waitUntil: 'networkidle' });
    const contact = page.getByRole('navigation', { name: 'Primary', exact: true }).getByRole('link', { name: 'Contact', exact: true });
    assert(await contact.isVisible(), 'Native mobile contact link must remain visible without JavaScript');
    await contact.click();
    await page.waitForURL(base.origin + '/contact/');
    result.interactions.push('No-JavaScript mobile primary Contact link works');
    await context.close();
    }
    } finally { await browser.close(); }
  }
})().catch(error => { result.errors.push(error.message); process.exitCode = 1; }).finally(() => {
  result.finished = new Date().toISOString();
  result.passed = result.errors.length === 0 && result.cases.length === 12 && result.interactions.length === 3;
  fs.writeFileSync(path.join(__dirname, 'render-checks.json'), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify({ passed: result.passed, cases: result.cases.length, interactions: result.interactions, errors: result.errors }));
});
