---
slug: /apply-col-default-to-existing-row
id: apply_col_default_to_existing_row
title: Apply column default to existing rows
description: Want to apply a default value to existing rows in a ClickHouse table column? Here's how to do that with MATERIALIZE.
tags:
  - beginner
  - getting-started
---

# Apply column default to existing rows

ClickHouse includes a special wrapper type called `Nullable` which allows a column to contain null values. It's common to use this early on in schema design, when a default value has not yet been decided. 

```sql
CREATE TABLE deleteme
(
    `number` UInt64,
    `date` Nullable(DateTime)
)
ENGINE = MergeTree
PARTITION BY number % 10
ORDER BY number AS
SELECT
    number,
    NULL
FROM numbers(10)
```

However, you will often find that you eventually want to modify this column to remove `Nullable` and insert a default value instead of nulls.

```sql
ALTER TABLE deleteme MODIFY COLUMN `date` DEFAULT now()
```

Adding a default value will affect new rows, but will not replace the nulls in existing rows.

```sql
SELECT *
FROM deleteme
LIMIT 1;

┌─number─┬─date─┐
│      0 │ ᴺᵁᴸᴸ │
└────────┴──────┘
```

To apply the new default value to existing rows, you can use `MATERIALIZE`.

```sql
ALTER TABLE deleteme
MATERIALIZE COLUMN `date`;

SELECT *
FROM deleteme
LIMIT 1;

┌─number─┬────────────────date─┐
│      0 │ 2022-09-23 12:31:14 │
└────────┴─────────────────────┘
```