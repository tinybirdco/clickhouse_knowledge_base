---
id: explore_data_from_terminal
title: Explore data from the terminal
tags:
  - beginner
  - getting-started
---

# Explore data from the terminal

ClickHouse comes with a very handy command line terminal `clickhouse-client` to explore data, debug queries and more.

Here are some examples of using the ClickHouse CLI to interact with ClickHouse.

## Explore data with readable formatting

You can run queries on the CLI, but the output formatting can be hard to read. You can use `FORMAT Vertical` to make it easier to read.

```sql
SELECT * FROM table_with_a_lot_of_columns FORMAT Vertical

Row 1:
────────
type:                                  QueryFinish
event_date:                            2022-09-22
event_time:                            2022-09-22 09:29:58
event_time_microseconds:               2022-09-22 09:29:58.298699
query_start_time:                      2022-09-22 09:29:58
query_start_time_microseconds:         2022-09-22 09:29:58.296902
query_duration_ms:                     1
read_rows:                             0
read_bytes:                            0
written_rows:                          60
written_bytes:                         8879
result_rows:                           0
result_bytes:                          0
memory_usage:                          4325156
current_database:                      public
```

## See query performance stats rather than query result

Queries you run in ClickHouse generate stats about the query performance. There are often multiple ways to write the same query, but each can have different performance characteristics. By analysing the performance stats, it's possible to find the most optimised queries.

You can `FORMAT Null` to run the query and just print the query performance stats.

```sql
SELECT *
FROM system.query_log
WHERE event_time > (now() - toIntervalMinute(10))
FORMAT `Null`

Query id: 7a125064-5422-471c-a170-e18601b2d631

Ok.

0 rows in set. Elapsed: 0.019 sec. Processed 49.86 thousand rows, 1.81 MB (2.61 million rows/s., 94.45 MB/s.)
```