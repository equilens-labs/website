# EQUILENS.IO — DESIGN REVIEW & IMPLEMENTATION GUIDE

**Date:** October 13, 2025  
**Reviewer:** Principal Brand Designer & Web UI Art Director  
**Scope:** Homepage design, CSS architecture, responsive behavior, accessibility  
**Status:** 8 critical fixes required before public launch

---

## EXECUTIVE SUMMARY

**Current State:** B grade (83/100)  
**Blockers:** Mobile navigation missing, CSS inconsistencies, inline styles, variable misalignment  
**Timeline:** 2-3 days for critical path, 1 week for production-ready  
**Architecture:** Sound foundation, no major refactoring needed

**What's Working:**
- Information architecture and content strategy (A)
- Accessibility foundation (B+)
- Performance and security (A+)
- Semantic HTML and SEO (A)

**What Needs Fixing:**
- Mobile responsive behavior (no hamburger menu)
- CSS variable mismatches with design tokens
- Typography scale conflicts
- Missing focus states for interactive elements

---

## CRITICAL ISSUES (Sprint 1 - Launch Blockers)

### Issue 1: Mobile Navigation Not Implemented

**Problem:** Navigation has 5 links that will overflow/wrap on mobile viewports. No hamburger menu exists.

**Impact:** Site unusable on mobile (<768px)

**Fix:**

**1a. Add HTML for menu toggle** (in `index.html`, `contact/index.html`, `legal/index.html`):
```html
<!-- Add before closing </nav> -->
<button class="menu-toggle" aria-label="Toggle menu" aria-expanded="false">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
</button>
```

**1b. Add CSS** (append to `assets/base.css`):
```css
.menu-toggle {
  display: none;
  background: none;
  border: 2px solid var(--border);
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 6px;
}

@media (max-width: 768px) {
  .menu-toggle { display: block; }
  
  .site-nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 4px 8px rgba(0,0,0,0.08);
  }
  
  .site-nav.is-open { display: flex; }
  
  .site-nav a {
    margin-left: 0;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    border-radius: 4px;
  }
  
  .site-nav a:hover {
    background: var(--bg);
  }
}
```

**1c. Add JavaScript** (append to existing `<script>` block in footer):
```javascript
// Mobile menu toggle
(function() {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.site-nav');
  
  if (toggle && nav) {
    toggle.addEventListener('click', function() {
      var expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      nav.classList.toggle('is-open');
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();
```

---

### Issue 2: Inline Style Anti-Pattern

**Problem:** `<a style="margin-left:.75rem" href="./contact/">or contact us</a>` in HTML

**Impact:** Breaks CSS cascade, prevents theming, not auditable

**Fix:**

**2a. Add CSS class** (append to `assets/base.css`):
```css
.cta-secondary {
  margin-left: 0.75rem;
  color: var(--accent-link);
  font-weight: 500;
  text-decoration: underline;
}

.cta-secondary:hover {
  color: var(--brand-strong);
}
```

**2b. Update HTML** (in `index.html`):
```html
<!-- Replace this -->
<a style="margin-left:.75rem" href="./contact/">or contact us</a>

<!-- With this -->
<a class="cta-secondary" href="./contact/">or contact us</a>
```

---

### Issue 3: Logo Alt Text Redundancy

**Problem:** `alt="Equilens logo"` is redundant with adjacent text "Equilens"

**Impact:** Screen readers announce "Equilens logo Equilens" (repetitive)

**Fix:**

**3a. Update HTML** (all pages: `index.html`, `contact/index.html`, `legal/index.html`):
```html
<!-- Change from -->
<img class="brand-logo" src="..." alt="Equilens logo" width="32" height="32">

<!-- To -->
<img class="brand-logo" src="..." alt="" width="32" height="32">
```

---

## HIGH PRIORITY ISSUES (Sprint 2 - Quality)

### Issue 4: CSS Variables Misaligned with Design Tokens

**Problem:** CSS variables don't match `docs/brand/tokens.json`:
- `--muted: #475569` should be `#6B7280`
- Missing `--accent-link: #6E59F7`
- Using `--brand-strong` instead of `--slate`

**Impact:** Focus states fail (undefined variable), color inconsistency

**Fix:**

**4a. Replace `:root` block** (in `assets/base.css`):
```css
:root {
  /* Colors - aligned with tokens.json */
  --ink: #0B0B0C;
  --bg: #FFFFFF;
  --surface: #F9FAFB;
  --muted: #6B7280;           /* CHANGED from #475569 */
  --line: #E5E7EB;
  --slate: #1E293B;
  --accent: #8B5CF6;
  --accent-light: #A78BFA;
  --accent-link: #6E59F7;     /* ADDED */
  
  /* Semantic aliases */
  --text: var(--ink);
  --border: var(--line);
  --brand-strong: var(--slate);
  --accent-contrast: #FFFFFF;
  --brand-pill-bg: var(--accent-light);
  --brand-pill-text: var(--slate);
  
  /* Layout */
  --maxw: 960px;
  
  /* Typography */
  --font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  
  /* Spacing - single system */
  --space-xs: 0.25rem;   /* 4px */
  --space-sm: 0.5rem;    /* 8px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 1.5rem;    /* 24px */
  --space-xl: 2rem;      /* 32px */
  --space-2xl: 3rem;     /* 48px */
  --space-3xl: 4rem;     /* 64px */
}
```

**4b. Remove duplicate spacing tokens** (delete these lines from `assets/base.css`):
```css
/* DELETE THESE */
--space-1: 8px;
--space-2: 12px;
--space-3: 16px;
--space-4: 24px;
--space-5: 32px;
--space-6: 48px;
```

**4c. Update focus-visible** (already exists, verify it uses correct variable):
```css
:focus-visible {
  outline: 2px solid var(--accent-link);  /* Now defined */
  outline-offset: 2px;
  border-radius: 6px;
}
```

---

### Issue 5: Typography Scale Conflicts

**Problem:** H1 defined twice with different values:
```css
.hero h1 { font-size: clamp(1.9rem, 3.2vw, 2.75rem); }  /* First */
h1 { font-size: clamp(1.75rem, 3.6vw, 2.5rem); }        /* Second wins */
```

**Impact:** Hero heading smaller than intended, confusion for maintainers

**Fix:**

**5a. Remove duplicate** (delete from `assets/base.css`):
```css
/* DELETE THIS BLOCK */
.hero h1 { font-size: clamp(1.9rem, 3.2vw, 2.75rem); line-height: 1.1; margin: 0 0 .5rem; }
```

**5b. Keep global definitions only** (verify these exist):
```css
h1 { font-size: clamp(1.75rem, 3.6vw, 2.5rem); line-height: 1.15; margin: 0.25rem 0 0.5rem; }
h2 { font-size: clamp(1.25rem, 2.4vw, 1.75rem); margin: 0.75rem 0 0.5rem; }
h3 { font-size: clamp(1.15rem, 1.9vw, 1.35rem); margin: 0.5rem 0 0.25rem; }
```

---

### Issue 6: Incomplete Responsive Breakpoints

**Problem:** Only one breakpoint at 900px. No tablet optimization, no mobile-specific adjustments.

**Impact:** Content cramped on mobile, inefficient use of tablet space

**Fix:**

**6a. Add comprehensive breakpoints** (append to `assets/base.css`):
```css
/* Mobile portrait */
@media (max-width: 640px) {
  .wrap { 
    padding-left: 1rem; 
    padding-right: 1rem; 
  }
  
  main.wrap {
    padding-top: 1.5rem;
    padding-bottom: 2rem;
  }
  
  .hero h1 { font-size: 1.75rem; }
  .lead { font-size: 1.05rem; }
  
  .section { padding: 1.5rem 0; }
  
  .grid { gap: 16px; }
  .span-6 { grid-column: span 12; }
  
  .kpis { flex-direction: column; }
  .kpi { min-width: 100%; }
}

/* Tablet */
@media (min-width: 641px) and (max-width: 900px) {
  .wrap { padding: 1.5rem; }
  .span-6 { grid-column: span 6; }
}

/* Desktop */
@media (min-width: 901px) {
  .wrap { padding: 1rem; }
  .span-6 { grid-column: span 6; }
}
```

---

### Issue 7: Missing Active Navigation State

**Problem:** No visual indicator for current page in navigation

**Impact:** User disorientation, poor UX

**Fix:**

**7a. Add CSS** (append to `assets/base.css`):
```css
.site-nav a[aria-current="page"] {
  color: var(--brand-strong);
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 4px;
}
```

**7b. Add attribute to active page** (example for homepage in `index.html`):
```html
<nav class="site-nav" aria-label="Primary">
  <a href="./" aria-current="page">Product</a>  <!-- Add aria-current -->
  <a href="./trust-center/">Trust Center</a>
  <a href="./pricing/">Pricing</a>
  <a href="./contact/">Contact</a>
  <a href="./legal/">Legal</a>
</nav>
```

**Repeat for all pages** (contact, legal, etc.) - mark the appropriate link with `aria-current="page"`

---

### Issue 8: Spacing Token Usage Inconsistency

**Problem:** CSS uses both semantic tokens (`--space-md`) and deleted numeric tokens (`--space-3`)

**Impact:** Breaks when numeric tokens removed (Issue 4b)

**Fix:**

**8a. Find and replace in `assets/base.css`**:
```bash
# Search for these patterns and replace:
var(--space-1) → var(--space-sm)    # 8px
var(--space-2) → 0.75rem             # 12px (no token)
var(--space-3) → var(--space-md)    # 16px
var(--space-4) → var(--space-lg)    # 24px
var(--space-5) → var(--space-xl)    # 32px
var(--space-6) → var(--space-3xl)   # 48px
```

**8b. Verify these sections specifically**:
```css
/* Check these rules use semantic tokens */
header.wrap { gap: var(--space-md); }          /* was var(--space-3) */
header.wrap nav a { margin-left: var(--space-md); }
.card + .card { margin-top: var(--space-md); }
```

---

## RECOMMENDED ENHANCEMENTS (Sprint 3 - Post-Launch OK)

### Enhancement A: Add Visual Asset to Hero

**Why:** Pure text hero lacks credibility for technical product

**Implementation:**

**A1. Add after H1** (in `index.html`):
```html
<h1>Fair-Lending Bias-Simulation Appliance</h1>

<!-- ADD THIS -->
<div class="hero-diagram">
  <svg viewBox="0 0 600 100" xmlns="http://www.w3.org/2000/svg" aria-label="Architecture: Your data flows to Equilens appliance, which produces evidence bundle">
    <defs>
      <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,6 L9,3 z" fill="#6E59F7" />
      </marker>
    </defs>
    
    <!-- Your Data -->
    <rect x="20" y="30" width="120" height="40" fill="#F9FAFB" stroke="#E5E7EB" stroke-width="2" rx="6"/>
    <text x="80" y="55" text-anchor="middle" font-size="14" fill="#0B0B0C">Your Data</text>
    
    <!-- Arrow -->
    <line x1="145" y1="50" x2="205" y2="50" stroke="#6E59F7" stroke-width="2" marker-end="url(#arrow)"/>
    
    <!-- Equilens -->
    <rect x="210" y="30" width="120" height="40" fill="#1E293B" stroke="#1E293B" stroke-width="2" rx="6"/>
    <text x="270" y="55" text-anchor="middle" font-size="14" font-weight="600" fill="#FFFFFF">Equilens</text>
    
    <!-- Arrow -->
    <line x1="335" y1="50" x2="395" y2="50" stroke="#6E59F7" stroke-width="2" marker-end="url(#arrow)"/>
    
    <!-- Evidence -->
    <rect x="400" y="30" width="160" height="40" fill="#F9FAFB" stroke="#E5E7EB" stroke-width="2" rx="6"/>
    <text x="480" y="55" text-anchor="middle" font-size="14" fill="#0B0B0C">Evidence Bundle</text>
  </svg>
</div>

<p class="lead">Deterministic bias simulation...</p>
```

**A2. Add CSS** (append to `assets/base.css`):
```css
.hero-diagram {
  margin: 1.5rem 0;
}

.hero-diagram svg {
  max-width: 100%;
  height: auto;
}

@media (max-width: 640px) {
  .hero-diagram svg {
    font-size: 12px;
  }
}
```

---

### Enhancement B: Card Icons

**Why:** Improves scannability and visual hierarchy

**Implementation:**

**B1. Add icons to card headings** (in `index.html`):
```html
<!-- Before -->
<h3>1) Calibrate</h3>

<!-- After -->
<h3><span class="card-icon" aria-hidden="true">📊</span> 1) Calibrate</h3>
```

**Suggested icons:**
- Calibrate: 📊
- Simulate & Measure: 📈
- Evidence Bundle: 📄
- Audit-Trail: 🔗

**B2. Add CSS** (append to `assets/base.css`):
```css
.card-icon {
  font-size: 1.4em;
  margin-right: 0.5rem;
  vertical-align: middle;
  display: inline-block;
}

@media (max-width: 640px) {
  .card-icon {
    font-size: 1.2em;
  }
}
```

---

### Enhancement C: Trust Badges

**Why:** Builds credibility, establishes compliance posture

**Implementation:**

**C1. Add section after hero** (in `index.html`, before "How it works"):
```html
</main>

<!-- ADD THIS -->
<section class="wrap section trust-section">
  <div class="trust-badges">
    <span class="trust-badge">SOC 2 Type II</span>
    <span class="trust-badge">ISO 27001</span>
    <span class="trust-badge">AWS Partner</span>
    <span class="trust-badge">GDPR Compliant</span>
  </div>
</section>

<section class="wrap section alt">
```

**C2. Add CSS** (append to `assets/base.css`):
```css
.trust-section {
  padding: 1rem 0;
  border-top: 1px solid var(--line);
}

.trust-badges {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.trust-badge {
  padding: 0.5rem 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--muted);
}

@media (max-width: 640px) {
  .trust-badge {
    font-size: 0.8rem;
    padding: 0.4rem 0.75rem;
  }
}
```

---

## TESTING REQUIREMENTS

### Viewport Testing
```
☐ 375px  - iPhone SE (mobile portrait)
☐ 414px  - iPhone Pro Max
☐ 768px  - iPad (tablet portrait)
☐ 1024px - iPad landscape
☐ 1440px - Desktop standard
☐ 1920px - Desktop large
```

### Interaction Testing
```
☐ Tab through all links (focus visible at all times?)
☐ Click hamburger menu (opens/closes?)
☐ Click outside menu (closes?)
☐ Press Escape in menu (closes?)
☐ Hover all buttons/links (visual feedback?)
☐ Test on touch device (tap targets ≥44px?)
```

### Accessibility Testing
```
☐ Run axe DevTools (0 violations?)
☐ Test with VoiceOver (macOS) or NVDA (Windows)
☐ Keyboard-only navigation (can reach all interactive elements?)
☐ Color contrast validator (all text ≥4.5:1?)
☐ Test with screen magnification (200% zoom)
☐ Verify ARIA attributes (aria-current, aria-label, aria-expanded)
```

### Browser Testing
```
☐ Chrome (latest)
☐ Firefox (latest)
☐ Safari (latest)
☐ Safari iOS
☐ Chrome Android
☐ Edge (latest)
```

### Performance Testing
```
☐ Lighthouse score (aim for 95+ on all metrics)
☐ Total page weight (<15KB target)
☐ No external requests (verify CSP)
☐ Print stylesheet works correctly
```

---

## IMPLEMENTATION CHECKLIST

### Sprint 1: Launch Blockers (2-3 days)
```
☐ Issue 1: Add mobile navigation (HTML + CSS + JS)
☐ Issue 2: Remove inline style, add .cta-secondary class
☐ Issue 3: Fix logo alt text to alt=""
☐ Test at 375px, 768px, 1440px
☐ Verify accessibility (keyboard nav, screen reader)
```

### Sprint 2: Quality & Polish (3-4 days)
```
☐ Issue 4: Align CSS variables with tokens.json
☐ Issue 5: Remove duplicate H1 definition
☐ Issue 6: Add responsive breakpoints
☐ Issue 7: Add active navigation state
☐ Issue 8: Consolidate spacing token usage
☐ Full regression test (all viewports, browsers)
```

### Sprint 3: Enhancements (Optional, 2-3 days)
```
☐ Enhancement A: Add hero diagram SVG
☐ Enhancement B: Add card icons
☐ Enhancement C: Add trust badges
☐ Final QA pass
```

---

## FILE MANIFEST

**Files Modified:**
```
index.html          - Mobile menu button, inline style removal, logo alt, active nav
contact/index.html  - Mobile menu button, logo alt, active nav
legal/index.html    - Mobile menu button, logo alt, active nav
assets/base.css     - All CSS fixes and enhancements
```

**Files Added:**
```
(none - all changes are modifications)
```

---

## ROLLBACK PROCEDURES

**If issues arise post-deployment:**

```bash
# Revert all changes
git checkout HEAD -- index.html contact/index.html legal/index.html assets/base.css

# Revert specific issue
git checkout HEAD -- assets/base.css  # Revert CSS only
git checkout HEAD -- index.html       # Revert HTML only

# Revert mobile nav only
# Remove .menu-toggle, .is-open classes and JS block
```

---

## VALIDATION COMMANDS

**CSS Validation:**
```bash
curl -H "Content-Type: text/css" --data-binary @assets/base.css \
  https://jigsaw.w3.org/css-validator/validator
```

**HTML Validation:**
```bash
curl -H "Content-Type: text/html; charset=utf-8" --data-binary @index.html \
  https://validator.w3.org/nu/?out=json
```

**Accessibility Check:**
```bash
npx @axe-core/cli https://equilens.io
```

**Lighthouse:**
```bash
npx lighthouse https://equilens.io --output html --output-path report.html
```

---

## DEPLOYMENT NOTES

**Pre-deployment:**
1. Merge all changes to staging branch
2. Run full test suite (checklist above)
3. Get design approval on staging URL
4. Verify print stylesheet works
5. Check mobile nav on real devices (iOS + Android)

**Deployment:**
1. Merge to main branch
2. GitHub Pages will auto-deploy
3. Verify DNS/SSL still working (equilens.io)
4. Test production URL immediately
5. Monitor for 24h (any 404s, layout breaks?)

**Post-deployment:**
1. Run Lighthouse on production
2. Submit sitemap to Google Search Console
3. Verify OG image renders on Twitter/LinkedIn
4. Remove `noindex, nofollow` when ready for indexing

---

## CONTACT

**Questions on implementation:**
- Design system: Review `docs/brand/tokens.json`
- Accessibility: WCAG 2.1 AA standard
- Performance: Target <15KB total page weight

**Sign-off required before launch:**
- ✅ All Sprint 1 issues resolved
- ✅ Mobile navigation tested on iOS + Android
- ✅ Accessibility validated (axe DevTools 0 violations)
- ✅ Cross-browser testing complete

---

**Document Version:** 1.0  
**Last Updated:** October 13, 2025  
**Next Review:** Post-Sprint 2 completion