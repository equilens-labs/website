#!/usr/bin/env bash
set -euo pipefail

TAG="${1:-LEGAL-PUB-v1}"
BASE="output/ops/LEGAL-PUB-${TAG}"
mkdir -p "$BASE"

find legal -maxdepth 1 -type f -name "*.html" -print | sort >"$BASE/legal_pages.txt"
if [[ -f .well-known/security.txt ]]; then
  cp .well-known/security.txt "$BASE/security.txt.copy"
else
  echo "MISSING .well-known/security.txt" >"$BASE/security_missing.txt"
fi

rg -n "Valfox Ltd" legal/index.html >"$BASE/imprint_has_name.txt"
rg -n "Company number" legal/index.html >"$BASE/imprint_has_number.txt"
rg -n "Registered office" legal/index.html >"$BASE/imprint_has_office.txt"
rg -n "England" legal/index.html >"$BASE/imprint_has_jurisdiction.txt"

rg -n "Controller" legal/privacy.html >"$BASE/privacy_has_controller.txt"
rg -n "legitimate interests" legal/privacy.html >"$BASE/privacy_has_legal_basis.txt"
rg -n "ico.org.uk" legal/privacy.html >"$BASE/privacy_has_ico.txt"
rg -n "Cookie" legal/privacy.html >"$BASE/privacy_links_cookie.txt"
rg -n "Plausible Analytics" legal/privacy.html >"$BASE/privacy_discloses_plausible.txt"

rg -n "Plausible Analytics" legal/index.html >"$BASE/cookie_discloses_plausible.txt"
rg -n "does <strong>not</strong> set cookies|advertising or social media cookies" legal/index.html >"$BASE/cookie_analytics_posture.txt"
rg -n "script-src 'self' https://plausible.io; connect-src 'self' https://plausible.io" legal/index.html legal/privacy.html >"$BASE/plausible_csp_present.txt"

[ -f legal/index.html ] && echo OK > "$BASE/legal_hub_present.txt" || echo MISSING > "$BASE/legal_hub_present.txt"
if rg -q 'id="open-source"' legal/index.html; then echo OK > "$BASE/open_source_present.txt"; else echo MISSING > "$BASE/open_source_present.txt"; fi
if rg -q 'id="accessibility"' legal/index.html; then echo OK > "$BASE/accessibility_present.txt"; else echo MISSING > "$BASE/accessibility_present.txt"; fi
if rg -q 'id="dpa-position"' legal/index.html; then echo OK > "$BASE/dpa_position_present.txt"; else echo MISSING > "$BASE/dpa_position_present.txt"; fi
if rg -q 'id="responsible-use"' legal/index.html; then echo OK > "$BASE/responsible_use_present.txt"; else echo MISSING > "$BASE/responsible_use_present.txt"; fi
[ -f trust-center/index.html ] && echo OK > "$BASE/trust_center_present.txt" || echo MISSING > "$BASE/trust_center_present.txt"

rg -n "Governing law" legal/tos.html > "$BASE/tos_has_governing_law.txt" || true
rg -n "Effective date" legal/tos.html > "$BASE/tos_has_effective_date.txt" || true
rg -n "retained" legal/privacy.html > "$BASE/privacy_has_retention.txt" || true

rg -n "<form" legal || echo "OK: no forms found" >"$BASE/no_forms_ok.txt"
if rg -n "<script[^>]+src=\"https?://" legal >"$BASE/external_scripts.txt"; then
  if rg -v "https://plausible\.io/js/script\.js" "$BASE/external_scripts.txt" >"$BASE/unapproved_external_scripts.txt"; then
    echo "ERROR: unapproved external script src found in legal/" >&2
    cat "$BASE/unapproved_external_scripts.txt" >&2
    exit 1
  else
    rm -f "$BASE/unapproved_external_scripts.txt"
    echo "OK: only approved Plausible external script src found in legal/" >"$BASE/no_unapproved_external_scripts_ok.txt"
  fi
else
  echo "OK: no external script src on legal/" >"$BASE/no_external_scripts_ok.txt"
fi

if [[ -f "$BASE/security.txt.copy" ]]; then
  rg -n "^Contact: " "$BASE/security.txt.copy" >"$BASE/security_contact.txt"
  rg -n "^Canonical: " "$BASE/security.txt.copy" >"$BASE/security_canonical.txt"
  rg -n "^Expires: " "$BASE/security.txt.copy" >"$BASE/security_expires.txt"
fi

BASE_DIR="$BASE" python3 - <<'PY'
import hashlib, json, os
base = os.environ['BASE_DIR']
digests = {}
for root, _, files in os.walk(base):
    for name in files:
        path = os.path.join(root, name)
        with open(path, 'rb') as fh:
            digests[os.path.relpath(path, base)] = hashlib.sha256(fh.read()).hexdigest()
with open(os.path.join(base, '_checksums.json'), 'w') as fh:
    json.dump(digests, fh, indent=2, sort_keys=True)
print(f"Artifacts: {len(digests)}")
PY

echo "Evidence bundle at: $BASE"
