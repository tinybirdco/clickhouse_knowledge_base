---
id: join_algorithm
title: Optimize memory usage for joins
description: ClickHouse has different algorithms for join operations. Here's how to choose which join algorithm to use to reduce memory usage.
tags:
  - advanced
  - performance
---

# Optimize memory usage for joins

ClickHouse provides different algorithms for joins operations. By default, the `hash` algorithm is used, which loads the right hand side of the join into memory, which can result in very high memory usage.

It is possible to choose which join algorithm to use, so you can pick the best algorithm for your use case.

This is done using the `join_algorithm` setting; you can find the possible algorithms [here](https://clickhouse.com/docs/en/operations/settings/settings#settings-join_algorithm).

For example:

```sql
SELECT number
FROM numbers(2000)
LEFT JOIN
(
    SELECT number
    FROM numbers(2000000)
) USING (number)
SETTINGS join_algorithm = 'partial_merge'
```

You can also use `join_algorithm='auto'` and let ClickHouse automatically decide which algorithm to use.