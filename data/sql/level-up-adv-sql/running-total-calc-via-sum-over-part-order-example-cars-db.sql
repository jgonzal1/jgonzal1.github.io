WITH cte_sales AS (
  SELECT strftime('%Y', soldDate) AS soldYear,
    strftime('%m', soldDate) AS soldMonth,
    SUM(salesAmount) AS salesAmount
  FROM sales
  GROUP BY soldYear,
    soldMonth
)
SELECT soldYear,
  soldMonth,
  salesAmount,
  SUM(salesAmount) OVER (
    PARTITION BY soldYear
    ORDER BY soldYear,
      soldMonth
  ) AS annualSalesRunningTotal
FROM cte_sales
ORDER BY soldYear,
  soldMonth
;
