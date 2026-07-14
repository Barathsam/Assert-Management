#!/usr/bin/env bash
#
# End-to-end verification against a running app.
#
#   docker compose up -d          # app on :3000, Postgres seeded
#   ./scripts/verify.sh
#
# Walks the full asset lifecycle through the real HTTP endpoints, then tries to break every
# business rule the app claims to enforce, then checks the ledger and the status column agree.
#
# NOTE: this writes to the database. Run it against the local demo stack, never anything real.
# `npm run db:reset` restores clean demo data afterwards.

set -uo pipefail

BASE=${BASE:-http://localhost:3000}
DB_CONTAINER=${DB_CONTAINER:-am_db}
JAR=$(mktemp)

q()    { docker exec -i "$DB_CONTAINER" psql -U postgres -d asset_management -t -A -c "$1"; }
post() { curl -s -b "$JAR" -c "$JAR" -o /dev/null -X POST "$BASE$1" -d "$2"; }
code() { curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE$1" -d "$2"; }

pass()  { printf "  \033[32m✓\033[0m %s\n" "$1"; }
fail()  { printf "  \033[31m✗ FAIL\033[0m %s\n" "$1"; FAILED=1; }
check() { [ "$1" = "$2" ] && pass "$3" || fail "$3 — expected '$2', got '$1'"; }

CAT=$(q "SELECT id FROM asset_categories WHERE code='LAP'")
BR=$(q "SELECT id FROM branches WHERE code='BLR'")
EMP=$(q "SELECT id FROM employees WHERE is_active ORDER BY id LIMIT 1")
SERIAL="VERIFY-$(date +%s)"

echo "=== GOLDEN PATH: purchase → issue → return(repair) → repaired → scrap ==="

post /assets "serialNumber=$SERIAL&categoryId=$CAT&branchId=$BR&make=Dell&model=Latitude+9999&purchaseDate=2026-01-10&purchaseCost=90000&vendor=Redington"
ID=$(q "SELECT id FROM assets WHERE upper(btrim(serial_number))='$SERIAL'")
[ -n "$ID" ] || { fail "asset was not created"; exit 1; }
pass "asset created ($(q "SELECT asset_tag FROM assets WHERE id=$ID"))"

check "$(q "SELECT status FROM assets WHERE id=$ID")" "IN_STOCK" "born IN_STOCK"
check "$(q "SELECT count(*) FROM asset_transactions WHERE asset_id=$ID AND txn_type='PURCHASE'")" "1" \
      "purchase recorded on the ledger"

post "/assets/$ID/issue" "employeeId=$EMP&issueDate=2026-02-01"
check "$(q "SELECT status FROM assets WHERE id=$ID")" "ISSUED" "issue → ISSUED"
check "$(q "SELECT count(*) FROM assets_active WHERE id=$ID AND status='IN_STOCK'")" "0" "left Stock View"

post "/assets/$ID/return" "reason=REPAIR&returnDate=2026-03-01"
check "$(q "SELECT status FROM assets WHERE id=$ID")" "IN_REPAIR" \
      "return(REPAIR) → IN_REPAIR, NOT back into stock"
check "$(q "SELECT current_holder_id IS NULL FROM assets WHERE id=$ID")" "t" "holder cleared"

post "/assets/$ID/repair-complete" "date=2026-03-10&cost=4500&vendor=Acme+Services"
check "$(q "SELECT status FROM assets WHERE id=$ID")" "IN_STOCK" "repair complete → IN_STOCK"
check "$(q "SELECT amount::int FROM asset_transactions WHERE asset_id=$ID AND txn_type='REPAIR_COMPLETE'")" \
      "4500" "repair cost captured (so it lands in total cost of ownership)"

post "/assets/$ID/scrap" "date=2026-04-01&scrapValue=3000&reason=Beyond+economic+repair"
check "$(q "SELECT status FROM assets WHERE id=$ID")" "SCRAPPED" "scrap → SCRAPPED"

echo
echo "=== REQUIREMENT 7: scrapped assets appear ONLY in reports ==="
TAG=$(q "SELECT asset_tag FROM assets WHERE id=$ID")
# No cookie jar on purpose: the session that just scrapped it holds a flash message naming the
# tag, and grepping that would match the banner rather than the table. A fresh visitor is the
# honest test of what the page actually shows.
for p in /assets /stock /issue /return /scrap /api/assets; do
  check "$(curl -s "$BASE$p" | grep -c "$TAG")" "0" "absent from $p"
done
for p in /reports/scrapped /reports/ledger; do
  [ "$(curl -s "$BASE$p" | grep -c "$TAG")" -gt 0 ] && pass "present in $p" || fail "missing from $p"
done
check "$(curl -s -o /dev/null -w '%{http_code}' "$BASE/reports/history/$ID")" "200" \
      "history still reachable for a scrapped asset"
check "$(q "SELECT count(*) FROM assets WHERE id=$ID")" "1" "row preserved — scrap is not a delete"

echo
echo "=== REQUIREMENT 8: the money adds up ==="
# 90,000 purchase + 4,500 repair − 3,000 recovered = 91,500
curl -s "$BASE/reports/history/$ID" | grep -q "91,500" \
  && pass "net cost ₹91,500 = 90,000 purchase + 4,500 repair − 3,000 scrap" \
  || fail "net cost is wrong"

echo
echo "=== TRY TO BREAK IT ==="

HOLDER=$(q "SELECT current_holder_id FROM assets WHERE status='ISSUED' LIMIT 1")
post "/employees/$HOLDER/deactivate" ""
check "$(q "SELECT is_active FROM employees WHERE id=$HOLDER")" "t" \
      "cannot deactivate an employee who still holds assets"

A2=$(q "SELECT id FROM assets WHERE status='IN_STOCK' LIMIT 1")
E1=$(q "SELECT id FROM employees WHERE is_active ORDER BY id LIMIT 1")
E2=$(q "SELECT id FROM employees WHERE is_active ORDER BY id DESC LIMIT 1")
post "/assets/$A2/issue" "employeeId=$E1&issueDate=2026-05-01"
check "$(code "/assets/$A2/issue" "employeeId=$E2&issueDate=2026-05-01")" "400" \
      "cannot issue an asset that is already issued"
check "$(q "SELECT current_holder_id FROM assets WHERE id=$A2")" "$E1" "still held by the FIRST employee"

code /assets "serialNumber=++$(echo "$SERIAL" | tr '[:upper:]' '[:lower:]')+&categoryId=$CAT&branchId=$BR&make=HP&model=X&purchaseDate=2026-01-10&purchaseCost=100" >/dev/null
check "$(q "SELECT count(*) FROM assets WHERE upper(btrim(serial_number))='$SERIAL'")" "1" \
      "duplicate serial rejected even with different case/whitespace"

INACT=$(q "SELECT id FROM employees WHERE NOT is_active LIMIT 1")
A3=$(q "SELECT id FROM assets WHERE status='IN_STOCK' LIMIT 1")
check "$(code "/assets/$A3/issue" "employeeId=$INACT&issueDate=2026-05-01")" "400" \
      "cannot issue to an inactive employee"
check "$(code "/assets/$A3/return" "reason=UPGRADE&returnDate=2026-05-01")" "400" \
      "cannot return an asset that is not issued"
check "$(code "/assets/$A3/return" "returnDate=2026-05-01")" "400" \
      "return with no reason rejected as a validation error, not a 500"
check "$(code "/assets/$ID/issue" "employeeId=$E1&issueDate=2026-05-01")" "400" \
      "cannot issue a scrapped asset — scrap is terminal"

echo
echo "=== INTEGRITY: the status column has not drifted from the ledger ==="
check "$(q "SELECT count(*) FROM assets a
             LEFT JOIN LATERAL (SELECT t.to_status FROM asset_transactions t
                                 WHERE t.asset_id = a.id
                                 ORDER BY t.txn_at DESC, t.id DESC LIMIT 1) l ON true
            WHERE l.to_status IS DISTINCT FROM a.status")" "0" \
      "every asset's status matches its last ledger event"
check "$(q "SELECT count(*) FROM (
             SELECT from_status,
                    LAG(to_status) OVER (PARTITION BY asset_id ORDER BY txn_at, id) prev
               FROM asset_transactions) x
            WHERE prev IS NOT NULL AND from_status IS DISTINCT FROM prev")" "0" \
      "every asset's ledger chain is contiguous"

echo
if [ -z "${FAILED:-}" ]; then
  printf "\033[32mALL CHECKS PASSED\033[0m — run 'npm run db:reset' to restore clean demo data.\n"
else
  printf "\033[31mSOME CHECKS FAILED\033[0m\n"
  exit 1
fi
