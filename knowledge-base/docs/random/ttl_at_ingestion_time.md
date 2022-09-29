---
id: ttl_at_ingestion_time
title: Controlling TTL at ingestion time
Description: 
tags:
  - beginner
  - random
---

# Controlling TTL at ingestion time

The TTL of a table can be an expression that references one or more columns; this means that the TTL for a given row will be calculated at the point of ingestion.

```sql
CREATE TABLE deleteme
(
    `number` UInt64,
    `date` DateTime,
    `days` UInt16
)
ENGINE = MergeTree
PARTITION BY number % 10
ORDER BY number
TTL date + INTERVAL days DAY
```