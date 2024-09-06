-- Animals never adopted
SELECT DISTINCT -- ! needed
  an.name,
  an.species
FROM animals AS an
  LEFT OUTER JOIN adoptions AS ad ON ad.name = an.name
  AND ad.species = an.species
WHERE ad.name IS NULL;
-- or
SELECT name,
  species
FROM animals
EXCEPT
SELECT name,
  species
FROM adoptions;
-- or
SELECT AN.Name,
  AN.Species
FROM Animals AS AN
WHERE NOT EXISTS (
    SELECT NULL
    FROM Adoptions AS AD
    WHERE AD.Name = AN.Name
      AND AD.Species = AN.Species
  );
-- select all known breeds that were never adopted
SELECT DISTINCT -- ! needed
  an.breed,
  an.species,
  an.breed
FROM animals AS an
  LEFT OUTER JOIN adoptions AS ad ON ad.name = an.name
  AND ad.species = an.species
WHERE ad.name IS NULL
  AND ad.breed IS NOT NULL;

-- correct
SELECT Species,
  Breed
FROM Animals
EXCEPT
SELECT AN.Species,
  AN.Breed
FROM Animals AS AN
  INNER JOIN Adoptions AS AD ON AN.Species = AD.Species
  AND AN.Name = AD.Name;
