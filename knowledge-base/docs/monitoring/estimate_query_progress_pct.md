---
slug: /estimate-query-progress-pct
id: estimate_query_progress_pct
title: Estimate the progress of a query
description: ClickHouse usually processes queries very quickly, but here's how to track the progress of long-running ClickHouse queries.
tags:
  - intermediate
  - getting-started
---

# Estimate the progress of a query

For longer running queries, you might want to track roughly how much progress the query has made. You can use the `system.processes` table to get information about your query and estimate it's progress.

You will need the `query_id` of the query you want to check. For example:

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

You can also use `SHOW PROCESSLIST`.
