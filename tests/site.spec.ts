import { expect, type Page, test } from '@playwright/test';
import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

type PageEntry = { path: string; slug: string };
type AnchorEntry = { url: string; slug: string };

const root = path.resolve(__dirname, '..');
const configPath = path.join(root, 'config', 'tests', 'playwright-pages.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8')) as {
  pages: PageEntry[];
  anchors?: AnchorEntry[];
};

const pages = config.pages;
const anchors = config.anchors ?? [];
const plausibleScriptSrc = 'https://plausible.io/js/script.tagged-events.outbound-links.file-downloads.js';
const nonTaggedPlausibleScript = ['script', 'outbound-links', 'file-downloads.js'].join('.');
const redirectMetadata = [
  {
    file: 'legal/accessibility.html',
    title: 'Accessibility — Equilens',
    description: 'Accessibility information for equilens.io. See /legal/#accessibility.',
    url: 'https://equilens.io/legal/#accessibility',
  },
  {
    file: 'legal/cookie-policy.html',
    title: 'Cookie Policy — Equilens',
    description: 'Cookie Policy for equilens.io. See /legal/#cookie-policy.',
    url: 'https://equilens.io/legal/#cookie-policy',
  },
  {
    file: 'legal/imprint.html',
    title: 'Imprint — Equilens',
    description: 'Company information and imprint for Equilens. See /legal/#imprint.',
    url: 'https://equilens.io/legal/#imprint',
  },
  {
    file: 'legal/open-source.html',
    title: 'Open Source — Equilens',
    description: 'Open source information for Equilens. See /legal/#open-source.',
    url: 'https://equilens.io/legal/#open-source',
  },
  {
    file: 'legal/privacy.html',
    title: 'Privacy Notice — Equilens',
    description: 'Privacy Notice for equilens.io. See /legal/#privacy.',
    url: 'https://equilens.io/legal/#privacy',
  },
  {
    file: 'legal/tos.html',
    title: 'Website Terms — Equilens',
    description: 'Website Terms for equilens.io. See /legal/#terms-of-service.',
    url: 'https://equilens.io/legal/#terms-of-service',
  },
];
const flbsaRedirectMetadata = [
  {
    file: 'docs/index.html',
    title: 'FL-BSA Documentation — Equilens',
    description: 'Documentation links for FL-BSA. See /fl-bsa/#docs.',
    url: 'https://equilens.io/fl-bsa/#docs',
  },
  {
    file: 'faq/index.html',
    title: 'FL-BSA FAQ — Equilens',
    description: 'Frequently asked questions for FL-BSA. See /fl-bsa/#faq.',
    url: 'https://equilens.io/fl-bsa/#faq',
  },
  {
    file: 'pricing/index.html',
    title: 'FL-BSA Licensing — Equilens',
    description: 'Licensing information for FL-BSA. See /fl-bsa/#pricing.',
    url: 'https://equilens.io/fl-bsa/#pricing',
  },
  {
    file: 'fl-bsa/faq/index.html',
    title: 'FL-BSA FAQ — Equilens',
    description: 'Frequently asked questions for FL-BSA. See /fl-bsa/#faq.',
    url: 'https://equilens.io/fl-bsa/#faq',
  },
  {
    file: 'fl-bsa/legal/index.html',
    title: 'FL-BSA Governance Evidence — Equilens',
    description: 'Governance evidence information for FL-BSA. See /fl-bsa/#compliance.',
    url: 'https://equilens.io/fl-bsa/#compliance',
  },
  {
    file: 'fl-bsa/pricing/index.html',
    title: 'FL-BSA Licensing — Equilens',
    description: 'Licensing information for FL-BSA. See /fl-bsa/#pricing.',
    url: 'https://equilens.io/fl-bsa/#pricing',
  },
];

async function stubPlausible(page: Page) {
  await page.route('https://plausible.io/**', async (route) => {
    await route.fulfill({
      status: 204,
      body: '',
    });
  });
}

test.describe('Equilens site surfaces', () => {
  for (const redirect of redirectMetadata) {
    test(`${redirect.file} preserves policy metadata while redirecting`, async () => {
      const html = fs.readFileSync(path.join(root, redirect.file), 'utf-8');

      expect(html).toContain(`<title>${redirect.title}</title>`);
      expect(html).toContain(`content="${redirect.description}"`);
      expect(html).toContain(`content="${redirect.title}"`);
      expect(html).toContain(`property="og:url" content="${redirect.url}"`);
      expect(html).toContain(`name="twitter:url" content="${redirect.url}"`);
      expect(html).not.toContain('Redirecting to Legal…');
    });
  }

  for (const redirect of flbsaRedirectMetadata) {
    test(`${redirect.file} preserves FL-BSA metadata while redirecting`, async () => {
      const html = fs.readFileSync(path.join(root, redirect.file), 'utf-8');

      expect(html).toContain(`<title>${redirect.title}</title>`);
      expect(html).toContain(`content="${redirect.description}"`);
      expect(html).toContain(`content="${redirect.title}"`);
      expect(html).toContain(`property="og:url" content="${redirect.url}"`);
      expect(html).toContain(`name="twitter:url" content="${redirect.url}"`);
      expect(html).not.toContain('Redirecting to FL-BSA');
    });
  }

  test('404 page is noindex and keeps footer heading inside the footer', async () => {
    const html = fs.readFileSync(path.join(root, '404.html'), 'utf-8');

    expect(html).toContain('<meta name="referrer" content="strict-origin-when-cross-origin">');
    expect(html).toContain('<meta name="robots" content="noindex">');
    expect(html).toContain('<footer class="site-footer" data-sync="footer" role="contentinfo" aria-labelledby="site-sections-heading">');
    expect(html).toContain('<h2 class="sr-only" id="site-sections-heading">Site sections</h2>');
    expect(html).not.toContain('</main>\n\n  <h2 class="sr-only">Site sections</h2>');
  });

  test('public indexing transform keeps 404 pages out of search indexes', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'eql-indexing-'));
    try {
      const scriptDir = path.join(tempRoot, 'scripts', 'seo');
      fs.mkdirSync(scriptDir, { recursive: true });
      fs.copyFileSync(path.join(root, 'scripts', 'seo', 'set-indexing.py'), path.join(scriptDir, 'set-indexing.py'));
      fs.writeFileSync(
        path.join(tempRoot, 'index.html'),
        '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex, nofollow"><title>Home</title></head><body></body></html>',
      );
      fs.writeFileSync(
        path.join(tempRoot, '404.html'),
        '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex"><title>Not found</title></head><body></body></html>',
      );

      execFileSync('python3', [path.join(scriptDir, 'set-indexing.py'), 'public'], {
        cwd: tempRoot,
        stdio: 'pipe',
      });

      const publicHome = fs.readFileSync(path.join(tempRoot, 'index.html'), 'utf-8');
      const public404 = fs.readFileSync(path.join(tempRoot, '404.html'), 'utf-8');

      expect(publicHome).not.toContain('name="robots"');
      expect(public404).toContain('<meta name="robots" content="noindex">');
      expect(public404).not.toContain('noindex, nofollow');
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  test('Tier 2 visual consistency fixes stay in place', async () => {
    const css = fs.readFileSync(path.join(root, 'assets', 'eql', 'base.css'), 'utf-8');
    const flbsa = fs.readFileSync(path.join(root, 'fl-bsa', 'index.html'), 'utf-8');
    const procurement = fs.readFileSync(path.join(root, 'procurement', 'index.html'), 'utf-8');
    const contact = fs.readFileSync(path.join(root, 'contact', 'index.html'), 'utf-8');
    const trustCenter = fs.readFileSync(path.join(root, 'trust-center', 'index.html'), 'utf-8');

    expect(css).not.toContain('.product-page--flbsa .section-block .lead {\n  color: var(--text-primary);\n  max-width: var(--measure-narrow);');
    expect(css).not.toContain('.product-page--flbsa .section-block .lead {\n  color: var(--text-primary);');
    expect(css).toContain('.section-block p {\n  text-align: left;\n  line-height: var(--leading-relaxed);');
    // Normalization: panels are solid white (the 0.88-alpha wash is gone).
    expect(css).toContain('.section-block {\n  background: var(--color-white);');
    expect(css).toContain('width: calc(100% - var(--space-8));');
    // Evidence lists are plain .checks now; code chips must still wrap.
    expect(css).toContain('.section-block code,\n.card code,\n.note code,\n.checks code {');
    expect(css).toContain('code {\n  background: var(--bg-subtle);');
    // One uniform card everywhere: bordered, centered content, icon above the
    // title (founder rule 2026-07-15) — no borderless or left-grid variants.
    expect(css).toContain('display: flex;\n  flex-direction: column;\n  align-items: center;\n  height: 100%;\n  text-align: center;\n}');
    expect(css).not.toContain('.card--plain');
    // Contact form heading follows the panel h2 scale; the form itself is the
    // width-constrained element.
    expect(css).toContain('.contact-form {\n  display: flex;\n  flex-direction: column;\n  gap: var(--space-5);\n  width: 100%;\n  max-width: var(--max-width-2xl);');
    // Product name always renders in the accent color, semibold (founder rule
    // 2026-07-15); consistency of wrapping enforced by
    // scripts/ops/check_product_name.py in content lint.
    expect(css).toContain('.product-name {\n  color: var(--color-primary-text);\n  font-weight: var(--font-semibold);');
    expect(css).toContain('abbr {\n  text-decoration: none;\n  font-variant-caps: all-small-caps;\n  letter-spacing: var(--tracking-wide);\n  font-weight: var(--font-semibold);');
    expect(css).toContain('.note {\n  font-size: var(--text-note);\n  color: var(--text-muted);\n  font-style: normal;');
    // note--small was a no-op restatement of .note; the variant is deleted
    // outright, so no rogue note styling can reappear under that class.
    expect(css).not.toContain('.note.note--small');
    // Form notes must not draw the footnote divider (it misfired mid-form on
    // /contact/); panel and card notes keep it, and the form rule explicitly
    // disables it so the panel-note rule cannot reintroduce it.
    expect(css).toContain('.section-block .note,\n.card .note {\n  border-top: 1px solid var(--border-light);\n  color: var(--text-muted);');
    expect(css).toContain('.contact-form .note {\n  border-top: none;\n  padding-top: 0;');
    expect(css).not.toContain('.policy .section-block .note {\n  background: linear-gradient');
    expect(css).not.toContain('font-style: italic;');
    expect(flbsa).toContain('<strong>Access request:</strong>');
    expect(flbsa).toContain('<strong>Data boundary:</strong>');
    expect(flbsa).toContain('<strong>Marketplace access:</strong>');
    expect(procurement).toContain('<title>Procurement &amp; Deployment — Equilens</title>');
    expect(procurement).toContain('<h1 class="hero-headline">Procurement &amp; Deployment</h1>');
    expect(procurement).toContain('<strong>Evidence manifest:</strong>');
    expect(procurement).toContain('<strong>Commercial terms:</strong>');
    expect(trustCenter).toContain('<strong>Image signing:</strong>');
    expect(trustCenter).toContain('<strong>Privilege boundary:</strong>');
    expect(trustCenter).toContain('<strong>Public technical-proof reference:</strong>');
    expect(trustCenter).toContain('<strong>Demo-artifact boundary:</strong>');
    expect(procurement).not.toContain('<h1 class="brand-title">Procurement &amp; Deployment</h1>');
    expect(procurement).not.toContain('Procurement &amp; Deployment — Equilens FL-BSA');
    expect((procurement.match(/<div class="section-block">/g) ?? []).length).toBeGreaterThanOrEqual(4);
    expect(contact).toContain('<body class="eql">');
    expect(contact).not.toContain('<body class="eql landing">');
  });

  test('visual system primitives render consistently across breakpoints', async ({ page }) => {
    await stubPlausible(page);

    await page.setViewportSize({ width: 390, height: 1000 });
    await page.goto('/procurement/', { waitUntil: 'networkidle' });
    const mobileSectionBlock = page.locator('.section-block').first();
    const mobileSectionBox = await mobileSectionBlock.boundingBox();
    expect(mobileSectionBox?.x).toBeGreaterThanOrEqual(15);
    expect(mobileSectionBox?.width).toBeLessThanOrEqual(360);
    await expect(page.locator('h1.hero-headline')).toHaveText('Procurement & Deployment');

    await page.goto('/fl-bsa/', { waitUntil: 'networkidle' });
    const heroHighlightsBox = await page.locator('.hero-highlights').boundingBox();
    expect(heroHighlightsBox?.height).toBeLessThan(430);

    await page.setViewportSize({ width: 820, height: 1100 });
    await page.goto('/trust-center/', { waitUntil: 'networkidle' });
    const codeWrap = await page.locator('#evidence-chain .checks code').first().evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        overflowWrap: style.overflowWrap,
        wordBreak: style.wordBreak,
      };
    });
    expect(codeWrap).toEqual({ overflowWrap: 'anywhere', wordBreak: 'break-word' });
    const tabletOverflow = await page.evaluate(() =>
      Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) -
      document.documentElement.clientWidth
    );
    expect(tabletOverflow).toBeLessThanOrEqual(1);

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/contact/', { waitUntil: 'networkidle' });
    // The contact heading now uses the one documented panel-h2 scale
    // (40px/600 at desktop) instead of a page-local 24px card size.
    const contactHeadingStyle = await page.locator('.section-block h2').evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
      };
    });
    expect(contactHeadingStyle).toEqual({ fontSize: '40px', fontWeight: '600' });
  });

  test('Tier 3 token and CTA polish stays in place', async () => {
    const css = fs.readFileSync(path.join(root, 'assets', 'eql', 'base.css'), 'utf-8');
    const home = fs.readFileSync(path.join(root, 'index.html'), 'utf-8');
    const flbsa = fs.readFileSync(path.join(root, 'fl-bsa', 'index.html'), 'utf-8');
    const trustCenter = fs.readFileSync(path.join(root, 'trust-center', 'index.html'), 'utf-8');
    const procurement = fs.readFileSync(path.join(root, 'procurement', 'index.html'), 'utf-8');
    const docs = fs.readFileSync(path.join(root, 'docs', 'index.html'), 'utf-8');
    const faq = fs.readFileSync(path.join(root, 'faq', 'index.html'), 'utf-8');
    const pricing = fs.readFileSync(path.join(root, 'pricing', 'index.html'), 'utf-8');

    expect(css).toContain('--text-note: 0.8125rem;');
    // Glass surfaces stay tokenized (the card-glass variant was deleted; the
    // navbar keeps the slate-tinted glass border token).
    expect(css).toContain('--surface-glass-border: rgba(226, 232, 240, 0.5);');
    expect(css).not.toContain('border: 1px solid rgba(255, 255, 255, 0.5)');
    expect(css).not.toContain('border: 1px solid rgba(229, 231, 235, 1)');
    expect(css).not.toContain('border-color: rgba(229, 231, 235, 1)');
    expect(css).not.toContain('gap: 8px;');
    expect(css).not.toContain('gap: 1.5rem;');
    expect(css).not.toContain('rgba(79, 70, 229, 0.35)');
    expect(css).not.toContain('rgba(79, 70, 229, 0.4)');
    expect(css).not.toContain('.timeline-marker');

    expect(home).toContain('<small class="footer-boundary">Product boundary: FL-BSA');
    expect(home).not.toContain('<p class="footer-boundary">');
    expect(home).not.toContain('<strong>Product boundary:</strong>');
    expect(home).not.toContain('footer-boundary"><span class="product-name">');
    expect(home.indexOf('Last deploy: stamped during publishing.')).toBeLessThan(home.indexOf('<small class="footer-boundary">Product boundary: FL-BSA'));

    // Footer SSOT template must keep emitting the labeled heading and the
    // product-boundary disclaimer, so sync_footer_ssot.py cannot strip them.
    const footerTemplate = fs.readFileSync(path.join(root, 'templates', 'footer.html'), 'utf-8');
    const footerConfig = fs.readFileSync(path.join(root, 'config', 'web', 'footer.json'), 'utf-8');
    expect(footerTemplate).toContain('aria-labelledby="site-sections-heading"');
    expect(footerTemplate).toContain('<h2 class="sr-only" id="site-sections-heading">Site sections</h2>');
    expect(footerTemplate).toContain('<small class="footer-boundary">{{boundary}}</small>');
    expect(JSON.parse(footerConfig).boundary_note).toContain('Product boundary: FL-BSA is a customer-hosted, simulation-only evidence appliance.');
    expect(css).toContain('.site-footer .footer-boundary {\n  max-width: var(--measure-default);\n  margin: var(--space-2) auto 0;\n  padding: 0 var(--space-4);\n  text-align: center;\n  color: var(--text-muted);');

    expect(flbsa).not.toContain('timeline-marker');
    expect(trustCenter).not.toContain('timeline-marker');
    expect(flbsa).toContain('<a class="btn btn-primary plausible-event-name=Request+Pack plausible-event-surface=fl-bsa plausible-event-cta=pricing-primary plausible-event-intent=readiness plausible-event-offer_stage=pack" href="/contact/?interest=Procurement%20Pack">Request the pack</a>\n        <a class="btn btn-secondary plausible-event-name=Procurement+Review+Click plausible-event-surface=fl-bsa plausible-event-cta=pricing-secondary plausible-event-intent=procurement" href="/procurement/">Review procurement</a>');
    expect(flbsa).toContain('<a class="btn btn-primary plausible-event-name=Request+Pack plausible-event-surface=fl-bsa plausible-event-cta=docs-request-pack plausible-event-intent=readiness plausible-event-offer_stage=pack" href="/contact/?interest=Procurement%20Pack">Request the pack</a>\n                <a class="btn btn-secondary" href="/trust-center/">Review Trust Center</a>');
    expect(procurement).toContain('Review <span class="product-name">FL-BSA</span>');
    expect(docs).toContain('<span class="product-name">FL-BSA</span> Documentation');
    expect(faq).toContain('<span class="product-name">FL-BSA</span> FAQ');
    expect(pricing).toContain('<span class="product-name">FL-BSA</span> Licensing');
  });

  test('FL-BSA metadata preserves the canonical appliance descriptor', async () => {
    const html = fs.readFileSync(path.join(root, 'fl-bsa', 'index.html'), 'utf-8');

    expect(html).toContain('<title>FL-BSA — Self-Hosted Fair-Outcomes Evidence Appliance</title>');
    expect(html).toContain('Self-hosted fair-outcomes evidence appliance for regulated credit decisions');
    expect(html).not.toContain('Self-hosted fair-outcomes evidence for regulated credit decisions:');
  });

  test('Plausible CTA events stay aggregate and non-PII', async () => {
    const flbsa = fs.readFileSync(path.join(root, 'fl-bsa', 'index.html'), 'utf-8');
    const procurement = fs.readFileSync(path.join(root, 'procurement', 'index.html'), 'utf-8');
    const trustCenter = fs.readFileSync(path.join(root, 'trust-center', 'index.html'), 'utf-8');
    const contact = fs.readFileSync(path.join(root, 'contact', 'index.html'), 'utf-8');
    const whitepaper = fs.readFileSync(path.join(root, 'fl-bsa', 'whitepaper', 'index.html'), 'utf-8');
    const legal = fs.readFileSync(path.join(root, 'legal', 'index.html'), 'utf-8');
    const trackedHtml = [flbsa, procurement, trustCenter, contact, whitepaper].join('\n');

    expect(trackedHtml).toContain('plausible-event-name=Request+Pack');
    expect(trackedHtml).toContain('plausible-event-name=Security+Pack+Click');
    expect(trackedHtml).toContain('plausible-event-name=Procurement+Review+Click');
    expect(trackedHtml).toContain('plausible-event-name=Proof+Asset+Click');
    expect(trackedHtml).toContain('plausible-event-name=Contact+Email+Click');
    expect(trackedHtml).toContain('plausible-event-surface=');
    expect(trackedHtml).toContain('plausible-event-cta=');
    expect(trackedHtml).toContain('plausible-event-intent=');
    expect(trackedHtml).not.toContain('message=');
    expect(trackedHtml).not.toContain('plausible-event-email=');
    expect(trackedHtml).not.toContain('plausible-event-name-field=');
    expect(trackedHtml).not.toContain('plausible-event-organisation=');
    expect(trackedHtml).not.toContain('plausible-event-message=');
    expect(trackedHtml).not.toContain('plausible-event-route=');
    expect(contact).not.toContain('plausible-event-name=Contact+Form+Submit');
    expect(legal).toContain('selected static CTA/custom-event labels');
    expect(legal).toContain('We do not track form submissions or form contents');
  });

  test('tracked HTML pages load Plausible tagged-events script variant', async () => {
    const trackedHtmlFiles = execFileSync('git', ['ls-files', '*.html'], {
      cwd: root,
      encoding: 'utf-8',
    })
      .trim()
      .split('\n')
      .filter(Boolean);

    const trackedHtmlPages = trackedHtmlFiles
      .map((file) => ({
        file,
        html: fs.readFileSync(path.join(root, file), 'utf-8'),
      }))
      .filter(({ html }) => /<html[\s>]/i.test(html));

    expect(trackedHtmlPages.length).toBeGreaterThan(0);

    for (const { file, html } of trackedHtmlPages) {
      expect(html, file).toContain(`src="${plausibleScriptSrc}"`);
      expect(html, file).not.toContain(nonTaggedPlausibleScript);
    }
  });

  test('high-content pages preserve section banding rhythm', async () => {
    const flbsa = fs.readFileSync(path.join(root, 'fl-bsa', 'index.html'), 'utf-8');
    const trustCenter = fs.readFileSync(path.join(root, 'trust-center', 'index.html'), 'utf-8');

    expect(flbsa).toContain('<section class="section alt" id="pricing">');
    expect(flbsa).toContain('<section class="section alt" id="docs">');
    expect(flbsa).toMatch(/<section class="section alt">[\s\S]*<div class="cta-row">/);
    expect(trustCenter).toContain('<section class="section alt" aria-label="Security review next steps">');
  });

  test('home and FL-BSA hero cards share the hero-highlights wrapper', async () => {
    const home = fs.readFileSync(path.join(root, 'index.html'), 'utf-8');
    const flbsa = fs.readFileSync(path.join(root, 'fl-bsa', 'index.html'), 'utf-8');

    expect(home).toContain('class="hero-highlights grid grid-3 mt-6"');
    expect(flbsa).toContain('class="hero-highlights grid grid-3"');
  });

  test('homepage title carries the algorithmic-compliance positioning', async ({ page }) => {
    await stubPlausible(page);
    await page.goto('/', { waitUntil: 'networkidle' });

    await expect(page).toHaveTitle('Equilens — Algorithmic Compliance');
  });

  test('homepage source ships the static nav and contact path without JS', async () => {
    const home = fs.readFileSync(path.join(root, 'index.html'), 'utf-8');

    expect(home).toContain('href="/contact/"');
    expect(home).toContain('class="navbar site-nav"');
    expect(home).toContain('Algorithmic Compliance');
  });

  test('footer Company column links to Contact on home and FL-BSA', async () => {
    for (const file of ['index.html', path.join('fl-bsa', 'index.html')]) {
      const html = fs.readFileSync(path.join(root, file), 'utf-8');
      const companyStart = html.indexOf('<section><h3>Company</h3><ul>');
      expect(companyStart, file).toBeGreaterThan(-1);
      const companyColumn = html.slice(companyStart, html.indexOf('</ul></section>', companyStart));
      expect(companyColumn, file).toContain('<li><a href="/contact/">Contact</a></li>');
    }
  });

  test('brand token import is wired into live CSS aliases', async () => {
    const css = fs.readFileSync(path.join(root, 'assets', 'eql', 'base.css'), 'utf-8');

    expect(css).toContain('@import url("/brand/tokens/tokens.css");');
    expect(css).toContain('--color-primary: var(--eql-color-brand-500);');
    expect(css).toContain('--color-primary-hover: var(--eql-color-brand-700);');
    // The unused gray ramp was deleted; primary text is wired to the brand
    // ink token (slate-900), so brand ink actually renders.
    expect(css).toContain('--text-primary: var(--eql-color-ink-900);');
  });

  test('mobile section headings use the compact section scale without emergency wrapping', async ({ page }) => {
    await stubPlausible(page);
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto('/fl-bsa/#docs', { waitUntil: 'networkidle' });

    const heading = page.locator('#docs h2');
    await expect(heading).toHaveText('Documentation');

    const metrics = await heading.evaluate((element) => {
      const styles = window.getComputedStyle(element);
      const lineHeight = parseFloat(styles.lineHeight);
      const height = element.getBoundingClientRect().height;

      return {
        fontSize: styles.fontSize,
        lineCount: height / lineHeight,
        overflowWrap: styles.overflowWrap,
      };
    });

    expect(metrics.fontSize).toBe('28px');
    expect(metrics.overflowWrap).toBe('normal');
    expect(metrics.lineCount).toBeLessThan(1.2);
  });

  for (const pageEntry of pages) {
    test(`${pageEntry.path} renders nav and footer`, async ({ page }, testInfo) => {
      await stubPlausible(page);
      await page.goto(pageEntry.path, { waitUntil: 'networkidle' });

      await expect(page.locator('nav.site-nav')).toHaveCount(1);
      await expect(page.locator('nav.site-nav a.nav-link[href="/procurement/"]')).toHaveText('Procurement');
      await expect(page.locator('footer.site-footer')).toHaveCount(1);
      await expect(page.locator(`script[src="${plausibleScriptSrc}"][data-domain="equilens.io"]`)).toHaveCount(1);
      await expect(page.locator('footer.site-footer small:not(.footer-boundary)')).toContainText('Last deploy');
      await expect(page.locator('footer.site-footer small.footer-boundary')).toContainText(
        'Product boundary: FL-BSA is a customer-hosted, simulation-only evidence appliance.',
      );
      await expect(page.locator('footer.site-footer h2#site-sections-heading')).toHaveCount(1);
      const linkedInLink = page.locator('footer.site-footer a[href="https://www.linkedin.com/company/equilens-labs/"]');
      await expect(linkedInLink).toHaveCount(1);
      await expect(linkedInLink).toHaveAttribute('target', '_blank');
      await expect(linkedInLink).toHaveAttribute('rel', 'noopener noreferrer');
      const releaseTagLinks = page.locator('a[href*="fl-bsa-pub/releases/tag"]');
      const manifestLinks = page.locator('a[href$="/manifest.json"]');
      const checksumLinks = page.locator('a[href$="/SHA256SUMS.txt"]');
      const provenanceLinks = page.locator('a[href$="/PROVENANCE.md"]');
      if (pageEntry.path === '/trust-center/' || pageEntry.path === '/fl-bsa/whitepaper/') {
        await expect(releaseTagLinks).toHaveCount(1);
        await expect(manifestLinks).toHaveCount(1);
        await expect(checksumLinks).toHaveCount(1);
        await expect(provenanceLinks).toHaveCount(1);
      }
      if (pageEntry.path === '/trust-center/') {
        await expect(page.getByRole('link', { name: 'Request security pack' }).first()).toHaveAttribute(
          'href',
          '/contact/?interest=Security%20Pack',
        );
      } else if (pageEntry.path !== '/fl-bsa/whitepaper/') {
        await expect(releaseTagLinks).toHaveCount(0);
        await expect(manifestLinks).toHaveCount(0);
        await expect(checksumLinks).toHaveCount(0);
        await expect(provenanceLinks).toHaveCount(0);
      }
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
      expect(title).toMatch(/Equilens|FL-BSA|Trust Center/i);
      const horizontalOverflow = await page.evaluate(() =>
        Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) -
        document.documentElement.clientWidth
      );
      expect(horizontalOverflow).toBeLessThanOrEqual(1);

      if (pageEntry.path === '/fl-bsa/') {
        // How-it-works folded from the bespoke .timeline into the shared
        // card + number-badge grammar: still four steps, no legacy markup.
        await expect(page.locator('#how-it-works .card')).toHaveCount(4);
        await expect(page.locator('#how-it-works .badge-number')).toHaveCount(4);
        await expect(page.locator('.timeline')).toHaveCount(0);
        await expect(page.getByRole('link', { name: 'Download whitepaper intake (ZIP)' })).toHaveAttribute(
          'href',
          'https://github.com/equilens-labs/fl-bsa-pub/releases/download/v5.0.0-rc9-public-fix-2724455/WhitePaper_Intake_Bundle_v4.zip',
        );
        await expect(page.getByRole('link', { name: 'Download demo GOLD pack (ZIP)' })).toHaveAttribute(
          'href',
          'https://github.com/equilens-labs/fl-bsa-pub/releases/download/v5.0.0-rc9-public-fix-2724455/gold_bundle.zip',
        );
      }

      const screenshotFile = `${pageEntry.slug}-${testInfo.project.name}.png`;
      const screenshotPath = testInfo.outputPath(screenshotFile);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      testInfo.attachments.push({
        name: screenshotFile,
        path: screenshotPath,
        contentType: 'image/png',
      });
    });
  }

  test('contact query parameters prefill security review enquiry', async ({ page }) => {
    await stubPlausible(page);
    await page.goto('/contact/?interest=Security%20Pack', { waitUntil: 'networkidle' });

    await expect(page.locator('#interest')).toHaveValue('Security Pack');
    await expect(page.locator('#message')).toHaveValue('Please send the FL-BSA security pack and vendor questionnaire materials.');
  });

  test('contact query parameters prefill procurement pack enquiry', async ({ page }) => {
    await stubPlausible(page);
    await page.goto('/contact/?interest=Procurement%20Pack', { waitUntil: 'networkidle' });

    await expect(page.locator('#interest')).toHaveValue('Procurement Pack');
    await expect(page.locator('#message')).toHaveValue('Please send the FL-BSA buyer and procurement pack and help scope a readiness conversation.');
  });

  for (const anchor of anchors) {
    test(`anchor ${anchor.url} is reachable`, async ({ page }) => {
      await stubPlausible(page);
      await page.goto(anchor.url, { waitUntil: 'networkidle' });
      const hashIndex = anchor.url.indexOf('#');
      if (hashIndex !== -1) {
        const hash = anchor.url.slice(hashIndex + 1);
        await expect(page.locator(`#${hash}`)).toBeVisible();
      }
      await expect(page.locator('footer.site-footer small:not(.footer-boundary)')).toContainText('Last deploy');
    });
  }
});
