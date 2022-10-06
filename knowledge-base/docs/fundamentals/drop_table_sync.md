---
id: drop_table_sync
title: Hard delete a table
description: Want to drop a table in ClickHouse and not wait until it's deleted asynchronously?
tags:
  - beginner
  - getting-started
---

# Synchronous deletion of tables

When dropping tables in ClickHouse, in the default Atomic database engine, the data and the table itself isn't deleted from disk until a) the table is no longer used by concurrent queries and b) 8 minutes (`old_parts_lifetime` setting) have passed since the request was received.

In some circumstances, for example when dropping and recreating the table, this can cause issues with Zookeeper as the table metadata is still there pending asynchronous deletion but we are trying to create it again. For example:

```sql Dropping a replicated table and recreating it again immediately will lead to Zookeeper errors
production-01 :) drop table test.myTable;

DROP TABLE test.myTable

Query id: 5a1e5daa-567e-49fb-aa11-c08c31fcde40

Ok.

0 rows in set. Elapsed: 0.005 sec. 

production-01 :) CREATE TABLE test.myTable
                 (
                     `timestamp` DateTime,
                     `event_type` String
                 )
                 ENGINE = ReplicatedMergeTree('/clickhouse/tables/{layer}-{shard}/test.myTable', '{replica}')
                 PARTITION BY toYear(timestamp)
                 ORDER BY (timestamp)

CREATE TABLE test.myTable
(
    `timestamp` DateTime,
    `event_type` String
)
ENGINE = ReplicatedMergeTree('/clickhouse/tables/{layer}-{shard}/test.myTable', '{replica}')
PARTITION BY toYear(timestamp)
ORDER BY timestamp

Query id: 26669a72-ba6f-4c99-860c-67f75272f3c2


0 rows in set. Elapsed: 0.030 sec. 

Received exception from server (version 22.10.1):
Code: 253. DB::Exception: Received from clickhouse-01:49000. DB::Exception: Replica /clickhouse/tables/01-01/test.myTable/replicas/clickhouse-01 already exists. (REPLICA_IS_ALREADY_EXIST)
```

In this case, to avoid the wait [we can use the `SYNC` modifier](https://clickhouse.com/docs/en/sql-reference/statements/drop/#drop-table), which will delete the data and the table synchronously and won't return until everything is clear. Then we can drop and recreate tables without problems:

```
production-01 :) CREATE TABLE test.myTable2
                 (
                     `timestamp` DateTime,
                     `event_type` String
                 )
                 ENGINE = ReplicatedMergeTree('/clickhouse/tables/{layer}-{shard}/test.myTable2', '{replica}')
                 PARTITION BY toYear(timestamp)
                 ORDER BY (timestamp)

CREATE TABLE test.myTable2
(
    `timestamp` DateTime,
    `event_type` String
)
ENGINE = ReplicatedMergeTree('/clickhouse/tables/{layer}-{shard}/test.myTable2', '{replica}')
PARTITION BY toYear(timestamp)
ORDER BY timestamp

Query id: 55afb63f-c4aa-46cb-b00b-c33bc7750c16

Ok.

0 rows in set. Elapsed: 0.045 sec. 

production-01 :) DROP TABLE test.myTable2 SYNC;

DROP TABLE test.myTable2 SYNC

Query id: 645e3e7b-17ea-4857-a405-d789378bdb2c

Ok.

0 rows in set. Elapsed: 0.046 sec. 

production-01 :) CREATE TABLE test.myTable2
                 (
                     `timestamp` DateTime,
                     `event_type` String
                 )
                 ENGINE = ReplicatedMergeTree('/clickhouse/tables/{layer}-{shard}/test.myTable2', '{replica}')
                 PARTITION BY toYear(timestamp)
                 ORDER BY (timestamp)

CREATE TABLE test.myTable2
(
    `timestamp` DateTime,
    `event_type` String
)
ENGINE = ReplicatedMergeTree('/clickhouse/tables/{layer}-{shard}/test.myTable2', '{replica}')
PARTITION BY toYear(timestamp)
ORDER BY timestamp

Query id: 4dc22cdb-7e39-415c-8813-63a76c9ba3de

Ok.

0 rows in set. Elapsed: 0.039 sec.
```


Note: This also works for dropping whole databases
```bash Drop database
DROP DATABASE test SYNC;
```
