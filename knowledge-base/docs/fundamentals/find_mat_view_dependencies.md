---
slug: /find-mat-view-dependencies
id: find_mat_view_dependencies
title: Find Materialized View dependencies
description: If you change a table in ClickHouse, it can affect Materialized Views that depend on it. Here's how to find all MV dependencies for your ClickHouse table.
tags:
  - intermediate
  - getting-started
---

# Find Materialized View dependencies

If you need to perform changes on a table, you'll want to know what Materialized Views depend on this table so you can assess the impact of your changes.

For example, let's say you have the following database structure:

```sql
CREATE DATABASE deleteme_alrocar;

CREATE TABLE deleteme_alrocar.deleteme_landing
(
    `number` UInt64,
    `key` LowCardinality(String),
    `timestamp` DateTime
)
ENGINE = Null;

CREATE MATERIALIZED VIEW deleteme_alrocar.deleteme_agg_mv TO deleteme_alrocar.deleteme_agg_day AS
SELECT
    toDate(timestamp) AS date,
    key,
    avgState(number) AS avg_number,
    countState() AS c,
    sumState(number) AS sum_number
FROM deleteme_alrocar.deleteme_landing
GROUP BY
    date,
    key;
```

If you want to perform changes on the table `deleteme_alrocar.deleteme_landing`, it would be useful to know if there any Materialized Views that depend on this table without going through them all one by one.

You can use the following query to find all Materialized Views that depend on `deleteme_alrocar.deleteme_landing`:

```sql
SELECT
    database,
    name
FROM
(
    SELECT arrayJoin(arrayZip(dependencies_database, dependencies_table)) AS _table
    FROM system.tables
    WHERE (database = 'deleteme_alrocar') AND (name = 'deleteme_landing')
) AS deps
INNER JOIN system.tables ON ((_table.1) = database) AND ((_table.2) = name)
WHERE engine = 'MaterializedView'
FORMAT Vertical

Row 1:
──────
database: deleteme_alrocar
name:     deleteme_agg_mv
```