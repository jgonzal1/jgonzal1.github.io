/*
Animal vaccinations report.
---------------------------
Write a query to report all animals and their vaccinations.
Animals that have not been vaccinated should be included.
The report should include the following attributes:
Animal's name, species, breed, and primary color,
vaccination time and the vaccine name,
the staff member's first name, last name, and role.

Guidelines:
-----------
Use the minimal number of tables required.
Use the correct logical join types and force join order as needed.
*/
USE Animal_Shelter;
SELECT A.Name,
  A.Species,
  A.Breed,
  A.Primary_Color,
  V.Vaccination_Time,
  V.Vaccine,
  P.First_Name,
  P.Last_Name,
  SA.Role
FROM Animals AS A
  LEFT OUTER JOIN (
    Vaccinations AS V
    INNER JOIN Staff_Assignments AS SA ON SA.Email = V.Email
    INNER JOIN Persons AS P ON P.Email = V.Email
  ) ON A.Name = V.Name
  AND A.Species = V.Species
ORDER BY A.Species,
  A.Name,
  A.Breed,
  V.Vaccination_Time DESC
;
