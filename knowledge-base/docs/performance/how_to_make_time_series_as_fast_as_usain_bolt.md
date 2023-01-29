---
id: how-to-make-time-series-as-fast-as-usain-bolt
slug: /how-to-make-time-series-as-fast-as-usain-bolt
title: Improve performance with time series data
description: ClickHouse is a perfect database for time series data. Here's how to improve time series performance in ClickHouse by choosing the right table engine.
tags: 
 - performance
 - intermediate
---

# Improve performance with time series data
ClickHouse is a perfect database for time series data. But which table engine should you use to optimize queries over time series data? 

Let's compare 3 table engines to find out.

Start by creating a MergeTree table with 1B rows:

```sql
CREATE TABLE deleteme
(
    `number` UInt64,
    `key` LowCardinality(String),
    `timestamp` DateTime
)
ENGINE = MergeTree
ORDER BY timestamp AS
SELECT
    number,
    toString(number % 10000) as key,
    toDateTime64(now(), 3) - (number /10)
FROM numbers(1000000000)
```

Then, run [this script](https://gist.githubusercontent.com/alrocar/f223cbab9b2cfd4ccf9ba75f1b6496e5/raw/af2f0bbe409680f6e2c61172d52df5614ce618fb/usain_bolt.sql) in ClickHouse like this:

```bash
cat usain_bolt.sql | clickhouse-client -mn
```

This will create three different tables with different engines. It'll take a while, but you can use these different tables to compare performance with time series data.

## Comparing performance between engines
These are the results for the queries with the source `MergeTree` table:

### MergeTree
#### Group by day and use a `MergeTree`

```sql
SELECT
    toDate(timestamp) AS date,
    avg(number) AS avg_number,
    count() AS c,
    sum(number) AS sum_number
FROM deleteme_alrocar.deleteme
WHERE timestamp >= (now() - toIntervalMonth(6))
GROUP BY date
FORMAT `Null`

Elapsed: 1.055 sec. Processed 158.96 million rows, 1.91 GB (150.72 million rows/s., 1.81 GB/s.)
```

#### Group by month and use a `MergeTree`

```sql
SELECT
    toStartOfMonth(timestamp) AS date,
    avg(number) AS avg_number,
    count() AS c,
    sum(number) AS sum_number
FROM deleteme_alrocar.deleteme
WHERE timestamp >= (now() - toIntervalMonth(6))
GROUP BY date
FORMAT `Null`

Elapsed: 1.060 sec. Processed 158.96 million rows, 1.91 GB (149.98 million rows/s., 1.80 GB/s.)
```
### AggregatingMergeTree
#### Group by day and use an `AggregatingMergeTree`

```sql
SELECT
    date,
    avgMerge(avg_number) AS aa,
    countMerge(c) AS cc,
    sumMerge(sum_number) AS ss
FROM deleteme_alrocar.deleteme_agg_day
WHERE date >= (now() - toIntervalMonth(6))
GROUP BY date
FORMAT `Null`

Elapsed: 0.064 sec. Processed 2.09 million rows, 172.94 MB (32.56 million rows/s., 2.69 GB/s.)    
```

#### Group by month and use an `AggregatingMergeTree`

```sql
SELECT
    date,
    avgMerge(avg_number) AS aa,
    countMerge(c) AS cc,
    sumMerge(sum_number) AS ss
FROM deleteme_alrocar.deleteme_agg_month
WHERE date >= (now() - toIntervalMonth(6))
GROUP BY date
FORMAT `Null`

Elapsed: 0.008 sec. Processed 80.00 thousand rows, 6.18 MB (10.10 million rows/s., 779.92 MB/s.)
```

Note that you must use the `-Merge` combinator to get the final aggregated results.

### SummingMergeTree
#### Group by day and use an `SummingMergeTree`

```sql
SELECT
    date,
    avg(avg_number) AS aa,
    count(c) AS cc,
    sum(sum_number) AS ss
FROM deleteme_alrocar.deleteme_sum_day
WHERE date >= (now() - toIntervalMonth(6))
GROUP BY date
FORMAT `Null`

Elapsed: 0.039 sec. Processed 2.09 million rows, 54.34 MB (53.52 million rows/s., 1.39 GB/s.)
```

#### Group by month and use an `SummingMergeTree`

```sql
SELECT
    date,
    avg(avg_number) AS aa,
    count(c) AS cc,
    sum(sum_number) AS ss
FROM deleteme_alrocar.deleteme_sum_month
WHERE date >= (now() - toIntervalMonth(6))
GROUP BY date
FORMAT `Null`

Elapsed: 0.006 sec. Processed 80.00 thousand rows, 2.08 MB (12.50 million rows/s., 325.02 MB/s.)
```
Now let's compare the performance:

| Group By | MergeTree | AggregatingMergeTree | SummingMergeTree |
| :--- | :---: | :---: | :---: |
| Day | Elapsed: 1.055 s<br/>Processed: 1.91 GB | Elapsed: 0.064 s<br/>Processed: 172.94 MB | Elapsed: 0.039 s<br/>Processed: 54.34 MB |
| Month | Elapsed: 1.060 s<br/>Processed: 1.91 GB | Elapsed: 0.008 s<br/>Processed: 6.18 MB | Elapsed: 0.006 s<br/>Processed: 2.08 MB |

As you can see the most performant queries in terms of time and processed bytes (the ones that process the less bytes) use the `SummingMergeTree` engine.

So, when running time series aggregates in ClickHouse, use `SummingMergeTree` if possible to speed up your queries!