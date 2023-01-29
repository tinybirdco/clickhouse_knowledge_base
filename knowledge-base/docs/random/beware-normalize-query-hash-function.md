---
id: beware_normalized_query_hash_function
slug: /beware-normalized-query-hash-function
title: When NOT to use normalizedQueryHash in ClickHouse
description: The normalizedQueryHash function in ClickHouse has some benefits, but you should avoid it certain cases.
tags:
 - advanced
 - random
---

# When NOT to use normalizedQueryHash in ClickHouse

The function `normalizedQueryHash` sometimes returns the same value for queries with the same structure but that use different resources:

```sql

    SELECT
        normalizedQueryHash('SELECT * FROM table_123') = normalizedQueryHash('SELECT * FROM table_456') AS is_equal,
        normalizedQueryHash('SELECT * FROM table_a12') = normalizedQueryHash('SELECT * FROM table_b34') AS is_not_equal
```

```bash

    Query id: 9ebbc48e-030f-48d7-824b-7cf3f254a3ad

    ┌─is_equal─┬─is_not_equal─┐
    │        1 │            0 │
    └──────────┴──────────────┘
```

Since this is what is being used to set the `normalized_query_hash` value in the `query_log` table, if you use this column to look for identical queries, beware that it could be wrong. If you run these queries and then take a look at the `system.query_log` table, you can see how, even if the table used is different, the `normalized_query_hash` value is the same:

```bash

    formatted_query:                       SELECT * FROM table_123
    normalized_query_hash:                 6380570996346862988
```

```bash

    formatted_query:                       SELECT * FROM table_456
    normalized_query_hash:                 6380570996346862988
```