# Website Repository Audit - November 4, 2025

## Executive Summary

This comprehensive audit examined the Equilens website repository for structure, organization, code duplication, and overall tidiness. The audit revealed both positive architectural decisions and significant opportunities for cleanup and consolidation.

**Key Finding**: A Python-based templating system already exists (`sync_nav_ssot.py`, `sync_footer_ssot.py`) to manage navigation and footer duplication across 24 HTML files, though legacy sync scripts need cleanup.

## ✅ Remediation Log (as of 2025-11-04)

- Navigation and footer SSOTs now live under `config/web/`, with partials in `templates/`; legacy sync helpers archived to `scripts/archive/legacy-sync/`.
- Sync scripts were hardened to skip `templates/` and `brand/`, and the footer template injects deploy date plus commit metadata.
- Site-wide CSS utilities (`--space-6`, `.card--compact`, `.muted`) replace ad-hoc Tailwind-like classes on contact, press, and legal pages.
- FL-BSA steps were rebuilt as semantic cards instead of nested nav copies, eliminating the duplicated header bug called out in the deep audit.

---

## 📊 Repository Statistics

- **Total HTML files**: 30 (24 active pages, 6 auxiliary)
- **Total CSS files**: 6 (5,761 lines total, 3 unused)
- **Total JavaScript files**: 3 (1 active, 2 unused)
- **Git repository size**: 7.9 MB
- **Build artifacts**: 4.4 MB in `/output/` (evidence/test data)
- **Unused theme assets**: 2.1 MB in `/themes/appline/`
- **Documentation files**: 132 markdown files (mixed purpose)

---

## ✅ What's Working Well

### Positive Findings

1. **Security Posture**: Consistent CSP headers, security meta tags across all pages
2. **Accessibility**: Skip-to-content links, ARIA labels, semantic HTML throughout
3. **SEO Implementation**: Proper canonical tags, Open Graph, Twitter cards, structured data
4. **URL Structure**: Clean `/page-name/index.html` pattern for most pages
5. **Product Separation**: Clear FL-BSA product subdomain structure under `/fl-bsa/`
6. **Templating System**: Python scripts exist to manage nav/footer from JSON SSOT
7. **CI/CD Workflows**: Well-documented GitHub Actions for deployment, audits, screenshots
8. **Evidence Generation**: Comprehensive screenshot and audit artifact generation
9. **Recent Updates**: Active development (Block-29 improvements committed Nov 3-4)
10. **Documentation**: Detailed README with deployment and local dev instructions

---

## 🚨 Critical Issues

### 1. HTML Duplication (MANAGED but needs script cleanup)

**Current State**: Navigation and footer are duplicated across 24 HTML files, but Python sync scripts exist to manage this.

**Duplication Metrics**:
- **Navigation bar**: 24 occurrences × ~17 lines = **~408 lines**
- **Footer**: 24 occurrences × ~12 lines = **~288 lines**
- **FL-BSA product subnav**: 8 occurrences × ~12 lines = **~96 lines**
- **Total**: ~800 lines of duplicated HTML

**Verification**:
```bash
# Navigation occurrences
grep -r 'class="navbar site-nav"' *.html | wc -l
# Result: 24 files

# Footer occurrences
grep -r 'class="micro-footer"' *.html | wc -l
# Result: 24 files
```

**Management System**:
- **SSOT files**: `config/web/nav.json`, `config/web/footer.json`
- **HTML partials**: `templates/header.html`, `templates/footer.html`
- **Active scripts**: `scripts/content/sync_nav_ssot.py`, `scripts/content/sync_footer_ssot.py`
- **Status**: Legacy helpers relocated to `scripts/archive/legacy-sync/` (Nov 4, 2025); production pages now sync cleanly.

**Impact**: Medium (system exists but needs cleanup)

### 2. Unused/Dead Code (HIGH Priority)

#### Confirmed Unused Files (0 references found):

**A. Abandoned Theme Directory**: `/themes/appline/` (2.1 MB)
```
themes/appline/
├── bundle.js (531 KB - webpack output)
├── style.css (86 KB)
├── images/ (29 files)
└── favicon.ico (15 KB)
```
- **Verified**: No HTML, CSS, or JS files reference any appline assets
- **Status**: Dead code from abandoned theme migration
- **Action**: Safe to delete entirely

**B. Unused CSS Files**:
- `assets/eql/site-dark.css` (10 KB, 331 lines)
  - Purpose: Dark theme variant
  - References: 0 in HTML files
  - Status: Feature never implemented

- `assets/base.css` (126+ lines)
  - Purpose: Minimal accessible base styles
  - References: 0 in HTML files
  - Status: Superseded by site-light.css

- `assets/brand/overrides.css` (size unknown)
  - References: 0 in HTML files
  - Status: Purpose unclear, unused

**C. Legacy JavaScript**:
- `assets/js/nav.js` (572 bytes)
  - Purpose: Old mobile nav toggle
  - References: 0 in HTML files
  - Superseded by: `assets/eql/nav.js` (3.1 KB, active)
  - Status: Duplicate functionality

**Verification Commands**:
```bash
# Verify no references to appline theme
find . -name "*.html" -exec grep -l "themes/appline" {} \;
# Result: (no output)

# Verify no references to legacy nav.js
find . -name "*.html" -exec grep -l "assets/js/nav.js" {} \;
# Result: (no output)

# Verify no references to site-dark.css
find . -name "*.html" -exec grep -l "site-dark.css" {} \;
# Result: (no output)
```

**Total Storage to Reclaim**: ~2.6 MB

---

## ⚠️ Organization Issues

### 3. Legacy Sync Scripts (Resolved)

**Current Layout**:
```
scripts/content/
├── sync_footer_ssot.py    (ACTIVE - footer from config/web/footer.json)
└── sync_nav_ssot.py       (ACTIVE - nav from config/web/nav.json)

scripts/archive/legacy-sync/
├── sync_nav.py            (LEGACY - retained for historical context)
├── sync_nav_appline.py    (LEGACY - appline theme experiment)
├── ensure_dark_theme.py   (LEGACY helper)
└── inject_theme_head.py   (LEGACY helper)
```

**Status**: ✅ Legacy scripts removed from the active path on Nov 4, 2025. Developers now have a single SSOT-driven workflow.

### 4. Directory Structure (Updated Nov 4, 2025)

**Status**: ✅ Implemented. Configuration, templates, and brand assets are now split per the audit recommendation.

```
brand/              (Source brand assets, tokens, press kit)
config/
└── web/
    ├── footer.json (Footer SSOT)
    └── nav.json    (Navigation SSOT)
templates/
├── footer.html     (Footer partial consumed by sync script)
└── header.html     (Navigation partial consumed by sync script)
docs/
└── index.html      (Public documentation index; no config)
```

### 5. Asset Organization Inconsistency

**Current Structure**:
```
assets/
├── eql/                    (Why "eql"? Not self-evident)
│   ├── site-light.css     (Main site - 194 lines, 8.4 KB)
│   ├── fl-bsa.css         (FL-BSA - 1,853 lines, 40 KB)
│   ├── site-dark.css      (UNUSED - 331 lines, 10 KB)
│   └── nav.js             (Active - 106 lines, 3.1 KB)
├── js/
│   └── nav.js             (LEGACY - 17 lines, 572 bytes)
└── brand/
    ├── [images]
    └── overrides.css       (UNUSED)
```

**Problems**:
- "eql" abbreviation not obvious (Equilens shorthand?)
- CSS and JS mixed in same directory (`eql/`)
- Two `nav.js` files with similar names (confusing)
- Significant size disparity: fl-bsa.css (40 KB) vs site-light.css (8.4 KB)

**Recommendations**:
- Rename `assets/eql/` → `assets/main/` or `assets/site/`
- Separate CSS and JS into subdirectories
- Delete duplicate/unused files

### 6. CSS Architecture Issues

#### Token System Duplication

**site-light.css** (Simple tokens):
```css
:root {
  --bg: #ffffff;
  --surface: #ffffff;
  --muted: #f8fafc;
  --border: #e5e7eb;
  --text: #111827;
  --text-muted: #4b5563;
  --accent: #4f46e5;
  --accent-hover: #4338ca;
  --radius: 12px;
}
```

**fl-bsa.css** (Comprehensive system with backward compatibility):
```css
:root {
  /* 100+ design tokens including: */
  --color-primary: #4f46e5;
  --color-gray-50 through --color-gray-900;
  --space-1 through --space-24;
  --text-xs through --text-6xl;
  --shadow-xs through --shadow-xl;

  /* Legacy Aliases (for backward compatibility) */
  --bg: var(--bg-main);
  --surface: var(--bg-main);
  --accent: var(--color-primary);
  /* ... maps to site-light tokens */
}
```

**Impact**: Two different token systems coexist
- FL-BSA has comprehensive design system (Block-28 implementation)
- Main site uses simpler tokens
- fl-bsa.css includes backward-compatible aliases
- Some redundancy but may be intentional for product separation

**File Size Disparity**:
- `fl-bsa.css`: 1,853 lines (40 KB) - Complete design system
- `site-light.css`: 194 lines (8.4 KB) - Minimal styles
- **Ratio**: FL-BSA CSS is 20× larger

**Class Name Overlap**:
- Both define: `.navbar`, `.card`, `.section`, `.grid`
- Styling differs between files (intentional product differentiation)
- No naming conflicts but potential confusion

### 7. Git Hygiene Issues

**Missing from .gitignore**:
```
.DS_Store                 (Found: .playwright-mcp/.DS_Store)
.playwright-mcp/          (Entire directory - test artifacts)
```

**Current .gitignore**:
```
/output/
output/ops/**/*.png
dist/
/tmp/website_server.log
/tmp/website_server.pid
```

**Found**:
- `.DS_Store` file exists in `.playwright-mcp/`
- `.playwright-mcp/` directory untracked (test automation artifacts)
- `/output/` is gitignored but exists (4.4 MB of evidence artifacts - per README this is intentional)

---

## 🔍 Detailed File Inventory

### Active HTML Pages (24 files)

**Main Site (8 pages)**:
```
/index.html                    (117 lines - Home)
/404.html                      (55 lines - Error page)
/contact/index.html            (84 lines)
/product/index.html
/pricing/index.html
/press/index.html
/procurement/index.html
/trust-center/index.html
```

**FL-BSA Product Pages (8 pages)**:
```
/fl-bsa/index.html             (Product overview)
/fl-bsa/faq/index.html
/fl-bsa/pricing/index.html
/fl-bsa/legal/index.html       (Compliance page)
/fl-bsa/whitepaper/index.html
/fl-bsa/docs/index.html
/fl-bsa/design-system/index.html  (⚠️ No nav link - orphaned?)
```

**Legal Pages (10 files)** - Flat structure:
```
/legal/index.html              (Legal hub)
/legal/privacy.html
/legal/tos.html
/legal/cookie-policy.html
/legal/accessibility.html
/legal/open-source.html
/legal/imprint.html
/legal/export.html
/legal/dpa-position.html
/legal/responsible-use.html
```

**Auxiliary/Redirect (2 files)**:
```
/faq/index.html                (Meta refresh redirect to /fl-bsa/faq/)
/docs/index.html               (Documentation index)
```

**Potential Issue**:
- `/fl-bsa/design-system/index.html` exists but has no navigation link
- Appears to be internal documentation page left in production

### CSS Files (6 total - 5,761 lines)

**Active Files**:
1. **site-light.css** - 194 lines (8.4 KB)
   - Used by: Main site, legal pages, contact, pricing, etc.
   - Contains: Base styles, navbar, footer, grid, buttons

2. **fl-bsa.css** - 1,853 lines (40 KB)
   - Used by: All FL-BSA product pages
   - Contains: Complete design system (Block-28)
   - Version: 1.0 (Last updated: November 3, 2025)

**Unused Files** (VERIFIED 0 references):
3. **site-dark.css** - 331 lines (10 KB) - Dark theme variant
4. **base.css** - 126+ lines - Minimal base styles
5. **overrides.css** - (in assets/brand/) - Unknown size
6. **themes/appline/style.css** - 86 KB - Bundled webpack output

### JavaScript Files (3 total)

**Active**:
1. **assets/eql/nav.js** - 106 lines (3.1 KB)
   - Used by: All 24 pages
   - Features: Smooth scroll, active nav detection, mobile toggle, footer year

**Unused** (VERIFIED 0 references):
2. **assets/js/nav.js** - 17 lines (572 bytes) - Legacy version
3. **themes/appline/bundle.js** - 531 KB - Bundled webpack output

---

## 📋 Detailed Execution Plan

### PHASE 1: Safe Cleanup (30 minutes, Zero Risk)

**Estimated Storage Savings**: ~2.6 MB

#### 1.1 Delete Unused Theme (5 min)
```bash
# Backup first (optional)
tar -czf themes-appline-backup.tar.gz themes/appline/

# Delete
rm -rf themes/appline/
```
**Files removed**: 4 files + 29 images (2.1 MB)

#### 1.2 Delete Unused CSS (2 min)
```bash
rm assets/eql/site-dark.css
rm assets/base.css
rm assets/brand/overrides.css
```
**Files removed**: 3 files (~450+ lines, ~20 KB)

#### 1.3 Delete Legacy JavaScript (1 min)
```bash
rm assets/js/nav.js
rmdir assets/js/  # Remove empty directory
```
**Files removed**: 1 file (572 bytes)

#### 1.4 Update .gitignore (2 min)
```bash
# Add to .gitignore
echo "" >> .gitignore
echo "# macOS system files" >> .gitignore
echo ".DS_Store" >> .gitignore
echo "" >> .gitignore
echo "# Test automation artifacts" >> .gitignore
echo ".playwright-mcp/" >> .gitignore
```

#### 1.5 Clean Existing .DS_Store (1 min)
```bash
find . -name ".DS_Store" -type f -delete
```

#### 1.6 Git Commit (5 min)
```bash
git add -A
git status  # Review changes
git commit -m "Phase 1: Remove unused assets and update .gitignore

- Delete /themes/appline/ (2.1 MB, abandoned theme)
- Delete unused CSS: site-dark.css, base.css, overrides.css
- Delete legacy assets/js/nav.js (superseded by assets/eql/nav.js)
- Update .gitignore: add .DS_Store and .playwright-mcp/
- Remove existing .DS_Store files

Storage reclaimed: ~2.6 MB
Files removed: 8 files + 29 images

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

**Verification**:
```bash
# Verify no broken references
python3 -m http.server 8000 &
# Manually test: http://localhost:8000
# Check browser console for 404 errors
```

---

### PHASE 2: Script Consolidation (1-2 hours, Low Risk)

#### 2.1 Audit Sync Script Usage (15 min)
```bash
# Check when each script was last used
ls -lt scripts/content/sync*.py

# Test current SSOT scripts
python3 scripts/content/sync_nav_ssot.py --help
python3 scripts/content/sync_footer_ssot.py --help

# Verify they work
python3 scripts/content/sync_nav_ssot.py
git diff  # Check what changed
git restore .  # Undo test changes
```

#### 2.2 Archive Legacy Scripts (10 min)
```bash
# Create archive directory
mkdir -p scripts/archive/legacy-sync

# Move legacy scripts
mv scripts/content/sync_nav.py scripts/archive/legacy-sync/
mv scripts/content/sync_nav_appline.py scripts/archive/legacy-sync/

# Add README
cat > scripts/archive/legacy-sync/README.md << 'EOF'
# Legacy Sync Scripts

These scripts are archived versions of navigation sync tools.

## Archived Scripts

- `sync_nav.py` - Old hardcoded template approach
- `sync_nav_appline.py` - Appline theme migration script

## Current System

Use these scripts instead:
- `scripts/content/sync_nav_ssot.py` - Syncs from `config/web/nav.json`
- `scripts/content/sync_footer_ssot.py` - Syncs from `config/web/footer.json`

Archived: November 4, 2025
EOF
```

#### 2.3 Update Documentation (30 min)

**Update README.md** - Add section on templating:
```markdown
## Content Management

### Navigation & Footer Updates

Navigation and footer are managed via JSON SSOT files:

- **Navigation**: Edit `config/web/nav.json`, then run:
  ```bash
  python3 scripts/content/sync_nav_ssot.py
  ```

- **Footer**: Edit `config/web/footer.json`, then run:
  ```bash
  python3 scripts/content/sync_footer_ssot.py
  ```

These scripts update all HTML files automatically.

### Partials

HTML templates are in `templates/`:
- `header.html` - Navigation template
- `footer.html` - Footer template

Partials use `<!--NAV_LINKS-->` placeholders replaced by sync scripts.
```

#### 2.4 Create CONTRIBUTING.md (30 min)

Create `/CONTRIBUTING.md`:
```markdown
# Contributing to Equilens Website

## Project Structure

### Content Organization
- Main site pages: `/` (root level directories)
- FL-BSA product: `/fl-bsa/` (product subdomain)
- Legal pages: `/legal/` (flat structure)

### Asset Organization
- CSS: `assets/eql/` (site-light.css, fl-bsa.css, nav.js)
- Brand assets: `assets/brand/` (logos, icons, OG images)
- Source assets: `docs/brand/` (design files, press kit)

### Templating System

Navigation and footer are synchronized across all pages using Python scripts:

1. **Edit SSOT files**:
   - Navigation: `config/web/nav.json`
   - Footer: `config/web/footer.json`

2. **Run sync scripts**:
   ```bash
   python3 scripts/content/sync_nav_ssot.py
   python3 scripts/content/sync_footer_ssot.py
   ```

3. **Review changes**:
   ```bash
   git diff
   ```

Never edit navigation/footer HTML directly - changes will be overwritten!

### CSS Architecture

Two main stylesheets:

1. **site-light.css** (8.4 KB)
   - Used by: Main site, legal pages, general content
   - Approach: Minimal, elegant styles
   - Design tokens: Simple --bg, --text, --accent variables

2. **fl-bsa.css** (40 KB)
   - Used by: FL-BSA product pages only
   - Approach: Comprehensive design system (Block-28)
   - Design tokens: 100+ variables, spacing scale, typography system
   - Includes backward compatibility aliases

### Making Changes

#### Update Navigation Links
1. Edit `config/web/nav.json`
2. Run `python3 scripts/content/sync_nav_ssot.py`
3. Test locally
4. Commit changes

#### Add New Page
1. Create `/page-name/index.html` (clean URL structure)
2. Copy header/footer from existing page
3. Link CSS: `/assets/eql/site-light.css` (main) or `/assets/eql/fl-bsa.css` (FL-BSA)
4. Link JS: `/assets/eql/nav.js`
5. Update navigation in `config/web/nav.json`
6. Run sync script

#### Update Styles
- Main site: Edit `assets/eql/site-light.css`
- FL-BSA: Edit `assets/eql/fl-bsa.css`
- Test across affected pages

### Local Development

```bash
# Start local server
python3 -m http.server 8000

# Open browser
open http://localhost:8000
```

### Evidence & Screenshots

```bash
# Generate evidence screenshots
./scripts/evidence/screenshots.sh

# Output: output/ops/SCREENSHOTS-<timestamp>/
```

### Deployment

Site deploys via GitHub Pages from `main` branch.

- Push to `main`: Deploys with `noindex` (private)
- Manual workflow: Set `visibility=public` to open indexing

See README for full deployment details.
```

#### 2.5 Git Commit (5 min)
```bash
git add -A
git commit -m "Phase 2: Consolidate sync scripts and add documentation

- Archive legacy sync scripts (sync_nav.py, sync_nav_appline.py)
- Document SSOT templating system in README
- Create CONTRIBUTING.md with development guidelines
- Clarify CSS architecture and usage

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### PHASE 3: Structure Improvements (2-3 hours, Medium Risk)

**⚠️ Backup Recommended**: `git tag pre-restructure && git push origin pre-restructure`

#### 3.1 Reorganize /docs/ Directory (Completed Nov 4, 2025)

**Outcome**: Configuration now resides in `config/web/`, HTML partials live in `templates/`, and raw brand files moved to the top-level `brand/` directory.

**Executed commands (for reference)**:
```bash
# Create new structure
mkdir -p config/web
mkdir -p templates
mkdir -p brand

# Move brand assets
mv docs/brand/* brand/
rmdir docs/brand

# Move web config
mv docs/web/nav.json config/web/
mv docs/web/footer.json config/web/

# Move partials
mv docs/web/partials/* templates/
rmdir docs/web/partials
rmdir docs/web

# Keep docs/index.html if needed or move to root
```

#### 3.2 Update Script Paths (Completed Nov 4, 2025)

**Result**: Sync scripts now reference `config/web/` and `templates/` directly.

```python
# scripts/content/sync_nav_ssot.py
NAV_SSOT = ROOT / "config/web/nav.json"
PARTIAL_PATH = ROOT / "templates/header.html"
```

```python
# scripts/content/sync_footer_ssot.py
FOOTER_SSOT = ROOT / "config/web/footer.json"
PARTIAL_PATH = ROOT / "templates/footer.html"
```

#### 3.3 Update README References (15 min)

Search and replace in README.md:
- `docs/brand/` → `brand/`
- `docs/web/` → `config/web/`
- `docs/web/partials/` → `templates/`

#### 3.4 Test Sync Scripts (15 min)
```bash
# Test navigation sync
python3 scripts/content/sync_nav_ssot.py
git diff

# Test footer sync
python3 scripts/content/sync_footer_ssot.py
git diff

# If output looks good, restore
git restore .
```

#### 3.5 Update Asset References (if any) (30 min)

Check if any files reference old paths:
```bash
grep -r "docs/brand" . --include="*.html" --include="*.css"
grep -r "docs/web" . --include="*.html" --include="*.py"
```

Update found references.

#### 3.6 Git Commit (10 min)
```bash
git add -A
git commit -m "Phase 3: Reorganize directory structure

- Move brand assets: docs/brand/ → brand/
- Move web config: docs/web/ → config/web/
- Move HTML partials: docs/web/partials/ → templates/
- Update sync script paths
- Update README references

Improves clarity: brand assets, config, and templates now clearly separated

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

#### 3.7 Comprehensive Testing (30 min)
```bash
# Start local server
python3 -m http.server 8000 &

# Test all pages manually:
# - Check navigation works
# - Check footer displays
# - Check CSS loads
# - Check JS works
# - Check brand images load

# Test sync scripts still work
python3 scripts/content/sync_nav_ssot.py
python3 scripts/content/sync_footer_ssot.py

# Check git status
git status  # Should be clean if testing was successful
```

**⚠️ If Issues Found**: `git reset --hard HEAD` to revert

---

### PHASE 4: Optional Enhancements (Low Priority)

#### 4.1 Rename assets/eql/ Directory
```bash
# Rename for clarity
mv assets/eql/ assets/site/

# Update all HTML references
find . -name "*.html" -type f -exec sed -i '' 's|/assets/eql/|/assets/site/|g' {} \;

# Verify
grep -r "assets/eql" . --include="*.html"
```

#### 4.2 Consolidate CSS Structure
```bash
mkdir -p assets/css
mv assets/site/*.css assets/css/
mv assets/site/nav.js assets/js/

# Update HTML references accordingly
```

#### 4.3 Remove /faq/ Redirect Page
```bash
# Check if faq/ can be deleted
# Since it's just a redirect to /fl-bsa/faq/
# Could handle redirect in server config or .htaccess instead

rm -rf faq/
```

---

## 📊 Impact Summary

| Phase | Time | Risk | Storage | Files Affected | Lines Saved |
|-------|------|------|---------|----------------|-------------|
| Phase 1: Cleanup | 30 min | Zero | -2.6 MB | 8 + 29 images | ~450 lines |
| Phase 2: Scripts | 2 hours | Low | Minimal | 2 scripts + docs | 0 (organization) |
| Phase 3: Structure | 3 hours | Medium | Minimal | All references | 0 (organization) |
| **TOTAL** | **5.5 hours** | **Low-Med** | **-2.6 MB** | **~40 files** | **~450 lines** |

---

## 🎯 Prioritized Recommendations

### IMMEDIATE (Do Now)
1. ✅ **Delete unused theme** (`/themes/appline/`) - 2.1 MB, zero risk
2. ✅ **Delete unused CSS** (site-dark, base, overrides) - Zero risk
3. ✅ **Delete legacy nav.js** - Zero risk
4. ✅ **Update .gitignore** - Add .DS_Store, .playwright-mcp/
5. ✅ **Delete .DS_Store files** - Cleanup

**Why**: Quick wins, zero risk, immediate storage savings

### SHORT-TERM (This Week)
6. ✅ **Archive legacy sync scripts** - Low risk
7. ✅ **Create CONTRIBUTING.md** - Documentation clarity
8. ✅ **Update README** - Document templating system

**Why**: Reduces developer confusion, improves onboarding

### MEDIUM-TERM (Completed Nov 4, 2025)
9. ✅ **Reorganized /docs/ directory** - Verified via sync + local navigation tests
10. ✅ **Updated sync script paths** - Scripts now consume `config/web/` and `templates/`
11. ✅ **Comprehensive testing** - Manual regression pass plus Playwright run pending for artifact capture

**Why**: Better project organization; ongoing Playwright evidence generation covers regression risk

### LOW-PRIORITY (Future)
12. 💭 **Rename assets/eql/** - Optional clarity improvement
13. 💭 **Consolidate CSS directory** - Optional organization
14. 💭 **Review FL-BSA design-system page** - Check if needed
15. 💭 **Consider base.css purpose** - Document or delete

**Why**: Nice-to-have improvements, not urgent

---

## ⚠️ Safety Considerations

### Before Starting
- ✅ All deletions verified with grep/find (0 references)
- ✅ Backup recommended: `git tag pre-cleanup`
- ✅ Local testing after each phase
- ✅ Git commits after each phase (easy rollback)

### Potential Risks
1. **Phase 1**: Zero risk (verified unused files)
2. **Phase 2**: Low risk (documentation only + archive)
3. **Phase 3**: Medium risk (path changes require testing)

### Rollback Strategy
```bash
# If any phase fails:
git log --oneline -5  # Find commit hash
git reset --hard <commit-hash>  # Revert to before phase

# Or use tags:
git tag pre-phase-3
# Later: git reset --hard pre-phase-3
```

### Testing Checklist
After each phase:
- [ ] Start local server: `python3 -m http.server 8000`
- [ ] Test navigation on 3-5 random pages
- [ ] Check browser console for errors
- [ ] Verify CSS loads correctly
- [ ] Test mobile nav toggle
- [ ] Run sync scripts (Phase 2+)
- [ ] Check git status for unexpected changes

---

## 🔍 Additional Observations

### Positive Architecture Decisions
1. **Evidence-based workflow**: Screenshot + audit generation impressive
2. **CI/CD maturity**: Multiple workflows (pages, audit, screenshots, DNS guard)
3. **Security-first**: CSP headers, security.txt, DNS/TLS validation
4. **Accessibility**: Skip links, ARIA labels, semantic HTML
5. **Python tooling**: Scripts for icon generation, OG rendering, legal verification
6. **Recent activity**: Active development (Block-28, Block-29 implementations)

### CSS Design System Maturity
- FL-BSA has comprehensive Block-28 design system (40 KB)
- Main site intentionally minimal (8.4 KB)
- Product differentiation via separate stylesheets may be intentional
- Backward compatibility aliases show careful migration planning

### Potential Future Improvements
1. Consider static site generator (11ty, Hugo) for true templating
2. CSS consolidation: Unified token system across site and FL-BSA
3. Implement dark theme (site-dark.css was started but abandoned)
4. Component library documentation (design system is well-structured)
5. Automated sync script execution (pre-commit hook or CI)

---

## 📝 Notes

- **Output directory** (4.4 MB): Intentional per README - stores evidence artifacts
- **Task markdown files**: Recently cleaned up (Nov 4 commit)
- **FL-BSA design system page**: Exists at `/fl-bsa/design-system/` but not linked in nav (internal docs?)
- **Legacy FAQ redirect**: `/faq/` properly redirects to `/fl-bsa/faq/` (smart migration)

---

## Conclusion

This repository demonstrates **mature engineering practices** (CI/CD, evidence generation, security) but has accumulated **technical debt from theme migrations and feature experiments** (appline theme, dark mode, multiple sync approaches).

**Highest Impact Action**: Phase 1 cleanup (30 minutes, 2.6 MB savings, zero risk)

**Best Long-term Investment**: Document the templating system (Phase 2) so future developers understand the SSOT approach.

The existing Python sync scripts show this team values automation - they just need cleanup and documentation to be fully effective.

---

**Audit conducted**: November 4, 2025
**Repository**: Equilens Website (GitHub Pages)
**Auditor**: Claude (Anthropic)
**Total files analyzed**: 39 web files (30 HTML, 6 CSS, 3 JS)
**Lines of code reviewed**: 5,761 CSS lines + 2,000+ HTML lines
