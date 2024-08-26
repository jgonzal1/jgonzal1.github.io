SELECT
  emp.firstName,
  emp.lastName,
  SUM(CASE WHEN strftime('%m',soldDate)='01' THEN salesAmount ELSE 0 END) AS _2101,
  SUM(CASE WHEN strftime('%m',soldDate)='02' THEN salesAmount ELSE 0 END) AS _2102,
  SUM(CASE WHEN strftime('%m',soldDate)='03' THEN salesAmount ELSE 0 END) AS _2103,
  SUM(CASE WHEN strftime('%m',soldDate)='04' THEN salesAmount ELSE 0 END) AS _2104,
  SUM(CASE WHEN strftime('%m',soldDate)='05' THEN salesAmount ELSE 0 END) AS _2105,
  SUM(CASE WHEN strftime('%m',soldDate)='06' THEN salesAmount ELSE 0 END) AS _2106,
  SUM(CASE WHEN strftime('%m',soldDate)='07' THEN salesAmount ELSE 0 END) AS _2107,
  SUM(CASE WHEN strftime('%m',soldDate)='08' THEN salesAmount ELSE 0 END) AS _2108,
  SUM(CASE WHEN strftime('%m',soldDate)='09' THEN salesAmount ELSE 0 END) AS _2109,
  SUM(CASE WHEN strftime('%m',soldDate)='10' THEN salesAmount ELSE 0 END) AS _2110,
  SUM(CASE WHEN strftime('%m',soldDate)='11' THEN salesAmount ELSE 0 END) AS _2111,
  SUM(CASE WHEN strftime('%m',soldDate)='12' THEN salesAmount ELSE 0 END) AS _2112
FROM sales sls
  INNER JOIN employee emp ON sls.employeeId = emp.employeeId
WHERE sls.soldDate >= '2021-01-01' AND sls.soldDate < '2022-01-01'
GROUP BY emp.firstName, emp.lastName
ORDER BY emp.lastName, emp.firstName
;
