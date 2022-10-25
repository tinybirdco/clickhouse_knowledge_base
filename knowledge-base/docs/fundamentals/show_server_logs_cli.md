---
slug: /show-server-logs-cli
id: show_server_logs_cli
title: Show logs in the CLI
description: Trying to debug a problem with your ClickHouse query, but having trouble filtering through the log file? Here's how to show logs in the CLI to reduce noise when debugging ClickHouse.
tags:
  - beginner
  - getting-started
---

# Showing logs in the CLI

When you're trying to debug a problem with a query, you might want to see the logs. However, there's a lot of noise in the log file, because the log file contains logs for all server operations & queries, making it difficult to find the logs you want in the log file.

To make this easier, you can instruct the CLI to display logs inside the terminal session, showing you only the logs related to your query.

You can enable this by adding the `send_logs_level` flag to the `clickhouse client` command:

```bash
clickhouse client --send_logs_level=trace

SELECT sum(number)
FROM numbers(100000000)

Query id: 4ee57b91-038a-4521-b853-24ebc3eaa933

[Mordor] 2022.09.23 15:37:02.791943 [ 42350 ] {4ee57b91-038a-4521-b853-24ebc3eaa933} <Debug> executeQuery: (from [::ffff:127.0.0.1]:55028) Select sum(number) from numbers(100000000); (stage: Complete)
[Mordor] 2022.09.23 15:37:02.792059 [ 42350 ] {4ee57b91-038a-4521-b853-24ebc3eaa933} <Trace> ContextAccess (default): Access granted: CREATE TEMPORARY TABLE ON *.*
[Mordor] 2022.09.23 15:37:02.792220 [ 42350 ] {4ee57b91-038a-4521-b853-24ebc3eaa933} <Trace> InterpreterSelectQuery: FetchColumns -> Complete
[Mordor] 2022.09.23 15:37:02.792765 [ 44170 ] {4ee57b91-038a-4521-b853-24ebc3eaa933} <Trace> AggregatingTransform: Aggregating
[Mordor] 2022.09.23 15:37:02.792804 [ 44170 ] {4ee57b91-038a-4521-b853-24ebc3eaa933} <Trace> Aggregator: Aggregation method: without_key
[Mordor] 2022.09.23 15:37:02.817190 [ 44170 ] {4ee57b91-038a-4521-b853-24ebc3eaa933} <Debug> AggregatingTransform: Aggregated. 100000000 to 1 rows (from 762.94 MiB) in 0.024879349 sec. (4019397774.435 rows/sec., 29.95 GiB/sec.)
[Mordor] 2022.09.23 15:37:02.817211 [ 44170 ] {4ee57b91-038a-4521-b853-24ebc3eaa933} <Trace> Aggregator: Merging aggregated data
[Mordor] 2022.09.23 15:37:02.817223 [ 44170 ] {4ee57b91-038a-4521-b853-24ebc3eaa933} <Trace> Aggregator: Statistics updated for key=8161375369231379905: new sum_of_sizes=1, median_size=1
┌──────sum(number)─┐
│ 4999999950000000 │
└──────────────────┘
[Mordor] 2022.09.23 15:37:02.818187 [ 42350 ] {4ee57b91-038a-4521-b853-24ebc3eaa933} <Information> executeQuery: Read 100026135 rows, 763.14 MiB in 0.026198061 sec., 3818073978 rows/sec., 28.45 GiB/sec.
[Mordor] 2022.09.23 15:37:02.818271 [ 42350 ] {4ee57b91-038a-4521-b853-24ebc3eaa933} <Debug> MemoryTracker: Peak memory usage (for query): 222.57 KiB.
[Mordor] 2022.09.23 15:37:02.818285 [ 42350 ] {4ee57b91-038a-4521-b853-24ebc3eaa933} <Debug> TCPHandler: Processed in 0.02661034 sec.

1 row in set. Elapsed: 0.026 sec. Processed 100.03 million rows, 800.21 MB (3.78 billion rows/s., 30.21 GB/s.)
```