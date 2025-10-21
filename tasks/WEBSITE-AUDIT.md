# Equilens Website Comprehensive Audit

**Date:** October 2024
**Auditor:** Claude (Sonnet 4.5)
**Scope:** Full website content, design, technical implementation, and UX
**Overall Score:** 6.5/10

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Critical Issues](#critical-issues)
3. [Content & Messaging](#content--messaging)
4. [Design & Visual Hierarchy](#design--visual-hierarchy)
5. [User Experience](#user-experience)
6. [Accessibility](#accessibility)
7. [Technical Implementation](#technical-implementation)
8. [Performance](#performance)
9. [SEO & Discoverability](#seo--discoverability)
10. [Security & Privacy](#security--privacy)
11. [Code Quality](#code-quality)
12. [Recommendations](#recommendations)
13. [Action Plan](#action-plan)

---

## Executive Summary

Equilens presents a privacy-first, technically sophisticated website for FL-BSA (Fair-Lending Bias-Simulation Appliance). The site demonstrates strong foundations in security, accessibility intent, and regulatory compliance awareness. However, several critical issues require immediate attention, alongside numerous opportunities for enhancement across content, design, and technical implementation.

### Key Strengths
1. **Privacy-first architecture** - No tracking, no cookies, strict CSP
2. **Strong security posture** - Excellent CSP, referrer policy, privacy compliance
3. **Regulatory compliance awareness** - GDPR, accessibility, legal documentation
4. **Technical credibility** - Detailed product descriptions, transparency
5. **Transparent pricing** - Clear tiers with GBP amounts

### Key Weaknesses
1. **Critical HTML structure bugs** - Navbar duplication breaking page structure
2. **Dead code bloat** - 100+ lines of unused JavaScript per page
3. **No social proof** - No testimonials, case studies, or trust indicators
4. **Weak conversion funnel** - Email only, no forms, no clear CTAs
5. **CSS architecture inconsistency** - Multiple conflicting systems, !important wars

---

## Critical Issues 🚨

### 1. Navbar Duplication & HTML Corruption
**SEVERITY: CRITICAL**

**Location:** `/fl-bsa/index.html` (lines 137-175) and `/procurement/index.html` (lines 75-111)

**Issue:** Multiple pages contain **duplicated navbar elements embedded within workflow steps**, creating severe HTML structure violations.

**Example:**
```html
<!-- Line 137-148 in fl-bsa/index.html -->
<div class="step">
  <nav class="navbar" role="navigation" aria-label="Primary">
    <!-- Full navbar markup duplicated INSIDE the step div -->
  </nav>
  <p>Upload structured data or summary statistics...</p>
</div>
```

**Impact:**
- Broken page structure - Navbars appearing inside content cards
- Accessibility violations - Multiple `role="navigation"` with same `aria-label`
- Screen reader confusion - Duplicate landmarks break navigation
- Visual layout chaos - Likely rendering incorrectly
- SEO penalties - Malformed HTML structure

**Root Cause:** Template injection error - header partial being inserted where step content should be.

---

### 2. Broken Navigation Partial System
**SEVERITY: HIGH**

**Location:** `docs/web/partials/header.html`

**Issue:** The header partial contains a placeholder `<!--NAV_LINKS-->` that's never being populated. Yet actual pages have hardcoded navigation links, suggesting the sync system is broken or incomplete.

---

### 3. Dead JavaScript Code
**SEVERITY: MEDIUM**

**Location:** All pages (inline `<script>` blocks, lines 77-119)

**Issue:** Every page contains a **100+ line dead JavaScript block** that references non-existent DOM elements.

**Example:**
```javascript
// Lines 77-119 on every page
try {
  document.querySelectorAll('.site-header').forEach(function (header) {
    var toggle = header.querySelector('.menu-toggle');
    var nav = header.querySelector('.site-nav');
    // ... 40+ lines of code that never runs
```

**Impact:**
- Code bloat - 2KB+ of unused code on every page
- Performance - Unnecessary parsing and execution
- Maintenance debt - Confusing for developers
- No functionality - Uses `.site-header`, `.menu-toggle`, `.site-nav` which don't exist (actual classes are `.navbar`, `.nav-toggle`, `.nav-links`)

---

### 4. CSS Loading Inefficiency
**SEVERITY: MEDIUM**

**Issue:** Stylesheets loaded multiple times with inconsistent order.

**Example from index.html:**
```html
<link rel="stylesheet" href="./assets/base.css">  <!-- Line 13 preload -->
<link rel="stylesheet" href="./assets/base.css">  <!-- Line 28 actual -->
<link rel="stylesheet" href="assets/brand/overrides.css"> <!-- Line 62 -->
<link rel="stylesheet" href="assets/base.css">    <!-- Line 63 duplicate -->
<link rel="stylesheet" href="/assets/eql/site-dark.css"> <!-- Line 64 -->
```

**Impact:**
- Duplicate network requests
- Increased initial load time
- CSS cascade confusion
- FOUC (Flash of Unstyled Content) risk

---

## Content & Messaging

### Strengths ✅

1. **Clear Value Proposition**
   - "Algorithmic compliance that stands up to regulators" - Strong, benefit-focused
   - Technical depth appropriate for B2B/banking audience
   - Compliance-first language resonates with target market

2. **Transparency**
   - Explicit about self-hosting and data boundaries
   - Clear pricing tiers with GBP amounts
   - Honest about "demo watermark" on sandbox tier

3. **Trust-Building**
   - Comprehensive legal/compliance pages
   - Detailed privacy notice (GDPR-compliant)
   - Security transparency (Trust Center)

### Content Gaps & Issues ⚠️

1. **Unclear Product-Market Fit Evidence**
   - No customer testimonials or case studies
   - No quantifiable results
   - Trust badges claim "ISO 27001" but note says "unverified certification claim removed"

2. **Technical Jargon Overload**
   - Assumes reader knows: CTGAN, AIF360, Fairlearn, DI ratio, EO, TPR gaps
   - No glossary or tooltips for regulatory terms (ECOA, Reg B, SR 11-7)
   - Example scenario uses "DI of 0.68" without context

3. **Weak Call-to-Actions**
   - Generic "Contact Equilens" on most pages
   - No urgency or incentive
   - Missing: "Book a demo", "See sample report", "Download whitepaper"

4. **Inconsistent Messaging**
   - Homepage: "30-page report + signed JSON"
   - FL-BSA page: "signed manifest, regulator-ready PDF, certificates"
   - Not clear these are the same thing

5. **FAQ Lacks Depth**
   - Only 5 questions
   - Missing: Integration questions, data format requirements, onboarding timeline
   - No pricing FAQs

6. **Product vs. Company Confusion**
   - `/product/index.html` exists but isn't linked
   - Unclear if Equilens = FL-BSA only or multi-product company

---

## Design & Visual Hierarchy

### Design System Analysis

**Positive:**
- Consistent dark theme (#0f172a background)
- Well-defined design tokens (tokens.json)
- Accessible color contrast for text
- System font stack (privacy-friendly, fast)

**Issues:**

#### 1. Inconsistent Spacing
```css
/* Multiple conflicting spacing systems */
--space-xs: 0.25rem;  /* base.css */
--eql-section: 72px;  /* base.css */
padding: 80px 24px;   /* site-dark.css .section */
padding-block: 72px;  /* overrides.css .section */
```

#### 2. Color Palette Confusion
- `tokens.json` says accent is `#8B5CF6` (purple)
- `overrides.css` sets accent as `#6D28D9` (different purple)
- `site-dark.css` uses `#8b5cf6`
- **Which is correct?**

#### 3. Typography Inconsistency
- Hero h1: `font-size: 56px` (site-dark.css)
- Hero h1: `clamp(34px, 5vw, 48px)` (base.css eql tokens)
- Hero h1: `clamp(1.75rem, 3.6vw, 2.5rem)` (base.css Block-9)
- **Three different sizing systems active simultaneously**

#### 4. Card Styling Chaos
```css
.card { background: #fff; }           /* base.css */
.card { border-radius: 14px; }        /* overrides.css */
.card { background: #0b1020 !important; } /* site-dark.css */
.card { border-radius: 12px; }        /* base.css eql tokens */
```
**Result:** !important wars and unclear final style

### Visual Hierarchy Issues

1. **Homepage Hero Overwhelming**
   - Full-height hero (`min-height: 100vh`) pushes content below fold
   - On 13" laptop, user sees ONLY logo + headline + description
   - Call-to-action buttons barely visible

2. **Poor Content Scanning**
   - No clear visual distinction between sections
   - Card grids look identical whether they're features, benefits, or steps
   - Missing: section dividers, accent colors, iconography consistency

3. **Button Hierarchy Weak**
   ```html
   <a class="btn-primary">Explore FL‑BSA</a>
   <a class="btn-secondary" style="margin-left:12px">Pricing</a>
   ```
   - Inline styles instead of utility classes
   - Secondary button almost invisible (transparent with #334155 border on dark bg)

---

## User Experience

### Navigation Issues

1. **Fixed Navbar Usability**
   ```css
   .navbar { position: fixed; top: 0; width: 100%; }
   ```
   - Covers content when scrolling to anchors
   - No offset for `scroll-margin-top` on sections
   - "Skip to content" link present but navbar remains visible

2. **Mobile Navigation Problems**
   - Menu toggle exists but JS might conflict (dead code vs. active code)
   - No visual indicator of which page you're on
   - Nav links in mobile don't highlight current page

3. **Product Sub-Nav Confusion**
   ```css
   .product-subnav { position: sticky; top: 68px; }
   ```
   - Only appears on FL-BSA pages
   - Sticks below main navbar but no z-index coordination
   - Links to `/fl-bsa/#how-it-works` won't work if section doesn't have that ID

### Information Architecture

**Current Structure:**
```
Home
├── FL-BSA (primary product)
├── Pricing (FL-BSA pricing)
├── Trust Center (company-level)
├── Docs (external GitHub links)
├── FAQ (5 questions)
├── Contact (email only)
└── Legal (8+ pages)
```

**Problems:**
1. Flat hierarchy - No clear primary/secondary distinction
2. Orphaned page - `/product/` exists but isn't linked
3. External dependencies - Docs go to GitHub (breaks user flow)
4. Footer overload - 3 columns with 11+ links

**Recommended Structure:**
```
Home
├── Product
│   └── FL-BSA
│       ├── Overview
│       ├── How It Works
│       ├── Pricing
│       └── Case Studies
├── Solutions (by persona)
│   ├── Compliance Teams
│   ├── Model Risk
│   └── Data Science
├── Resources
│   ├── Documentation
│   ├── Whitepapers
│   ├── FAQ
│   └── Trust Center
├── Company
│   ├── About
│   ├── Press
│   └── Procurement
└── Contact
```

### Conversion Funnel Analysis

**Current Funnel:**
1. Land on homepage → See value prop
2. Click "Explore FL-BSA" → See technical details
3. Click "Contact" → See email address
4. **Dead end** - No form, no demo request, no clear next step

**Drop-off Points:**
- No lead capture mechanism
- Email-only contact (friction for busy executives)
- No pricing calculator or ROI estimator
- Missing: Demo request, trial signup, whitepaper download

---

## Accessibility

### Strengths ✅

1. **Semantic HTML**
   - Proper heading hierarchy (h1 → h2 → h3)
   - `<main>`, `<nav>`, `<footer>` landmarks
   - Skip-to-content link present

2. **ARIA Usage**
   - `role="navigation"` on navbar
   - `aria-label="Primary"` distinguishes navigation
   - `aria-expanded` on mobile toggle
   - `aria-controls` linking toggle to menu

3. **Keyboard Navigation**
   - Escape key closes mobile menu
   - Focus management (toggle.focus() after close)
   - Visible focus indicators (`:focus-visible`)

### Issues & Violations ⚠️

1. **Duplicate Landmarks** (CRITICAL)
   - Multiple `<nav role="navigation" aria-label="Primary">` on same page
   - Caused by navbar duplication bug
   - **WCAG 2.1 SC 1.3.1 failure**

2. **Color Contrast Problems**
   ```css
   .nav-link { color: #94a3b8; }  /* On #0f172a background */
   ```
   - Contrast ratio: **4.2:1** (AA requires 4.5:1 for normal text)
   - `.muted` text (#94a3b8) on dark bg also marginal

3. **Missing Alt Text**
   - Logo uses div + CSS instead of img
   - No text alternative for logo itself (though logo-text exists)

4. **Touch Target Sizes**
   ```css
   .nav-link { font-size: 14px; padding: 8px 10px; }
   ```
   - Touch target: ~30px × ~26px
   - **WCAG 2.1 SC 2.5.5 requires minimum 44×44px**
   - Failing accessibility on mobile

5. **Heading Gaps**
   - Some sections jump from h2 to no heading
   - Card headings should be h3, but some are just `<header>`

---

## Technical Implementation

### HTML Quality

**Strengths:**
- Valid doctype
- UTF-8 charset declared
- Viewport meta tag present
- Semantic HTML5 elements

**Issues:**

1. **Inconsistent Paths**
   ```html
   <link rel="stylesheet" href="./assets/base.css">      <!-- Relative -->
   <link rel="stylesheet" href="/assets/eql/site-dark.css"> <!-- Absolute -->
   <link href="../favicon.svg">                           <!-- Parent relative -->
   ```

2. **Schema.org Markup**
   - ✅ Organization, WebSite, FAQPage schemas present
   - ⚠️ Product schema missing critical fields (offers, aggregateRating, screenshot)

### CSS Architecture

**Current Structure:**
```
1. base.css (13KB, 424 lines)
2. overrides.css (2.7KB, 50 lines)
3. site-dark.css (2.3KB, 69 lines)
Total: ~18.4KB
```

**Problems:**

1. **No Clear Methodology**
   - Not BEM, not SMACSS, not ITCSS
   - Mix of utility classes, component classes, layout classes

2. **Specificity Wars**
   ```css
   .card { background: #fff; }
   .card { background: #0b1020 !important; }
   ```
   - **6 uses of `!important`** in site-dark.css
   - Indicates architectural problems

3. **Unused Styles**
   - `.site-header`, `.site-nav`, `.menu-toggle` defined but not used
   - `.brand-pill` exists but only appears in early CSS

4. **Responsive Design Gaps**
   - Breakpoints don't match modern devices
   - Missing: 768px (iPad), 1024px (iPad Pro), 1440px (laptop)

### JavaScript Quality

**Active Code (`/assets/eql/nav.js`):**
- ✅ Clean, functional
- ✅ Event delegation
- ✅ Keyboard support
- ⚠️ No error boundaries

**Dead Code (inline in every HTML file):**
- ❌ 100+ lines per page
- ❌ References non-existent elements
- ❌ Never executes
- **ACTION: Delete entirely**

---

## Performance

### Asset Analysis

```
CSS: ~18.4KB (not minified)
JS: 1.1KB (nav.js) + ~2KB dead code per page
Fonts: System fonts only ✅ (0KB, privacy-first)
Images: ~29KB OG image, 16KB icon
```

### Opportunities

1. **Minification**
   - CSS not minified (could save ~40%)
   - HTML not minified

2. **Compression**
   - No Brotli/Gzip evidence
   - 18.4KB CSS could be ~7KB compressed

3. **Critical CSS**
   - Above-fold styles should inline
   - Below-fold can defer

4. **Image Optimization**
   - No WebP alternatives
   - No responsive images (`srcset`)

### Render Performance Issues

1. **Fixed Navbar Reflows**
   - Changes opacity on scroll
   - Triggers repaint on every scroll event
   - Should debounce or use CSS only

2. **Layout Shifts**
   - Hero `min-height: 100vh` can shift on mobile address bar hide/show
   - Should use `100dvh` on modern browsers

---

## SEO & Discoverability

### On-Page SEO

**Strengths:**
- ✅ Unique `<title>` per page
- ✅ Meta descriptions present
- ✅ Canonical URLs defined
- ✅ OpenGraph tags
- ✅ Structured data

**Issues:**

1. **Meta Robots - CRITICAL**
   ```html
   <meta name="robots" content="noindex, nofollow">
   ```
   - **EVERY PAGE** has `noindex, nofollow`
   - **Site will NOT appear in Google**
   - Intentional for pre-launch? Or mistake?

2. **Missing Files**
   - No `sitemap.xml`
   - No `robots.txt`

3. **Internal Linking Weak**
   - Homepage doesn't link to `/product/`
   - No breadcrumbs
   - Footer links inconsistent

---

## Security & Privacy

### Strengths ✅

1. **Content Security Policy**
   - Very strict (prevents XSS)
   - No inline scripts
   - No external resources

2. **Referrer Policy**
   - Doesn't leak full URLs to external sites

3. **Privacy Compliance**
   - Comprehensive GDPR-compliant privacy notice
   - No tracking/analytics cookies
   - Clear data controller information

### Missing

1. **HTTP Headers** (can't verify without live server)
   - Should have: X-Frame-Options, HSTS, Permissions-Policy

2. **Cookie Policy Date**
   - Privacy effective date: 2025-10-11 (appears to be placeholder)

---

## Code Quality & Maintainability

### Template System

**Current Approach:**
- Partials in `/docs/web/partials/`
- Footer injected with `data-sync="footer"`
- Header uses `<!--NAV_LINKS-->` placeholder

**Problems:**
1. Sync script not in repo or not working
2. Pages have hardcoded nav links
3. Footer partial has wrong path depths

**Recommendation:**
- Use proper SSG (11ty, Hugo, Jekyll)
- Or document build process

### Git Activity

Recent commits show:
- Active development
- Frequent theme/styling changes (design system instability)
- Nav fixes (confirms navigation issues)
- Code deduplication efforts

---

## Recommendations

### Priority 1: Critical Fixes (Before Launch)

1. ✅ Fix navbar duplication bug
2. ✅ Delete dead JavaScript
3. ✅ Fix CSS loading duplicates
4. ⚠️ Remove `noindex` or confirm intentional
5. ✅ Fix accessibility violations

### Priority 2: Design System (This Month)

6. ✅ Consolidate CSS architecture
7. ✅ Choose single accent color
8. ✅ Unify typography system
9. ✅ Fix card component (remove !important)
10. ✅ Improve button hierarchy

### Priority 3: Navigation & UX (This Month)

11. ✅ Fix fixed navbar scroll issues
12. ✅ Add active page indicators
13. ✅ Standardize footer paths
14. ✅ Fix mobile touch targets
15. ✅ Improve conversion funnel

### Priority 4: Content & Trust (Next Quarter)

16. ⏳ Add case studies/testimonials
17. ⏳ Create demo video
18. ⏳ Expand FAQ
19. ⏳ Launch blog/resources
20. ⏳ Add ROI calculator

### Priority 5: Technical Optimization (Next Quarter)

21. ⏳ Implement proper templating system
22. ⏳ Minify assets
23. ⏳ Add sitemap.xml
24. ⏳ Set up analytics (privacy-preserving)
25. ⏳ Performance optimization

---

## Action Plan

### Immediate (Today/This Week)

**Critical Bug Fixes:**
- [ ] Fix navbar duplication in fl-bsa/index.html, procurement/index.html
- [ ] Remove 100+ line dead JS from all pages
- [ ] Standardize CSS loading order
- [ ] Fix duplicate landmarks (accessibility)

**Design System:**
- [ ] Choose single accent color (#8B5CF6 or #6D28D9)
- [ ] Document in tokens.json
- [ ] Remove conflicting CSS rules
- [ ] Eliminate !important declarations

**Navigation:**
- [ ] Add scroll-padding-top for fixed navbar
- [ ] Implement active page indicators
- [ ] Fix footer relative paths
- [ ] Increase mobile touch targets to 44px

### This Month

**Content:**
- [ ] Expand FAQ to 10-15 questions
- [ ] Add sample report/demo
- [ ] Create one case study (even anonymized)

**Technical:**
- [ ] Minify CSS
- [ ] Add sitemap.xml
- [ ] Run Pa11y + Lighthouse tests
- [ ] Document build process

### Next Quarter

**Growth:**
- [ ] Launch blog with 5-10 articles
- [ ] Create downloadable whitepaper
- [ ] Add demo request form
- [ ] Implement ROI calculator

**Optimization:**
- [ ] Set up privacy-preserving analytics
- [ ] Visual regression testing
- [ ] Performance monitoring
- [ ] Progressive Web App features

---

## Success Metrics

**Design:**
- ✅ No CSS !important (or documented exceptions)
- ✅ Single source of truth for design tokens
- ✅ Consistent spacing across all pages
- ✅ All text meets WCAG AA contrast

**Navigation:**
- ✅ Zero duplicate navbar elements
- ✅ Fixed navbar doesn't cover content
- ✅ Mobile menu works on all pages
- ✅ Current page visually indicated

**Performance:**
- ✅ CSS minified and under 10KB gzipped
- ✅ Zero dead JavaScript
- ✅ Lighthouse score 90+ on all metrics

**Accessibility:**
- ✅ Pa11y reports zero errors
- ✅ All touch targets ≥44×44px
- ✅ No duplicate landmarks
- ✅ WCAG 2.1 AA compliant

---

## Overall Assessment

**Score Breakdown:**
- **Content:** 6/10 (Clear but lacks depth, social proof)
- **Design:** 7/10 (Modern intent, execution issues)
- **UX:** 6/10 (Navigation works, conversion funnel weak)
- **Accessibility:** 7/10 (Good intent, critical bugs)
- **Technical:** 5/10 (Solid foundation, bugs and dead code)
- **SEO:** 4/10 (Good structure, but noindex blocks everything)
- **Security:** 9/10 (Excellent CSP, privacy-first)
- **Performance:** 7/10 (Fast, but not optimized)

**Overall: 6.5/10**

The website has a solid foundation with excellent security and privacy practices, but suffers from critical structural bugs, inconsistent design system implementation, and weak conversion optimization. With the fixes outlined in this audit, the site could easily reach 8-9/10.

**Primary Recommendation:** Fix critical bugs immediately, consolidate design system, then focus on trust-building content and conversion optimization before aggressive marketing.
