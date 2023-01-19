---
id: choose_the_right_data_types
slug: /choose-the-right-data-types
title: How to choose the right data types in ClickHouse
description: ClickHouse has many unique data types. Here's how to choose the right ones for your tables.
tags: 
 - getting-started
 - beginner
---

# How to choose the right data types in ClickHouse

When dealing with large tables and looking for the most efficient and performant queries, data types need to be chosen carefully.

Three basic rules:

- Don't use floats for integers
- Choose the right precision for numbers, and favor the lower precision
- Use ``LowCardinality(String)`` or ``FixedString`` for text when possible

Let's see a basic example looking at storage and processed bytes for a simple query.

```SQL
    CREATE TABLE deleteme_wrong_type
    (
        `number` UInt64
    )
    ENGINE = MergeTree
    PARTITION BY number % 10
    ORDER BY number AS
    SELECT number % 100
    FROM numbers(10000000)
```

While ClickHouse does a great job compressing...

``` SQL
    SELECT
        total_rows,
        formatReadableSize(total_bytes) AS bytes
    FROM system.tables
    WHERE name = 'deleteme_wrong_type'
    FORMAT Vertical

    Row 1:
    ──────
    total_rows: 10000000
    bytes:      397.03 KiB
```

...when it's time to process bytes you end up processing 8GB of data:

```SQL
    SELECT sum(number)
    FROM deleteme_wrong_type

    ┌─sum(number)─┐
    │ 49500000000 │
    └─────────────┘

    1 rows in set. Elapsed: 0.013 sec. Processed 10.00 million rows, 80.00 MB (767.57 million rows/s., 6.14 GB/s.)
```

In this case you don't need more than a ``UInt8``, so let's compare the difference using the right type for the job:

```SQL
    CREATE TABLE deleteme_right_type
    (
        `number` UInt8
    )
    ENGINE = MergeTree
    PARTITION BY number % 10
    ORDER BY number AS
    SELECT number % 100
    FROM numbers(10000000)
```

Storage is more or less the same...

```SQL
    SELECT
        total_rows,
        formatReadableSize(total_bytes) AS bytes
    FROM system.tables
    WHERE name = 'deleteme_right_type'
    FORMAT Vertical

    Row 1:
    ──────
    total_rows: 1000000000
    bytes:      110.89 KiB
```

...but there's a huge difference in bytes processed:

```SQL
    SELECT sum(number)
    FROM deleteme_right_type

    Query id: 8df38fab-2251-4814-aa1f-9434ca942525

    ┌─sum(number)─┐
    │   495000000 │
    └─────────────┘

    1 rows in set. Elapsed: 0.005 sec. Processed 10.00 million rows, 10.00 MB (1.98 billion rows/s., 1.98 GB/s.)
```

As expected, data processed is 8 times lower. Now imagine you run that query over and over and over... 💸 chose your data types carefully.
