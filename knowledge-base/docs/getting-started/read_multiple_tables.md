---
id: read_multiple_tables
title: Selecting from multiple tables
tags:
  - beginner
  - getting-started
---

# How do I read data from multiple tables as one?

Let's say that you have several tables with the same structure, or a common subset, and you want to read from all of them in a single query. Coming from other RDBMS you might be tempted to do something along the lines of

```sql
SELECT max(d1)
FROM
(
    SELECT *
    FROM t_20220919
    UNION ALL
    SELECT *
    FROM t_20220920
    UNION ALL
    SELECT *
    FROM t_20220920
)
```

In ClickHouse, we can use `merge` function to make this easier.

`merge` enables us to query multiple tables as if they were a single table, with much cleaner syntax, making it easier to read & maintain.

```sql
SELECT max(d1)
FROM merge('_local', 't_202209*')
```

Additionally, we can use a REGEX pattern to match table names, meaning we can create new tables that follow a pattern, and they are automatically included in this query. 