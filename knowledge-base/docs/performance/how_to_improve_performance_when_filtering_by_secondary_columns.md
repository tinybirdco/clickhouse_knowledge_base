---
id: how_to_improve_performance_inverted_index
slug: /improve-performance-inverted-index
title: Improve filter performance with an inverted index
description: Sorting keys are critical to query performance in ClickHouse. Read this to learn when and how to optimize query performance using an inverted index.
tags: 
 - performance
 - intermediate
---

# Improve performance when filtering by secondary columns
Sorting keys are critical to query performance in ClickHouse. Read more to learn how to optimize performance when filtering by secondary or tertiary sorting keys by using an inverted index.

## Rules of thumb for ClickHouse sorting keys
When you create ``MergeTree`` tables in ClickHouse, you need to specify the order of the columns in the sorting key. The order of the sorting keys is very important when building your queries, since the sorting keys determine how closely together the data needed to compute the query is stored in disk.

When you define your sorting keys, you should follow these rules of thumb.

- Prioritize columns you use most often when filtering
- The first column in the key should be the most-used column with the lowest cardinality.
- Don't add more than 3 or 4 columns, since this will make insertions slower, among other things.

## When you have more than one column
Do you have more than one column that you often use to filter data? If so, you can improve performance of those queries using an inverted index. 

Here's see an example:

```SQL
    CREATE TABLE deleteme
    (
        `product_id` UInt64,
        `client_id` UInt64
    )
    ENGINE = MergeTree
    PARTITION BY product_id % 10
    ORDER BY (product_id, client_id) AS
    SELECT number % 100 product_id, number % 100 client_id
    FROM numbers(100000000)
```

The total size of this table is ~7MiB:

```SQL
    SELECT formatReadableSize(total_bytes)
    FROM system.tables
    WHERE name = 'deleteme'
    FORMAT Vertical

    Row 1:
    ──────
    formatReadableSize(total_bytes): 7.64 MiB
```

Running a query filtered by ``product_id`` processes only ~1M rows, since the table is first sorted by that column.

```SQL
    SELECT *
    FROM deleteme
    WHERE product_id = 10
    FORMAT `Null`

    0 rows in set. Elapsed: 0.014 sec. Processed 1.03 million rows, 16.52 MB (72.40 million rows/s., 1.16 GB/s.)
```

But if you filter by ``client_id`` (the secondary sorting key) ClickHouse reads ~3x the data, since the same ``client_id`` is repeated in different blocks in disk ordered by ``product_id`` and ClickHouse needs to read and process more data to run the query:

```SQL
    SELECT *
    FROM deleteme
    WHERE client_id = 10
    FORMAT `Null`

    0 rows in set. Elapsed: 0.048 sec. Processed 2.97 million rows, 31.98 MB (61.42 million rows/s., 661.52 MB/s.)
```

Here's where an inverted index comes in handy. The concept is really simple, in this case, just reorder the table by ``client_id``. You can achieve that with a ``PROJECTION``.

Heres's see an example:

```SQL
    ALTER TABLE deleteme
        ADD PROJECTION deleteme_by_client_id
        (
            SELECT *
            ORDER BY client_id
        )
    ALTER TABLE deleteme
        MATERIALIZE PROJECTION deleteme_by_client_id
```

The ``PROJECTION`` sorts the current data by ``client_id``, takes care of sorting when new parts are merged, and finally transparently runs the query over the parts sorted by ``client_id`` on query time.

Now if you run the same query as above filtering by ``client_id``, you see that ClickHouse read ~1M rows:

```SQL
    SELECT *
    FROM deleteme
    WHERE client_id = 10
    FORMAT `Null`

    Query id: 51a55fec-d526-480b-870b-424a0c6471d3

    0 rows in set. Elapsed: 0.052 sec. Processed 1.25 million rows, 18.28 MB (24.17 million rows/s., 352.53 MB/s.)
```

To make sure that ``PROJECTION`` was used effectively, you can check the ``query_log``:

```SQL
    SELECT projections
    FROM system.query_log
    WHERE (event_time > (now() - toIntervalMinute(5))) AND (query_id = '51a55fec-d526-480b-870b-424a0c6471d3')
    LIMIT 1
    FORMAT Vertical

    Row 1:
    ──────
    projections: ['default.deleteme.deleteme_by_client_id']
```

Of course this comes at the cost of duplicating data, but in certain cases this is an acceptable tradeoff, especially for smaller tables.

```SQL
    SELECT formatReadableSize(total_bytes)
    FROM system.tables
    WHERE name = 'deleteme'
    FORMAT Vertical

    Row 1:
    ──────
    formatReadableSize(total_bytes): 15.19 MiB
```