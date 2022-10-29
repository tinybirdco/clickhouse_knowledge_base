---
slug: monitor_mutations
id: monitor_mutations
title: Monitor Mutations
description: 
tags:
  - intermediate
  - monitoring
---


# Monitor Mutations

ClickHouse [mutations](https://clickhouse.com/docs/en/sql-reference/statements/alter/#mutations) are asynchronous and can take time to finish. They can also error out and block subsequent mutations, so it's important to monitor them to decide whether to cancel or reapply them where necessay.

You can use the [`system.mutations`](https://clickhouse.com/docs/en/operations/system-tables/mutations/) table to monitor them.

For example, to find errors:

```sql
SELECT
    hostname() AS host,
    count()
FROM clusterAllReplicas('all', 'system.mutations')
WHERE (latest_fail_reason <> '' OR toUInt64(latest_fail_time) <> 0)
GROUP BY host
```

Or to find long running mutations:

```sql
SELECT
    hostname() AS host,
    count()
FROM clusterAllReplicas('all', 'system.mutations')
WHERE is_done = 0 AND create_time < now() - INTERVAL 24 HOUR
GROUP BY host
```