import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const tag = process.env.PLAYWRIGHT_AUDIT_TAG ?? 'PLAYWRIGHT-AUDIT';
const stamp =
  process.env.PLAYWRIGHT_AUDIT_STAMP ??
  new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '') + 'Z';

const auditDir = path.join('output/ops', `${tag}-${stamp}`);
const artifactsDir = path.join(auditDir, 'artifacts');
fs.mkdirSync(artifactsDir, { recursive: true });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['json', { outputFile: path.join(auditDir, 'report.json') }],
  ],
  outputDir: artifactsDir,
  timeout: 60_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: process.env.EQL_BASE_URL || 'http://localhost:8000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'chromium-mobile',
      use: {
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'chromium-tablet-768',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: 'chromium-tablet-1024',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1024, height: 1366 },
      },
    },
  ],
});
