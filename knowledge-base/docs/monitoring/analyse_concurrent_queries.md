---
id: analyze_concurrent_queries
title: Analyze concurrent queries
description: Getting the TOO_MANY_SIMULTANEOUS_QUERIES error in ClickHouse? Here's how to analyze which queries are throttling your ClickHouse instance.
tags:
  - beginner
  - monitoring
---

# Analyze concurrent queries

ClickHouse can proccess multiple queries concurrently, but performance is affected, and, in the worst case, you may hit the dreaded TOO_MANY_SIMULTANEOUS_QUERIES error. This happens when ClickHouse has reached the maximum amount of simulatenous queries and you send another request before at least one is finished. One way to avoid this issue is to optimize the queries, but to do that, you'll need to know which ones are responsible for the problem.

You can use the `system.query_log` to get detailed information from queries, and, in combination with a window function, you can track the number of concurrent queries, grouping by whatever you want. For example, you could group by the query itself, by http_user_agent, or by query_kind like in this example:

```sql
SELECT
    time,
    query_kind,
    max(started_queries) - max(finished_queries) AS concurrent_queries
FROM
(
    WITH now() - toIntervalMinute(30) AS asdf
    SELECT
        toStartOfInterval(event_time, toIntervalMinute(1)) AS time,
        query_kind,
        countIf((type IN (2, 4)) AND (query_start_time >= asdf)) OVER (myw) AS finished_queries,
        countIf(type = 1) OVER (myw) AS started_queries
    FROM system.query_log
    WHERE event_time >= asdf
    WINDOW myw AS (PARTITION BY query_kind ORDER BY event_time ASC)
)
GROUP BY
    time,
    query_kind
HAVING concurrent_queries > 0
ORDER BY
    time ASC,
    query_kind DESC
LIMIT 15

Query id: 008ddcda-851e-4fea-a3f9-1b3c4105e571

┌────────────────time─┬─query_kind─┬─concurrent_queries─┐
│ 2022-09-23 12:56:00 │ Insert     │                 26 │
│ 2022-09-23 12:57:00 │ Insert     │                 21 │
│ 2022-09-23 12:58:00 │ Insert     │                 25 │
│ 2022-09-23 12:59:00 │ Insert     │                 23 │
│ 2022-09-23 13:00:00 │ Insert     │                 22 │
│ 2022-09-23 13:01:00 │ Insert     │                 22 │
│ 2022-09-23 13:02:00 │ Insert     │                 22 │
│ 2022-09-23 13:03:00 │ Insert     │                 23 │
│ 2022-09-23 13:04:00 │ Insert     │                 22 │
│ 2022-09-23 13:05:00 │ Insert     │                 22 │
│ 2022-09-23 13:06:00 │ Insert     │                 23 │
│ 2022-09-23 13:07:00 │ Insert     │                 24 │
│ 2022-09-23 13:08:00 │ Insert     │                 24 │
│ 2022-09-23 13:09:00 │ Insert     │                 22 │
│ 2022-09-23 13:10:00 │ Insert     │                 22 │
└─────────────────────┴────────────┴────────────────────┘

15 rows in set. Elapsed: 0.037 sec. Processed 859.57 thousand rows, 3.75 MB (23.17 million rows/s., 101.20 MB/s.)
```