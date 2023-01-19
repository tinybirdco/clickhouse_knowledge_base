---
id: clickhouse_server_start_parameters
slug: /clickhouse-server-start-parameters
title: How to share ClickHouse configures across local servers
description: Ever wondered how to share the same ClickHouse configuration between multiple servers locally? Here's how to do it.
tags: 
 - getting-started
 - intermediate
---

# How to share ClickHouse configures across local servers

When testing features locally, you should test in a replicated environment with at least 2 or more ClickHouse instances. Keeping several configurations updated and in sync can seem time consuming and error prone, but you can make it much easier by sharing the configuration when you start the server.

You usually want to change ports and data paths, and you can do it with something like:

```bash

    clickhouse server \
        --config-file=/mnt/ch/ch_data/config/zk/config.xml \
        --pid-file=/tmp/clickhouse-server-zk_1.pid \
        -- --path /mnt/ch/ch_data/data/zk_1/ \
        --tmp_path  /mnt/ch/ch_data/data/zk_1/tmp \
        --user_files_path /mnt/ch/ch_data/data/zk_1/user_files/ \
        --format_schema_path /mnt/ch/ch_data/data/zk_1/format_schemas/ \
        --http_port 28123 \
        --tcp_port 29000 \
        --interserver_http_port 29009
```

Then a second server can use the same base configuration (`/mnt/ch/ch_data/config/zk/config.xml`) but instead change ports and paths:

```bash

    clickhouse server \
        --config-file=/mnt/ch/ch_data/config/zk/config.xml \
        --pid-file=/tmp/clickhouse-server-zk_2.pid \
        -- --path /mnt/ch/ch_data/data/zk_2/ \
        --tmp_path  /mnt/ch/ch_data/data/zk_2/tmp \
        --user_files_path /mnt/ch/ch_data/data/zk_2/user_files/ \
        --format_schema_path /mnt/ch/ch_data/data/zk_2/format_schemas/ \
        --http_port 38123 \
        --tcp_port 39000 \
        --interserver_http_port 39009
```

This works for almost any configuration, but there are some that aren't as simple to change, for example the macros `REPLICA`, `LAYER` and `SHARD`. For these, you change the configuration so it reads them from the environment:

In your xml config file include something like...

```XML
    <macros>
        <replica from_env="REPLICA" />
        <layer from_env="LAYER" />
        <shard from_env="SHARD" />
    </macros>
```

...and then when starting the server pass the config:

```bash

    REPLICA=zk_1 LAYER=01 SHARD=01 \
    clickhouse server \
        --config-file=/mnt/ch/ch_data/config/zk/config.xml \
        --pid-file=/tmp/clickhouse-server-zk_1.pid \
        -- --path /mnt/ch/ch_data/data/zk_1/ \
        --tmp_path  /mnt/ch/ch_data/data/zk_1/tmp \
        --user_files_path /mnt/ch/ch_data/data/zk_1/user_files/ \
        --format_schema_path /mnt/ch/ch_data/data/zk_1/format_schemas/ \
        --http_port 28123 \
        --tcp_port 29000 \
        --interserver_http_port 29009
```

If you follow these instructions, all the rest of the configuration files are completely shared and you can forget about applying new changes on multiple places.
