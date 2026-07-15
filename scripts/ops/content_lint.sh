#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "${REPO_ROOT}"

echo "Checking for forbidden phrases..."

GREP_EXCLUDES=(
  --exclude-dir=node_modules
  --exclude-dir=vendor
  --exclude-dir=tasks
  --exclude-dir=output
  --exclude-dir=dist
)

if grep -r --include="*.html" --include="*.md" -n "Equilens Ltd" "${GREP_EXCLUDES[@]}" .; then
  echo "ERROR: Found 'Equilens Ltd' - use 'Valfox Ltd, trading as Equilens' instead"
  exit 1
fi

if grep -r --include="*.html" --include="*.md" -n -E "ensures? compliance|guarantees? compliance|guarantees? regulatory approval|makes you compliant|automatically compliant" "${GREP_EXCLUDES[@]}" .; then
  echo "ERROR: Found over-promising compliance language"
  exit 1
fi

if grep -r --include="*.html" --include="*.md" -n -i -E "subscribe via aws marketplace|subscribe through aws|open the aws marketplace listing|click[[:space:]]+subscribe" "${GREP_EXCLUDES[@]}" .; then
  echo "ERROR: Found pre-live AWS Marketplace subscribe language"
  exit 1
fi

if grep -r --include="*.html" --include="*.md" -n -i -E "aws marketplace availability is coming soon|aws marketplace listing coming soon|marketplace deployment|pilot tier|standard tier|enterprise tier|annual licence" "${GREP_EXCLUDES[@]}" .; then
  echo "ERROR: Found unapproved pre-live marketplace or cold-sell tier language"
  exit 1
fi

if grep -r --include="*.html" --include="*.md" -n -i -E "attestations aligned to" "${GREP_EXCLUDES[@]}" .; then
  echo "ERROR: Found regulatory attestation wording that should be phrased as mapping or evidence"
  exit 1
fi

if grep -r --include="*.html" --include="*.md" -n -i -E "30-page PDF report|Model Fidelity|Training Convergence|≤ ~20 minutes|OSFI.*B-10|APRA.*CPS.*230|SR 11-7|PS22/9" "${GREP_EXCLUDES[@]}" .; then
  echo "ERROR: Found stale FL-BSA evidence, runtime, or regulatory-scope wording"
  exit 1
fi

if grep -r --include="*.html" --include="*.md" -n -i -E "regulatory digital twin|audit-ready|regulator-ready|regulator[- ]blessed|regulator[- ]endorsed|regulator[- ]certified|court-admissible|FCA[- ]approved|regulator[- ]approved|production decisioning|compliance certified|ECOA-compliant|production-grade appliance|full commercial use rights|Annual Licence[[:space:]]*·[[:space:]]*Production|Regulatory Assurance|Controls[[:space:]]*&[[:space:]]*Attestations|Alternate:[[:space:]]*.*AWS.*AMI|v5\.0\.0-rc4|EU GDPR Representative|equilens@equilens\.io" "${GREP_EXCLUDES[@]}" .; then
  echo "ERROR: Found stale or over-strong FL-BSA GTM/regulatory wording"
  exit 1
fi

# "Regulator-aligned PDF reports" is allowed only where it refers to report templates/reports
# grounded in product truth. The broader pack-level phrase below is blocked unless the claims
# register explicitly approves it.
if grep -r --include="*.html" --include="*.md" -n -i -E "regulator[- ]aligned[[:space:]]+evidence[[:space:]]+packs" "${GREP_EXCLUDES[@]}" .; then
  echo "ERROR: Found unapproved broad 'regulator-aligned evidence packs' wording"
  exit 1
fi

# Founder rule (2026-07-14): the word "call" is banned on web surfaces — no "sales call",
# no "before a call", no call framing anywhere in published copy.
if grep -r --include="*.html" -n -i -E "\bcalls?\b" "${GREP_EXCLUDES[@]}" .; then
  echo "ERROR: Found banned word 'call' in web copy (founder rule 2026-07-14)"
  exit 1
fi

echo "[OK] Content lint passed"
