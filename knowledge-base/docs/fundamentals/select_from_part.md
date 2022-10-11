---
id: select_from_part
title: Query a specific part or partition
description: Want to query from a specific part or partition of a ClickHouse table? Here's how to use ClickHouse virtual columns to do so.
tags:
  - intermediate
  - getting-started
---

# Query a specific part or partition

If you want to run a query over data from a specific part or partition, ClickHouse has virtual columns `_part` and `_partition_id` that you can use.

## Query from a specific part

You can use the virtual column `_part` to filter by a specific part, for example:

```sql
SELECT
    count(),
    _part
FROM products
GROUP BY _part

Query id: e3cb8687-82ef-4d5c-9109-01d327d1a1ab

┌─count()─┬─_part─────┐
│     100 │ all_2_2_0 │
│   10000 │ all_3_3_0 │
└─────────┴───────────┘

SELECT avg(cost)
FROM products
WHERE _part = 'all_2_2_0'

Query id: 31a9632d-b902-4abe-bcc9-2d1b37b599cf

┌─────────avg(cost)─┐
│ 2114.058412771225 │
└───────────────────┘

1 row in set. Elapsed: 0.010 sec. 
```

## Query from a specific partition

You can use the virtual column `_partition_id` to filter by a specific partition, for example:

```sql
SELECT
    count(),
    _partition_id
FROM products
GROUP BY _partition_id

Query id: 50148c02-84a6-4be9-a21a-3f8b4cbc7bbe

┌─count()─┬─_partition_id─┐
│   10100 │ all           │
└─────────┴───────────────┘

1 row in set. Elapsed: 0.001 sec. 
```