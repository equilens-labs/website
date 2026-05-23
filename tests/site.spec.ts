import { expect, type Page, test } from '@playwright/test';
import fs from 'fs';
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
  },
  {
    file: 'legal/cookie-policy.html',
    title: 'Cookie Policy — Equilens',
    description: 'Cookie Policy for equilens.io. See /legal/#cookie-policy.',
  },
  {
    file: 'legal/imprint.html',
    title: 'Imprint — Equilens',
    description: 'Company information and imprint for Equilens. See /legal/#imprint.',
  },
  {
    file: 'legal/open-source.html',
    title: 'Open Source — Equilens',
    description: 'Open source information for Equilens. See /legal/#open-source.',
  },
  {
    file: 'legal/privacy.html',
    title: 'Privacy Notice — Equilens',
    description: 'Privacy Notice for equilens.io. See /legal/#privacy.',
  },
  {
    file: 'legal/tos.html',
    title: 'Website Terms — Equilens',
    description: 'Website Terms for equilens.io. See /legal/#terms-of-service.',
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
      expect(html).not.toContain('Redirecting to Legal…');
    });
  }

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
    expect(flbsa).toContain('<section class="section alt">\n          <div class="cta-row">');
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

  for (const pageEntry of pages) {
    test(`${pageEntry.path} renders nav and footer`, async ({ page }, testInfo) => {
      await stubPlausible(page);
      await page.goto(pageEntry.path, { waitUntil: 'networkidle' });

      await expect(page.locator('nav.site-nav')).toHaveCount(1);
      await expect(page.locator('nav.site-nav a.nav-link[href="/procurement/"]')).toHaveText('Procurement');
      await expect(page.locator('footer.site-footer')).toHaveCount(1);
      await expect(page.locator('script[src="https://plausible.io/js/script.outbound-links.file-downloads.js"][data-domain="equilens.io"]')).toHaveCount(1);
      await expect(page.locator('footer.site-footer small')).toContainText('Last deploy');
      const linkedInLink = page.locator('footer.site-footer a[href="https://www.linkedin.com/company/equilens-labs/"]');
      await expect(linkedInLink).toHaveCount(1);
      await expect(linkedInLink).toHaveAttribute('target', '_blank');
      await expect(linkedInLink).toHaveAttribute('rel', 'noopener noreferrer');
      const releaseTagLinks = page.locator('a[href*="fl-bsa-pub/releases/tag"]');
      const manifestLinks = page.locator('a[href$="/manifest.json"]');
      const checksumLinks = page.locator('a[href$="/SHA256SUMS.txt"]');
      const provenanceLinks = page.locator('a[href$="/PROVENANCE.md"]');
      if (pageEntry.path === '/trust-center/') {
        await expect(releaseTagLinks).toHaveCount(1);
        await expect(manifestLinks).toHaveCount(1);
        await expect(checksumLinks).toHaveCount(1);
        await expect(provenanceLinks).toHaveCount(1);
        await expect(page.getByRole('link', { name: 'Request Security Pack' })).toHaveAttribute(
          'href',
          '/contact/?interest=Security%20Pack&message=Please%20send%20the%20FL-BSA%20security%20pack%20and%20vendor%20questionnaire%20materials.',
        );
      } else {
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
        await expect(page.locator('.timeline .timeline-icon')).toHaveCount(4);
        await expect(page.getByRole('link', { name: 'Download Whitepaper Intake (ZIP)' })).toHaveAttribute(
          'href',
          'https://github.com/equilens-labs/fl-bsa-pub/releases/download/v5.0.0-rc8.4/WhitePaper_Intake_Bundle_v4.zip',
        );
        await expect(page.getByRole('link', { name: 'Download Demo GOLD Pack (ZIP)' })).toHaveAttribute(
          'href',
          'https://github.com/equilens-labs/fl-bsa-pub/releases/download/v5.0.0-rc8.4/gold_bundle.zip',
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
      await expect(page.locator('footer.site-footer small')).toContainText('Last deploy');
    });
  }
});
