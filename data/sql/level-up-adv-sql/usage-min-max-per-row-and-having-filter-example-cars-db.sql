SELECT emp.employeeId,
  emp.firstName,
  emp.lastName,
  count(*) AS NumOfCarsSold,
  MIN(salesAmount) AS MinSalesAmount,
  MAX(salesAmount) AS MaxSalesAmount
FROM sales sls
  INNER JOIN employee emp ON sls.employeeId = emp.employeeId
WHERE sls.soldDate >= date('now', 'start of year')
GROUP BY emp.employeeId,
  emp.firstName,
  emp.lastName
HAVING count(*) > 5
;
