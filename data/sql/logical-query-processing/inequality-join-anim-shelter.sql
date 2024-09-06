-- Adopters who adopted 2 animals on the same day
SELECT
  A1.Adopter_Email
, A1.Adoption_Date
, A1.Name          AS First_Animal_Name
, A1.Species       AS Firs_Animal_Species
, A2.Name          AS Second_Animal_Name
, A2.Species       AS Second_Animal_Species
FROM
  Adoptions AS A1
  INNER JOIN Adoptions AS A2 ON A1.Adopter_Email = A2.Adopter_Email
  AND A1.Adoption_Date = A2.Adoption_Date
  AND (
    (
      A1.Name = A2.Name
      AND A1.Species > A2.Species
    )
    OR (
      A1.Name > A2.Name
      AND A1.Species = A2.Species
    )
    OR (
      A1.Name > A2.Name
      AND A1.Species <> A2.Species
    )
  )
ORDER BY
  A1.Adopter_Email
, A1.Adoption_Date
;