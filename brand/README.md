# Equilens Brand Package

This directory contains all official Equilens brand assets, design tokens, and usage guidelines.

## Structure

```
/brand
├── logo/                  # Wordmark variants (light, dark, mono)
├── symbol/               # Monogram "[ e ]", source raster set, Safari pinned tab
├── icons/                # Favicon, app icons, webmanifest
├── social/               # OG image templates (Facebook, X/Twitter)
├── tokens/               # Design tokens (CSS + JSON)
└── guidelines/           # Brand guidelines documentation
```

## Export commands

### Favicon ICO

```bash
magick -background none ./icons/favicon.svg -define icon:auto-resize=16,32,48 ./icons/favicon.ico
```

### Maskable icons & Apple touch

```bash
resvg ./icons/maskable.svg -w 180 -o ./icons/apple-touch-icon-180.png
resvg ./icons/maskable.svg -w 192 -o ./icons/icon-192-maskable.png
resvg ./icons/maskable.svg -w 512 -o ./icons/icon-512-maskable.png
```

## Inline usage

### Light theme

```html
<object type="image/svg+xml" data="/brand/logo/equilens-wordmark-light.svg" class="logo"></object>
```

### Dark theme

```html
<div data-theme="dark">
  <object type="image/svg+xml" data="/brand/logo/equilens-wordmark-dark.svg" class="logo"></object>
</div>
```

## Accessibility checks

- Maintain AA contrast for all text; prefer #A5B4FC for brand elements on dark.
- Always include `<title>` in SVGs for assistive tech.
- Provide text alternatives near hero logos (company name in HTML).

## Release checklist

- [ ] Update `site.webmanifest` paths if you change directories.
- [ ] Verify favicons on Chrome/Firefox/Safari (16/32/48).
- [ ] Verify OG crops via platform debuggers.
- [ ] Test dark/light logo variants on actual backgrounds.
- [ ] Confirm clearspace is maintained in all implementations.

## Design Tokens

Import design tokens in your CSS:

```css
@import '/brand/tokens/tokens.css';
```

Or use the JSON for programmatic access (build tools, Figma plugins, etc.):

```javascript
import tokens from './brand/tokens/tokens.json';
```

## Questions?

See `guidelines/brand-guidelines.md` for detailed usage rules and examples.
