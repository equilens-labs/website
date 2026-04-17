#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "${REPO_ROOT}"

echo "Checking for forbidden phrases..."

if grep -r --include="*.html" --include="*.md" -n "Equilens Ltd" . --exclude-dir=node_modules --exclude-dir=vendor --exclude-dir=tasks --exclude-dir=output; then
  echo "ERROR: Found 'Equilens Ltd' - use 'Valfox Ltd, trading as Equilens' instead"
  exit 1
fi

if grep -r --include="*.html" --include="*.md" -n -E "ensures? compliance|guarantees? compliance|guarantees? regulatory approval|makes you compliant|automatically compliant" . --exclude-dir=node_modules --exclude-dir=vendor --exclude-dir=tasks --exclude-dir=output; then
  echo "ERROR: Found over-promising compliance language"
  exit 1
fi

if grep -r --include="*.html" --include="*.md" -n -i -E "subscribe via aws marketplace|subscribe through aws|open the aws marketplace listing|click[[:space:]]+subscribe" . --exclude-dir=node_modules --exclude-dir=vendor --exclude-dir=tasks --exclude-dir=output; then
  echo "ERROR: Found pre-live AWS Marketplace subscribe language"
  exit 1
fi

if grep -r --include="*.html" --include="*.md" -n -i -E "attestations aligned to" . --exclude-dir=node_modules --exclude-dir=vendor --exclude-dir=tasks --exclude-dir=output; then
  echo "ERROR: Found regulatory attestation wording that should be phrased as mapping or evidence"
  exit 1
fi

if grep -r --include="*.html" --include="*.md" -n -i -E "30-page PDF report|Model Fidelity|Training Convergence|≤ ~20 minutes|OSFI.*B-10|APRA.*CPS.*230|SR 11-7|PS22/9" . --exclude-dir=node_modules --exclude-dir=vendor --exclude-dir=tasks --exclude-dir=output; then
  echo "ERROR: Found stale FL-BSA evidence, runtime, or regulatory-scope wording"
  exit 1
fi

echo "[OK] Content lint passed"
