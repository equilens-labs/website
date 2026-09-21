#!/usr/bin/env node
// Composed layout guard. Run only against a local preview; external requests
// are blocked before navigation. Detailed visual judgment stays with reviewers.
import { chromium } from '@playwright/test';
const base = new URL(process.argv[2] || 'http://127.0.0.1:8000');
if (!['localhost', '127.0.0.1', '[::1]'].includes(base.hostname) || !['http:', 'https:'].includes(base.protocol)) {
  throw new Error('Layout checks require a loopback preview URL');
}
const browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {});
const results = [], errors = [];
try {
  for (const width of [375, 768, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 812 }, reducedMotion: 'reduce' });
    await context.route('**/*', route => {
      const request = route.request(), url = new URL(request.url());
      return (url.origin === base.origin && ['GET', 'HEAD'].includes(request.method())) || url.protocol === 'data:' ? route.continue() : route.abort();
    });
    const page = await context.newPage();
    for (const path of ['/', '/fl-bsa/', '/contact/?interest=Procurement%20Pack']) {
      await page.goto(new URL(path, base).href, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const metrics = await page.evaluate(() => {
        const box = selector => {
          const node = document.querySelector(selector);
          if (!node) return null;
          const r = node.getBoundingClientRect();
          return { top: r.top, bottom: r.bottom, width: r.width, height: r.height };
        };
        const sections = [...document.querySelectorAll('main .section')].map(section => {
          const title = section.querySelector('h2');
          return { heading: title?.textContent, paddingTop: parseFloat(getComputedStyle(section).paddingTop), paddingBottom: parseFloat(getComputedStyle(section).paddingBottom) };
        });
        return { pageHeight: document.documentElement.scrollHeight, overflow: document.documentElement.scrollWidth - innerWidth,
          primaryAction: box('.hero-copy .btn-primary'), sample: box('.sample-report'), name: box('#name'), email: box('#email'),
          rowWidths: [...document.querySelectorAll('.service-row')].map(row => row.getBoundingClientRect().width), sections };
      });
      const label = `${path} @ ${width}`;
      if (metrics.overflow > 1) errors.push(`${label}: horizontal overflow ${metrics.overflow}px`);
      if (metrics.primaryAction && metrics.primaryAction.bottom > 812) errors.push(`${label}: primary action falls below opening viewport`);
      if (metrics.sample && metrics.sample.top > 1200) errors.push(`${label}: sample begins too late`);
      if (metrics.email && metrics.email.bottom > 812) errors.push(`${label}: required email field falls below opening viewport`);
      if (metrics.rowWidths.length && Math.max(...metrics.rowWidths) - Math.min(...metrics.rowWidths) > 1) errors.push(`${label}: unequal engagement widths`);
      if (metrics.sections.some(section => section.paddingTop < 24 || section.paddingBottom < 24)) errors.push(`${label}: section separation is too small`);
      results.push({ path, width, ...metrics });
    }
    await context.close();
  }
} finally { await browser.close(); }
console.log(JSON.stringify({ results, errors }, null, 2));
if (errors.length) process.exitCode = 1;
