SELECT DISTINCT
  Name
, RANK() OVER (
    ORDER BY
      Name
  ) AS RANK
FROM
  Animals
LIMIT
  10
;