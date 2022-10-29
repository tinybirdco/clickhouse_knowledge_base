---
slug: get_server_ports
id: get_server_ports
title: Get all server ports
description: 
tags:
  - beginner
  - getting-started
---

# Get all server ports

A ClickHouse server can open network ports for the 3 supported interface types in ClickHouse: native TCP, HTTP and gRPC. Whether you use a single ClickHouse server, or a cluster of them, it can be very useful to find out which ports these interfaces are bound to. You could get this information from the host machine's OS, but ClickHouse makes it easy to get the information with SQL!

The `getServerPort` function will return the port number for the given interface.

If you are running a cluster of multiple ClickHouse servers, don't forget to use the `clusterAllReplicas` to ensure you get results for every server in the cluster.

For example:

```sql
SELECT *
FROM clusterAllReplicas('tinybird', view(
    SELECT
        shardNum() AS shard,
        FQDN(),
        hostname(),
        getServerPort('http_port'),
        getServerPort('tcp_port')
))
ORDER BY shard ASC
FORMAT Pretty

Query id: edf01a14-6787-4c93-801f-7262c87f9887

┏━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ shard ┃ FQDN() ┃ hostname() ┃ getServerPort('http_port') ┃ getServerPort('tcp_port') ┃
┡━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━┩
│     1 │ Mordor │ Mordor     │                      48123 │                     49000 │
└───────┴────────┴────────────┴────────────────────────────┴───────────────────────────┘
┏━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ shard ┃ FQDN() ┃ hostname() ┃ getServerPort('http_port') ┃ getServerPort('tcp_port') ┃
┡━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━┩
│     2 │ Mordor │ Mordor     │                      58123 │                     59000 │
└───────┴────────┴────────────┴────────────────────────────┴───────────────────────────┘

2 rows in set. Elapsed: 0.006 sec.
```