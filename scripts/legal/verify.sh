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

rg -n "Valfox Ltd" legal/imprint.html >"$BASE/imprint_has_name.txt"
rg -n "Company" legal/imprint.html >"$BASE/imprint_has_number.txt"
rg -n "Registered office" legal/imprint.html >"$BASE/imprint_has_office.txt"
rg -n "England" legal/imprint.html >"$BASE/imprint_has_jurisdiction.txt"

rg -n "Controller" legal/privacy.html >"$BASE/privacy_has_controller.txt"
rg -n "legitimate interests" legal/privacy.html >"$BASE/privacy_has_legal_basis.txt"
rg -n "ico.org.uk" legal/privacy.html >"$BASE/privacy_has_ico.txt"
rg -n "Cookie" legal/privacy.html >"$BASE/privacy_links_cookie.txt"

rg -n "We do <strong>not</strong> use analytics" legal/cookie-policy.html >"$BASE/cookie_no_analytics.txt"

rg -n "<form" legal || echo "OK: no forms found" >"$BASE/no_forms_ok.txt"
rg -n "<script[^>]+src=\"https?://" legal || echo "OK: no external script src on legal/" >"$BASE/no_external_scripts_ok.txt"

if [[ -f "$BASE/security.txt.copy" ]]; then
  rg -n "^Contact: " "$BASE/security.txt.copy" >"$BASE/security_contact.txt"
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
