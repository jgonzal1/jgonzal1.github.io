-- Lag for offset cals so we can see diff changes over months
SELECT strftime('%Y-%m', soldDate) AS MonthSold,
  COUNT(*) AS NumberCarsSold,
  LAG (COUNT(*), 1, 0) OVER calMonth AS LastMonthCarsSold
FROM sales
GROUP BY strftime('%Y-%m', soldDate) WINDOW calMonth AS (
    ORDER BY strftime('%Y-%m', soldDate)
  ) -- we can window indefinitely
ORDER BY strftime('%Y-%m', soldDate)
;
