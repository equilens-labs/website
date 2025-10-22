#!/usr/bin/env bash
set -euo pipefail

# DNS/TLS guard for GitHub Pages custom domains
# Usage: guard_dns_ssl.sh <domain> [additional_hosts...]

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <domain> [additional_hosts...]" >&2
  exit 2
fi

DOMAIN="$1"; shift || true
HOSTS=("$DOMAIN")
if [ "$#" -gt 0 ]; then
  HOSTS+=("$@")
fi

TICKET="DNS-SSL-GUARD-$(date -u +%Y%m%dT%H%M%SZ)"
OUTDIR="output/ops/$TICKET"
mkdir -p "$OUTDIR"

ALLOWED_A=(185.199.108.153 185.199.109.153 185.199.110.153 185.199.111.153)
ALLOWED_AAAA=(2606:50c0:8000::153 2606:50c0:8001::153 2606:50c0:8002::153 2606:50c0:8003::153)

ok=true

# Write helper to join array elements
join_by() { local IFS="$1"; shift; echo "$*"; }

is_in() {
  local needle="$1"; shift; local x
  for x in "$@"; do [ "$x" = "$needle" ] && return 0; done
  return 1
}

echo "== Guard: Authoritative DNS records ==" | tee "$OUTDIR/dns-authoritative.txt"
auth_ns=( $(dig +short NS "$DOMAIN") )
if [ "${#auth_ns[@]}" -eq 0 ]; then
  echo "No NS records found for $DOMAIN" | tee -a "$OUTDIR/dns-authoritative.txt"
  ok=false
fi

for ns in "${auth_ns[@]}"; do
  {
    echo "== $ns =="
    for host in "${HOSTS[@]}"; do
      echo "-- $host (A) --"
      dig @"$ns" "$host" A +noall +answer
      echo "-- $host (AAAA) --"
      dig @"$ns" "$host" AAAA +noall +answer
      if [[ "$host" != "$DOMAIN" ]]; then
        echo "-- $host (CNAME) --"
        dig @"$ns" "$host" CNAME +noall +answer || true
      fi
      echo
    done
  } >> "$OUTDIR/dns-authoritative.txt"
done

# Validate returned A/AAAA are subsets of allowed sets
violations=()
is_ipv4() { [[ "$1" =~ ^([0-9]{1,3}\.){3}[0-9]{1,3}$ ]]; }
is_ipv6() { [[ "$1" =~ : ]]; }
uniq_lines() { awk '!seen[$0]++'; }
RESOLVERS=(1.1.1.1 8.8.8.8)
for host in "${HOSTS[@]}"; do
  # Collect union of answers across public resolvers
  current_a=()
  current_aaaa=()
  for r in "${RESOLVERS[@]}"; do
    mapfile -t ra < <(dig @"$r" +short "$host" A | grep -E "^([0-9]{1,3}\.){3}[0-9]{1,3}$" || true)
    mapfile -t raaaa < <(dig @"$r" +short "$host" AAAA | grep -E ":" || true)
    current_a+=("${ra[@]:-}")
    current_aaaa+=("${raaaa[@]:-}")
  done
  # Uniq
  mapfile -t current_a < <(printf "%s\n" "${current_a[@]:-}" | uniq_lines)
  mapfile -t current_aaaa < <(printf "%s\n" "${current_aaaa[@]:-}" | uniq_lines)
  for a in "${current_a[@]:-}"; do
    if ! is_in "$a" "${ALLOWED_A[@]}"; then
      violations+=("$host A has disallowed $a")
    fi
  done
  for aaaa in "${current_aaaa[@]:-}"; do
    if ! is_in "$aaaa" "${ALLOWED_AAAA[@]}"; then
      violations+=("$host AAAA has disallowed $aaaa")
    fi
  done
done

{
  echo "== Allowed GitHub Pages IPs =="
  echo "A:     $(join_by ", " "${ALLOWED_A[@]}")"
  echo "AAAA:  $(join_by ", " "${ALLOWED_AAAA[@]}")"
  echo
  for r in "${RESOLVERS[@]}"; do
    echo "== Observed via $r =="
    for host in "${HOSTS[@]}"; do
      echo "-- $host --"
      echo -n "A:    "; dig @"$r" +short "$host" A | grep -E "^([0-9]{1,3}\.){3}[0-9]{1,3}$" || true
      echo -n "AAAA: "; dig @"$r" +short "$host" AAAA | grep -E ":" || true
    done
    echo
  done
} | tee "$OUTDIR/dns-summary.txt"

# TLS certificate SAN checks
san_failures=()
for host in "${HOSTS[@]}"; do
  cert_txt="$OUTDIR/cert_${host//./_}.txt"
  {
    echo "== TLS cert ($host) =="
    echo | openssl s_client -connect "$host:443" -servername "$host" 2>/dev/null | openssl x509 -noout -text || true
  } > "$cert_txt"
  if ! grep -q "DNS:$host" "$cert_txt"; then
    san_failures+=("SAN missing for $host")
  fi
done

# Compose summary and decide exit code
{
  echo "Guard summary for $DOMAIN"
  echo "Hosts checked: ${HOSTS[*]}"
  echo
  if [ "${#violations[@]}" -gt 0 ]; then
    echo "DNS violations:"
    for v in "${violations[@]}"; do echo "- $v"; done
  else
    echo "DNS: OK (records within allowed GitHub Pages IP sets)"
  fi
  echo
  if [ "${#san_failures[@]}" -gt 0 ]; then
    echo "TLS SAN failures:"
    for s in "${san_failures[@]}"; do echo "- $s"; done
  else
    echo "TLS: OK (SAN includes all hosts)"
  fi
} | tee "$OUTDIR/summary.txt"

(cd "$OUTDIR" && { sha256sum * > SHA256SUMS.txt || shasum -a 256 * > SHA256SUMS.txt || true; })

# Exit non-zero if any issues
if [ "${#violations[@]}" -gt 0 ] || [ "${#san_failures[@]}" -gt 0 ]; then
  echo "Evidence: $OUTDIR"
  exit 1
fi

echo "Evidence: $OUTDIR"
exit 0
