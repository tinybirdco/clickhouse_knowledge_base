---
slug: /compression-scan-size
id: compression_scan_size
title: Optimize scans with column compression
description: Want to optimize your queries in ClickHouse? Here's how to use column compression to speed up ClickHouse queries.
tags:
  - beginner
  - performance
---

# Optimize scans with column compression

When running a query, you need to read data from disk. Generally, the more data you read, the slower your query. You can reduce the amount of data read by using compression. Compression can be applied to individual columns when it makes sense to do so.

For example, create a table with 2 columns. Just store some zeros in the columns. One column will be compressed with LZ4, the other column will be stored raw.

```sql
CREATE TABLE sizes
(
    `a` Int32 CODEC(LZ4),
    `b` Int32 CODEC(NONE)
)
ENGINE = MergeTree
ORDER BY a;
```

Next, insert 111M zeros:

```sql
INSERT INTO sizes SELECT 0, 0 FROM numbers(111000000);
```

If you look at the size of the stored data, you can see the difference between these two columns.

The compressed column is about 111kb, while the uncompressed column is about 24Mb.

```sql
SELECT
    name,
    data_uncompressed_bytes,
    data_compressed_bytes
FROM system.columns
WHERE table = 'sizes'

Query id: 25eb5a84-c8e0-4fd3-acee-22a66f5d415e

┌─name─┬─data_uncompressed_bytes─┬─data_compressed_bytes─┐
│ a    │                24970900 │                111294 │
│ b    │                24970900 │              24980450 │
└──────┴─────────────────────────┴───────────────────────┘
```

Now, run a query that scans every row, so you can see the difference working with the compressed vs uncompressed columns. 

```sql
SELECT sum(a)
FROM sizes

┌─sum(a)─┐
│      0 │
└────────┘

1 row in set. Elapsed: 0.071 sec. Processed 111.00 million rows, 444.00 MB (1.55 billion rows/s., 6.22 GB/s.)

SELECT sum(b)
FROM sizes

Query id: dcf12e84-f1cb-475e-b26e-389d072c89d4

┌─sum(b)─┐
│      0 │
└────────┘

1 row in set. Elapsed: 0.248 sec. Processed 111.00 million rows, 444.00 MB (446.87 million rows/s., 1.79 GB/s.)
```

You can see that you are scanning 111M rows in both queries, but scanning the compressed data was 3.5x faster: 0.071 seconds vs. 0.248 seconds for the uncompressed data.