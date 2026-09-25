import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test as baseTest } from '@playwright/test';
import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

type PageEntry = { path: string; slug: string };
type AnchorEntry = { url: string; slug: string };

const root = path.resolve(__dirname, '..');
// The audit is local-only even when invoked directly rather than through npm test.
// Install this before the test receives its Page, so no initial navigation can
// reach a real form, analytics collector, or other external service.
const test = baseTest.extend({
  page: async ({ page, context, baseURL }, use, testInfo) => {
    const origin = new URL(baseURL || 'http://localhost:8000');
    if (origin.protocol !== 'http:' || !['localhost', '127.0.0.1', '[::1]'].includes(origin.hostname)) {
      throw new Error(`Website tests require a loopback HTTP server, received ${origin.origin}`);
    }
    const receipt = { localReads: 0, blockedExternal: 0, blockedWrites: 0, externalPassThrough: 0 };
    await context.route('**/*', async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      if (url.origin === origin.origin && ['GET', 'HEAD'].includes(request.method())) {
        receipt.localReads += 1;
        await route.continue();
      } else if (url.protocol === 'data:' || url.protocol === 'blob:') {
        await route.continue();
      } else {
        if (!['GET', 'HEAD'].includes(request.method())) receipt.blockedWrites += 1;
        else receipt.blockedExternal += 1;
        await route.abort('blockedbyclient');
      }
    });
    await use(page);
    await testInfo.attach('local-network-boundary', {
      body: JSON.stringify(receipt, null, 2), contentType: 'application/json',
    });
  },
});
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
      status: 200,
      contentType: 'application/javascript',
      body: `window.__auditEvents = [];
        window.plausible = (name, options) => window.__auditEvents.push({name, props: options?.props || {}});
        // Model the documented tagged-form integration as well as direct calls,
        // so leaving the old form tag in place exposes duplicate/bot attempts.
        document.addEventListener('submit', (event) => {
          const tag = [...event.target.classList].find(c => c.startsWith('plausible-event-name='));
          if (tag) window.plausible(tag.split('=').slice(1).join('=').replaceAll('+', ' '));
        });`,
    });
  });
}

async function mockForm(page: Page, status = 200) {
  const requests: Record<string, unknown>[] = [];
  await page.route('https://submit-form.com/**', async (route) => {
    const request = route.request();
    if (request.method() === 'POST') requests.push(request.postDataJSON());
    await route.fulfill({
      status: request.method() === 'OPTIONS' ? 204 : status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Accept',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
      },
      contentType: 'application/json', body: request.method() === 'OPTIONS' ? '' : '{}',
    });
  });
  return requests;
}

async function fillRequiredContactFields(page: Page) {
  await page.locator('#name').fill('Local audit fixture');
  await page.locator('#email').fill('audit@example.invalid');
}

async function recordedEvents(page: Page) {
  return page.evaluate(() => (window as unknown as {
    __auditEvents: { name: string; props: Record<string, string> }[];
  }).__auditEvents);
}

// Read the limited entity vocabulary in these source fixtures in one pass.
// Chained replacements could incorrectly decode an encoded entity twice.
const textEntities: Record<string, string> = {
  '&amp;': '&', '&nbsp;': ' ', '&#39;': "'", '&#x27;': "'", '&apos;': "'", '&quot;': '"',
};
const visibleText = (html: string) => html
  .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<!--([\s\S]*?)-->/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&(?:amp|nbsp|apos|quot|#39|#x27);/g, entity => textEntities[entity])
  .replace(/\s+/g, ' ').trim();

async function expectNoOverflow(page: Page) {
  expect(await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth)
    - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
}

type CapturedSubmission = {
  subject: string | null;
  payload: Record<string, unknown>;
};

async function submitAndReadSubmission(page: Page): Promise<CapturedSubmission> {
  // A persistent context guard already blocks the endpoint before navigation;
  // this page-specific response supplies the explicit local success fixture.
  await mockForm(page);
  await fillRequiredContactFields(page);
  const [request] = await Promise.all([
    page.waitForRequest(
      (candidate) =>
        candidate.url().startsWith('https://submit-form.com/') && candidate.method() === 'POST',
    ),
    page.locator('#contact-form button[type="submit"]').click(),
  ]);
  const payload = (request.postDataJSON() ?? {}) as Record<string, unknown>;
  const emailMeta = (payload._email ?? {}) as { subject?: string };
  await expect(page.locator('#form-status')).toContainText(/sent|received/i);
  await expect(page.locator('#contact-form button[type="submit"]')).toBeDisabled();
  expect(request.headers()['content-type']).toContain('application/json');
  return { subject: emailMeta.subject ?? null, payload };
}

async function submitAndReadSubject(page: Page) {
  return (await submitAndReadSubmission(page)).subject;
}

test.describe('Equilens site surfaces', () => {
  for (const entry of pages) {
    test(`${entry.slug} passes axe (no critical or serious violations)`, async ({ page }) => {
      await stubPlausible(page);
      await page.goto(entry.path, { waitUntil: 'networkidle' });
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      const blocking = results.violations.filter(
        (violation) => violation.impact === 'critical' || violation.impact === 'serious',
      );
      expect(blocking.map((violation) => `${violation.id}: ${violation.nodes.length} node(s)`)).toEqual([]);
    });
  }

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

  test('buyer-critical product boundaries survive presentation changes', async () => {
    for (const file of ['index.html', 'fl-bsa/index.html', 'procurement/index.html', 'trust-center/index.html', 'contact/index.html']) {
      const text = visibleText(fs.readFileSync(path.join(root, file), 'utf-8'));
      expect(text, file).toContain('customer-hosted, simulation-only evidence appliance');
      expect(text, file).toMatch(/does not make or override live lending decisions/i);
      expect(text, file).toMatch(/does not[^.]*provide legal advice[^.]*certify regulatory compliance/i);
      expect(text, file).not.toMatch(/ensures? compliance|guarantees? regulatory approval|click subscribe|production-grade appliance/i);
    }
  });

  test('dense buyer pages remain readable without horizontal overflow', async ({ page }) => {
    await stubPlausible(page);
    for (const width of [375, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const route of ['/procurement/', '/trust-center/', '/contact/']) {
        await page.goto(route, { waitUntil: 'networkidle' });
        await expectNoOverflow(page);
        await expect(page.getByRole('main')).toHaveCount(1);
        await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
        const textBoxes = await page.locator('main p').evaluateAll(elements => elements
          .filter(e => (e.textContent || '').trim().length > 240 && e.getBoundingClientRect().width > 0)
          .map(e => ({ width: e.getBoundingClientRect().width, fontSize: parseFloat(getComputedStyle(e).fontSize) })));
        for (const box of textBoxes) expect(box.width / box.fontSize).toBeLessThanOrEqual(50);
      }
    }
  });

  test('shared footer keeps its accessible name, deployment marker and product boundary', async ({ page }) => {
    await stubPlausible(page);
    await page.goto('/', { waitUntil: 'networkidle' });
    const footer = page.getByRole('contentinfo');
    await expect(footer).toHaveAccessibleName('Site sections');
    await expect(footer).toContainText('Last deploy');
    await expect(footer).toContainText('Product boundary: FL-BSA is a customer-hosted, simulation-only evidence appliance.');
    await expect(footer.getByRole('link', { name: 'Contact', exact: true })).toHaveAttribute('href', '/contact/');
    const template = fs.readFileSync(path.join(root, 'templates/footer.html'), 'utf-8');
    const config = JSON.parse(fs.readFileSync(path.join(root, 'config/web/footer.json'), 'utf-8'));
    expect(template).toContain('{{boundary}}');
    expect(config.boundary_note).toMatch(/customer-hosted, simulation-only/);
  });

  test('FL-BSA metadata carries consistent identity and the simulation boundary', async ({ page }) => {
    await stubPlausible(page);
    await page.goto('/fl-bsa/', { waitUntil: 'networkidle' });
    const pageTitle = 'Fair-outcomes evidence for automated credit decisions | FL-BSA by Equilens';
    await expect(page).toHaveTitle(pageTitle);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', pageTitle);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', pageTitle);
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toMatch(/self-hosted/i);
    expect(description).toMatch(/simulation/i);
    expect(description).toMatch(/synthetic/i);
    expect(description).toMatch(/pre-release/i);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', description!);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', description!);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://equilens.io/fl-bsa/');
    const structured = JSON.parse((await page.locator('script[type="application/ld+json"]').first().textContent())!);
    expect(structured['@graph']).toEqual(expect.arrayContaining([
      expect.objectContaining({ '@type': 'SoftwareApplication', name: 'FL-BSA' }),
    ]));
  });

  test('regulatory dates and product limits remain bounded after copy changes', async () => {
    const home = visibleText(fs.readFileSync(path.join(root, 'index.html'), 'utf-8'));
    const flbsa = visibleText(fs.readFileSync(path.join(root, 'fl-bsa/index.html'), 'utf-8'));
    const procurement = visibleText(fs.readFileSync(path.join(root, 'procurement/index.html'), 'utf-8'));
    for (const text of [home, flbsa]) expect(text).not.toContain('high-risk credit scoring from 2 August 2026');
    expect(flbsa).toContain('2 December 2027');
    expect(flbsa).toContain('20 November 2026');
    expect(flbsa).toContain('EU AI Act Article 4a');
    expect(flbsa).toContain('including synthetic or anonymised data');
    expect(flbsa).toMatch(/does not[^.]*provide legal advice[^.]*certify compliance[^.]*validate a model[^.]*make live lending decisions/i);
    expect(flbsa).toMatch(/does not load or execute your models|never executes your models/i);
    expect(flbsa).toMatch(/public stable release[^.]*not yet published|not yet published[^.]*public stable release/i);
    expect(flbsa).toMatch(/optional engagement is not the release programme/i);
    for (const text of [flbsa, procurement]) {
      expect(text).not.toMatch(/CPU-only and GPU-preferred profiles are supported|~20[–-]25 minute range/i);
      expect(text).toMatch(/GPU[^.]*not part of[^.]*runtime/i);
    }
    expect(flbsa).not.toContain('synthetic-first');
  });

  test('website does not fork the canonical product SSoT', async () => {
    const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf-8');

    expect(fs.existsSync(path.join(root, 'SSoT.md'))).toBe(false);
    expect(readme).toContain('Canonical FL-BSA product truth lives in `equilens-labs/fl-bsa/SSoT.md`');
    expect(readme).toContain('intentionally not');
  });

  test('paid campaign identities reach only their reviewed contact routes', async ({ page }) => {
    await stubPlausible(page);
    const genericContact = '/contact/?interest=Automated%20Creditworthiness%20Evidence%20Readiness';
    const genericPilotContact = '/contact/?interest=Controlled%20FL-BSA%20Pilot';
    const linkedinContact =
      '/contact/?' +
      new URLSearchParams({
        interest: 'Automated Creditworthiness Evidence Readiness',
        route: 'linkedin-era-eea-202609',
        utm_source: 'linkedin',
        utm_medium: 'paid-social',
        utm_campaign: 'flbsa_era_eea_202609',
        utm_content: 'single_image_v1',
      }).toString();
    const googleContact =
      '/contact/?' +
      new URLSearchParams({
        interest: 'Automated Creditworthiness Evidence Readiness',
        route: 'ccd2-search-202609',
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: 'ccd2_readiness_eu_202609',
      }).toString();
    const pilotContact =
      '/contact/?' +
      new URLSearchParams({
        interest: 'Controlled FL-BSA Pilot',
        route: 'linkedin-flbsa-eu4-pilot-202609',
        utm_source: 'linkedin',
        utm_medium: 'paid-social',
        utm_campaign: 'flbsa_eu4_pilot_202609',
        utm_content: 'single_image_v4',
      }).toString();

    await page.goto('/fl-bsa/', { waitUntil: 'networkidle' });
    await expect(page.locator('[data-campaign-contact="ccd2-readiness"]')).toHaveAttribute(
      'href',
      genericContact,
    );
    await expect(page.locator('[data-campaign-contact="controlled-pilot"]')).toHaveAttribute(
      'href',
      genericPilotContact,
    );

    await page.goto(
      '/fl-bsa/?route=linkedin-flbsa-eu4-pilot-202609&utm_source=linkedin&utm_medium=paid-social&utm_campaign=flbsa_eu4_pilot_202609&utm_content=single_image_v4#controlled-pilot',
      { waitUntil: 'networkidle' },
    );
    await expect(page.locator('[data-campaign-contact="controlled-pilot"]')).toHaveAttribute(
      'href',
      pilotContact,
    );
    await expect(page.locator('[data-campaign-contact="ccd2-readiness"]')).toHaveAttribute(
      'href',
      genericContact,
    );

    await page.goto(
      '/fl-bsa/?route=linkedin-era-eea-202609&utm_source=linkedin&utm_medium=paid-social&utm_campaign=flbsa_era_eea_202609&utm_content=single_image_v1#creditworthiness-readiness',
      { waitUntil: 'networkidle' },
    );
    await expect(page.locator('[data-campaign-contact="ccd2-readiness"]')).toHaveAttribute(
      'href',
      linkedinContact,
    );

    await page.goto(
      '/fl-bsa/?route=linkedin-era-eea-202609&utm_source=linkedin&utm_medium=organic-social&utm_campaign=flbsa_era_eea_202609',
      { waitUntil: 'networkidle' },
    );
    await expect(page.locator('[data-campaign-contact="ccd2-readiness"]')).toHaveAttribute(
      'href',
      genericContact,
    );

    await page.goto(
      '/fl-bsa/?route=ccd2-search-202609&utm_source=google&utm_medium=cpc&utm_campaign=ccd2_readiness_eu_202609',
      { waitUntil: 'networkidle' },
    );
    await expect(page.locator('[data-campaign-contact="ccd2-readiness"]')).toHaveAttribute(
      'href',
      googleContact,
    );

    await page.goto(
      '/fl-bsa/?route=ccd2-search-202609&utm_source=organic&utm_medium=cpc&utm_campaign=ccd2_readiness_eu_202609',
      { waitUntil: 'networkidle' },
    );
    await expect(page.locator('[data-campaign-contact="ccd2-readiness"]')).toHaveAttribute(
      'href',
      genericContact,
    );
  });

  test('paid campaign attribution survives the complete CTA-to-email journey', async ({ page }) => {
    await stubPlausible(page);
    const pilotLanding =
      '/fl-bsa/?route=linkedin-flbsa-eu4-pilot-202609&utm_source=linkedin&utm_medium=paid-social&utm_campaign=flbsa_eu4_pilot_202609&utm_content=single_image_v4#controlled-pilot';
    const linkedinLanding =
      '/fl-bsa/?route=linkedin-era-eea-202609&utm_source=linkedin&utm_medium=paid-social&utm_campaign=flbsa_era_eea_202609&utm_content=single_image_v1#creditworthiness-readiness';

    await page.goto(pilotLanding, { waitUntil: 'networkidle' });
    await page.locator('[data-campaign-contact="controlled-pilot"]').click();
    await expect(page.locator('#interest')).toHaveValue('Controlled FL-BSA Pilot');
    await expect(page.locator('#message')).toHaveValue(
      'I would like to discuss an optional, customer-hosted FL-BSA evaluation for one regulated-credit workflow.',
    );
    const evaluationSubmission = await submitAndReadSubmission(page);
    expect(evaluationSubmission.subject).toBe(
      'FL-BSA enquiry: Optional evaluation — LinkedIn EU4 Sep 2026',
    );
    expect(evaluationSubmission.payload.interest).toBe('Optional FL-BSA evaluation');
    expect(JSON.stringify(evaluationSubmission.payload)).not.toContain('Pilot');

    await page.goto(linkedinLanding, { waitUntil: 'networkidle' });
    await page.locator('[data-campaign-contact="ccd2-readiness"]').click();
    await expect(page.locator('#interest')).toHaveValue(
      'Automated Creditworthiness Evidence Readiness',
    );
    await expect(page.locator('#message')).toHaveValue(
      'I would like to discuss evidence readiness for one automated creditworthiness workflow.',
    );
    expect(await submitAndReadSubject(page)).toBe(
      'FL-BSA enquiry: Evidence readiness — LinkedIn EEA Sep 2026',
    );

    await page.goto(
      '/fl-bsa/?route=ccd2-search-202609&utm_source=google&utm_medium=cpc&utm_campaign=ccd2_readiness_eu_202609',
      { waitUntil: 'networkidle' },
    );
    await page.locator('[data-campaign-contact="ccd2-readiness"]').click();
    expect(await submitAndReadSubject(page)).toBe(
      'FL-BSA enquiry: CCD2 readiness — EU Search Sep 2026',
    );
  });

  test('current EU4 and UK campaigns retain their identity without changing buyer-pack intent', async ({ page }) => {
    await stubPlausible(page);
    for (const campaign of [
      { region: 'EU4', route: 'linkedin-flbsa-eu4-pilot-202609', name: 'flbsa_eu4_pilot_202609', content: 'single_image_v4' },
      { region: 'UK', route: 'linkedin-flbsa-uk-pilot-202609', name: 'flbsa_uk_pilot_202609', content: 'single_image_uk_a' },
    ]) {
      const tags = new URLSearchParams({ route: campaign.route, utm_source: 'linkedin',
        utm_medium: 'paid-social', utm_campaign: campaign.name, utm_content: campaign.content });
      const landing = '/fl-bsa/?' + tags + '#controlled-pilot';
      await page.goto(landing, { waitUntil: 'networkidle' });
      for (const cta of ['hero-primary', 'pricing-primary', 'final-primary']) {
        const href = await page.locator(`a[class*="plausible-event-cta=${cta}"]`).getAttribute('href');
        const destination = new URL(href!, 'http://localhost');
        expect(destination.pathname).toBe('/contact/');
        expect(destination.searchParams.get('interest')).toBe('Procurement Pack');
        for (const [name, value] of tags) expect(destination.searchParams.get(name)).toBe(value);
      }
      const navHref = await page.locator('nav a.nav-link').filter({ hasText: /^Contact$/ }).first().getAttribute('href');
      expect(new URL(navHref!, 'http://localhost').searchParams.get('route')).toBe(campaign.route);
      // A different offer stays a different offer.
      await expect(page.locator('[data-campaign-contact="ccd2-readiness"]')).toHaveAttribute(
        'href', '/contact/?interest=Automated%20Creditworthiness%20Evidence%20Readiness');
      await page.locator('a[class*="plausible-event-cta=hero-primary"]').click();
      await expect(page.locator('#interest')).toHaveValue('Procurement Pack');
      await expect(page.locator('#message')).toHaveValue(/Please send the FL-BSA buyer and procurement pack/);
      const pack = await submitAndReadSubmission(page);
      expect(pack.subject).toBe(`FL-BSA enquiry: Procurement Pack — LinkedIn ${campaign.region} Sep 2026`);
      expect(pack.payload.interest).toBe('Procurement Pack');

      await page.goto(landing, { waitUntil: 'networkidle' });
      await page.locator('[data-campaign-contact="controlled-pilot"]').click();
      await expect(page.locator('#interest')).toHaveValue('Controlled FL-BSA Pilot');
      expect(await submitAndReadSubject(page)).toBe(`FL-BSA enquiry: Optional evaluation — LinkedIn ${campaign.region} Sep 2026`);
    }
  });

  test('UK campaign identity rejects mismatched and duplicated tags on landing and contact', async ({ page }) => {
    await stubPlausible(page);
    const exact = 'route=linkedin-flbsa-uk-pilot-202609&utm_source=linkedin&utm_medium=paid-social&utm_campaign=flbsa_uk_pilot_202609&utm_content=single_image_uk_a';
    for (const invalid of [exact.replace('single_image_uk_a', 'single_image_v4'),
      exact + '&utm_campaign=flbsa_uk_pilot_202609', exact.replace('utm_source=linkedin', 'utm_source=direct')]) {
      await page.goto('/fl-bsa/?' + invalid + '#controlled-pilot', { waitUntil: 'networkidle' });
      await expect(page.locator('[data-campaign-contact="controlled-pilot"]')).toHaveAttribute(
        'href', '/contact/?interest=Controlled%20FL-BSA%20Pilot');
      await page.goto('/contact/?interest=Procurement%20Pack&' + invalid, { waitUntil: 'networkidle' });
      expect(await submitAndReadSubject(page)).toBe('FL-BSA enquiry: Procurement Pack');
    }
  });

  test('malformed or changed campaign routes fall back to generic email subjects', async ({ page }) => {
    await stubPlausible(page);
    const genericSubject =
      'FL-BSA enquiry: Automated Creditworthiness Evidence Readiness';
    const exactContact =
      '/contact/?interest=Automated%20Creditworthiness%20Evidence%20Readiness' +
      '&route=linkedin-era-eea-202609' +
      '&utm_source=linkedin' +
      '&utm_medium=paid-social' +
      '&utm_campaign=flbsa_era_eea_202609' +
      '&utm_content=single_image_v1';
    const invalidContacts = [
      exactContact.replace('&utm_campaign=flbsa_era_eea_202609', ''),
      exactContact.replace('utm_source=linkedin', 'utm_source=direct'),
      exactContact + '&utm_medium=organic-social',
      exactContact + '&utm_content=single_image_v1',
      exactContact.replace('route=linkedin-era-eea-202609', 'route=unknown'),
      exactContact + '&route=linkedin-era-eea-202609',
    ];

    for (const contact of invalidContacts) {
      await page.goto(contact, { waitUntil: 'networkidle' });
      expect(await submitAndReadSubject(page)).toBe(genericSubject);
    }

    await page.goto(exactContact, { waitUntil: 'networkidle' });
    await page.locator('#interest').selectOption('Pricing');
    expect(await submitAndReadSubject(page)).toBe('FL-BSA enquiry: Pricing');
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
    expect(trackedHtml).toContain('plausible-event-name=CCD2+Evidence+Readiness+Click');
    expect(trackedHtml).toContain('plausible-event-surface=');
    expect(trackedHtml).toContain('plausible-event-cta=');
    expect(trackedHtml).toContain('plausible-event-intent=');
    expect(trackedHtml).not.toContain('message=');
    expect(trackedHtml).not.toContain('plausible-event-email=');
    expect(trackedHtml).not.toContain('plausible-event-name-field=');
    expect(trackedHtml).not.toContain('plausible-event-organisation=');
    expect(flbsa).toContain('/assets/eql/campaign-routes.js');
    expect(flbsa).toContain('/assets/eql/campaign-route.js');
    expect(contact).toContain('/assets/eql/campaign-routes.js');
    expect(contact).toContain('/assets/eql/contact.js');
    expect(trackedHtml).not.toContain('plausible-event-message=');
    // Explicit JS emission follows validation/honeypot checks; a form tag would double-count.
    expect(contact).not.toContain('plausible-event-name=Contact+Form+Submit');
    expect(legal).toContain('selected static CTA/custom-event labels');
    expect(visibleText(legal)).toMatch(/without (?:collecting or transmitting )?form contents|no form contents/i);
  });

  test('tracked HTML pages load Plausible tagged-events script variant', async () => {
    const trackedHtmlFiles = execFileSync('git', ['ls-files', '*.html'], {
      cwd: root,
      encoding: 'utf-8',
    })
      .trim()
      .split('\n')
      .filter(Boolean)
      // Known-bad claims fixtures are full HTML documents but never deploy.
      .filter((file) => !file.startsWith('tests/'));

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

  test('engagement options have equal readable rows and keep their conversion paths', async ({ page }) => {
    await stubPlausible(page);
    for (const width of [375, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto('/fl-bsa/#pricing', { waitUntil: 'networkidle' });
      const rows = page.locator('#pricing .service-list > .service-row');
      await expect(rows).toHaveCount(3);
      const widths = await rows.evaluateAll(elements => elements.map(e => e.getBoundingClientRect().width));
      expect(Math.max(...widths) - Math.min(...widths)).toBeLessThanOrEqual(1);
      expect(Math.min(...widths)).toBeGreaterThan(width === 375 ? 300 : 500);
      for (const row of await rows.all()) {
        await expect(row.getByRole('heading')).toHaveCount(1);
      }
      await expect(page.locator('#pricing a[href^="/contact/"]').first()).toBeVisible();
      await expectNoOverflow(page);
    }
  });

  test('primary product action is available in the first mobile viewport', async ({ page }) => {
    await stubPlausible(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/fl-bsa/', { waitUntil: 'networkidle' });
    const action = page.locator('#overview a[href^="/contact/"]').first();
    await expect(action).toBeVisible();
    const box = await action.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.y + box!.height).toBeLessThanOrEqual(812);
    await expect(action).toHaveAttribute('href', '/contact/?interest=Procurement%20Pack');
    await expectNoOverflow(page);
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

  test('evidence-readiness note has an owned conversion path and is linked from FL-BSA', async () => {
    const note = fs.readFileSync(
      path.join(root, 'notes', 'five-things-before-a-fair-outcomes-test', 'index.html'),
      'utf-8',
    );
    const flbsa = fs.readFileSync(path.join(root, 'fl-bsa', 'index.html'), 'utf-8');

    expect(note).toContain(
      '<link href="https://equilens.io/notes/five-things-before-a-fair-outcomes-test/" rel="canonical">',
    );
    expect(note).toContain('plausible-event-surface=evidence-note');
    expect(note).toContain('href="/contact/?interest=Evidence%20Readiness%20Assessment"');
    expect(note).toContain('These are internal decision thresholds, not regulatory safe harbours');
    expect(flbsa).toContain('href="/notes/five-things-before-a-fair-outcomes-test/">Read the note</a>');
  });

  test('evidence-readiness note preserves its five numbered headings and styled lists', async ({ page }) => {
    await stubPlausible(page);
    await page.goto('/notes/five-things-before-a-fair-outcomes-test/', { waitUntil: 'networkidle' });

    const expectedHeadings = [
      '1. One decision',
      '2. One evidence question',
      '3. A safe data boundary',
      '4. Named owners for each judgement',
      '5. A pre-agreed action',
    ];
    const headings = page.locator('.article-step > h2');

    await expect(headings).toHaveCount(expectedHeadings.length);
    expect(await headings.evaluateAll((elements) => elements.map((element) => element.textContent))).toEqual(
      expectedHeadings,
    );
    for (const heading of expectedHeadings) {
      await expect(page.getByRole('heading', { level: 2, name: heading, exact: true })).toHaveCount(1);
    }

    await expect(page.locator('.article-step ul[role="list"], .article-output ul[role="list"]')).toHaveCount(5);
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

    expect(metrics.overflowWrap).toBe('normal');
    expect(metrics.lineCount).toBeLessThanOrEqual(3);
    await expectNoOverflow(page);
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
        // The approved workflow has three readable steps; markup is free to evolve.
        const steps = page.locator('#how-it-works .process-list > *');
        await expect(steps).toHaveCount(3);
        for (const step of await steps.all()) await expect(step.getByRole('heading')).toHaveCount(1);
        await expect(page.locator('#docs a[href$="/WhitePaper_Intake_Bundle_v4.zip"]')).toHaveAttribute(
          'href',
          'https://github.com/equilens-labs/fl-bsa-pub/releases/download/v5.0.0-rc9-public-fix-2724455/WhitePaper_Intake_Bundle_v4.zip',
        );
        await expect(page.getByRole('link', { name: 'Download demo GOLD pack (ZIP, ~4 MB)' })).toHaveAttribute(
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

  test('contact essentials appear early with autocomplete and a visible keyboard focus indicator', async ({ page }) => {
    await stubPlausible(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/contact/', { waitUntil: 'networkidle' });
    const fields = { name: 'name', email: 'email', organisation: 'organization', role: 'organization-title' };
    for (const [id, token] of Object.entries(fields)) {
      await expect(page.locator(`#${id}`)).toHaveAttribute('autocomplete', token);
    }
    expect(await page.locator('#contact-form input:not([tabindex="-1"])').evaluateAll(
      elements => elements.slice(0, 2).map(element => element.id),
    )).toEqual(['name', 'email']);
    for (const id of ['name', 'email']) {
      const box = await page.locator(`#${id}`).boundingBox();
      expect(box).not.toBeNull();
      expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.y + box!.height).toBeLessThanOrEqual(812);
    }
    await page.locator('.skip-to-content').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.locator('#name')).toBeFocused();
    const focus = await page.locator('#name').evaluate(element => {
      const css = getComputedStyle(element);
      return { style: css.outlineStyle, width: parseFloat(css.outlineWidth), color: css.outlineColor };
    });
    expect(focus.style).not.toBe('none');
    expect(focus.width).toBeGreaterThanOrEqual(2);
    expect(focus.color).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('contents navigation respects reduced motion and moves keyboard focus to the destination', async ({ page }) => {
    await stubPlausible(page);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(() => {
      const original = Element.prototype.scrollIntoView;
      (window as unknown as { __scrollModes: unknown[] }).__scrollModes = [];
      Element.prototype.scrollIntoView = function (options) {
        (window as unknown as { __scrollModes: unknown[] }).__scrollModes.push(options);
        return original.call(this, options);
      };
    });
    await page.goto('/fl-bsa/', { waitUntil: 'networkidle' });
    await page.locator('.toc a[href="#docs"]').focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#docs$/);
    await expect(page.locator('#docs')).toBeFocused();
    const modes = await page.evaluate(() => (window as unknown as {
      __scrollModes: { behavior?: string }[];
    }).__scrollModes);
    expect(modes.length).toBeGreaterThan(0);
    expect(modes.some(mode => mode?.behavior === 'smooth')).toBe(false);
    await page.keyboard.press('Tab');
    expect(await page.locator('#docs').evaluate(element => element.contains(document.activeElement))).toBe(true);
  });

  test('mobile contents can be opened by keyboard and reach every retained section', async ({ page }) => {
    await stubPlausible(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/fl-bsa/', { waitUntil: 'networkidle' });
    const contents = page.locator('.toc-disclosure');
    const summary = contents.locator('summary');
    await summary.scrollIntoViewIfNeeded();
    await expect(contents).not.toHaveAttribute('open', '');
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(contents).toHaveAttribute('open', '');
    for (const link of await contents.locator('a[href^="#"]').all()) {
      await expect(link).toBeVisible();
      const destination = await link.getAttribute('href');
      await expect(page.locator(destination!)).toHaveCount(1);
    }
    await contents.locator('a[href="#docs"]').click();
    await expect(page).toHaveURL(/#docs$/);
    await expect(page.locator('#docs')).toBeFocused();
    await expectNoOverflow(page);
  });

  test('mobile legal anchors stay below the header after skipping and closing the menu', async ({ page }) => {
    await stubPlausible(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/legal/', { waitUntil: 'networkidle' });
    await page.locator('.skip-to-content').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
    const menu = page.getByRole('button', { name: 'Menu', exact: true });
    await menu.focus();
    await page.keyboard.press('Enter');
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(menu).toBeFocused();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    const contents = page.locator('.toc-disclosure');
    await contents.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(contents).toHaveAttribute('open', '');
    await contents.getByRole('link', { name: 'Accessibility', exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#accessibility$/);
    await expect(page.locator('#accessibility')).toBeFocused();
    // A queued scroll-anchor adjustment used to move this heading behind the
    // sticky header after the mobile menu changed the main content's margin.
    await page.waitForTimeout(500);
    const heading = await page.locator('#accessibility h2').boundingBox();
    const header = await page.locator('.navbar').boundingBox();
    expect(heading).not.toBeNull();
    expect(header).not.toBeNull();
    expect(heading!.y).toBeGreaterThanOrEqual(header!.y + header!.height);
    expect(heading!.y + heading!.height).toBeLessThanOrEqual(812);
  });

  test('delayed navigation keeps initial mobile layout stable on home and legal', async ({ page }, testInfo) => {
    await stubPlausible(page);
    await page.setViewportSize({ width: 393, height: 852 });
    let delayedScripts = 0;
    await page.route(url => url.pathname === '/assets/eql/nav.js', async route => {
      delayedScripts += 1;
      await new Promise(resolve => setTimeout(resolve, 500));
      // Fall through to the persistent context guard, which permits only local
      // GET/HEAD reads. A slow script must not bypass the network boundary.
      await route.fallback();
    });
    await page.addInitScript(() => {
      type LayoutShift = PerformanceEntry & { value: number; hadRecentInput: boolean };
      const auditWindow = window as unknown as { __auditLayoutShifts: number[] };
      auditWindow.__auditLayoutShifts = [];
      new PerformanceObserver(list => {
        for (const entry of list.getEntries() as LayoutShift[]) {
          if (!entry.hadRecentInput) auditWindow.__auditLayoutShifts.push(entry.value);
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });
    for (const pathname of ['/', '/legal/']) {
      await page.goto(pathname, { waitUntil: 'networkidle' });
      await page.evaluate(async () => {
        await document.fonts.ready;
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      });
      expect(await page.evaluate(() => PerformanceObserver.supportedEntryTypes.includes('layout-shift'))).toBe(true);
      await expect(page.locator('.navbar')).toHaveClass(/\bis-enhanced\b/);
      if (pathname === '/legal/') await expect(page.locator('.toc-disclosure')).not.toHaveAttribute('open', '');
      const shifts = await page.evaluate(() => (window as unknown as { __auditLayoutShifts: number[] }).__auditLayoutShifts);
      const cls = shifts.reduce((total, value) => total + value, 0);
      await testInfo.attach(`initial-layout-${pathname === '/' ? 'home' : 'legal'}`, {
        body: JSON.stringify({ pathname, cls, shifts }), contentType: 'application/json',
      });
      expect(cls, `${pathname} shifted after navigation enhancement`).toBeLessThan(0.1);
    }
    expect(delayedScripts).toBe(2);
  });

  test('failed navigation script leaves mobile primary links usable', async ({ page }) => {
    await stubPlausible(page);
    await page.setViewportSize({ width: 393, height: 852 });
    let blockedScripts = 0;
    await page.route(url => url.pathname === '/assets/eql/nav.js', async route => {
      blockedScripts += 1;
      await route.abort('failed');
    });
    await page.goto('/legal/', { waitUntil: 'networkidle' });
    const primary = page.getByRole('navigation', { name: 'Primary', exact: true });
    await expect(primary).not.toHaveClass(/\bis-enhanced\b/);
    await expect(primary.getByRole('button', { name: 'Menu', exact: true })).toBeHidden();
    for (const name of ['FL‑BSA', 'Procurement', 'Trust Center', 'Legal', 'Contact']) {
      await expect(primary.getByRole('link', { name, exact: true })).toBeVisible();
    }
    await primary.getByRole('link', { name: 'Contact', exact: true }).click();
    await expect(page).toHaveURL(/\/contact\/$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Send us a message', exact: true })).toBeVisible();
    expect(blockedScripts).toBe(2);
  });

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });
    test('mobile navigation remains usable and the contact email fallback is clear', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto('/fl-bsa/', { waitUntil: 'networkidle' });
      const primary = page.getByRole('navigation', { name: 'Primary', exact: true });
      await expect(primary.getByRole('link', { name: 'Contact', exact: true })).toBeVisible();
      await primary.getByRole('link', { name: 'Contact', exact: true }).click();
      // Playwright intentionally excludes a noscript container from its text
      // aggregation; its rendered paragraph and link are the usable UI.
      const notice = page.locator('noscript p');
      await expect(notice).toBeVisible();
      await expect(notice).toContainText('JavaScript is off');
      await expect(notice.getByRole('link', { name: 'hello@equilens.io', exact: true }))
        .toHaveAttribute('href', 'mailto:hello@equilens.io');
    });
  });

  test('valid accepted forms produce one attempt and one accepted event without personal fields', async ({ page }) => {
    await stubPlausible(page);
    const requests = await mockForm(page);
    await page.goto('/contact/?interest=Procurement%20Pack', { waitUntil: 'networkidle' });
    await fillRequiredContactFields(page);
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('#form-status')).toContainText(/sent|received/i);
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
    await expect.poll(() => requests.length).toBe(1);
    await expect.poll(async () => (await recordedEvents(page)).map(event => event.name))
      .toEqual(['Contact Form Submit', 'Enquiry Submitted']);
    const events = JSON.stringify(await recordedEvents(page));
    expect(events).not.toContain('audit@example.invalid');
    expect(events).not.toContain('Local audit fixture');
    expect(events).not.toMatch(/"(?:email|organisation|message|name-field)"\s*:/);
    await expect(page.locator('#name')).toHaveValue('');
  });

  test('rejected forms preserve input and expose an email fallback without an accepted event', async ({ page }) => {
    await stubPlausible(page);
    const requests = await mockForm(page, 503);
    await page.goto('/contact/?interest=Security%20Pack', { waitUntil: 'networkidle' });
    await fillRequiredContactFields(page);
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('#form-status')).toContainText(/did not accept|failed|could not|unable/i);
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
    await expect(page.locator('#name')).toHaveValue('Local audit fixture');
    await expect(page.locator('#email')).toHaveValue('audit@example.invalid');
    await expect(page.locator('#form-status a')).toHaveAttribute('href', /^mailto:hello@equilens\.io\?subject=/);
    expect(requests).toHaveLength(1);
    expect((await recordedEvents(page)).map(event => event.name)).toEqual(['Contact Form Submit']);
  });

  test('honeypot and native-invalid forms produce neither requests nor conversion events', async ({ page }) => {
    await stubPlausible(page);
    const requests = await mockForm(page);
    await page.goto('/contact/', { waitUntil: 'networkidle' });
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('#name')).toBeFocused();
    expect(requests).toHaveLength(0);
    expect(await recordedEvents(page)).toEqual([]);
    await fillRequiredContactFields(page);
    await page.locator('#hp-field').evaluate((element: HTMLInputElement) => { element.value = 'local-bot-fixture'; });
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('#form-status')).toBeVisible();
    expect(requests).toHaveLength(0);
    expect(await recordedEvents(page)).toEqual([]);
  });

  test('pending forms show progress then uncertain delivery without automatic retry', async ({ page }) => {
    await stubPlausible(page);
    await page.clock.install();
    let posts = 0;
    await page.route('https://submit-form.com/**', async route => {
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({ status: 204, headers: {
          'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type,Accept',
          'Access-Control-Allow-Methods': 'POST,OPTIONS',
        } });
      } else {
        posts += 1;
        // Deliberately keep the local intercepted POST unresolved.
      }
    });
    await page.goto('/contact/?interest=Procurement%20Pack', { waitUntil: 'networkidle' });
    await fillRequiredContactFields(page);
    await Promise.all([
      page.waitForRequest(request => request.url().startsWith('https://submit-form.com/') && request.method() === 'POST'),
      page.locator('button[type="submit"]').click(),
    ]);
    await expect(page.locator('#form-status')).toContainText(/sending/i);
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
    expect(await page.locator('#form-status').evaluate(element =>
      element.closest('[aria-busy="true"]') === null,
    )).toBe(true);
    await page.clock.fastForward(15_001);
    await expect(page.locator('#form-status')).toContainText(/confirm|uncertain|taking longer/i);
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
    await expect(page.locator('#name')).toHaveValue('Local audit fixture');
    await expect(page.locator('#email')).toHaveValue('audit@example.invalid');
    await expect(page.locator('#form-status a')).toHaveAttribute('href', /^mailto:/);
    await page.clock.fastForward(60_000);
    expect(posts).toBe(1);
    expect((await recordedEvents(page)).map(event => event.name)).toEqual(['Contact Form Submit']);
  });

  test('contact query parameters prefill procurement pack enquiry', async ({ page }) => {
    await stubPlausible(page);
    await page.goto('/contact/?interest=Procurement%20Pack', { waitUntil: 'networkidle' });

    await expect(page.locator('#interest')).toHaveValue('Procurement Pack');
    await expect(page.locator('#message')).toHaveValue('Please send the FL-BSA buyer and procurement pack and help scope a readiness conversation.');
  });

  test('contact query parameters prefill evidence-readiness enquiry', async ({ page }) => {
    await stubPlausible(page);
    await page.goto('/contact/?interest=Evidence%20Readiness%20Assessment', { waitUntil: 'networkidle' });

    await expect(page.locator('#interest')).toHaveValue('Evidence Readiness Assessment');
    await expect(page.locator('#message')).toHaveValue(
      'I would like to discuss whether one credit workflow is ready for a fair-outcomes evidence test.',
    );
  });

  test('contact query parameters prefill automated-creditworthiness enquiry', async ({ page }) => {
    await stubPlausible(page);
    await page.goto('/contact/?interest=Automated%20Creditworthiness%20Evidence%20Readiness', {
      waitUntil: 'networkidle',
    });

    await expect(page.locator('#interest')).toHaveValue('Automated Creditworthiness Evidence Readiness');
    await expect(page.locator('#message')).toHaveValue(
      'I would like to discuss evidence readiness for one automated creditworthiness workflow.',
    );
  });

  test('legacy controlled-pilot key prefills evaluation wording', async ({ page }) => {
    await stubPlausible(page);
    await page.goto('/contact/?interest=Controlled%20FL-BSA%20Pilot', { waitUntil: 'networkidle' });

    await expect(page.locator('#interest')).toHaveValue('Controlled FL-BSA Pilot');
    await expect(page.locator('#message')).toHaveValue(
      'I would like to discuss an optional, customer-hosted FL-BSA evaluation for one regulated-credit workflow.',
    );
    const evaluationSubmission = await submitAndReadSubmission(page);
    expect(evaluationSubmission.subject).toBe(
      'FL-BSA enquiry: Optional FL-BSA evaluation',
    );
    expect(evaluationSubmission.payload.interest).toBe('Optional FL-BSA evaluation');
    expect(JSON.stringify(evaluationSubmission.payload)).not.toContain('Pilot');
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

  // Paid-arrival variant B (/fl-bsa/evidence/) and E1 engagement milestones.
  const evidencePath = '/fl-bsa/evidence/';
  const samplePdf = 'https://github.com/equilens-labs/fl-bsa-pub/releases/download/v5.0.0-rc9-public-fix-2724455/customer_report.pdf';
  const ukTags = 'route=linkedin-flbsa-uk-pilot-202609&utm_source=linkedin&utm_medium=paid-social&utm_campaign=flbsa_uk_pilot_202609&utm_content=single_image_uk_a';
  const eventsNamed = async (page: Page, name: string) =>
    (await page.evaluate(() => (window as unknown as { __auditEvents?: { name: string; props: Record<string, string> }[] }).__auditEvents || []))
      .filter(event => event.name === name);

  test('evidence landing stays out of search, sitemap and navigation', async () => {
    const html = fs.readFileSync(path.join(root, 'fl-bsa/evidence/index.html'), 'utf-8');
    expect(html).toContain('<meta name="robots" content="noindex">');
    expect(html).toContain('<link href="https://equilens.io/fl-bsa/evidence/" rel="canonical"/>');
    expect(fs.readFileSync(path.join(root, 'config/web/nav.json'), 'utf-8')).not.toContain('/fl-bsa/evidence/');
    for (const file of ['index.html', 'fl-bsa/index.html']) {
      expect(fs.readFileSync(path.join(root, file), 'utf-8'), file).not.toContain('/fl-bsa/evidence/');
    }
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'eql-evidence-seo-'));
    try {
      const scriptDir = path.join(tempRoot, 'scripts', 'seo');
      fs.mkdirSync(scriptDir, { recursive: true });
      for (const script of ['set-indexing.py', 'gen-sitemap.py']) {
        fs.copyFileSync(path.join(root, 'scripts', 'seo', script), path.join(scriptDir, script));
      }
      fs.writeFileSync(path.join(tempRoot, 'CNAME'), 'equilens.io\n');
      const page = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex"><title>T</title></head><body></body></html>';
      fs.writeFileSync(path.join(tempRoot, 'index.html'), page);
      fs.mkdirSync(path.join(tempRoot, 'fl-bsa', 'evidence'), { recursive: true });
      fs.writeFileSync(path.join(tempRoot, 'fl-bsa', 'index.html'), page);
      fs.writeFileSync(path.join(tempRoot, 'fl-bsa', 'evidence', 'index.html'), page);
      execFileSync('python3', [path.join(scriptDir, 'set-indexing.py'), 'public'], { cwd: tempRoot, stdio: 'pipe' });
      execFileSync('python3', [path.join(scriptDir, 'gen-sitemap.py')], { cwd: tempRoot, stdio: 'pipe' });
      expect(fs.readFileSync(path.join(tempRoot, 'fl-bsa', 'index.html'), 'utf-8')).not.toContain('name="robots"');
      expect(fs.readFileSync(path.join(tempRoot, 'fl-bsa', 'evidence', 'index.html'), 'utf-8'))
        .toContain('<meta name="robots" content="noindex">');
      const sitemap = fs.readFileSync(path.join(tempRoot, 'sitemap.xml'), 'utf-8');
      expect(sitemap).toContain('https://equilens.io/fl-bsa/</loc>');
      expect(sitemap).not.toContain('/fl-bsa/evidence/');
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  test('evidence landing answers the ad with one primary action in the first phone screen', async ({ page }) => {
    await stubPlausible(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${evidencePath}?${ukTags}`, { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/bias amplification/i);
    const primary = page.locator('main .btn-primary');
    await expect(primary).toHaveCount(1);
    await expect(primary).toHaveText('Get the sample evidence report');
    await expect(primary).toHaveAttribute('href', samplePdf);
    await expect(primary).toHaveClass(/plausible-event-name=Proof\+Asset\+Click/);
    await expect(primary).toHaveClass(/plausible-event-surface=paid_b/);
    const cta = (await primary.boundingBox())!;
    expect(cta.y).toBeGreaterThanOrEqual(0);
    expect(cta.y + cta.height).toBeLessThanOrEqual(844);
    const figure = (await page.locator('main img').first().boundingBox())!;
    expect(figure.y).toBeLessThan(844);
    const hero = visibleText(await page.locator('main > section').first().innerHTML());
    expect(hero).toMatch(/intrinsic|historical decisions/i);
    expect(hero).toMatch(/your environment|customer-hosted/i);
    expect(hero).not.toMatch(/pre-release|optional|release programme/i);
    const mainHeight = await page.locator('main').evaluate(element => element.getBoundingClientRect().height);
    expect(mainHeight).toBeLessThanOrEqual(3 * 844);
    await expectNoOverflow(page);
  });

  test('evidence landing evaluation CTA keeps paid enquiry attribution', async ({ page }) => {
    await stubPlausible(page);
    await page.goto(evidencePath, { waitUntil: 'networkidle' });
    const evaluation = page.getByRole('link', { name: 'Discuss an evaluation', exact: true });
    await expect(evaluation).toHaveAttribute('href', '/contact/?interest=Controlled%20FL-BSA%20Pilot');
    await page.goto(`${evidencePath}?${ukTags}`, { waitUntil: 'networkidle' });
    const href = new URL((await evaluation.getAttribute('href'))!, 'http://localhost');
    expect(href.searchParams.get('interest')).toBe('Controlled FL-BSA Pilot');
    expect(href.searchParams.get('route')).toBe('linkedin-flbsa-uk-pilot-202609');
    expect(href.searchParams.get('utm_content')).toBe('single_image_uk_a');
    await evaluation.click();
    await expect(page.locator('#interest')).toHaveValue('Controlled FL-BSA Pilot');
    expect(await submitAndReadSubject(page)).toBe('FL-BSA enquiry: Optional evaluation — LinkedIn UK Sep 2026');
    expect((await recordedEvents(page)).map(event => event.name)).toEqual(['Contact Form Submit', 'Enquiry Submitted']);
  });

  test('E1 arrival CTA and time-engaged events fire once with variant props', async ({ page }) => {
    await stubPlausible(page);
    // Freeze time before arrival so each milestone is reached only by explicit clock advances.
    const frozen = new Date('2026-09-25T09:00:00Z');
    await page.clock.install({ time: frozen });
    await page.clock.pauseAt(frozen);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${evidencePath}?${ukTags}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(200);
    await page.clock.runFor(1500);
    expect(await eventsNamed(page, 'Arrival CTA Seen')).toEqual([]);
    await page.clock.runFor(1000);
    expect(await eventsNamed(page, 'Arrival CTA Seen')).toEqual([
      { name: 'Arrival CTA Seen', props: { variant: 'b', utm_content: 'single_image_uk_a', cta: 'b-primary' } },
    ]);
    expect(await eventsNamed(page, 'Engaged Visit')).toEqual([]);
    await page.clock.runFor(8000);
    expect(await eventsNamed(page, 'Engaged Visit')).toEqual([
      { name: 'Engaged Visit', props: { variant: 'b', utm_content: 'single_image_uk_a', trigger: 'time' } },
    ]);
    await page.clock.runFor(30000);
    expect(await eventsNamed(page, 'Engaged Visit')).toHaveLength(1);
    expect(await eventsNamed(page, 'Arrival CTA Seen')).toHaveLength(1);
    expect(await eventsNamed(page, 'Reached Evaluation CTA')).toEqual([]);
  });

  test('E1 scroll past arrival engages and reaching the evaluation CTA is recorded', async ({ page }) => {
    await stubPlausible(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${evidencePath}?utm_content=bad%40example.invalid`, { waitUntil: 'networkidle' });
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect.poll(() => eventsNamed(page, 'Engaged Visit')).toEqual([
      { name: 'Engaged Visit', props: { variant: 'b', trigger: 'scroll' } },
    ]);
    await expect.poll(() => eventsNamed(page, 'Reached Evaluation CTA')).toEqual([
      { name: 'Reached Evaluation CTA', props: { variant: 'b', cta: 'b-evaluation' } },
    ]);
  });

  test('E1 proof click counts as an engaged visit', async ({ page }) => {
    await stubPlausible(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(evidencePath, { waitUntil: 'networkidle' });
    await page.locator('main .btn-primary').click();
    await expect.poll(() => eventsNamed(page, 'Engaged Visit')).toEqual([
      { name: 'Engaged Visit', props: { variant: 'b', trigger: 'proof_click' } },
    ]);
  });

  test('E1 on the current paid anchor reports variant a without changing its CTAs', async ({ page }) => {
    await stubPlausible(page);
    // Freeze time before arrival so each milestone is reached only by explicit clock advances.
    const frozen = new Date('2026-09-25T09:00:00Z');
    await page.clock.install({ time: frozen });
    await page.clock.pauseAt(frozen);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/fl-bsa/?${ukTags}#controlled-pilot`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(200);
    await page.clock.runFor(2500);
    expect(await eventsNamed(page, 'Arrival CTA Seen')).toEqual([
      { name: 'Arrival CTA Seen', props: { variant: 'a', utm_content: 'single_image_uk_a', cta: 'evaluation-sample' } },
    ]);
    expect(await eventsNamed(page, 'Reached Evaluation CTA')).toEqual([
      { name: 'Reached Evaluation CTA', props: { variant: 'a', utm_content: 'single_image_uk_a', cta: 'controlled-pilot' } },
    ]);
    const html = fs.readFileSync(path.join(root, 'fl-bsa/index.html'), 'utf-8');
    expect(html.match(/src="\/assets\/eql\/engagement\.js[^"]*" data-eql-variant="a"/g)).toHaveLength(1);
  });

});
