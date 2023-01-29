---
id: restore_replica_on_cluster
slug: /restore-replica-on-cluster
title: How to recover from a fatal data loss in ClickHouse Zookeeper
description: If you're working with ClickHouse and Zookeeper crashed causing data loss, here's how you can restore it to a usable state.
tags: 
 - advanced
 - random
---

# How do I recover from a fatal data loss in Zookeeper?

Imagine that Zookeeper has crashed, the server burned and it was a standalone replica without backup. Luckily, you were running ClickHouse on a different server (if not, you should be!) so technically all the data is present on the ClickHouse replicas.

So how do you restore Zookeeper into a usable state?

ClickHouse has got your back: [`SYSTEM RESTORE REPLICA ON CLUSTER`](https://clickhouse.com/docs/en/sql-reference/statements/system/#restore-replica)

You can use this command to ask ClickHouse to push the information that the server has about the replication status to Zookeeper. Although it's going to be slow and painful, all you need to do is to iterate over all databases and over all replicated tables and execute that command for every one of them.

And remember, next time, use a cluster of 3+ Zookeeper nodes 😉

