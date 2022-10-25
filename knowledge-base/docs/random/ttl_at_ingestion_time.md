---
slug: /ttl-at-ingestion-time
id: ttl_at_ingestion_time
title: Control TTL at ingestion time
Description: Want to set a TTL on a table in ClickHouse? Here's how to control the TTL at ingestion time based on a date column.
tags:
  - beginner
  - random
---

# Control TTL at ingestion time

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