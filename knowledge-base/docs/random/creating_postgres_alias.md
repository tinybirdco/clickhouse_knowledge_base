---
id: creating_postgres_alias
title: Creating an alias for Postgres functions
description:
tags:
  - intermediate
  - random
---


# Creating an alias for Postgres functions

ClickHouse allows you to create custom functions out of SQL statements. You can use this feature to re-create well-known functions from other RDBMS systems, such as Postgres.

For example, here is a basic implementation of the `to_char` Postgres function, in this case, partially supporting DateTime formatting.

```sql
CREATE FUNCTION to_char AS (date_expression, format) -> formatDateTime(date_expression, multiIf(format = 'YYYYMM', '%Y%m', 'Error: non supported format'))

Ok.

0 rows in set. Elapsed: 0.001 sec.
```

You can now use the `to_char` function in your SQL, just like you would in Postgres.

```sql
SELECT to_char(now(), 'YYYYMM') AS formatted_date

┌─formatted_date─┐
│ 202209         │
└────────────────┘

1 row in set. Elapsed: 0.001 sec.
```