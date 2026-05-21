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

async function stubPlausible(page: Page) {
  await page.route('https://plausible.io/**', async (route) => {
    await route.fulfill({
      status: 204,
      body: '',
    });
  });
}

test.describe('Equilens site surfaces', () => {
  for (const pageEntry of pages) {
    test(`${pageEntry.path} renders nav and footer`, async ({ page }, testInfo) => {
      await stubPlausible(page);
      await page.goto(pageEntry.path, { waitUntil: 'networkidle' });

      await expect(page.locator('nav.site-nav')).toHaveCount(1);
      await expect(page.locator('footer.site-footer')).toHaveCount(1);
      await expect(page.locator('script[src="https://plausible.io/js/script.js"][data-domain="equilens.io"]')).toHaveCount(1);
      await expect(page.locator('footer.site-footer small')).toContainText('Last deploy');
      await expect(page.locator('a[href*="fl-bsa-pub/releases/tag"]')).toHaveCount(0);
      await expect(page.locator('a[href$="/manifest.json"]')).toHaveCount(0);
      await expect(page.locator('a[href$="/SHA256SUMS.txt"]')).toHaveCount(0);
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
      expect(title).toMatch(/Equilens|FL-BSA|Trust Center/i);

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
