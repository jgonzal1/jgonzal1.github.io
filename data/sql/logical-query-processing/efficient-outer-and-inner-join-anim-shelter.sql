SELECT *
FROM Animals AS AN -- 100 entries
  LEFT OUTER JOIN ( -- not neded but good to keep for readability
    Adoptions AS AD -- 70 entries
    INNER JOIN Persons AS P
    ON AD.Adopter_Email = P.Email
  ) ON AD.Name = AN.Name
  AND AD.Species = AN.Species
; -- 100 entries
