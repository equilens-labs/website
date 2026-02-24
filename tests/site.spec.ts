import { expect, test } from '@playwright/test';
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

test.describe('Equilens site surfaces', () => {
  for (const pageEntry of pages) {
    test(`${pageEntry.path} renders nav and footer`, async ({ page }, testInfo) => {
      await page.goto(pageEntry.path, { waitUntil: 'networkidle' });

      await expect(page.locator('nav.site-nav')).toHaveCount(1);
      await expect(page.locator('footer.site-footer')).toHaveCount(1);
      await expect(page.locator('footer.site-footer small')).toContainText('Last deploy');
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
      expect(title).toMatch(/Equilens|FL-BSA|Trust Center/i);

      if (pageEntry.path === '/fl-bsa/') {
        await expect(page.locator('.timeline .timeline-item')).toHaveCount(4);
        await expect(page.locator('.timeline .timeline-icon')).toHaveCount(4);
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
