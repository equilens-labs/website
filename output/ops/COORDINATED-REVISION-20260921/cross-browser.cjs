const { firefox, webkit } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const origin = 'http://127.0.0.1:8765';
const routes = ['/', '/fl-bsa/', '/contact/', '/legal/', '/trust-center/', '/procurement/', '/fl-bsa/whitepaper/', '/press/', '/notes/five-things-before-a-fair-outcomes-test/'];
const result = { started: new Date().toISOString(), origin, cases: [], blocked: [], errors: [] };
const assert = (condition, message) => { if (!condition) throw new Error(message); };
(async () => {
  for (const [name, engine] of [['firefox', firefox], ['webkit', webkit]]) {
    const browser = await engine.launch();
    for (const width of [375, 1280]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      await context.route('**/*', route => {
        const request = route.request(), url = new URL(request.url());
        if ((url.origin === origin && ['GET', 'HEAD'].includes(request.method())) || ['data:', 'blob:'].includes(url.protocol)) return route.continue();
        result.blocked.push({ engine: name, method: request.method(), url: request.url() });
        return route.abort();
      });
      for (const pathname of routes) {
        const page = await context.newPage(), errors = [];
        page.on('pageerror', error => errors.push(error.message));
        const response = await page.goto(origin + pathname, { waitUntil: 'networkidle' });
        await page.evaluate(async () => { await document.fonts.ready; for (const image of document.images) { image.loading = 'eager'; await image.decode().catch(() => {}); } });
        const geometry = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight, missingImages: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src), h1s: document.querySelectorAll('h1').length }));
        const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
        const record = { engine: name, version: browser.version(), width, pathname, status: response.status(), ...geometry, pageErrors: errors, axeViolations: axe.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) })) };
        result.cases.push(record);
        assert(record.status === 200 && record.h1s === 1 && record.scrollWidth <= width && !record.missingImages.length && !errors.length && !record.axeViolations.length, JSON.stringify(record));
        if (pathname === '/fl-bsa/') {
          if (width < 1100) await page.locator('.toc summary').click();
          await page.locator('.toc-link[href="#faq"]').click();
          assert(await page.locator('#faq').evaluate(e => e === document.activeElement), `${name} section focus`);
          await page.goto(origin + pathname, { waitUntil: 'networkidle' });
          await page.screenshot({ path: path.join(__dirname, `${name}-product-${width}.png`) });
        }
        if (pathname === '/legal/' && width === 375) {
          await page.locator('.skip-to-content').focus();
          await page.keyboard.press('Enter');
          await page.locator('.nav-toggle').focus();
          await page.keyboard.press('Enter');
          await page.waitForTimeout(100);
          await page.keyboard.press('Escape');
          await page.locator('.toc summary').focus();
          await page.keyboard.press('Enter');
          await page.locator('.toc-link[href="#accessibility"]').focus();
          await page.keyboard.press('Enter');
          await page.waitForTimeout(500);
          record.menuThenContents = await page.evaluate(() => ({ headingTop: document.querySelector('#accessibility h2').getBoundingClientRect().top, headerBottom: document.querySelector('.navbar').getBoundingClientRect().bottom, focus: document.activeElement.id }));
          assert(record.menuThenContents.headingTop >= record.menuThenContents.headerBottom && record.menuThenContents.focus === 'accessibility', `${name} menu then contents landing`);
        }
        await page.close();
        console.log(`${name} ${width} ${pathname}: pass`);
      }
      await context.close();
    }
    await browser.close();
  }
})().catch(error => { result.errors.push(error.message); process.exitCode = 1; }).finally(() => {
  result.finished = new Date().toISOString();
  result.sourceHashes = Object.fromEntries(['assets/eql/base.css', 'assets/eql/nav.js', 'assets/eql/contact.js'].map(file => [file, crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')]));
  result.passed = !result.errors.length && result.cases.length === 36;
  fs.writeFileSync(path.join(__dirname, 'cross-browser.json'), JSON.stringify(result, null, 2) + '\n');
});
