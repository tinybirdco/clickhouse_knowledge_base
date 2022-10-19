---
id: live_views
title: Live Views
description: Sometimes you want ClickHouse materialized views to behave like a typical RDBMS. Here's how to use Live Views to periodically refresh ClickHouse materializations.
tags:
  - beginner
  - getting-started
---

# Live Views

In ClickHouse, materialized views are processed incrementally, while a traditional RDBMS would process them in batch; the traditional RDBMS requires that materializations are triggered either manually or via external automation, while ClickHouse can materialize values as rows are inserted to the source table(s).

Sometimes you might want behaviour similar to the traditional approach. ClickHouse has recently introduced an experimental feature called [`LIVE VIEWS`](https://clickhouse.com/docs/en/sql-reference/statements/create/view/#live-view-experimental). With a Live View, you can configure a periodic refresh, which re-evaluates the result of the `SELECT` based on a configurable interval, and inserts the results.

For example:

```sql
    CREATE LIVE VIEW lv WITH TIMEOUT 60 AND PERIODIC REFRESH 1 AS
    SELECT value
    FROM system.events
    WHERE event = 'OSCPUVirtualTimeMicroseconds'
```
    
## Watch for changes with WATCH

An additional feature to be aware of is the ability to watch for results changes with the `WATCH` command. The `WATCH` command will monitor the results of a Live View, and show you the new values when they change.

```sql
    Mordor :) watch lv;

    WATCH lv

    Query id: b351334e-8bfe-47ee-9d33-12c9563d964e

    ┌───value─┬─_version─┐
    │ 4434938 │        3 │
    └─────────┴──────────┘
    ┌───value─┬─_version─┐
    │ 4435024 │        4 │
    └─────────┴──────────┘
    ┌───value─┬─_version─┐
    │ 4435282 │        5 │
    └─────────┴──────────┘
    ┌───value─┬─_version─┐
    │ 4435407 │        6 │
    └─────────┴──────────┘
    ┌───value─┬─_version─┐
    │ 4435573 │        7 │
    └─────────┴──────────┘
    ↙ Progress: 5.00 rows, 80.00 B (0.94 rows/s., 15.06 B/s.)                                             (0.0 CPU, 9.41 KB RAM)^Cancelling query.
    Query was cancelled.

    5 rows in set. Elapsed: 5.512 sec.
```