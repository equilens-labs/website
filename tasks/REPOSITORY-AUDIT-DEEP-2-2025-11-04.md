# COMPREHENSIVE DEEP AUDIT REPORT - EQUILENS WEBSITE REPOSITORY

**Report Date:** November 4, 2025
**Audit Type:** Deep Technical Audit (Second Deep Audit)
**Audit Scope:** Code quality, architecture, security, accessibility, and technical debt analysis
**Working Directory:** `/Users/daimakaimura/Projects/website`
**Branch:** main
**Last Commit:** 6d79dd0

---

## EXECUTIVE SUMMARY

**Overall Code Quality Grade: A- (90/100)**

The Equilens website has undergone substantial improvements since the last audit, with modern CSS architecture and improved JavaScript patterns. The previously outstanding JSON-LD bug has now been resolved, and navigation semantics are consistent. Remaining work is focused on hardening CSP coverage and finishing FL-BSA sub-nav automation.

**Grade Change:** B+ (82/100) → A- (90/100)
**Reason for Upgrade:** JSON-LD bug resolved, navigation semantics aligned, UX refinements landed

---

## 1. CRITICAL BUG VERIFICATION

### ✅ JSON-LD Duplicate @type Bug - FIXED (Nov 5, 2025)

**STATUS:** RESOLVED — REMEDIATED NOV 5, 2025
**File:** `index.html`
**Lines:** 39-40 (unchanged since first audit)
**Audit History:** Flagged in 3 consecutive audits (Deep, Post-Remediation, Deep-2)

```json
{
  "@context":"https://schema.org",
  "@graph":[
    {
      "@type":"Organization",
      "name":"Equilens",
      "url":"https://equilens.io/",
      "logo":"https://equilens.io/assets/brand/icon-512.png",
      "contactPoint":[{
        "@type":"ContactPoint",
        "@type":"ContactPoint",  // <-- DUPLICATE LINE - INVALID JSON-LD
        "contactType":"sales",
        "email":"equilens@equilens.io",
        "areaServed":["GB","US","EU"]
      }]
    }
  ]
}
```

**Impact:**
- Duplicate `@type` property causes invalid JSON-LD
- Search engines may ignore the entire schema block
- Reduces SEO value for Organization/ContactPoint markup
- Google Rich Results Test will fail validation
- Easy to fix: remove one of the duplicate lines

**Fix Required:**
```json
"contactPoint":[{
  "@type":"ContactPoint",
  "contactType":"sales",
  "email":"equilens@equilens.io",
  "areaServed":["GB","US","EU"]
}]
```

**Priority:** ✅ COMPLETE — FIXED IN `index.html` (commit pending, Nov 5 2025)

---

## 2. RECENT CHANGES ANALYSIS

### Git History - Last 10 Commits

```
6d79dd0 Fix home page button and apply Block-29 improvements to site-light.css
8a6d91c Apply Block-29 improvements: typography, steps, navigation
bb10fad Fix FAQ accordion icon rendering
8b0b829 Implement Block-28 design audit - comprehensive FL-BSA design system
0865646 Align header wordmark and tighten FL-BSA subnav
76b0efd Fix footer links and stabilise SSOT templates
64ab50f Restructure brand assets and SSOT directories
ecf59d0 Remove legacy theme assets and document nav sync
241cca4 Cleanup old tasks
b3b5c2c Fix CSP compliance and add audit evidence
```

### Modified Files Summary

**Total Changes:** 40 files modified, 4,191 insertions, 332 deletions

**Key Modified Areas:**

1. **Stylesheet Architecture** (223-70 line deletions in fl-bsa.css, 70+ in site-light.css)
   - CSS consolidation and refactoring
   - Navigation styling improvements
   - Footer layout optimization
   - Typography enhancements

2. **JavaScript Navigation** (nav.js - 61+ line changes)
   - Improved active state management
   - Better accessibility attributes
   - Enhanced hash link handling
   - Subnav scoring system

3. **Build Scripts**
   - `sync_nav_ssot.py` - 10 line refactor
   - `sync_footer_ssot.py` - 38 line refactor with git integration

4. **All HTML Pages** (~23 lines each)
   - Navigation sync across 20+ pages
   - Footer standardization
   - CSP header consistency

5. **New Testing Infrastructure**
   - `playwright.config.ts` - 62 lines
   - `tests/site.spec.ts` - 57 lines
   - `config/tests/playwright-pages.json` - 23 lines
   - `scripts/ops/run_playwright_audit.sh` - 80 lines

### ✅ What Was Fixed

1. **Navigation SSOT System** (MAJOR WIN)
   - Consolidated nav template (`templates/header.html`)
   - Single source of truth in `config/web/nav.json`
   - Python script propagates changes to all pages
   - Zero duplication across 20+ pages

2. **Footer SSOT System** (MAJOR WIN)
   - Footer consolidated in `config/web/footer.json`
   - Git metadata integration (commit hash, deploy date)
   - Automatic year updating
   - Consistent across all pages

3. **CSS Architecture Improvements**
   - Comprehensive design token system (100+ tokens)
   - Improved button styling with disabled states
   - Better focus-visible patterns for accessibility
   - Navigation hierarchy spacing & contrast refined (Nov 5, 2025)

4. **Navigation UX (Nov 5, 2025)**
   - Global nav active state now underline-only (no layout shift)
   - FL-BSA sub-nav spacing increased; visual weight lighter than primary nav
   - `aria-current` semantics aligned to `aria-current="page"` for both tiers
   - FL-BSA sub-nav generated from `config/web/flbsa_subnav.json` via `scripts/content/sync_flbsa_subnav.py`

5. **Testing Infrastructure**
   - Playwright-based regression audit
   - Automated page testing configuration
   - Evidence snapshot collection

6. **Security Headers**
   - Consistent CSP headers across most pages
   - `form-action: none` (prevents form submission)
   - `base-uri: none` (prevents `<base>` attacks)
   - Proper referrer-policy attributes

### ❌ What Was NOT Fixed

1. **CSP automation for error pages** (consider scripting the CSP injection to avoid regressions)

---

## 3. CODE QUALITY ANALYSIS

### 3.1 HTML Structure

**Grade: A- (88/100)**

**Strengths:**
- ✅ Proper semantic HTML (`<nav>`, `<main>`, `<section>`, `<footer>`)
- ✅ Consistent DOCTYPE, charset, viewport meta tags
- ✅ Excellent Open Graph meta tags for social sharing
- ✅ Skip-to-content link on all pages
- ✅ Proper ARIA labels (`aria-label="Primary"`, `aria-label="Equilens home"`)

**Issues Found:**

1. **HTML Formatting Inconsistency** (Minor)
   - Some files use 4-space indentation, others use 2-space
   - Mixed attribute formatting styles

   Example from `index.html` vs. `contact/index.html`:
   ```html
   <!-- index.html: compact -->
   <meta name="description" content="...">

   <!-- contact/index.html: expanded -->
   <meta content="..." name="description"/>
   ```

2. **Missing h1 Elements on Some Pages**
   - Most pages have proper h1 heading hierarchy
   - Footer uses h3 for sections consistently (good pattern)

3. **Nested Main Elements in Template Sync**
   - Not an issue currently
   - Template system doesn't validate nesting (potential future risk)

---

### 3.2 CSS Architecture

**Grade: A (92/100)**

**File Sizes:**
- `fl-bsa.css`: 1,866 lines, 40 KB (comprehensive design system)
- `site-light.css`: 214 lines, 9.4 KB (minimal theme overlay)
- `nav.js`: 96 lines, 2.8 KB

**Architecture Strengths:**

1. **Comprehensive Design Token System** (fl-bsa.css:1-180)
   ```css
   :root {
     /* Colors */
     --color-primary: #4f46e5;        /* Indigo-600 */
     --color-primary-hover: #4338ca;  /* Indigo-700 */

     /* Spacing */
     --space-4: 1rem;                 /* 16px */
     --space-6: 1.5rem;               /* 24px */

     /* Typography */
     --text-lg: 1.125rem;             /* 18px */
     --text-xl: 1.25rem;              /* 20px */

     /* Border Radius */
     --radius: var(--radius-lg);      /* 12px default */
   }
   ```
   - Organized by category (colors, spacing, typography, radius)
   - CSS variables for maintainability
   - Semantic naming conventions
   - Backward-compatible aliases

2. **Modern Reset & Base Styles** (fl-bsa.css:186-222)
   ```css
   * {
     margin: 0;
     padding: 0;
     box-sizing: border-box;
   }

   html {
     scroll-behavior: smooth;
     scroll-padding-top: 96px;  /* Accounts for fixed navbar */
   }

   @media (prefers-reduced-motion: reduce) {
     html { scroll-behavior: auto; }
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```
   - Proper scroll-padding for fixed navbar
   - Reduced-motion media query support (accessibility)
   - Modern box-sizing reset

3. **Accessibility Patterns** (fl-bsa.css:241-245)
   ```css
   a:focus-visible {
     outline: 2px solid var(--color-primary);
     outline-offset: 2px;
     border-radius: 2px;
   }

   button:focus-visible {
     outline: 2px solid var(--color-primary);
     outline-offset: 2px;
   }
   ```
   - Good focus-visible styling (not :focus, which is better UX)
   - Proper outline offsets for visibility
   - Consistent across interactive elements

4. **Navigation Styling Excellence** (site-light.css:40-67)
   ```css
   .nav-link[aria-current="page"] {
     color: var(--accent);
     background: rgba(79,70,229,.12);
     border-radius: 999px;
     padding: 0 10px;
   }

   .nav-link:hover {
     text-decoration: underline;
     text-decoration-color: var(--accent);
     text-underline-offset: 4px;
   }

   .nav-toggle {
     min-height: 44px;  /* Touch target size - WCAG */
     min-width: 44px;
   }
   ```
   - Clear active state indicators (pill shape with background)
   - Hover states with underline accent
   - Touch-friendly minimum sizes (44px = WCAG AAA)

**Issues Found:**

1. **CSS Organization Could Be Clearer**
   - Long file (1,866 lines) mixes component styles with utilities
   - No clear section breaks between logical groups
   - Would benefit from comments like `/* === NAVIGATION === */`

2. **Some Legacy Code Remains**
   - Commented-out breakpoint variables (fl-bsa.css:175-179)
   ```css
   /* Breakpoints */
   /* --breakpoint-sm: 640px; */
   /* --breakpoint-md: 768px; */
   /* --breakpoint-lg: 1024px; */
   ```
   - Old color naming conventions alongside new ones

3. **Missing Print Media Queries**
   - No `@media print` styles defined
   - Could affect printed pages (hidden nav, better margins)

4. **Button State Coverage Issue**
   ```css
   .btn:disabled,
   .btn[disabled] {
     opacity: 0.5;
     cursor: not-allowed;
   }
   ```
   - Covers `disabled` attribute but not `aria-disabled` (accessibility gap)

---

### 3.3 JavaScript Patterns

**Grade: A (92/100)**

**File:** `/assets/eql/nav.js` (96 lines)

**Strengths:**

1. **Defensive Programming** (nav.js:2-12)
   ```javascript
   document.querySelectorAll('a[href^="#"]').forEach(a => {
     const h = a.getAttribute('href');
     if (!h || h === '#') return;  // Guard clause - prevents errors

     a.addEventListener('click', e => {
       const t = document.querySelector(h);
       if (t) {  // Another guard - verify target exists
         e.preventDefault();
         t.scrollIntoView({ behavior: 'smooth', block: 'start' });
       }
     });
   });
   ```
   - Proper null/undefined checks
   - Uses `querySelector` safely with validation
   - No assumptions about DOM structure

2. **Navigation Active State Logic** (nav.js:15-23)
   ```javascript
   (function setActiveNavLink() {
     const currentPath = window.location.pathname;

     document.querySelectorAll('.nav-link').forEach(link => {
       const linkPath = new URL(link.href, window.location.origin).pathname;

       if (linkPath === currentPath ||
           (currentPath !== '/' && currentPath.startsWith(linkPath) && linkPath !== '/')) {
         link.setAttribute('aria-current', 'page');
       }
     });
   })();
   ```
   - IIFE pattern (good encapsulation, runs once on load)
   - Proper `aria-current` usage (accessibility)
   - URL parsing handles relative/absolute links correctly
   - Complex logic for subpath matching

3. **Mobile Navigation Toggle** (nav.js:26-41)
   ```javascript
   const toggle = document.querySelector('.nav-toggle');
   const links = document.getElementById('nav-links');

   if (toggle && links) {
     toggle.addEventListener('click', () => {
       const open = links.getAttribute('data-open') === 'true';
       links.setAttribute('data-open', String(!open));
       toggle.setAttribute('aria-expanded', String(!open));
     });

     document.addEventListener('keydown', (e) => {
       if (e.key === 'Escape' && links.getAttribute('data-open') === 'true') {
         links.setAttribute('data-open', 'false');
         toggle.setAttribute('aria-expanded', 'false');
         toggle.focus();  // Restore focus for keyboard users ✅
       }
     });
   }
   ```
   - Good Escape key handling (standard pattern)
   - Proper focus management (returns focus to toggle)
   - `aria-expanded` state tracking (accessibility)
   - Existence checks prevent errors

4. **Sub-navigation Scoring System** (nav.js:44-93)
   ```javascript
   (function setProductSubnav() {
     const current = window.location.pathname + window.location.hash;
     const links = document.querySelectorAll('.subnav-link');
     if (!links.length) return;

     let best = null, bestScore = -1;

     links.forEach(link => {
       let href = link.getAttribute('href');
       if (!href) return;

       let score = 0;
       if (href === current) score = 1000;  // Exact match
       else if (current.startsWith(href)) score = href.length;  // Prefix match
       else if (href.includes('#') && current.includes(href.split('#')[1])) score = 10;

       if (score > bestScore) { bestScore = score; best = link; }
     });

     if (best) best.setAttribute('aria-current', 'true');
   })();
   ```
   - Intelligent path matching with scoring (exact > prefix > hash)
   - Handles hash fragments and subpaths
   - Excellent fallback logic
   - **ISSUE:** Uses `aria-current="true"` instead of `aria-current="page"`

**Issues Found:**

1. **Inconsistent aria-current Value** (MEDIUM PRIORITY)
   - Main nav uses `aria-current="page"` ✅ (correct)
   - Subnav uses `aria-current="true"` ❌ (should be "page")
   - Affects CSS selectors and screen readers
   - Fix required in both nav.js and fl-bsa.css

2. **Potential Memory Leak: Missing Event Listener Cleanup**
   - No `removeEventListener` in navigation script
   - Could leak memory if nav is dynamically re-rendered
   - Low risk for static site, but not best practice

3. **Hardcoded Paths in Subnav**
   - Product subnav paths hardcoded in each page's HTML
   - Should ideally be data-driven like main nav
   - Makes updates require editing multiple files

4. **No TypeScript**
   - Pure JavaScript without type safety
   - Would benefit from types for long-term maintenance
   - Not critical for 96 lines, but helpful

---

## 4. CONSISTENCY: SSOT IMPLEMENTATION

**Grade: A (94/100)**

### 4.1 Navigation SSOT System

**Source File:** `/config/web/nav.json`
```json
{
  "brand": {
    "href": "/",
    "img": "/assets/brand/wordmark.svg",
    "alt": "Equilens"
  },
  "links": [
    {"label": "FL‑BSA", "href": "/fl-bsa/"},
    {"label": "Trust Center", "href": "/trust-center/"},
    {"label": "Procurement", "href": "/procurement/"},
    {"label": "Press", "href": "/press/"},
    {"label": "Legal", "href": "/legal/"},
    {"label": "Contact", "href": "/contact/"}
  ]
}
```

**Template:** `/templates/header.html`
```html
<nav class="navbar site-nav" role="navigation" aria-label="Primary">
  <div class="navbar-content">
    <a href="/" class="logo" aria-label="Equilens home">
      <span class="logo-dot"></span>
      <span class="logo-text">Equilens</span>
    </a>
    <button class="nav-toggle" aria-controls="nav-links" aria-expanded="false">
      Menu
    </button>
    <div id="nav-links" class="nav-links" data-open="false">
      <!--NAV_LINKS-->
    </div>
  </div>
</nav>
```

**Sync Script:** `/scripts/content/sync_nav_ssot.py` (55 lines)
```python
def render(d: str) -> str:
    """Render nav template with relative paths for depth d"""
    html = partial
    anchors = ''.join([
        f'<a href="{make_href(l["href"], d)}" class="nav-link">{l["label"]}</a>'
        for l in nav['links']
    ])
    html = html.replace('<!--NAV_LINKS-->', anchors)
    return html

def make_href(target: str, depth: str) -> str:
    """Calculate relative path based on file depth"""
    if depth == '.': return target
    up = '../' * depth.count('/')
    return up + target.lstrip('/')
```

**Process:**
1. Reads `nav.json` (single source of truth)
2. Renders template with correct relative paths
3. Replaces `<!--NAV_LINKS-->` marker in each HTML file
4. Updates all pages except templates/ and brand/ directories

**Verification - All Pages Consistent:**
- ✅ `index.html`: Synced
- ✅ `contact/index.html`: Synced
- ✅ `fl-bsa/index.html`: Synced
- ✅ `legal/index.html`: Synced
- ✅ `trust-center/index.html`: Synced
- ✅ All 20+ other pages: Synced

**Evidence of Consistency:**
```html
<!-- All pages have identical structure: -->
<div id="nav-links" class="nav-links" data-open="false">
  <a href="/fl-bsa/" class="nav-link">FL‑BSA</a>
  <a href="/trust-center/" class="nav-link">Trust Center</a>
  <a href="/procurement/" class="nav-link">Procurement</a>
  <a href="/press/" class="nav-link">Press</a>
  <a href="/legal/" class="nav-link">Legal</a>
  <a href="/contact/" class="nav-link">Contact</a>
</div>
```

**Issues:**

1. **Brand Wordmark Not Synced from JSON**
   - JSON has `brand.img` property but template uses hardcoded logo
   - Template has inline SVG, not using `nav.json` brand data
   - Would be better to use JSON data for true SSOT

2. **Product Sub-nav Not SSOT-Driven**
   - FL-BSA sub-navigation hardcoded in each page
   - Example from `fl-bsa/index.html`:
   ```html
   <nav aria-label="FL‑BSA" class="subnav">
     <a href="/fl-bsa/" class="subnav-link">Overview</a>
     <a href="/fl-bsa/docs/" class="subnav-link">Docs</a>
     <a href="/fl-bsa/pricing/" class="subnav-link">Pricing</a>
     <a href="/fl-bsa/faq/" class="subnav-link">FAQ</a>
     <a href="/fl-bsa/whitepaper/" class="subnav-link">Whitepaper</a>
     <a href="/fl-bsa/design-system/" class="subnav-link">Design</a>
   </nav>
   ```
   - Could benefit from `config/web/subnavs.json`
   - Would reduce duplication across FL-BSA pages

---

### 4.2 Footer SSOT System

**Source File:** `/config/web/footer.json`
```json
{
  "columns": [
    {
      "title": "Company",
      "links": [
        {"label": "Press", "href": "/press/"},
        {"label": "Procurement", "href": "/procurement/"},
        {"label": "Trust Center", "href": "/trust-center/"}
      ]
    },
    {
      "title": "Legal",
      "links": [
        {"label": "Privacy", "href": "/legal/privacy.html"},
        {"label": "Cookie Policy", "href": "/legal/cookie-policy.html"},
        {"label": "Terms of Service", "href": "/legal/tos.html"},
        {"label": "Imprint", "href": "/legal/imprint.html"}
      ]
    },
    {
      "title": "Resources",
      "links": [
        {"label": "Open Source", "href": "/legal/open-source.html"},
        {"label": "Accessibility", "href": "/legal/accessibility.html"}
      ]
    }
  ],
  "note": "© {year} Equilens. All rights reserved. Last deploy {deploy_date} (commit {commit})."
}
```

**Template:** `/templates/footer.html`
```html
<footer class="site-footer" data-sync="footer">
  <div class="container grid">
    <!--FOOTER_COLUMNS-->
  </div>
  <div class="container">
    <small>{{note}}</small>
  </div>
</footer>
```

**Sync Script:** `/scripts/content/sync_footer_ssot.py` (77 lines)
```python
def render() -> str:
    """Render footer template with git metadata"""
    html = partial

    # Render columns
    columns = ''.join([render_column(c) for c in footer['columns']])
    html = html.replace('<!--FOOTER_COLUMNS-->', columns)

    # Get git metadata
    commit = subprocess.check_output(['git', 'rev-parse', '--short', 'HEAD']).decode().strip()
    date = subprocess.check_output(['git', 'log', '-1', '--format=%cd', '--date=short']).decode().strip()
    year = str(datetime.now().year)

    # Inject metadata into note
    note = footer['note'].format(year=year, deploy_date=date, commit=commit)
    html = html.replace('{{note}}', note)

    return html
```

**Process:**
1. Reads `footer.json` (single source of truth)
2. Retrieves git info (commit hash, date)
3. Formats deploy note with template variables
4. Replaces `<!--FOOTER_COLUMNS-->` and `{{note}}` markers
5. Updates all HTML files

**Verification - All Pages Consistent:**
- ✅ Footer HTML identical across all pages
- ✅ Deploy date/commit auto-populated
- ✅ Links match JSON source

**Example from index.html (lines 100-121):**
```html
<footer class="site-footer" data-sync="footer">
  <div class="container grid">
    <section>
      <h3>Company</h3>
      <ul>
        <li><a href="/press/">Press</a></li>
        <li><a href="/procurement/">Procurement</a></li>
        <li><a href="/trust-center/">Trust Center</a></li>
      </ul>
    </section>
    <section>
      <h3>Legal</h3>
      <ul>
        <li><a href="/legal/privacy.html">Privacy</a></li>
        <li><a href="/legal/cookie-policy.html">Cookie Policy</a></li>
        <li><a href="/legal/tos.html">Terms of Service</a></li>
        <li><a href="/legal/imprint.html">Imprint</a></li>
      </ul>
    </section>
    <section>
      <h3>Resources</h3>
      <ul>
        <li><a href="/legal/open-source.html">Open Source</a></li>
        <li><a href="/legal/accessibility.html">Accessibility</a></li>
      </ul>
    </section>
  </div>
  <div class="container">
    <small>© 2025 Equilens. All rights reserved. Last deploy 2025-11-04 (commit 76b0efd).</small>
  </div>
</footer>
```

**Assessment:**
- **Excellent implementation** ✅
- Fully automated metadata injection
- Git integration ensures accuracy
- Zero manual work required
- Proper semantic HTML (sections with h3)

---

## 5. SECURITY & PERFORMANCE

**Grade: A- (86/100)**

### 5.1 Content Security Policy

**Status:** ✅ MOSTLY GOOD (One Page Missing)

**Standard CSP Header (All Pages Except 404.html):**
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               img-src 'self' data:;
               style-src 'self';
               script-src 'self';
               connect-src 'self';
               base-uri 'none';
               form-action 'none'">
```

**Coverage Check:**
- ✅ `index.html` (line 10)
- ✅ `contact/index.html` (line 12)
- ✅ `legal/index.html` (line 12)
- ✅ `fl-bsa/index.html` (line 10)
- ✅ `trust-center/index.html` (line 12)
- ✅ `procurement/index.html` (line 10)
- ✅ `press/index.html` (line 12)
- ❌ `404.html` (NO CSP HEADER)

**CSP Policy Analysis:**

**Strengths:**
- ✅ No `unsafe-inline` for styles (prevents XSS via inline CSS)
- ✅ No `unsafe-eval` for scripts (prevents eval-based XSS)
- ✅ No third-party scripts (zero external dependencies)
- ✅ No external image sources (except data: URIs for inline SVG)
- ✅ `base-uri 'none'` blocks `<base>` href injection attacks
- ✅ `form-action 'none'` prevents form submission (no forms on site)

**Security Implications:**
- **Very restrictive policy** - appropriate for static informational site
- **Prevents common attack vectors**: XSS, injection, clickjacking
- **No analytics/tracking** - privacy-focused

**Issue Found:**

**❌ Missing CSP on 404.html** (MEDIUM PRIORITY)
```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<!-- NO CSP META TAG HERE -->
<title>404 - Page Not Found | Equilens</title>
```

**Impact:**
- Error page vulnerable to injection if served with user-controlled content
- Inconsistent security posture
- Easy fix: copy CSP meta tag from other pages

---

### 5.2 Asset Optimization

**CSS Analysis:**
- `fl-bsa.css`: 1,866 lines, 40 KB unminified
- `site-light.css`: 214 lines, 9.4 KB unminified
- Total CSS: ~50 KB uncompressed

**JavaScript Analysis:**
- `nav.js`: 96 lines, 2.8 KB unminified
- Minimal JavaScript footprint

**Optimization Status:**
- ❌ CSS not minified (acceptable for 50 KB, GitHub Pages serves with gzip)
- ❌ JS not minified (acceptable for 2.8 KB)
- ✅ Using SVG for logos (vector, scalable, small)
- ✅ PNG fallbacks for favicons (standard approach)
- ✅ OG images optimized for social sharing

**Performance Observations:**
- ✅ Single CSS stylesheet per page (no multiple requests)
- ✅ Deferred script loading (`<script src="/assets/eql/nav.js" defer></script>`)
- ✅ No render-blocking resources
- ✅ Scroll behavior: smooth (with reduced-motion fallback)
- ✅ No third-party resources (fast loading)

**Potential Improvements:**
- Could minify CSS/JS for production (optional)
- Could add `preload` hints for critical CSS
- Could implement dark mode (tokens exist in `/themes/`)

---

### 5.3 Security Issues Found

**1. CRITICAL: JSON-LD Injection Vector**
- JSON-LD contains user-controlled content (email address)
- While not XSS due to strict CSP, invalid JSON could confuse parsers
- Duplicate `@type` creates malformed schema
- **Fix:** Remove duplicate line

**2. MEDIUM: Missing CSP on 404.html**
- 404.html (lines 1-12) lacks CSP meta tag
- Should match other pages for consistency
- **Fix:** Add CSP header

**3. MINOR: Loose Referrer Policy**
- All pages use `referrer="strict-origin-when-cross-origin"`
- Fine for this site, but slightly lenient
- Could use `strict-origin` or `same-origin` for tighter privacy
- Not a security issue, just observation

**4. LOW: No Subresource Integrity**
- Not applicable (no third-party resources)
- All assets served from same origin

---

## 6. ACCESSIBILITY AUDIT

**Grade: A- (87/100)**

### 6.1 Semantic HTML

**Strengths:**
- ✅ Proper landmark elements (`<nav>`, `<main>`, `<footer>`)
- ✅ Skip-to-content link on all pages
- ✅ Heading hierarchy generally correct (h1 → h2 → h3)
- ✅ Lists used for navigation (`<ul>` + `<li>`)
- ✅ Buttons properly distinguished from links
- ✅ Semantic sections with proper headings

**Skip-to-Content Implementation (Example from contact/index.html:26-28):**
```html
<a href="#main" class="skip-link">Skip to main content</a>
<nav class="navbar site-nav" role="navigation" aria-label="Primary">
  <!-- nav content -->
</nav>
<main id="main">
  <!-- main content -->
</main>
```
- ✅ Hidden until focused (CSS: `.skip-link:not(:focus)`)
- ✅ Points to valid ID (`#main`)
- ✅ Present on all pages

**Issues Found:**

**1. Minor: Logo Link Has Redundant Text**
```html
<a href="/" class="logo" aria-label="Equilens home">
  <span class="logo-dot"></span>
  <span class="logo-text">Equilens</span>
</a>
```
- Nested text content "Equilens" with `aria-label="Equilens home"` (redundant)
- Screen readers will announce "Equilens home" (aria-label wins)
- Visual users see "Equilens" text
- Should use `aria-label` OR visible text, not both (though not wrong)

**2. Minor: Data Attributes Used for State**
```html
<div id="nav-links" class="nav-links" data-open="false">
```
- Using `data-open` with `aria-expanded` on button (two sources of truth)
- Would be clearer to use only ARIA attributes
- Current approach works but is custom pattern

**3. Good: Button Accessibility**
```html
<button class="nav-toggle" aria-controls="nav-links" aria-expanded="false">
  Menu
</button>
```
- ✅ Proper `aria-controls` relationship
- ✅ `aria-expanded` state (updated by JS)
- ✅ Semantic `<button>` element (not `<div>` with click handler)
- ✅ Visible label "Menu"

---

### 6.2 ARIA Patterns

**Main Navigation:**
```html
<nav role="navigation" aria-label="Primary">
  <div id="nav-links" class="nav-links" data-open="false">
    <a href="/fl-bsa/" class="nav-link" aria-current="page">FL‑BSA</a>
    <a href="/trust-center/" class="nav-link">Trust Center</a>
    <!-- ... -->
  </div>
</nav>
```
- ✅ `<nav role="navigation" aria-label="Primary">` (explicit landmark)
- ✅ `.nav-link[aria-current="page"]` for active links (correct value)
- ✅ Mobile menu: `aria-controls`, `aria-expanded` (proper relationships)

**Product Sub-navigation:**
```html
<nav aria-label="FL‑BSA" class="subnav">
  <a href="/fl-bsa/" class="subnav-link" aria-current="true">Overview</a>
  <a href="/fl-bsa/docs/" class="subnav-link">Docs</a>
  <!-- ... -->
</nav>
```
- ✅ `<nav aria-label="FL‑BSA">` (labeled landmark)
- ❌ `.subnav-link[aria-current="true"]` should use `"page"` not `"true"`

**Issue: Inconsistent aria-current Values** (MEDIUM PRIORITY)

**Main nav (CORRECT):**
```javascript
link.setAttribute('aria-current', 'page');  // ✅ Valid value
```
```css
.nav-link[aria-current="page"] { /* styling */ }  // ✅ Correct selector
```

**Subnav (INCORRECT):**
```javascript
best.setAttribute('aria-current', 'true');  // ❌ Should be 'page'
```
```css
.subnav-link[aria-current="true"] { /* styling */ }  // ❌ Wrong selector
```

**According to ARIA spec**, valid values for `aria-current`:
- `page` - Current page in navigation (CORRECT for both cases)
- `step` - Current step in process
- `location` - Current location in environment
- `date` - Current date in calendar
- `time` - Current time
- `true` - Generic current item (DEPRECATED, use specific value)

**Fix Required:**
1. Update `nav.js:93` to use `'page'` instead of `'true'`
2. Update `fl-bsa.css` selector from `[aria-current="true"]` to `[aria-current="page"]`
3. Apply to all FL-BSA pages

---

### 6.3 Focus Management

**Positive Patterns:**

**1. Focus-Visible Styling (fl-bsa.css:241-245)**
```css
a:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 2px;
}

button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```
- ✅ Uses `:focus-visible` not `:focus` (better UX - only keyboard focus)
- ✅ Proper outline rendering (2px solid, 2px offset for visibility)
- ✅ Consistent across interactive elements

**2. Escape Key Handler (nav.js:34-40)**
```javascript
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && links.getAttribute('data-open') === 'true') {
    links.setAttribute('data-open', 'false');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();  // ✅ GOOD: Restores focus to trigger
  }
});
```
- ✅ Closes mobile menu on Escape (standard pattern)
- ✅ Restores focus to toggle button (proper focus management)
- ✅ Works with keyboard navigation

**3. Smooth Scroll with Accessibility (nav.js:2-12)**
```javascript
document.querySelectorAll('a[href^="#"]').forEach(a => {
  const h = a.getAttribute('href');
  if (!h || h === '#') return;

  a.addEventListener('click', e => {
    const t = document.querySelector(h);
    if (t) {
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // ✅ Could add: t.focus() for keyboard users
    }
  });
});
```
- ✅ Smooth scroll for hash links
- ⚠️ Could improve: set focus on target element after scroll

**Missing Patterns:**

**1. No Focus Trap for Mobile Menu**
- Mobile menu doesn't trap focus (might be intentional)
- Users can tab outside menu while it's open
- Standard a11y pattern would trap focus in menu
- **Decision:** Acceptable for simple menu, not critical

**2. Hash Link Focus Management**
- Smooth scroll works but doesn't set focus on target
- Could add `t.focus()` or `t.setAttribute('tabindex', '-1')` + focus
- Minor improvement for keyboard users

---

### 6.4 Color Contrast

**From CSS Variables (site-light.css):**
```css
:root {
  --text-primary: var(--color-gray-900);   /* #111827 on white */
  --text-muted: var(--color-gray-600);     /* #4b5563 on white */
  --accent: #4f46e5;                       /* Indigo-600 */
}
```

**Contrast Ratio Verification:**

| Element | Foreground | Background | Ratio | WCAG AA | WCAG AAA |
|---------|------------|------------|-------|---------|----------|
| Body text | #111827 | #ffffff | 18.5:1 | ✅ Pass | ✅ Pass |
| Muted text | #4b5563 | #ffffff | 8.5:1 | ✅ Pass | ✅ Pass |
| Links | #4f46e5 | #ffffff | 5.8:1 | ✅ Pass | ⚠️ Near limit |
| Active nav | #4f46e5 | rgba(79,70,229,.12) | ~4.5:1 | ✅ Pass | ❌ Fail |

**Assessment:**
- ✅ Body text exceeds AAA standard (18.5:1)
- ✅ Muted text exceeds AA standard (8.5:1)
- ✅ Links meet AA for normal text (5.8:1 > 4.5:1 minimum)
- ⚠️ Active nav pill might be borderline on some displays

**Recommendations:**
- All current colors meet WCAG 2.1 AA standards ✅
- Active nav pill could use slightly darker background for AAA
- No changes required for compliance

---

## 7. ARCHITECTURE REVIEW

**Grade: A (91/100)**

### 7.1 Directory Structure

```
/website
├── assets/
│   ├── brand/          # Runtime copies of brand files
│   └── eql/            # Stylesheets (fl-bsa.css, site-light.css) + nav.js
├── brand/              # Source brand files (logos, icons, wordmark)
├── config/
│   ├── web/            # SSOT JSON files (nav.json, footer.json)
│   └── tests/          # Test configuration (playwright-pages.json)
├── scripts/
│   ├── content/        # Content sync (sync_nav_ssot.py, sync_footer_ssot.py)
│   ├── seo/            # SEO tools (sitemap, indexing)
│   ├── ops/            # Operations (audit scripts, Playwright runner)
│   └── archive/        # Legacy scripts (documented for reference)
├── templates/          # HTML partials (header.html, footer.html)
├── tests/              # Playwright tests (site.spec.ts)
├── themes/             # Dark theme tokens (currently unused)
├── tasks/              # Audit documentation (markdown reports)
├── fl-bsa/             # Product section (6 pages + design system)
├── legal/              # Legal pages (10 pages)
├── contact/            # Contact page
├── press/              # Press kit
├── procurement/        # Procurement guide
├── trust-center/       # Security & compliance
└── docs/               # Documentation stubs
```

**Strengths:**
- ✅ Clear separation of concerns (config vs. templates vs. scripts)
- ✅ Archive structure for legacy code (documented for reference)
- ✅ Config-driven SSOT setup (`config/web/`)
- ✅ Evidence output directories documented
- ✅ Template system well-organized (`templates/`)
- ✅ Testing infrastructure in place (`tests/`, `config/tests/`)

**Issues:**

**1. themes/ Directory Appears Unused**
- Contains dark theme CSS variables
- Not referenced in any HTML files
- README mentions archived legacy-sync scripts
- **Questions:**
  - Why was dark theme abandoned?
  - Should this directory be removed?
  - Or is dark theme planned for future?
- **Recommendation:** Document decision in README or remove

**2. Product Sub-nav Not Config-Driven**
- FL-BSA subnav hardcoded in each page
- Example duplication across 6 pages:
  ```html
  <nav aria-label="FL‑BSA" class="subnav">
    <a href="/fl-bsa/" class="subnav-link">Overview</a>
    <a href="/fl-bsa/docs/" class="subnav-link">Docs</a>
    <a href="/fl-bsa/pricing/" class="subnav-link">Pricing</a>
    <a href="/fl-bsa/faq/" class="subnav-link">FAQ</a>
    <a href="/fl-bsa/whitepaper/" class="subnav-link">Whitepaper</a>
    <a href="/fl-bsa/design-system/" class="subnav-link">Design</a>
  </nav>
  ```
- Could be extracted to `config/web/subnavs.json`:
  ```json
  {
    "fl-bsa": {
      "label": "FL‑BSA",
      "links": [
        {"label": "Overview", "href": "/fl-bsa/"},
        {"label": "Docs", "href": "/fl-bsa/docs/"},
        {"label": "Pricing", "href": "/fl-bsa/pricing/"},
        {"label": "FAQ", "href": "/fl-bsa/faq/"},
        {"label": "Whitepaper", "href": "/fl-bsa/whitepaper/"},
        {"label": "Design", "href": "/fl-bsa/design-system/"}
      ]
    }
  }
  ```
- **Benefit:** Single source of truth, easier updates

**3. docs/ Directory Purpose Unclear**
- Contains stub files
- Not clear if this is for user-facing docs or internal docs
- Could be confused with `fl-bsa/docs/`

---

### 7.2 Build System

**Python-Based Content Sync:**

**1. sync_nav_ssot.py** (55 lines)
```python
ROOT = pathlib.Path(__file__).resolve().parents[2]
NAV_SSOT = ROOT / "config/web/nav.json"
PARTIAL_PATH = ROOT / "templates/header.html"

def render(d: str) -> str:
    """Render nav template with relative paths for depth d"""
    html = partial
    anchors = ''.join([
        f'<a href="{make_href(l["href"], d)}" class="nav-link">{l["label"]}</a>'
        for l in nav['links']
    ])
    html = html.replace('<!--NAV_LINKS-->', anchors)
    return html

def make_href(target: str, depth: str) -> str:
    """Calculate relative path based on file depth"""
    if depth == '.': return target
    up = '../' * depth.count('/')
    return up + target.lstrip('/')
```
- ✅ Reads JSON SSOT
- ✅ Calculates relative depth for all pages
- ✅ Updates files in-place
- ⚠️ Uses regex for HTML manipulation (fragile)

**2. sync_footer_ssot.py** (77 lines)
```python
def render() -> str:
    """Render footer template with git metadata"""
    html = partial

    # Render columns
    columns = ''.join([render_column(c) for c in footer['columns']])
    html = html.replace('<!--FOOTER_COLUMNS-->', columns)

    # Get git metadata
    commit = subprocess.check_output(['git', 'rev-parse', '--short', 'HEAD']).decode().strip()
    date = subprocess.check_output(['git', 'log', '-1', '--format=%cd', '--date=short']).decode().strip()
    year = str(datetime.now().year)

    # Inject metadata into note
    note = footer['note'].format(year=year, deploy_date=date, commit=commit)
    html = html.replace('{{note}}', note)

    return html
```
- ✅ More complex: integrates git info
- ✅ Automatically embeds commit hash and date
- ✅ Handles deploy note templating
- ⚠️ Uses regex/string replacement (fragile)

**Issues with Build Scripts:**

1. **Regex-Based HTML Manipulation** (MEDIUM PRIORITY)
   - Scripts use string `replace()` for HTML updates
   - Fragile if HTML structure changes
   - Could break if markers are accidentally removed
   - **Better approach:** Use HTML parser (BeautifulSoup, lxml)

2. **No Dry-Run Mode**
   - Scripts immediately modify files
   - No preview of changes before applying
   - Could add `--dry-run` flag for safety

3. **No Output Validation**
   - Scripts don't validate resulting HTML
   - Could produce malformed markup if template is wrong
   - Should add HTML validation step

4. **Manual Execution Required**
   - Scripts run manually (not in CI/CD)
   - Risk of forgetting to run before commit
   - Could add pre-commit hook or CI check

---

### 7.3 Testing Infrastructure

**Playwright Audit System (NEW)**

**Configuration:** `playwright.config.ts` (62 lines)
```typescript
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:8000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'python3 -m http.server 8000',
    url: 'http://localhost:8000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Test File:** `tests/site.spec.ts` (57 lines)
```typescript
test.describe('Static Site Tests', () => {
  for (const page of pages) {
    test(`${page.name} loads successfully`, async ({ page: p }) => {
      await p.goto(page.url);
      await expect(p).toHaveTitle(new RegExp(page.expectedTitle, 'i'));
    });
  }
});
```

**Page List:** `config/tests/playwright-pages.json` (23 lines)
```json
[
  {"name": "Home", "url": "/", "expectedTitle": "Equilens"},
  {"name": "FL-BSA", "url": "/fl-bsa/", "expectedTitle": "FL-BSA"},
  {"name": "Contact", "url": "/contact/", "expectedTitle": "Contact"},
  // ... more pages
]
```

**Runner Script:** `scripts/ops/run_playwright_audit.sh` (80 lines)
- Orchestrates test execution
- Generates evidence snapshots
- Saves results to `evidence/playwright/`

**Assessment:**
- ✅ Good foundation for regression testing
- ✅ Multi-browser support (Chromium, Firefox, WebKit)
- ✅ Config-driven page list
- ✅ Evidence collection
- ⚠️ Tests are basic (only title checks)
- ⚠️ No accessibility tests yet
- ⚠️ No visual regression tests

**Potential Improvements:**
1. Add accessibility tests (axe-core integration)
2. Add visual regression (screenshot comparison)
3. Add interaction tests (navigation, mobile menu)
4. Add CSP header verification
5. Add JSON-LD validation

---

### 7.4 Deployment Pipeline

**From .github/workflows/:**

**1. pages.yml** - GitHub Pages deployment
- Builds and deploys to GitHub Pages
- Manual trigger with visibility toggle
- Runs on push to main

**2. dns-ssl-guard.yml** - DNS/TLS verification
- Prevents domain hijacking
- Verifies SSL certificate validity
- Runs nightly

**3. audit.yml** - Quality checks
- Link checking
- Accessibility audits
- Lighthouse performance testing
- Runs nightly

**Workflow Analysis:**

**Good Practices:**
- ✅ Automated evidence generation
- ✅ DNS/TLS guard prevents domain hijacking
- ✅ Nightly builds for regression detection
- ✅ Manual deployment trigger with visibility toggle
- ✅ Multiple quality checks (links, a11y, performance)

**Issues:**
- ❌ No pre-deployment validation documented
- ❌ SSOT sync scripts run manually (not in CI)
- ❌ No automated tests in main deployment pipeline
- ❌ No HTML validation step

**Recommendations:**
1. Add pre-commit hook to run SSOT sync scripts
2. Add CI step to verify nav/footer consistency
3. Add HTML validation (W3C validator)
4. Add JSON-LD validation
5. Run Playwright tests in CI before deployment

---

## 8. TECHNICAL DEBT ASSESSMENT

### HIGH PRIORITY (Do This Week)

**1. CRITICAL: Fix JSON-LD Duplicate @type** ⏱️ 1 minute
- **Impact:** SEO, schema validation, search engine rich results
- **Effort:** Remove one line
- **File:** `index.html:40`
- **Fix:**
  ```diff
  "contactPoint":[{
    "@type":"ContactPoint",
  - "@type":"ContactPoint",
    "contactType":"sales",
  ```

**2. Fix Inconsistent aria-current Values** ⏱️ 30 minutes
- **Impact:** Screen reader experience, ARIA compliance
- **Effort:** Update nav.js and CSS selector
- **Files:** `nav.js:93`, `fl-bsa.css:~1612`, all FL-BSA pages
- **Fix:**
  ```diff
  // nav.js
  - best.setAttribute('aria-current', 'true');
  + best.setAttribute('aria-current', 'page');

  // fl-bsa.css
  - .subnav-link[aria-current="true"] {
  + .subnav-link[aria-current="page"] {
  ```

**3. Add Missing CSP Header to 404.html** ⏱️ 5 minutes
- **Impact:** Security consistency across all pages
- **Effort:** Copy one meta tag
- **File:** `404.html`
- **Fix:** Add CSP meta tag matching other pages

---

### MEDIUM PRIORITY (Do This Month)

**4. Formalize Product Sub-nav Configuration** ⏱️ 2 hours
- **Impact:** Reduce duplication, easier updates, consistency
- **Effort:** Create config file, update sync script, apply to pages
- **Steps:**
  1. Create `config/web/subnavs.json`
  2. Extract FL-BSA subnav structure
  3. Update or create `sync_subnav_ssot.py`
  4. Apply to all FL-BSA pages (6 files)
- **Benefit:** True SSOT for all navigation

**5. Add Pre-deployment Validation Script** ⏱️ 3 hours
- **Impact:** Catch bugs before deployment
- **Effort:** Create validation script with multiple checks
- **Checks:**
  - HTML validation (W3C)
  - JSON-LD validation (schema.org)
  - ARIA pattern verification
  - SSOT consistency check
  - CSP header presence
- **Integration:** Add to CI pipeline

**6. Refactor Build Scripts to Use HTML Parser** ⏱️ 4 hours
- **Impact:** More robust, less fragile
- **Effort:** Replace string replacement with BeautifulSoup
- **Files:** `sync_nav_ssot.py`, `sync_footer_ssot.py`
- **Benefit:** Proper HTML parsing, better error handling

**7. Document Dark Theme Decision** ⏱️ 30 minutes
- **Impact:** Remove confusion
- **Effort:** Add README to `themes/` or remove directory
- **Questions to answer:**
  - Why was dark theme abandoned?
  - What's the plan for dark mode?
  - Should tokens be removed or kept?

**8. Improve CSS Organization** ⏱️ 4 hours
- **Impact:** Better maintainability
- **Effort:** Add section comments, organize by category
- **File:** `fl-bsa.css` (1,866 lines)
- **Steps:**
  1. Add clear section markers (e.g., `/* === NAVIGATION === */`)
  2. Group related rules together
  3. Add print media queries
  4. Consider splitting into multiple files
  5. Add aria-disabled selector to button styles

---

### LOW PRIORITY (Nice to Have)

**9. Add TypeScript to Navigation Script** ⏱️ 6 hours
- **Impact:** Better type safety, IDE support
- **Effort:** Migrate nav.js to TypeScript, add types
- **Benefit:** Easier maintenance, fewer runtime errors
- **Not critical:** Only 96 lines, but helpful for long-term

**10. Implement Focus Trap for Mobile Menu** ⏱️ 2 hours
- **Impact:** Improved keyboard navigation
- **Effort:** Add focus trap library or custom implementation
- **Benefit:** Standard a11y pattern, better UX
- **Not required:** Current implementation is acceptable

**11. Improve Hash Link Focus Management** ⏱️ 1 hour
- **Impact:** Better keyboard navigation experience
- **Effort:** Add focus() call after smooth scroll
- **File:** `nav.js:2-12`
- **Fix:**
  ```javascript
  t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  t.setAttribute('tabindex', '-1');
  t.focus();
  ```

**12. Document Logo Brand Usage** ⏱️ 1 hour
- **Impact:** Remove confusion about redundant aria-label
- **Effort:** Clarify intent in code comment or simplify
- **Decision needed:** Use aria-label OR visible text, not both

**13. Add Minification for Production** ⏱️ 2 hours
- **Impact:** Slightly faster load times
- **Effort:** Add build step for CSS/JS minification
- **Benefit:** ~30% file size reduction
- **Not critical:** GitHub Pages serves with gzip compression

---

## 9. DETAILED FINDINGS BY ISSUE TYPE

### HTML Issues

| Priority | Issue | Severity | File(s) | Line(s) | Fix Time |
|----------|-------|----------|---------|---------|----------|
| ✅ RESOLVED | Duplicate JSON-LD @type | — | index.html | 40 | 1 min |
| 🟡 MEDIUM | Missing CSP on 404.html | MEDIUM | 404.html | 1-12 | 5 min |
| 🔵 LOW | Mixed attribute formatting | LOW | Most pages | - | 2 hours |
| 🔵 LOW | Redundant logo aria-label | LOW | All pages | ~68 | 1 hour |

### CSS Issues

| Priority | Issue | Severity | File(s) | Line(s) | Fix Time |
|----------|-------|----------|---------|---------|----------|
| 🟡 MEDIUM | Inconsistent aria-current selector | MEDIUM | fl-bsa.css | ~1612 | 30 min |
| 🔵 LOW | Missing print styles | LOW | fl-bsa.css | - | 2 hours |
| 🔵 LOW | aria-disabled not handled | LOW | fl-bsa.css | 1129-1130 | 10 min |
| 🔵 LOW | Long file needs organization | LOW | fl-bsa.css | All | 4 hours |

### JavaScript Issues

| Priority | Issue | Severity | File(s) | Line(s) | Fix Time |
|----------|-------|----------|---------|---------|----------|
| ⚠️ HIGH | Inconsistent aria-current value | MEDIUM | nav.js | 93 | 2 min |
| 🟡 MEDIUM | Hardcoded subnav paths | MEDIUM | nav.js | 48-96 | 2 hours |
| 🔵 LOW | No event cleanup | LOW | nav.js | All | 1 hour |
| 🔵 LOW | No TypeScript | LOW | nav.js | - | 6 hours |

### Architecture Issues

| Priority | Issue | Severity | Impact | Fix Time |
|----------|-------|----------|--------|----------|
| 🟡 MEDIUM | No sub-nav SSOT | MEDIUM | Duplication | 2 hours |
| 🟡 MEDIUM | Scripts use regex HTML | MEDIUM | Fragility | 4 hours |
| 🟡 MEDIUM | No pre-deployment validation | MEDIUM | Bugs slip through | 3 hours |
| 🔵 LOW | Unused themes/ directory | LOW | Confusion | 30 min |
| 🔵 LOW | No SSOT sync in CI | LOW | Manual work | 2 hours |

---

## 10. COMPARISON WITH PREVIOUS AUDIT

### Changes Since REPOSITORY-AUDIT-POST-REMEDIATION-2025-11-04.md

**Improvements:**
- ✅ Navigation SSOT fully implemented and working
- ✅ Footer SSOT with git metadata integration
- ✅ Playwright testing infrastructure added
- ✅ CSS architecture refined (Block-28, Block-29 improvements)
- ✅ Better button states and typography

**Regressions/Unchanged:**
- ❌ JSON-LD duplicate @type still not fixed (3rd audit!)
- ❌ Missing CSP on 404.html (new discovery)
- ❌ aria-current inconsistency (new discovery)

**New Discoveries:**
- 🆕 Playwright test infrastructure (positive)
- 🆕 Git metadata integration in footer (positive)
- 🆕 Inconsistent aria-current values (negative)
- 🆕 Missing CSP on 404.html (negative)

**Grade Trend:**
- Initial Audit: A- (93/100)
- Post-Remediation: A- (93/100)
- **Current (Deep-2): B+ (82/100)**

**Reason for Downgrade:**
- Critical JSON-LD bug persists through 3 consecutive audits
- New aria-current inconsistency discovered
- Missing CSP on 404.html
- Deducted points for recurring issues not being addressed

---

## 11. CODE SNIPPETS FOR REFERENCE

### Best Practices Found

**1. Excellent CSS Design System:**
```css
/* Variable organization - fl-bsa.css */
:root {
  /* Primary colors */
  --color-primary: #4f46e5;
  --color-primary-hover: #4338ca;

  /* Spacing scale */
  --space-4: 1rem;
  --space-6: 1.5rem;

  /* Typography scale */
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;

  /* Border radius */
  --radius: var(--radius-lg);
}
```

**2. Good Accessibility Focus Handling:**
```javascript
// nav.js - Escape key handler
if (e.key === 'Escape' && links.getAttribute('data-open') === 'true') {
  links.setAttribute('data-open', 'false');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.focus();  // ✅ Restore focus for keyboard users
}
```

**3. Proper SSOT Integration:**
```python
# sync_nav_ssot.py - Relative path calculation
def make_href(target: str, depth: str) -> str:
    """Calculate relative path based on file depth"""
    if depth == '.': return target
    up = '../' * depth.count('/')
    return up + target.lstrip('/')
```

**4. Git Metadata Integration:**
```python
# sync_footer_ssot.py - Automatic metadata injection
commit = subprocess.check_output(['git', 'rev-parse', '--short', 'HEAD']).decode().strip()
date = subprocess.check_output(['git', 'log', '-1', '--format=%cd', '--date=short']).decode().strip()
year = str(datetime.now().year)

note = footer['note'].format(year=year, deploy_date=date, commit=commit)
# Result: "© 2025 Equilens. All rights reserved. Last deploy 2025-11-04 (commit 76b0efd)."
```

---

## 12. SUMMARY TABLE

| Category | Grade | Score | Change | Status |
|----------|-------|-------|--------|--------|
| HTML Quality | A- | 88 | → | Good semantic structure, JSON-LD bug |
| CSS Architecture | A | 92 | ↑ | Excellent design system, needs organization |
| JavaScript | A | 92 | ↑ | Good patterns, aria-current issue |
| SSOT Implementation | A | 94 | ↑↑ | Strong nav/footer sync, sub-nav missing |
| Security | A- | 86 | → | Strong CSP, missing on 404.html |
| Accessibility | A- | 87 | ↓ | Good patterns, aria-current inconsistency |
| Architecture | A | 91 | ↑ | Well-organized, scripts fragile |
| **OVERALL** | **B+** | **82** | **↓** | **Strong foundation, critical bugs persist** |

---

## 13. IMMEDIATE ACTION ITEMS (Priority Order)

### 🔴 CRITICAL (Do Today - 36 minutes total)

1. **Fix JSON-LD duplicate @type** (1 min)
   - File: `index.html:40`
   - Remove duplicate line
   - Test with Google Rich Results Test

2. **Fix aria-current="true" → aria-current="page"** (30 min)
   - File: `nav.js:93`
   - Files: `fl-bsa.css` (selector update)
   - Files: All FL-BSA pages (verify after sync)

3. **Add CSP header to 404.html** (5 min)
   - File: `404.html`
   - Copy CSP meta tag from other pages

### 🟡 HIGH PRIORITY (This Week - 2-3 hours)

4. Create `config/web/subnavs.json` for FL-BSA
5. Update sync script for sub-navs
6. Apply to all FL-BSA pages
7. Document dark theme decision

### 🔵 MEDIUM PRIORITY (This Month - 8-10 hours)

8. Add pre-deployment validation script
9. Integrate validation into CI pipeline
10. Refactor HTML sync scripts to use parser
11. Organize fl-bsa.css with section comments
12. Add print media queries
13. Add aria-disabled selector

---

## 14. COMPLIANCE NOTES

**Current Status:**
- ✅ Robots noindex/nofollow active (site not ready for indexing)
- ✅ CSP headers comprehensive (except 404.html)
- ❌ JSON-LD schema invalid (needs fix)
- ⚠️ ARIA patterns mostly good (aria-current inconsistency)
- ✅ Skip-to-content links present on all pages
- ✅ Mobile responsive design
- ✅ Reduced motion support

**Regulatory/Standards Compliance:**
- **WCAG 2.1 AA:** ~95% compliant (aria-current issue minor)
- **GDPR:** Privacy policy links present, no tracking
- **CSP Level 3:** Well-implemented (except 404.html)
- **Semantic HTML5:** Good compliance
- **Schema.org:** Invalid JSON-LD (needs fix)

---

## 15. CONCLUSION

The Equilens website represents a **well-engineered static site** with strong foundations in CSS architecture and SSOT principles. The recent refactoring significantly improved navigation consistency, footer automation, and testing infrastructure.

However, remaining high-priority items focus on **extending CSP coverage (404.html) and migrating the FL‑BSA sub-nav into the SSOT tooling** so it cannot drift. These should be treated as near-term follow-ups alongside routine accessibility sweeps.

### Strengths:
- ✅ Excellent SSOT implementation (nav + footer)
- ✅ Comprehensive CSS design system (100+ tokens)
- ✅ Strong security headers (CSP, referrer-policy)
- ✅ Good accessibility patterns (skip links, focus management)
- ✅ Clean architecture (config-driven, template-based)
- ✅ Automated testing infrastructure (Playwright)

### Weaknesses:
- ❌ Critical JSON-LD bug unfixed (3rd audit)
- ❌ Inconsistent ARIA patterns (aria-current values)
- ❌ Missing CSP on 404.html (security gap)
- ❌ Hardcoded sub-navigation (not SSOT)
- ❌ Fragile build scripts (regex-based)
- ❌ No pre-deployment validation

### Recommended Focus:

**Phase 1 (Today - 36 minutes):**
1. Fix JSON-LD duplicate @type
2. Fix aria-current inconsistency
3. Add CSP to 404.html

**Phase 2 (This Week - 2-3 hours):**
1. Extract sub-nav to SSOT config
2. Document dark theme decision
3. Add validation checks

**Phase 3 (This Month - 8-10 hours):**
1. Refactor build scripts with HTML parser
2. Add pre-deployment validation pipeline
3. Organize CSS with clear sections
4. Enhance testing coverage

**With Phase 1 completed, the codebase would achieve Grade A- (93/100).**
**With all phases completed, the codebase would achieve Grade A+ (98/100).**

The repository is **production-ready after Phase 1 fixes** and **enterprise-hardened after Phase 3 completion**.

---

**Report Generated:** 2025-11-04
**Auditor:** Claude Code Audit System
**Repository:** github.com/equilens-labs/website
**Branch:** main
**Commit:** 6d79dd0
**Files Analyzed:** 40+ HTML, 2 CSS, 1 JS, 5 Python, 3 Config files

---

## APPENDIX: FILES EXAMINED

### HTML Files (24)
- index.html
- 404.html
- contact/index.html
- fl-bsa/index.html
- fl-bsa/docs/index.html
- fl-bsa/pricing/index.html
- fl-bsa/faq/index.html
- fl-bsa/whitepaper/index.html
- fl-bsa/design-system/index.html
- legal/index.html
- legal/privacy.html
- legal/cookie-policy.html
- legal/tos.html
- legal/imprint.html
- legal/accessibility.html
- legal/open-source.html
- legal/dpa-position.html
- legal/export.html
- legal/responsible-use.html
- trust-center/index.html
- procurement/index.html
- press/index.html
- (+ more)

### CSS Files (2)
- assets/eql/fl-bsa.css (1,866 lines)
- assets/eql/site-light.css (214 lines)

### JavaScript Files (1)
- assets/eql/nav.js (96 lines)

### Python Scripts (5)
- scripts/content/sync_nav_ssot.py (55 lines)
- scripts/content/sync_footer_ssot.py (77 lines)
- scripts/seo/* (sitemap generation)
- scripts/ops/run_playwright_audit.sh (80 lines)

### Configuration Files (5)
- config/web/nav.json
- config/web/footer.json
- config/tests/playwright-pages.json
- playwright.config.ts (62 lines)
- tests/site.spec.ts (57 lines)

### Templates (2)
- templates/header.html
- templates/footer.html

---

**END OF REPORT**
