SELECT
  "1_specific_unix_epoch" AS key
, unixepoch ('2023-01-13 01:01:01') AS VALUE
, strftime ('%s', DATE ("2023-01-13 01:01:01")) AS strftime_value
UNION
SELECT
  "2_date_start_of_year" AS key
, DATE ('now', 'start of year') AS VALUE
, strftime ('%F', DATE ('now', 'start of year')) AS strftime_value
UNION
SELECT
  "3_first_tuesday_in_october_for_the_current_year" AS key
, DATE ('now', 'start of year', '+9 months', 'weekday 2') AS VALUE
, strftime ('%F', DATE ('now', 'start of year', '+9 months', 'weekday 2')) AS strftime_value
UNION
SELECT
  "4_last_day_of_the_current_month" AS key
, DATE ('now', 'start of month', '+1 month', '-1 day') AS VALUE
, strftime ('%F', DATE ('now', 'start of month', '+1 month', '-1 day')) AS strftime_value
UNION
SELECT
  "5_date" AS key
, DATE () AS VALUE
, strftime ('%F', DATE ("now")) AS strftime_value
UNION
SELECT
  "6_time" AS key
, TIME() AS VALUE
, strftime ('%T', DATE ("now")) AS strftime_value
UNION
SELECT
  "7_datetime" AS key
, datetime () AS VALUE
, strftime ('%F %T', DATE ("now")) AS strftime_value
UNION
SELECT
  "8_julian_day" AS key
, julianday () AS VALUE
, strftime ('%J', DATE ("now")) AS strftime_value
  -- fractional number of days since noon
  -- in Greenwich on -4714-11-23
  -- (Proleptic Gregorian calendar start)
  -- at which three multi-year cycles started
  -- (which are: Indiction, Solar, and Lunar cycles)
  -- and which preceded any dates in recorded history
  --UNION
  --SELECT "9_current_year" AS key
  --, "" AS specific_value
  --, strftime('%Y', date('now')) AS strftime_value
  --UNION
  --SELECT "0_time_diff" AS key
  --, timediff(date('2023-02-15'), date('2023-03-15')) AS specific_value
  --, "" AS strftime_value
  -- YEAR(CURRENT_TIMESTAMP)
  -- More on strftime format: https://www.sqlite.org/lang_datefunc.html
;


/* Reference:
https://www.sqlitetutorial.net/sqlite-date-functions/sqlite-strftime-function/
Format , Description
%Y , year: 0000-9999
%m , month: 01-12
%d , day of the month: 01-31

%j , day of the year: 001-366
%J , Julian day number

%w , day of week 0-6 with Sunday==0
%W , week of the year: 00-53

%H , hour: 00-24
%M , minute: 00-59
%S , seconds: 00-59

%s , seconds since 1970-01-01
%f , fractional seconds: SS.SSS
%% , %
 */