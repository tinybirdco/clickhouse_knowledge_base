---
slug: /read-multiple-tables
id: read_multiple_tables
title: Select data from multiple tables
description: Want to get data from multiple tables in ClickHouse with a single query? Use the merge() ClickHouse function instead of UNION ALL for cleaner queries.
tags:
  - beginner
  - getting-started
---

# Select data from multiple tables

Let's say that you have several tables with the same structure, or a common subset, and you want to read from all of them in a single query. Coming from other RDBMS you might be tempted to do something along the lines of:

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

In ClickHouse, you can use the `merge` function to make this easier.

`merge` lets you query multiple tables as if they were a single table, with much cleaner syntax, making it easier to read & maintain.

```sql
SELECT max(d1)
FROM merge('_local', 't_202209*')
```

Additionally, you can use a REGEX pattern to match table names, meaning you can create new tables that follow a pattern, and they will be automatically included in this query. 