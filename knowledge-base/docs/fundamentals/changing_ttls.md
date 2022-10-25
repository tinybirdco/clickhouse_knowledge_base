---
slug: /changing-ttls
id: changing_ttls
title: Change table TTLs
description: Want to change table TTLs in ClickHouse? Here's how you can modify the TTL of a table in ClickHouse and avoid impacting performance.
tags:
  - beginner
  - getting-started
---

# Change table TTLs

You can modify the TTL of a table in ClickHouse by using `ALTER TABLE...MODIFY TTL`. For example:

```sql
ALTER TABLE database.table MODIFY TTL event_date + INTERVAL 30 DAY;
```

However, ClickHouse will rewrite all table partitions, including those not impacted by the TTL change. This can be a very expensive operation, especially for large tables.

To avoid impacting the performance of our database, we can instead set `materialize_ttl_after_modify` to 0 and clear up old partitions manually. 

This avoids the huge performance impact of rewriting all table partitions, but does mean there is additional manual effort.

For example:

```sql
set materialize_ttl_after_modify=0;
ALTER TABLE database.table MODIFY TTL event_date + INTERVAL 30 DAY;

ALTER TABLE database.table DROP PARTITION 202205;
ALTER TABLE database.table DROP PARTITION 202206;
ALTER TABLE database.table DROP PARTITION 202207;
```