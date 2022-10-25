---
slug: /drop-large-tables
id: drop_large_tables
title: Drop large tables
description: Dropping large tables in ClickHouse, but exceeding the size limits? Here's how to drop a ClickHouse table over the default 50GB size.
tags:
  - beginner
  - random
---

# Drop large tables

ClickHouse limits the size of the tables you can drop/truncate with the `max_table_size_to_drop` parameter. By default, the maximum is 50GB.

To manually drop/truncate it, you need to create a file in the /mnt/disks/tb/clickhouse/flags directory:


```bash
sudo touch '/mnt/disks/tb/clickhouse/flags/force_drop_table' && sudo chmod 666 '/mnt/disks/tb/clickhouse/flags/force_drop_table'
```

This will let you drop/truncate a >50GB table once, and then ClickHouse will automatically delete the flag file. If you want to drop/truncate more than one large table, you'll need to recreate the flag file.

Be mindful that if you create the file and then drop/truncate a smaller table, the flag file will **not** be erased.