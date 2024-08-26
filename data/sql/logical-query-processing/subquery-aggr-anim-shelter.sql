SELECT
  *
, (
    SELECT
      MAX(adoption_fee)
    FROM
      adoptions AS A2
    WHERE
      species = A1.species
  ) AS max_fee
FROM
  adoptions AS A1
;


SELECT
  A.*
, M.Max_Species_Fee
FROM
  Adoptions AS A
  INNER JOIN (
    SELECT
      Species
    , MAX(Adoption_Fee) AS Max_Species_Fee
    FROM
      Adoptions
    GROUP BY
      Species
  ) AS M ON A.Species = M.Species
;