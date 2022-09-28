---
id: async_insert
title: Avoid TOO_MANY_PARTS with async_insert
description: "Getting a TOO_MANY_PARTS exception in ClickHouse? If you see DB::Exception: Too many parts (600), you can avoid it by using async_insert in v21.11."
tags:
  - beginner
  - getting-started
---

# Avoid TOO_MANY_PARTS with async_insert

ClickHouse was originally designed to insert data in batches.

For engineers accustomed to other databases, it's a common mistake to send hundreds of individual inserts per second to ClickHouse and get a TOO_MANY_PARTS error. This error is ClickHouse telling us to throttle ingestion, as it can't keep up.

Until recently, you were required to solve this issue yourself, by buffering inserts and sending larger batches.

However, ClickHouse v21.11 introduced [`async_insert`](https://clickhouse.com/docs/en/operations/settings/settings/#async-insert) which enables ClickHouse to handle batching small inserts for you.

:::info Note
`async_insert` is disabled by default, so you must enable it to take advantage of this feature.
:::

If you decide to use it you should also have a look at `async_insert_threads`, `async_insert_max_data_size`, `async_insert_busy_timeout_ms` and `wait_for_async_insert`.
