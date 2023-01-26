---
id: optimize_queries_explain
slug: /optimize-queries-explain
title: Use EXPLAIN SYNTAX to optimize queries
description: The EXPLAIN SYNTAX statement in ClickHouse often provides clues on how to optimize your ClickHouse queries. Here's how to use it.
tags: 
 - performance
 - advanced
---

# Use ``EXPLAIN SYNTAX`` to optimize queries

ClickHouse is able to automatically optimize certain simple queries, but if you want to optimize more complex queries you'll need to turn elsewhere.

Fortunately you can use ``EXPLAIN SYNTAX`` to manually optimize your queries for better performance.

## An example
First, create a simple table with 100M rows each containing a unique value from 0 to 100M-1:

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

This query sets up 10 partitions on purpose to showcase the example below.

Now sum the numbers in the first partition:

```SQL
    SELECT sum(number)
    FROM
    (
        SELECT number
        FROM deleteme
    )
    WHERE (number % 10) = 1

    Query id: 5a187605-22e9-4303-b2d7-b429d38832f3

    ┌─────sum(number)─┐
    │ 499999960000000 │
    └─────────────────┘

    1 rows in set. Elapsed: 0.065 sec. Processed 10.00 million rows, 80.00 MB (154.64 million rows/s., 1.24 GB/s.)
```

You can see ClickHouse only needed to process 10M rows.

If you use ``EXPLAIN SYNTAX``, you'll see that ClickHouse has automatically optimized the query, pushing down the ``WHERE`` filter to inside the subquery. That's why it only needed to process 1/10th of the table.

```SQL
    EXPLAIN SYNTAX
    SELECT sum(number)
    FROM
    (
        SELECT number
        FROM deleteme
    )
    WHERE (number % 10) = 1

    Query id: babfaeff-5904-486f-9c6a-caad90392e0f

    ┌─explain─────────────────────┐
    │ SELECT sum(number)          │
    │ FROM                        │
    │ (                           │
    │     SELECT number           │
    │     FROM deleteme           │
    │     WHERE (number % 10) = 1 │
    │ )                           │
    │ WHERE (number % 10) = 1     │
    └─────────────────────────────┘
```

Now try a more complex query that involves a self ``JOIN``.

```SQL
    SELECT sum(number) AS n
    FROM deleteme AS a
    INNER JOIN
    (
        SELECT number
        FROM deleteme
    ) AS b ON a.number = b.number
    WHERE (a.number % 10) = 1

Query id: c7ca27eb-783b-4296-aed5-6da585f0da51

┌───────────────n─┐
│ 499999960000000 │
└─────────────────┘

1 rows in set. Elapsed: 10.693 sec. Processed 110.00 million rows, 880.00 MB (10.29 million rows/s., 82.30 MB/s.)
```

You can see ClickHouse had to process 110M rows to return a result. You can again use ``EXPLAIN SYNTAX`` to see what happened:

```SQL
    EXPLAIN SYNTAX
    SELECT sum(number) AS n
    FROM deleteme AS a
    INNER JOIN
    (
        SELECT number
        FROM deleteme
    ) AS b ON a.number = b.number
    WHERE (a.number % 10) = 1

    Query id: edd566cb-f7f2-4e5b-b5b1-c7aa1812feec

    ┌─explain─────────────────────┐
    │ SELECT sum(number) AS n     │
    │ FROM deleteme AS a          │
    │ ALL INNER JOIN              │
    │ (                           │
    │     SELECT number           │
    │     FROM deleteme           │
    │ ) AS b ON number = b.number │
    │ WHERE (number % 10) = 1     │
    └─────────────────────────────┘
```

In this case, ClickHouse wasn't able to push down the ``WHERE`` predicate to the subquery, so it had to readh 100M rows to compute the ``JOIN`` subquery.

With the information provided by ``EXPLAIN SYNTAX``, you could optimize this query manually by moving the ``WHERE`` predicate to the subquery:

```SQL
    SELECT sum(number) AS n
    FROM deleteme AS a
    INNER JOIN
    (
        SELECT number
        FROM deleteme
        WHERE (number % 10) = 1
    ) AS b ON a.number = b.number
    WHERE (a.number % 10) = 1

    Query id: aba46ec5-1948-4ea9-a6a4-fcca895eea08

    ┌───────────────n─┐
    │ 499999960000000 │
    └─────────────────┘

    1 rows in set. Elapsed: 1.857 sec. Processed 20.00 million rows, 160.00 MB (10.77 million rows/s., 86.17 MB/s.)
```

You get the same result, but one order of magnitude faster ✨.