---
id: query_progress_percentage
slug: /query-progress-percentage
title: Estimate the percent progress of a ClickHouse query
description: Wondering how long your ClickHouse query will take to execute? Here's how to estimate the progress of your queries in ClickHouse.
tags: 
 - monitoring
 - intermediate
---

# How to estimate the progress of a running query in ClickHouse

If you have the ``query_id`` of a ClickHouse query, you can estimate the running percentage and time to completion with this query:

```sql
    SELECT
        query_id,
        (100 * read_rows) / total_rows_approx AS progress_percentage,
        elapsed AS elapsed_time,
        (elapsed / (read_rows / total_rows_approx)) * (1 - (read_rows / total_rows_approx)) AS estimated_remaining_time
    FROM system.processes
    WHERE query_id = 'a6fca6dc-1a9a-4243-b633-17b090fdfccc'
    FORMAT Vertical

    Row 1:
    ──────
    query_id:                 a6fca6dc-1a9a-4243-b633-17b090fdfccc
    progress_percentage:      61.5495915
    elapsed_time:             233.419534862
    estimated_remaining_time: 145.8186195650688DROP TABLE table_name;
```

If you need to get the ``query_id`` for a specific query, you can use ``SHOW PROCESSLIST`` or query ``system.processes`` to list the running queries and processes.
