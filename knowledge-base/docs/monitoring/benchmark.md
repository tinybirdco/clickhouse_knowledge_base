---
id: benchmarking_tips
slug: /benchmarking-tips
title: How to benchmark functions in ClickHouse
description: Wondering how to benchmark functions in ClickHouse? Here are a bunch of tips to help you better benchmark your functions in ClickHouse.
tags: 
 - monitoring
 - beginner
---

# How to benchmark functions in ClickHouse
Below are some tips for how to successfully benchmark functions in ClickHouse

## Use clickhouse benchmark

```bash
clickhouse benchmark --query "select uniqMerge(b_count) as b_count from matview"
```

It will keep running the query over an over again and give you the measurements live. You can use perf or other profiling tools in the meantime, no matter how fast the query is.

## Use FORMAT Null

```bash
clickhouse benchmark --query "select uniqMerge(b_count) as b_count from matview FORMAT Null"
```

If you are measuring the performance of a specific function, you don't really care about the time it takes for ClickHouse to transform the output into whatever format was chosen, so it's better to ignore it.

## Use a single thread

```bash
clickhouse benchmark --query "select uniqMerge(b_count) as b_count from matview FORMAT Null SETTINGS max_threads=1"
```

This is only useful when evaluating a function, not a whole query. It's better to not have to think about how many threads are available to ClickHouse at a certain point in time, so having only one makes it simpler to benchmark and profile.


## Use numbers() or zeros() to generate many rows

```sql
SELECT sum(number) FROM numbers(1000000000);

SELECT sum(zero) FROM zeros(1000000000);
```

## Use ignore() to move conditions to the where clause

```sql
SELECT *
FROM zeros(1000000)
WHERE NOT ignore(JSONExtract('{"a": "hi", "b": "hello", "c": "hola", "d": "see you, bye, bye"}', 'Tuple(a LowCardinality(String), b LowCardinality(String), c LowCardinality(String), d LowCardinality(String) )'))
FORMAT `Null` SETTINGS max_threads=1

0 rows in set. Elapsed: 0.001 sec. Processed 1.05 million rows, 1.05 MB (1.18 billion rows/s., 1.18 GB/s.)
```

## Use materialize() to force the evaluation of const values for all rows

```sql
SELECT *
FROM zeros(1000000)
WHERE NOT ignore(JSONExtract(materialize('{"a": "hi", "b": "hello", "c": "hola", "d": "see you, bye, bye"}'), 'Tuple(a String, b String, c String, d String )'))
FORMAT `Null` SETTINGS max_threads=1

0 rows in set. Elapsed: 0.185 sec. Processed 1.05 million rows, 1.05 MB (5.68 million rows/s., 5.68 MB/s.)
```

If you don't do this, ClickHouse will evaluate it once for the whole query so you won't do much benchmarking. :D

