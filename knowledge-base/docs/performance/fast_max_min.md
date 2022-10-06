---
id: fast_max_min
title: Speed up ARGMIN and ARGMAX aggregations
Description: ARGMIN() and ARGMAX are useful ClickHouse functions. Here's how to make them faster to speed up your queries in ClickHouse.
tags:
  - beginner
  - performance
---

# Speed up ARGMIN and ARGMAX aggregations

ClickHouse currently is not able to use the knowledge of the sort key from a table to speed up aggregations. This means that to get the `ARGMIN()` or `ARGMAX()` values from a table it will read all values even if it's sorted by that column:

```sql
CREATE TABLE myData
ENGINE = MergeTree
ORDER BY value AS
SELECT *
FROM generateRandom('value UInt64 , id String')
LIMIT 100000000

Query id: a41f287e-ecb5-4689-9306-a8fe037c6d85

Ok.

0 rows in set. Elapsed: 6.356 sec.

SELECT argMax(id, value) FROM myData;

SELECT argMax(id, value)
FROM myData

Query id: e2c16764-723d-48ad-93ad-64c1b9ab9247

┌─argMax(id, value)─┐
│ +wS50l4(          │
└───────────────────┘

1 row in set. Elapsed: 0.115 sec. Processed 100.00 million rows, 2.20 GB (866.13 million rows/s., 19.06 GB/s.)

SELECT read_rows, read_bytes FROM system.query_log WHERE initial_query_id = 'e2c16764-723d-48ad-93ad-64c1b9ab9247' AND type = 'QueryFinish' \G

SELECT
    read_rows,
    read_bytes
FROM system.query_log
WHERE (initial_query_id = 'e2c16764-723d-48ad-93ad-64c1b9ab9247') AND (type = 'QueryFinish')

Query id: 628d011d-c84e-4150-b7c1-0548e3dc35cb

Row 1:
──────
read_rows:  100000000
read_bytes: 2200081879

1 row in set. Elapsed: 0.005 sec. 
```

To get the id with the highest value, you have to read the whole table, in this case 100M elements. But the knowledge of the structure allows you to be more clever:

```sql
SELECT id FROM myData ORDER BY value DESC LIMIT 1;

SELECT id
FROM myData
ORDER BY value DESC
LIMIT 1

Query id: 7c560628-93c6-44be-b533-c25558f96378

┌─id───────┐
│ +wS50l4( │
└──────────┘

1 row in set. Elapsed: 0.003 sec. Processed 41.22 thousand rows, 906.51 KB (15.34 million rows/s., 337.29 MB/s.)

SELECT read_rows, read_bytes FROM system.query_log where initial_query_id = '7c560628-93c6-44be-b533-c25558f96378' AND type = 'QueryFinish' \G

SELECT
    read_rows,
    read_bytes
FROM system.query_log
WHERE (initial_query_id = '7c560628-93c6-44be-b533-c25558f96378') AND (type = 'QueryFinish')

Query id: bcf59f19-0537-44cd-8b24-cd398b815276

Row 1:
──────
read_rows:  41216
read_bytes: 906512

1 row in set. Elapsed: 0.004 sec.
```

In this case ClickHouse knows that it can use the sorting key of the table and read only the first block of data, which is much faster. Beware that this doesn't work exactly the same for some types, especially when dealing with floating point and NaNs, but it can be useful in many other cases.
