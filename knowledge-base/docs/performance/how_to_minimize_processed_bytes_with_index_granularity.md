---
id: minimize_processed_bytes_with_index_granularity
slug: /minimize-processed-bytes-with-index-granularity
title: Minimize processed bytes with index granularity
description: Slow queries in ClickHouse? Here's a trick that could significantly reduce the amount of data your ClickHouse queries process.
tags: 
 - performance
 - intermediate
---

# Minimize processed bytes with index granularity

When you have a column with high cardinality and you need to apply a filter to it to get some metrics, you want to discard as many rows as possible. Otherwise, you'll end up processing more bytes and paying for more compute than you need.

By default, ClickHouse reads blocks of 8192 rows in a ``MergeTree`` table, but you can tweak this with the ``index_granularity`` setting on table creation.

## How to change ``index_granularity``
Here's an example.

First create a table of 100M rows each containing a unique integer from 0 to 100M-1:

```SQL
    CREATE TABLE deleteme
    (
        `number` UInt64
    )
    ENGINE = MergeTree
    PARTITION BY number % 10
    ORDER BY number AS
    SELECT number
    FROM numbers(100000000)
```

Now filter to get only rows with a value that is a multiple of 10,000:

```SQL
    SELECT *
    FROM deleteme
    WHERE number IN (
        SELECT number * 10000
        FROM numbers(100000)
    )
    FORMAT `Null`

    Query id: 11412bc3-05de-4790-9b65-06b139761e0c

    Ok.

    0 rows in set. Elapsed: 1.211 sec. Processed 100.00 million rows, 800.00 MB (82.56 million rows/s., 660.45 MB/s.)
```
You'll read the whole table. You can see why: Trying to get every 10,000th with an ``index_granularity`` of 8192 means you'll read every block.

You can minimize the amount of processed data by changning ``index_granularity``:

```SQL
    CREATE TABLE deleteme
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

Now run the same query: 

```SQL
    SELECT *
    FROM deleteme
    WHERE number IN (
        SELECT number * 10000
        FROM numbers(100000)
    )
    FORMAT `Null`

    0 rows in set. Elapsed: 0.785 sec. Processed 12.84 million rows, 102.73 MB (16.35 million rows/s., 130.81 MB/s.)
```
You'll read just 12M rows. This will reduce the latency of the query and your compute cost.

Of course adjusting the ``index_granularity`` comes at a cost. The index gets heavier, so insertions are slower. And sometimes reading smaller blocks doesn't improve performance for certain queries, since it depends on the query patterns. 

Still, it's a nice trick to explore to make your queries faster.
