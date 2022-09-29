---
id: swapping_tables
title: Swap tables
description: Want to swap one table for another in ClickHouse? Here are two ways to swap tables in ClickHouse using EXCHANGE TABLE or RENAME TABLE statements
tags:
  - beginner
  - getting-started
---

# Swap tables

There is always a scenario where you need to swap one table for another. For example, you have `my_table` and `my_table_new` and you want `my_table_new` to become `my_table`. You can always drop the original table, and then rename the new table, but this is risky, as you can't reverse the operation.

ClickHouse has two ways to achieve swapping tables.

## Using an Atomic database

If both tables are part of an Atomic database, then you should use the [`EXCHANGE TABLES`](https://clickhouse.com/docs/en/sql-reference/statements/exchange/#exchange-tables):

```sql
EXCHANGE TABLES db1.my_table AND db2.my_table_new ON CLUSTER my_cluster
```

This will to an atomic swap, which means that concurrent operations won't fail and there won't be any moment where one of the tables doesn't exist.

## Using an Ordinary database

On the other hand, if you are still using `Ordinary` databases (tip: you should migrate to `Atomic`) then you can do multiple `RENAME TABLE` calls:

```sql
RENAME TABLE db1.my_table TO db1.my_table_tmp,
            db2.my_table_new TO db1.my_table,
            db1.my_table_tmp TO db2.my_table_new
            ON CLUSTER my_cluster
```
This command is equivalent to the `EXCHANGE` call, but it's not atomic so you might receive errors on concurrent queries about one of the tables not existing while the operation is being applied.

Note that in both cases you can do multiple swaps in one query, but they won't happen at exactly the same time (but with exchange each swap will be atomic).