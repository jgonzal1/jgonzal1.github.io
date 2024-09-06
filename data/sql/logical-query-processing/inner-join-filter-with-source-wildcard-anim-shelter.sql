SELECT DISTINCT P.*
FROM persons AS P
INNER JOIN adoptions AS A
ON A.adopter_email = P.email
;
