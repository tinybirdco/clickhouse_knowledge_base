---
id: compact-parts
slug: /compact-parts
title: Use compact parts to store columns together on disk
description: Ever wondered how to improve performance when querying many columns in ClickHouse? Here's how to use compact parts to do so.
tags: 
 - advanced
 - performance
---

# Use compact parts to store columns together on disk

ClickHouse is a columnar database, this means that every column gets indepently stored in disk. This makes reading data from disk only for the column that are used in a query.

This comes at a cost, operations affecting multiple columns become more expensive. But there is a way to force columns to get stored together in disk, this makes reading columns sequentially, improving performance.

We can take advantage of [compact parts](https://clickhouse.com/docs/en/engines/table-engines/mergetree-family/mergetree#mergetree-data-storage), to validate the idea we'll create two tables with 90 columns each, forcing one of them to use compact parts:

``` SQL

    DROP DATABASE IF EXISTS wide_compact;
    CREATE DATABASE wide_compact;

    CREATE TABLE wide_compact.compact_parts
    ENGINE = MergeTree
    ORDER BY (c1, c2)
    SETTINGS min_rows_for_wide_part = 1000000000 AS
    SELECT *
    FROM generateRandom('c1 UInt32, c2 UInt64, s1 String, c3 UInt32, c4 UInt64, s2 String, c5 UInt32, c6 UInt64, s3 String, c7 UInt32, c8 UInt64, s4 String, c9 UInt64 , c10 UInt64 , c11 UInt64 , c12 UInt64 , c13 UInt64 , c14 UInt64 , c15 UInt64 , c16 UInt64 , c17 UInt64 , c18 UInt64 , c19 UInt64 , c20 UInt64 , c21 UInt64 , c22 UInt64 , c23 UInt64 , c24 UInt64 , c25 UInt64 , c26 UInt64 , c27 UInt64 , c28 UInt64 , c29 UInt64 , c30 UInt64 , c31 UInt64 , c32 UInt64 , c33 UInt64 , c34 UInt64 , c35 UInt64 , c36 UInt64 , c37 UInt64 , c38 UInt64 , c39 UInt64 , c40 UInt64 , c41 UInt64 , c42 UInt64 , c43 UInt64 , c44 UInt64 , c45 UInt64 , c46 UInt64 , c47 UInt64 , c48 UInt64 , c49 UInt64 , c50 UInt64 , c51 UInt64 , c52 UInt64 , c53 UInt64 , c54 UInt64 , c55 UInt64 , c56 UInt64 , c57 UInt64 , c58 UInt64 , c59 UInt64 , c60 UInt64 , c61 UInt64 , c62 UInt64 , c63 UInt64 , c64 UInt64 , c65 UInt64 , c66 UInt64 , c67 UInt64 , c68 UInt64 , c69 UInt64 , c70 UInt64 , c71 UInt64 , c72 UInt64 , c73 UInt64 , c74 UInt64 , c75 UInt64 , c76 UInt64 , c77 UInt64 , c78 UInt64 , c79 UInt64 , c80 UInt64 , c81 UInt64 , c82 UInt64 , c83 UInt64', 0, 30, 30)
    LIMIT 2000000;

    CREATE TABLE wide_compact.wide_parts
    ENGINE = MergeTree
    ORDER BY (c1, c2) AS
    SELECT *
    FROM generateRandom('c1 UInt32, c2 UInt64, s1 String, c3 UInt32, c4 UInt64, s2 String, c5 UInt32, c6 UInt64, s3 String, c7 UInt32, c8 UInt64, s4 String, c9 UInt64 , c10 UInt64 , c11 UInt64 , c12 UInt64 , c13 UInt64 , c14 UInt64 , c15 UInt64 , c16 UInt64 , c17 UInt64 , c18 UInt64 , c19 UInt64 , c20 UInt64 , c21 UInt64 , c22 UInt64 , c23 UInt64 , c24 UInt64 , c25 UInt64 , c26 UInt64 , c27 UInt64 , c28 UInt64 , c29 UInt64 , c30 UInt64 , c31 UInt64 , c32 UInt64 , c33 UInt64 , c34 UInt64 , c35 UInt64 , c36 UInt64 , c37 UInt64 , c38 UInt64 , c39 UInt64 , c40 UInt64 , c41 UInt64 , c42 UInt64 , c43 UInt64 , c44 UInt64 , c45 UInt64 , c46 UInt64 , c47 UInt64 , c48 UInt64 , c49 UInt64 , c50 UInt64 , c51 UInt64 , c52 UInt64 , c53 UInt64 , c54 UInt64 , c55 UInt64 , c56 UInt64 , c57 UInt64 , c58 UInt64 , c59 UInt64 , c60 UInt64 , c61 UInt64 , c62 UInt64 , c63 UInt64 , c64 UInt64 , c65 UInt64 , c66 UInt64 , c67 UInt64 , c68 UInt64 , c69 UInt64 , c70 UInt64 , c71 UInt64 , c72 UInt64 , c73 UInt64 , c74 UInt64 , c75 UInt64 , c76 UInt64 , c77 UInt64 , c78 UInt64 , c79 UInt64 , c80 UInt64 , c81 UInt64 , c82 UInt64 , c83 UInt64', 0, 30, 30)
    LIMIT 2000000;

    SELECT '---- Compact';
    SELECT
        partition,
        name,
        part_type,
        level,
        rows,
        formatReadableSize(bytes_on_disk) AS size,
        modification_time
    FROM system.parts
    WHERE (table = 'compact_parts') AND active
    ORDER BY
        partition ASC,
        modification_time ASC
    FORMAT PrettyCompact;

    SELECT '---- Wide';
    SELECT
        partition,
        name,
        part_type,
        level,
        rows,
        formatReadableSize(bytes_on_disk) AS size,
        modification_time
    FROM system.parts
    WHERE (table = 'wide_parts') AND active
    ORDER BY
        partition ASC,
        modification_time ASC
    FORMAT PrettyCompact;
```

```bash

    ❯ cat wide_compact.sql | ./clickhouse client -h clickhouse-01 -mn
    ---- Compact
    ┌─partition─┬─name──────┬─part_type─┬─level─┬────rows─┬─size───────┬───modification_time─┐
    │ tuple()   │ all_1_1_0 │ Compact   │     0 │ 1048545 │ 715.23 MiB │ 2022-02-25 16:06:48 │
    │ tuple()   │ all_2_2_0 │ Compact   │     0 │  951455 │ 649.00 MiB │ 2022-02-25 16:06:50 │
    └───────────┴───────────┴───────────┴───────┴─────────┴────────────┴─────────────────────┘
    ---- Wide
    ┌─partition─┬─name──────┬─part_type─┬─level─┬────rows─┬─size───────┬───modification_time─┐
    │ tuple()   │ all_1_1_0 │ Wide      │     0 │ 1048545 │ 715.31 MiB │ 2022-02-25 16:06:51 │
    │ tuple()   │ all_2_2_0 │ Wide      │     0 │  951455 │ 649.07 MiB │ 2022-02-25 16:06:53 │
    └───────────┴───────────┴───────────┴───────┴─────────┴────────────┴─────────────────────┘
```

When you read a single column, the wide parts table is faster as expected when dealing with a columnar database...

```bash

    ❯ ./clickhouse benchmark <<< "SELECT c1 FROM wide_compact.wide_parts LIMIT 1000" --cumulative --max_threads 1 -i 500
    Loaded 1 queries.

    Queries executed: 500.

    localhost:9000, queries 500, QPS: 1519.752, RPS: 1519752.220, MiB/s: 5.797, result RPS: 1519752.220, result MiB/s: 5.797.


    ❯ ./clickhouse benchmark <<< "SELECT c1 FROM wide_compact.compact_parts LIMIT 1000" --cumulative --max_threads 1 -i 500
    Loaded 1 queries.

    Queries executed: 500.

    localhost:9000, queries 500, QPS: 1718.089, RPS: 14074585.683, MiB/s: 53.690, result RPS: 1718089.073, result MiB/s: 6.554.
```

...but when you read all of them, the compact parts table is way faster!

```bash

    ❯ ./clickhouse benchmark <<< "SELECT * FROM wide_compact.wide_parts LIMIT 1000" --cumulative --max_threads 1 -i 500
    Loaded 1 queries.

    Queries executed: 500.

    localhost:9000, queries 500, QPS: 62.517, RPS: 62516.895, MiB/s: 44.351, result RPS: 62516.895, result MiB/s: 44.351.

    ❯ ./clickhouse benchmark <<< "SELECT * FROM wide_compact.compact_parts LIMIT 1000" --cumulative --max_threads 1 -i 500
    Loaded 1 queries.

    Queries executed: 500.

    localhost:9000, queries 500, QPS: 223.399, RPS: 1830084.516, MiB/s: 1298.450, result RPS: 223398.989, result MiB/s: 158.483.
```

That's 223 QPS with compact parts versus 62 without, a 270% improvement!
