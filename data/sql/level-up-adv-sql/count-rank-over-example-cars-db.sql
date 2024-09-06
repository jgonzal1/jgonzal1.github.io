-- for each salesperson, rank the car models they've sold the most
SELECT emp.firstName,
  emp.lastName,
  mdl.model,
  count(model) AS numberSold,
  rank() OVER (
    PARTITION BY sls.employeeId
    ORDER BY count(model) DESC
    -- aggr alias not available unless new step
  ) AS rank
FROM sales sls
  INNER JOIN employee emp
  ON sls.employeeId = emp.employeeId
  INNER JOIN inventory inv
  ON inv.inventoryId = sls.inventoryId
  INNER JOIN model mdl
  ON mdl.modelId = inv.modelId
GROUP BY emp.firstName,
  emp.lastName,
  mdl.model
ORDER BY lastName, firstName, rank
;
