---
slug: /query-remote-clickhouse-server
id: query_remote_clickhouse_server
title: Query a remote ClickHouse server
description: Want to query a specific remote ClickHouse server? Here's how to use the remote() function to send queries to a different ClickHouse cluster.
  - beginner
  - getting-started
---

# Query a remote ClickHouse server

If you have more than one ClickHouse cluster, you might want to send queries from one cluster to another. This is pretty easy in ClickHouse, which has built in support for just that.

The `remote` (or `remoteSecure`) functions can be used in the `FROM` clause to read data from a remote server.

To send a query to a specific remote ClickHouse server, you can use `remote`. For example:

```sql
SELECT count()
FROM remote('127.0.0.1:9000', 'default.t1') AS t
WHERE date >= today()

Query id: 1868afed-9689-4605-9675-4be4a7725ea4

┌─count()─┐
│   14191 │
└─────────┘
```

Similarly, if you have configured [remote servers as a cluster in your ClickHouse config](https://clickhouse.com/docs/en/operations/server-configuration-parameters/settings/#server-settings-remote-servers), you can send a query to all servers in the remote cluster using the `clusterAllReplicas` function. For example:

```sql
SELECT
    hostName(),
    *
FROM clusterAllReplicas('clustername', system.mutations)
WHERE NOT is_done
FORMAT Vertical

Query id: e53b1851-3246-4d40-8c95-687d3fde5958

Row 1:
──────
hostName():                 host-db-2
database:                   database_name
table:                      table_name
mutation_id:                0000000004
command:                    MATERIALIZE TTL
create_time:                2022-09-19 16:34:24
block_numbers.partition_id: ['all']
block_numbers.number:       [238358]
parts_to_do_names:          ['all_164055_173528_6_184171']
parts_to_do:                1
is_done:                    0
latest_failed_part:         
latest_fail_time:           1970-01-01 00:00:00
latest_fail_reason:         

1 rows in set. Elapsed: 0.017 sec.
```
