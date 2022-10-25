---
slug: /creating-postgres-alias
id: creating_postgres_alias
title: Create aliases for Postgres functions
description: Using ClickHouse, but more comfortable with Postgres? Learn how to use custom ClickHouse functions to recreate your favorite Postgres functions in ClickHouse.
tags:
  - intermediate
  - random
---

# Create aliases for Postgres functions

ClickHouse lets you create custom functions out of SQL statements. You can use this feature to re-create well-known functions from other RDBMS systems, such as Postgres.

For example, here is a basic implementation of the `to_char` Postgres function, in this case, partially supporting DateTime formatting.

```sql
CREATE FUNCTION to_char AS (date_expression, format) -> formatDateTime(date_expression, multiIf(format = 'YYYYMM', '%Y%m', 'Error: non supported format'))

Ok.

0 rows in set. Elapsed: 0.001 sec.
```

You can now use the `to_char` function in your SQL in ClickHouse, just like you would in Postgres.

```sql
SELECT to_char(now(), 'YYYYMM') AS formatted_date

┌─formatted_date─┐
│ 202209         │
└────────────────┘

1 row in set. Elapsed: 0.001 sec.
```