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
    const procurement = fs.readFileSync(path.join(root, 'procurement', 'index.html'), 'utf-8');
    const contact = fs.readFileSync(path.join(root, 'contact', 'index.html'), 'utf-8');

    expect(css).not.toContain('.product-page--flbsa .section-block .lead {\n  color: var(--text-primary);\n  max-width: var(--measure-narrow);');
    expect(css).not.toContain('.product-page--flbsa .section-block .lead {\n  color: var(--text-primary);');
    expect(css).toContain('.section-block p {\n  text-align: left;\n  line-height: var(--leading-relaxed);');
    expect(css).toContain('.section-block {\n  background: rgba(255, 255, 255, 0.88);');
    expect(css).toContain('width: calc(100% - var(--space-8));');
    expect(css).toContain('.section-block code,\n.card code,\n.note code,\n.checks code,\n.evidence-chain-list code {');
    expect(css).toContain('.hero-highlights .card-hero {\n    display: grid;');
    expect(css).toContain('.contact-form-card h2 {\n  font-size: var(--text-2xl);');
    expect(css).toContain('.note.note--small {\n  color: var(--text-secondary);\n  font-size: var(--text-note);\n  font-style: normal;');
    expect(procurement).toContain('<title>Procurement &amp; Deployment — Equilens</title>');
    expect(procurement).toContain('<h1 class="hero-headline">Procurement &amp; Deployment</h1>');
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
    const codeWrap = await page.locator('.evidence-chain-list code').first().evaluate((element) => {
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
    const contactHeadingStyle = await page.locator('.contact-form-card h2').evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
      };
    });
    expect(contactHeadingStyle).toEqual({ fontSize: '24px', fontWeight: '600' });
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
    expect(css).toContain('--surface-glass-card-border: rgba(255, 255, 255, 0.5);');
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
    expect(css).toContain('.site-footer .footer-boundary {\n  max-width: var(--measure-default);\n  margin: var(--space-2) auto 0;\n  padding: 0 var(--space-4);\n  text-align: center;\n  color: var(--text-muted);');

    expect(flbsa).not.toContain('timeline-marker');
    expect(trustCenter).not.toContain('timeline-marker');
    expect(flbsa).toContain('<a class="btn btn-primary" href="/contact/">Request Assessment</a>\n        <a class="btn btn-secondary" href="/procurement/">Review Procurement</a>');
    expect(flbsa).toContain('<a class="btn btn-primary" href="/contact/">Request Access</a>\n                <a class="btn btn-secondary" href="/trust-center/">Review Trust Center</a>');
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

  test('brand token import is wired into live CSS aliases', async () => {
    const css = fs.readFileSync(path.join(root, 'assets', 'eql', 'base.css'), 'utf-8');

    expect(css).toContain('@import url("/brand/tokens/tokens.css");');
    expect(css).toContain('--color-primary: var(--eql-color-brand-500);');
    expect(css).toContain('--color-primary-hover: var(--eql-color-brand-700);');
    expect(css).toContain('--color-gray-900: var(--eql-color-ink-900);');
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
      await expect(page.locator('script[src="https://plausible.io/js/script.outbound-links.file-downloads.js"][data-domain="equilens.io"]')).toHaveCount(1);
      await expect(page.locator('footer.site-footer small:not(.footer-boundary)')).toContainText('Last deploy');
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
        await expect(page.getByRole('link', { name: 'Request Security Pack' })).toHaveAttribute(
          'href',
          '/contact/?interest=Security%20Pack&message=Please%20send%20the%20FL-BSA%20security%20pack%20and%20vendor%20questionnaire%20materials.',
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
        await expect(page.locator('.timeline .timeline-item')).toHaveCount(4);
        await expect(page.locator('.timeline .timeline-icon')).toHaveCount(0);
        await expect(page.getByRole('link', { name: 'Download Whitepaper Intake (ZIP)' })).toHaveAttribute(
          'href',
          'https://github.com/equilens-labs/fl-bsa-pub/releases/download/v5.0.0-rc9-public-fix-2724455/WhitePaper_Intake_Bundle_v4.zip',
        );
        await expect(page.getByRole('link', { name: 'Download Demo GOLD Pack (ZIP)' })).toHaveAttribute(
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
    await page.goto('/contact/?interest=Security%20Pack&message=Please%20send%20the%20FL-BSA%20security%20pack%20and%20vendor%20questionnaire%20materials.', { waitUntil: 'networkidle' });

    await expect(page.locator('#interest')).toHaveValue('Security Pack');
    await expect(page.locator('#message')).toHaveValue('Please send the FL-BSA security pack and vendor questionnaire materials.');
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
