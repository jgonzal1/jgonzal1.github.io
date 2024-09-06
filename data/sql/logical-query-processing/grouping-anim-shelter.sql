/*
 Animal vaccination report
 --------------------------
 
 Write a query to report the number of vaccinations each animal has received.
 Include animals that were never vaccinated.
 Exclude all rabbits.
 Exclude all Rabies vaccinations.
 Exclude all animals that were last vaccinated on or after October first, 2019.
 
 The report should return the following attributes:
 Animals Name, Species, Primary Color, Breed,
 and the number of vaccinations this animal has received,
 
 -- Guidelines
 Use the correct logical join types and force order if needed.
 Use the  correct logical group by expressions.
 */
USE Animal_Shelter;
-- For SQL Server
SELECT AN.Name,
  AN.Species,
  MAX(AN.Primary_Color) AS Primary_Color,
  -- Dummy aggregate, functionally dependent.
  MAX(AN.Breed) AS Breed,
  -- Dummy aggregate, functionally dependent.
  COUNT(V.Vaccine) AS Number_Of_Vaccines
  -- * would count nulls
FROM Animals AS AN
  LEFT OUTER JOIN Vaccinations AS V ON V.Name = AN.Name
  AND V.Species = AN.Species
WHERE AN.Species <> 'Rabbit' -- Can't be null
  AND (
    V.Vaccine <> 'Rabies'
    OR V.Vaccine IS NULL
  )
GROUP BY AN.Species,
  AN.Name
HAVING MAX(V.Vaccination_Time) < '20191001'
  OR MAX(V.Vaccination_Time) IS NULL -- vt in HAVING to exclude the whole animal rows not just the RIGHT JOINee
ORDER BY AN.Species,
  AN.Name
;
