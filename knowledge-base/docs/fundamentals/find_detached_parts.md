---
slug: /find-detached-parts
id: find_detached_parts
title: Find detached parts & partitions
description: Here's how you can discover which parts & partitions have been detached from your ClickHouse tables.
tags:
  - beginner
  - getting-started
---

# Find detached parts & partitions

Tables in ClickHouse are made up of smaller sections of data, called partitions & parts. It is possible to detach a part or partition from a table, without actually deleting it. This means that the data is removed from the table, but it is not deleted from disk, allowing you to reattach the part or partition at a later time, if you want to.

There are a few reasons why you might have detached parts or partitions:

- They have been manually detached using the [`ALTER TABLE DETACH PART|PARTITION`](https://clickhouse.com/docs/en/sql-reference/statements/alter/partition/#detach-partitionpart) command.
- A part found locally but not found in Zookeeper's metadata. It will be set as "unexpected" or "ignored"
- A part found locally, and found in ZooKeeper's metadata, but the status does not match. The part will be set as "broken" and downloaded fresh from another server.
- A failed quorum for the part. Will be set as "noquorum"

There's a few more, but these are the most common. Most often, this is caused by an unclean shutdown of ClickHouse. These checks normally occur when a ClickHouse server is started, and by detaching the affected parts, ClickHouse can continue to start (instead of crashing) and allow you to fix the issues.

You can find all of the detached parts of a server by querying the `system.detached_parts` table.

```sql
    SELECT *
    FROM system.detached_parts

    Query id: fbc3d2b7-94c1-4ba4-8197-d3781efea792

    ┌─database─┬─table──────────────────────────────┬─partition_id─┬─name──────────────────────────────┬─disk────┬─reason──┬─min_block_number─┬─max_block_number─┬─level─┐
    │ database │ t_957657bace18444a80fc9b465269e132 │ 202203       │ broken_202203_4554988_4554988_0   │ default │ broken  │          4554988 │          4554988 │     0 │
    │ database │ t_957657bace18444a80fc9b465269e132 │ 202201       │ ignored_202201_6774780_6774868_20 │ default │ ignored │          6774780 │          6774868 │    20 │
    │ database │ t_7777dbf2efff4253b7d0802112ae4061 │ 202103       │ 202103_764230_1414635_14_984413   │ default │         │           764230 │          1414635 │    14 │
    │ database │ t_7777dbf2efff4253b7d0802112ae4061 │ 202103       │ 202103_1414636_1448800_9          │ default │         │          1414636 │          1448800 │     9 │
    │ database │ t_7777dbf2efff4253b7d0802112ae4061 │ 202103       │ 202103_730438_764229_9            │ default │         │           730438 │           764229 │     9 │
    │ database │ t_7777dbf2efff4253b7d0802112ae4061 │ 202103       │ 202103_0_730437_45                │ default │         │                0 │           730437 │    45 │
    │ database │ t_ab2e566af7e74637977f07ba42339f1e │ 202103       │ 202103_192019_400537_14_717974    │ default │         │           192019 │           400537 │    14 │
    │ database │ t_ab2e566af7e74637977f07ba42339f1e │ 202103       │ 202103_95413_192018_13_717974     │ default │         │            95413 │           192018 │    13 │
    └──────────┴────────────────────────────────────┴──────────────┴───────────────────────────────────┴─────────┴─────────┴──────────────────┴──────────────────┴───────┘
```