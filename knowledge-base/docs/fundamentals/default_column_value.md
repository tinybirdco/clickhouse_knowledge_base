---
id: default_column_value
title: Add a default value for new columns
description: Want to change the default value for new columns in ClickHouse? Here's how to do just that.
tags:
  - beginner
  - getting-started
---

# Add a default value for new columns

When you add a new column to a table, ClickHouse will add it with the default value:

```sql
CREATE TABLE local
ENGINE = MergeTree
ORDER BY number AS
SELECT *
FROM numbers(1000000);

ALTER TABLE local
    ADD COLUMN IF NOT EXISTS `date` DateTime;

OPTIMIZE TABLE local FINAL; -- To speed up the mutation / lazy way to know it has finished

SELECT *
FROM local
LIMIT 10

Query id: b5fedb97-a1c8-475f-a674-0b1658c8e889

┌─number─┬────────────────date─┐
│      0 │ 1970-01-01 01:00:00 │
│      1 │ 1970-01-01 01:00:00 │
│      2 │ 1970-01-01 01:00:00 │
│      3 │ 1970-01-01 01:00:00 │
│      4 │ 1970-01-01 01:00:00 │
│      5 │ 1970-01-01 01:00:00 │
│      6 │ 1970-01-01 01:00:00 │
│      7 │ 1970-01-01 01:00:00 │
│      8 │ 1970-01-01 01:00:00 │
│      9 │ 1970-01-01 01:00:00 │
└────────┴─────────────────────┘
```

To change the default value for old rows you need to declare the default in the column definition:

```sql
ALTER TABLE local
    ADD COLUMN IF NOT EXISTS `new_date` DateTime DEFAULT now();

OPTIMIZE TABLE local FINAL;

SELECT *
FROM local
LIMIT 10

Query id: b5ff3afd-78f7-4ea3-8d43-adc7fe14f0a0

┌─number─┬────────────────date─┬────────────new_date─┐
│      0 │ 1970-01-01 01:00:00 │ 2022-09-23 13:53:38 │
│      1 │ 1970-01-01 01:00:00 │ 2022-09-23 13:53:38 │
│      2 │ 1970-01-01 01:00:00 │ 2022-09-23 13:53:38 │
│      3 │ 1970-01-01 01:00:00 │ 2022-09-23 13:53:38 │
│      4 │ 1970-01-01 01:00:00 │ 2022-09-23 13:53:38 │
│      5 │ 1970-01-01 01:00:00 │ 2022-09-23 13:53:38 │
│      6 │ 1970-01-01 01:00:00 │ 2022-09-23 13:53:38 │
│      7 │ 1970-01-01 01:00:00 │ 2022-09-23 13:53:38 │
│      8 │ 1970-01-01 01:00:00 │ 2022-09-23 13:53:38 │
│      9 │ 1970-01-01 01:00:00 │ 2022-09-23 13:53:38 │
└────────┴─────────────────────┴─────────────────────┘

10 rows in set. Elapsed: 0.002 sec.
```

Note that this means that new rows will also get the default value if it's not declared on insertion.

```sql
ALTER TABLE local
    MODIFY COLUMN `new_date` DateTime DEFAULT yesterday();

INSERT INTO local(number) VALUES (999999999);

SELECT *
FROM local
WHERE number = 999999999

Query id: 02527ad6-4644-42ff-8755-8869a9df30fa

┌────number─┬────────────────date─┬────────────new_date─┐
│ 999999999 │ 1970-01-01 01:00:00 │ 2022-09-22 00:00:00 │
└───────────┴─────────────────────┴─────────────────────┘
```