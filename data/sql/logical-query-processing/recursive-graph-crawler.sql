WITH
  weblinks AS (
    SELECT
      'U1' AS URL
    , 'U3' AS Points_To_URL
    UNION
    SELECT
      'U1' AS URL
    , 'U9' AS Points_To_URL
    UNION
    SELECT
      'U2' AS URL
    , 'U6' AS Points_To_URL
    UNION
    SELECT
      'U2' AS URL
    , 'U8' AS Points_To_URL
    UNION
    SELECT
      'U3' AS URL
    , 'U2' AS Points_To_URL
    UNION
    SELECT
      'U3' AS URL
    , 'U4' AS Points_To_URL
    UNION
    SELECT
      'U3' AS URL
    , 'U5' AS Points_To_URL
    UNION
    SELECT
      'U3' AS URL
    , 'U9' AS Points_To_URL
    UNION
    SELECT
      'U4' AS URL
    , 'U2' AS Points_To_URL
    UNION
    SELECT
      'U5' AS URL
    , 'U4' AS Points_To_URL
    UNION
    SELECT
      'U5' AS URL
    , 'U6' AS Points_To_URL
  )
, Crawler (From_URL, To_URL, Level) AS (
    SELECT
      CAST('i' AS CHAR(3))
    , CAST('U4' AS CHAR(3))
    , CAST(0 AS INT)
    UNION ALL
    SELECT
      c.To_URL
    , W.Points_To_URL
    , level + 1
    FROM
      Weblinks AS W
      INNER JOIN Crawler AS C ON W.URL = C.To_URL
  )
SELECT
  Level
, from_URL
, to_URL
FROM
  Crawler
ORDER BY
  Level
, From_URL
, To_URL
;