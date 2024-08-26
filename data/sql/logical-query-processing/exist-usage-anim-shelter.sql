SELECT * FROM persons
WHERE EXISTS (
  SELECT NULL
  FROM adoptions
  WHERE species = 'Elephant'
);
