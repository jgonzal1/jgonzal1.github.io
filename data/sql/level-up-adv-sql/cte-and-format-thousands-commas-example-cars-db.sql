WITH common_table_expression AS (
  SELECT strftime('%Y', soldDate) AS sold_year,
    salesAmount as sales_amount
  FROM sales
)
SELECT sold_year,
  FORMAT('%,d', (SUM(sales_amount) / 100)) -- units
  || FORMAT('.%02d $', SUM(sales_amount) % 100) AS annual_sales -- decimals
  -- former: FORMAT("U%.2f $", SUM(sales_amount)) AS annual_sales
FROM common_table_expression
GROUP BY sold_year
ORDER BY sold_year
;
