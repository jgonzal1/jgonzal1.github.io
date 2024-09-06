-- Generate 1-100 list
WITH RECURSIVE
  cnt(x) AS (
     SELECT 1
     UNION ALL
     SELECT x+1 FROM cnt
      LIMIT 100
  )
SELECT x FROM cnt;


-- Generate all dates of 2023
WITH RECURSIVE
  cnt(x) AS (
     SELECT 0
     UNION ALL
     SELECT x+1 FROM cnt
      LIMIT 365
  )
SELECT DATE ('2019-01-01 00:00:00', '+'||x||' day') AS date FROM cnt;


-- Generate 100 random values with 99999 as limit
WITH RECURSIVE
  cnt(x) AS (
     SELECT 1
     UNION ALL
     SELECT x+1 FROM cnt
      LIMIT 100
  )
SELECT abs(random() % 99999) AS rnd FROM cnt;

-- Generate 100 double random values with 99999 as limit
WITH RECURSIVE
  cnt(x) AS (
     SELECT 1
     UNION ALL
     SELECT x+1 FROM cnt
      LIMIT 100
  )
SELECT abs(random() % 99999) AS RandIdx,
  abs(random() % 99999) AS RandMatch
  FROM cnt;


-- Generate binary matrix
SELECT * FROM (
    (SELECT 0 AS A UNION ALL SELECT 1 AS A) t2 -- maximum allowed limit size ↓
    ,(SELECT 0 AS B UNION ALL SELECT 1 AS B) t4
    ,(SELECT 0 AS C UNION ALL SELECT 1 AS C) t8
    ,(SELECT 0 AS D UNION ALL SELECT 1 AS D) t16
    --,(SELECT 0 AS E UNION ALL SELECT 1 AS E) t32
    --,(SELECT 0 AS F UNION ALL SELECT 1 AS F) t64
    --,(SELECT 0 AS G UNION ALL SELECT 1 AS G) t128
    --,(SELECT 0 AS H UNION ALL SELECT 1 AS H) t256
    --,(SELECT 0 AS I UNION ALL SELECT 1 AS I) t512
    --,(SELECT 0 AS J UNION ALL SELECT 1 AS J) t1024
    --,(SELECT 0 AS K UNION ALL SELECT 1 AS K) t2048
  ); -- LIMIT N<=tN