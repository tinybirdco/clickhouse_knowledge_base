---
id: functions_to_multiple_cols
title: Apply a function to multiple columns
description: Want to apply a function to multiple columns in ClickHouse? Here's a shortcut to applying the same function across several columns in a table.
tags:
  - intermediate
  - getting-started
---

# Apply a function to multiple columns

When you write SQL you may want to apply the same function to several columns, which usually requires repeating the code and having to list all the columns:

```sql
SELECT
    *,
    formatReadableSize(read_bytes) AS read_bytes_readable,
    formatReadableSize(written_bytes) AS written_bytes_readable,
    formatReadableSize(result_bytes) AS result_bytes_readable
FROM system.query_log
WHERE (event_date = today()) AND (query_id = '58b7c683-5c86-482d-8f84-c04964129238') AND (type > 1)
```

This is a natural approach, but it can result in queries that are very long and hard to maintain, particularly as the size of the query grows.

You can use some features of ClickHouse to make this query more maintainable.

First, you can use the `SELECT ... EXCEPT` syntax, e.g. `SELECT * EXCEPT (read_bytes, written_bytes, result_bytes)`. This  allows you to remove a named subset of columns from the result, rather than the inverse of naming all of the columns that you do want.

Then, you can use the `COLUMNS` expression to select multiple columns whose name matches a pattern, e.g. `COLUMNS('bytes').

Finally, you can use the `APPLY` modifier to apply a function to each of the columns selected previously, e.g. `APPLY formatReadableSize`.

The complete query looks like this:

```sql
SELECT
    * EXCEPT (read_bytes, written_bytes, result_bytes),
    COLUMNS('bytes') APPLY formatReadableSize
FROM system.query_log
WHERE (event_date = today()) AND (query_id = '58b7c683-5c86-482d-8f84-c04964129238') AND (type > 1)
```