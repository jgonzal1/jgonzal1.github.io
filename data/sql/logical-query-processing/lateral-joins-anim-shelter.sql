-- Last 3 vaccinations via PostgreSQL, excludes the ones without (sub-query is 0)
SELECT
  A.Name
, A.Species
, A.Primary_Color
, A.Breed
, Last_Vaccinations.*
FROM
  Animals AS A
  CROSS JOIN LATERAL (
    SELECT
      V.Vaccine
    , V.Vaccination_Time
    FROM
      Vaccinations AS V
    WHERE
      V.Name = A.Name
      AND V.Species = A.species
    ORDER BY
      V.Vaccination_Time DESC
    LIMIT
      3
    OFFSET
      0
  ) AS Last_Vaccinations
ORDER BY
  A.Name
, Vaccination_Time
;


-- Last 3 vaccinations via PostgreSQL, includes the ones without (sub-query is 0)
SELECT
  A.Name
, A.Species
, A.Primary_Color
, A.Breed
, Last_Vaccinations.*
FROM
  Animals AS A
  LEFT OUTER JOIN LATERAL (
    SELECT
      V.Vaccine
    , V.Vaccination_Time
    FROM
      Vaccinations AS V
    WHERE
      V.Name = A.Name
      AND V.Species = A.species
    ORDER BY
      V.Vaccination_Time DESC
    LIMIT
      3
    OFFSET
      0
  ) AS Last_Vaccinations ON TRUE
ORDER BY
  A.Name
, Vaccination_Time
;


-- Alternative CROSS APPLY: Last 3 vaccinations via PostgreSQL, excludes the ones without (sub-query is 0)
SELECT
  A.Name
, A.Species
, A.Primary_Color
, A.Breed
, Last_Vaccinations.*
FROM
  Animals AS A CROSS APPLY (
    SELECT
      V.Vaccine
    , V.Vaccination_Time
    FROM
      Vaccinations AS V
    WHERE
      V.Name = A.Name
      AND V.Species = A.species
    ORDER BY
      V.Vaccination_Time DESC
    OFFSET
      0 ROWS
    FETCH NEXT
      3 ROW ONLY
  ) AS Last_Vaccinations
ORDER BY
  A.Name
, Vaccination_Time
;


-- Alternative OUTER APPLY: Last 3 vaccinations via PostgreSQL, includes the ones without (sub-query is 0)
SELECT
  A.Name
, A.Species
, A.Primary_Color
, A.Breed
, Last_Vaccinations.*
FROM
  Animals AS A OUTER APPLY (
    SELECT
      V.Vaccine
    , V.Vaccination_Time
    FROM
      Vaccinations AS V
    WHERE
      V.Name = A.Name
      AND V.Species = A.species
    ORDER BY
      V.Vaccination_Time DESC
    OFFSET
      0 ROWS
    FETCH NEXT
      3 ROW ONLY
  ) AS Last_Vaccinations
ORDER BY
  A.Name
, Vaccination_Time
;