-- Animals that were adopted and vaccinated at least twice
SELECT
  Name
, Species
FROM
  Adoptions
INTERSECT
SELECT
  Name
, Species
FROM
  Vaccinations
GROUP BY
  Name
, Species
HAVING
  COUNT(*) > 1
;