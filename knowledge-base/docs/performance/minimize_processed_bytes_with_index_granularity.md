---
slug: /minimize-processed-bytes-index-granularity
id: minimize_processed_bytes_index_granularity
title: Minimize processed bytes with index granularity
description: Adjusting the ClickHouse index granularity has tradeoffs, but can help with some use cases. Here's how adjusting the granularity can help with filters on high cardinality columns.
tags:
  - intermediate
  - performance
---

# Minimize processed bytes when filtering by high cardinality columns

By default, ClickHouse reads blocks of 8192 rows in a `MergeTree` table but this setting can be tweaked with the `index_granularity` setting.

As with any database, generally, the less data you read, the better your query performance. To do this, we want to filter & discard as many rows as possible. However, this can be tricky if you need to filter on a column with very high cardinality.

Changing the `index_granularity` can help in this situation, but remember, this is not a silver bullet, so take care to understand the impact it has for your use case.

Let's see an example. First create a table of 100M rows with unique values (this simulates a very high cardinality data set).

```sql
CREATE TABLE default_index_granularity
(
    `number` UInt64
)
ENGINE = MergeTree
PARTITION BY number % 10
ORDER BY number AS
SELECT number
FROM numbers(100000000)
```

In our query we want to apply a filter that selects only 100K rows, but we're filtering on a column that has 100M unique values.

```sql
SELECT *
FROM default_index_granularity
WHERE number IN (
    SELECT number * 10000
    FROM numbers(100000)
)
FORMAT `Null`

Query id: 11412bc3-05de-4790-9b65-06b139761e0c

Ok.

0 rows in set. Elapsed: 1.211 sec. Processed 100.00 million rows, 800.00 MB (82.56 million rows/s., 660.45 MB/s.)
```

We can see in the output that to fulfill this query we had to read all 100M rows of data.

Let's do that again, but with an `index_granularity` of `128`:

```sql
CREATE TABLE reduced_index_granularity
(
    `number` UInt64
)
ENGINE = MergeTree
PARTITION BY number % 10
ORDER BY number
SETTINGS index_granularity=128 AS
SELECT number
FROM numbers(100000000)
```

We'll run the exact same query to read data as we did before:

```sql
SELECT *
FROM reduced_index_granularity
WHERE number IN (
    SELECT number * 10000
    FROM numbers(100000)
)
FORMAT `Null`

0 rows in set. Elapsed: 0.785 sec. Processed 12.84 million rows, 102.73 MB (16.35 million rows/s., 130.81 MB/s.)
```

Now we can see that to fulfill this query, we only had to read 12.84M rows - a very significant reduction of processed data.

Remember, adjusting the `index_granularity` comes with some tradeoffs, such as heavier indexing and slower insertions, but it's a good trick to keep in your back pocket.
