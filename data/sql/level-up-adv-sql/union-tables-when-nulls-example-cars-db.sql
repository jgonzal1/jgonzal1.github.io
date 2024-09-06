-- List all customers & their sales, even if some data is gone
SELECT cus.firstName,
  cus.lastName,
  cus.email,
  sls.salesAmount,
  sls.soldDate
FROM customer cus
  INNER JOIN sales sls
  ON cus.customerId = sls.customerId
UNION
-- Union with customers who have no sales
SELECT cus.firstName,
  cus.lastName,
  cus.email,
  sls.salesAmount,
  sls.soldDate
FROM customer cus
  LEFT JOIN sales sls
  ON cus.customerId = sls.customerId
WHERE sls.salesId IS NULL
UNION
-- Union with sales missing customer data
SELECT cus.firstName,
  cus.lastName,
  cus.email,
  sls.salesAmount,
  sls.soldDate
FROM sales sls
  LEFT JOIN customer cus
  ON cus.customerId = sls.customerId
WHERE cus.customerId IS NULL
;
