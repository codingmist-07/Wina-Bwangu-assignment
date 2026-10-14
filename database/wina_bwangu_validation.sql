-- =====================================================================
-- Wina Bwangu Database — Validation / Test Queries
-- Every query here SHOULD RETURN 0 ROWS if the data is correct.
-- If any query returns rows, that's the bug you need to fix.
-- =====================================================================

USE wina_bwangu;

-- CHECK 1: Row counts match the case study's stated numbers
-- Expected: booths=6, services=5, transactions=308
SELECT
  (SELECT COUNT(*) FROM booths)       AS booth_count,
  (SELECT COUNT(*) FROM services)     AS service_count,
  (SELECT COUNT(*) FROM transactions) AS transaction_count;
-- PASS if this reads 6 | 5 | 308

-- CHECK 2: No transaction references a booth that doesn't exist
-- (orphaned foreign key — should be impossible if FKs are enforced, but
--  worth checking if your DB doesn't enforce FKs by default, e.g. SQLite)
SELECT t.transaction_id, t.booth_code
FROM   transactions t
LEFT JOIN booths b ON b.booth_code = t.booth_code
WHERE  b.booth_code IS NULL;

-- CHECK 3: No transaction references a service that doesn't exist
SELECT t.transaction_id, t.service_name
FROM   transactions t
LEFT JOIN services s ON s.service_name = t.service_name
WHERE  s.service_name IS NULL;

-- CHECK 4 (the important one): No transaction records a service that its
-- booth isn't allowed to sell. E.g. Wina4 doesn't carry Zanaco/FNB — if a
-- Wina4 transaction shows Zanaco, that violates the case study's catalogue.
SELECT t.transaction_id, t.booth_code, t.service_name
FROM   transactions t
LEFT JOIN booth_services bs
       ON bs.booth_code = t.booth_code AND bs.service_name = t.service_name
WHERE  bs.booth_code IS NULL;

-- CHECK 5: Transaction amounts fall within the min/max the case study
-- implies for the capture form (K20 - K10,000).
SELECT transaction_id, transaction_amount
FROM   transactions
WHERE  transaction_amount < 20 OR transaction_amount > 10000;

-- CHECK 6: TransactionID format is correct — 'WB' followed by exactly
-- 7 digits (e.g. WB0000309). Catches typos or malformed IDs.
SELECT transaction_id
FROM   transactions
WHERE  transaction_id NOT LIKE 'WB_______'   -- WB + 7 chars
   OR  length(transaction_id) <> 9;

-- CHECK 7: No duplicate TransactionIDs (each must be unique).
SELECT transaction_id, COUNT(*) AS occurrences
FROM   transactions
GROUP BY transaction_id
HAVING COUNT(*) > 1;

-- CHECK 8: Every booth has at least one service in its catalogue
-- (a booth with zero services would be a data-entry mistake).
SELECT b.booth_code
FROM   booths b
LEFT JOIN booth_services bs ON bs.booth_code = b.booth_code
GROUP BY b.booth_code
HAVING COUNT(bs.service_name) = 0;

-- CHECK 9 (sanity, not pass/fail): does any single service's cumulative
-- transactions exceed its monthly limit? The case study wants agents to
-- SEE this (it's a business condition, not a data error) — but it's worth
-- knowing which services are already over/near limit.
SELECT s.service_name,
       s.month_limit,
       SUM(t.transaction_amount) AS cumulative_total,
       s.month_limit - SUM(t.transaction_amount) AS amount_remaining
FROM   services s
JOIN   transactions t ON t.service_name = s.service_name
GROUP BY s.service_name, s.month_limit
HAVING SUM(t.transaction_amount) > s.month_limit;

-- CHECK 10: Spot-check a handful of known rows against Appendix 1 by hand.
-- Pick 3-4 transaction IDs from the case study PDF and confirm they match.
SELECT * FROM transactions
WHERE transaction_id IN ('WB0000001','WB0000050','WB0000150','WB0000308');
