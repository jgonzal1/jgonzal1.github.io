-- ! PROBLEM STATEMENT
-- * We create a table instead of using a WITH clause
-- * in order to keep constants the selected columns;
-- * because the random creates a different set every time
DROP TABLE Animals_Excerpt
;


CREATE TABLE
  Animals_Excerpt (Date_Of_Admission DATE NOT NULL, Species VARCHAR(10) NOT NULL, Name VARCHAR(20) NOT NULL)
;


INSERT INTO
  Animals_Excerpt (Date_Of_Admission, Species, Name)
SELECT DISTINCT
  DATE (Admission_Date) AS Date_Of_Admission
, Species
, Name
FROM
  Animals
WHERE
  Date_Of_Admission IS NOT NULL
  AND Date_Of_Admission < DATE ("2009-11-01")
ORDER BY
  random ()
LIMIT
  10
;


-- ! For big data sources:
-- WITH
--   Sorted_An_Excerpt AS (
--     SELECT
--       Date_Of_Admission
--     , Species
--     , Name
--     FROM
--       Animals_Excerpt
--     ORDER BY
--       1
--     , 2
--     , 3
--   )
SELECT
  Date_Of_Admission
, Species
, Name || IFNULL ( -- * Does not fully join them, and in the best case just groups 2
    (
      SELECT
        ' and ' || Name
      FROM
        Animals_Excerpt AS A2
      WHERE
        A1.Date_Of_Admission = A2.Date_Of_Admission
        AND A1.Species = A2.Species
        AND A1.Name <> A2.Name
    )
  , ""
  ) AS Adopted_Names
, "JOIN" AS Source
FROM
  Animals_Excerpt AS A1 -- ! For big data sources: Sorted_An_Excerpt
UNION
SELECT
  Date_Of_Admission
, Species
, Name AS Adopted_Names
, "Excerpt" AS Source
FROM
  Animals_Excerpt -- ! For big data sources: Sorted_An_Excerpt
;