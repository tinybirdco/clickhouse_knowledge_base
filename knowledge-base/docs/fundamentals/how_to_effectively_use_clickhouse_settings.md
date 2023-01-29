---
id: how_to_effectively_use_clickhouse_settings
slug: /how-to-effectively-use-clickhouse-settings
title: How to effectively use ClickHouse settings
description: Wondering how to configure ClickHouse settings? Here are 5 tips to take into account when doing so.
tags: 
 - beginner
 - getting-started
---

# How to effectively use ClickHouse settings

ClickHouse comes with a bunch of settings to tweak and tinker with. Getting those settings right can be the difference between a great ClickHouse experience, or a hellish one.

Here are 5 things to take into account when using ClickHouse settings.

## 1. Apply settings to specific queries
You can apply a `SETTING` to a specific query:

```sql
    OPTIMIZE TABLE table_name FINAL SETTINGS optimize_throw_if_noop=1
```
## 2. Apply settings to clickhouse-client sessions
You can apply a ``SETTING`` to a ``clickhouse-client`` session:

```sql
    clickhouse-client
    SET max_thread=1
    -- now the setting applies to all the queries from this point
```
...but take into account that when the session is closed the setting is no longer applied to the session, and the setting might not be applied to ``ON CLUSTER`` operations.

## 3. User settings don't require a server restart 
User settings (those in ``users.xml`` or applied to a user ``profile``) don't require that you restart the ClickHouse server.

## 4. But server settings do
Server settings (those in ``config.xml``) do require a server restart.

## 5. Specifying table settings
When configuring table settings, some need to be specified on table creation, but the table can be altered afterwards.

```sql
    CREATE TABLE deleteme
    (
        `number` UInt64
    )
    ENGINE = MergeTree
    PARTITION BY number % 10
    ORDER BY number
    SETTINGS index_granularity=128
```
## Bonus: Inspecting current settings
You can inspect current settings applied in several ways:

```sql
    SELECT getSetting('max_threads')

    ┌─getSetting('max_threads')─┐
    │                        16 │
    └───────────────────────────┘
```

```sql
    SELECT *
    FROM system.settings
    WHERE name = 'max_threads'

    ┌─name────────┬─value─┬─changed─┬─description───────────────────────────────────────────────────────────────────────────────────────┬─min──┬─max──┬─readonly─┬─type───────┐
    │ max_threads │ 16    │       1 │ The maximum number of threads to execute the request. By default, it is determined automatically. │ ᴺᵁᴸᴸ │ ᴺᵁᴸᴸ │        0 │ MaxThreads │
    └─────────────┴───────┴─────────┴───────────────────────────────────────────────────────────────────────────────────────────────────┴──────┴──────┴──────────┴────────────┘
```

In this case, you can see if the setting is the default or if it was ``changed``.
