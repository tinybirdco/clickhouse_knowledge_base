---
id: log_table_ttl
title: Apply a TTL to system.query_log
description: ClickHouse query logs growing too large? Here's how to apply a permanent TTL to your ClickHouse system.query_log.
tags:
  - beginner
  - getting-started
---

# Apply a TTL to system.query_log

ClickHouse can surface query logs in the `system.query_log` table, making it easy to run queries over your logs for debugging. Over time, especially on busy clusters, this table can grow quite large and take up a lot of disk space.

You might think to apply a TTL to this table using `MODIFY TTL`, however, this change will be lost upon a server restart.

To permenantly apply a TTL to the `system.query_log` table, you must modify the `conf.xml` file.

For example:

```xml
    <query_views_log>
        <database>system</database>
        <table>query_views_log</table>
        <partition_by>toStartOfWeek(event_date)</partition_by>
        <flush_interval_milliseconds>7500</flush_interval_milliseconds>
        <ttl>toStartOfWeek(event_date) + INTERVAL 3 MONTH</ttl>
    </query_views_log>

    <query_log>
        <database>system</database>
        <table>query_log</table>
        <partition_by>toStartOfWeek(event_date)</partition_by>
        <ttl>toStartOfWeek(event_date) + INTERVAL 3 MONTH</ttl>
        <flush_interval_milliseconds>7500</flush_interval_milliseconds>
    </query_log>
```

You must restart the ClickHouse server for this config change to be applied.