-- String aggregate
SELECT
  Adoption_Date
, SUM(Adoption_Fee) AS Total_Fee
, group_concat ((Name || ' the ' || Species), ", ") AS Adopted_Animals
FROM
  Adoptions
GROUP BY
  Adoption_Date
  -- HAVING
  --     COUNT(*) > 1
;