# FL-BSA canonical metadata correction

## Intent

Correct the public FL-BSA page title metadata consumed by LinkedIn and other link-preview crawlers.
The authoritative product expansion is `Fair-Lending Bias-Simulation Appliance`, as defined in the
FL-BSA repository's `SSoT.md`.

## Changed surfaces

- HTML document title
- Open Graph title
- X/Twitter card title
- `SoftwareApplication` structured-data name
- Site test guarding all four title surfaces

The existing product-description metadata remains unchanged. This correction changes the product
name, not the product's claims or operating boundary.

## Validation

Local validation on 2026-08-26:

- `npm ci --ignore-scripts` — pass; restored the lockfile-defined local test dependencies
- `npm run content:lint` — pass
- `npm run lint:html` — pass; 22 deployed HTML files checked
- `npm test` — pass; 296 Playwright, content, design, and axe checks
- `git diff --check` — pass

The GitHub pull-request audit and post-merge deployment are recorded in the linked repository
checks and deployment history.
