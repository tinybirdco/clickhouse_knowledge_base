---
id: soft_delete_tables
title: Soft delete tables
description: Want to drop a table in ClickHouse, but worried about losing data? Here's how to "soft" delete a ClickHouse table so you can restore it in the future.
tags:
  - beginner
  - getting-started
---

# Soft delete tables

You can drop a ClickHouse table with:

```sql
DROP TABLE table_name;
```

However, you might encounter two cases in which dropping a table is not possible or it's not convenient.

First, by default, MergeTree tables bigger than 50GB are not dropped. That's a restriction that can be changed with the server setting `max_table_size_to_drop`.

Additionaly, there are times when you want to be a bit more cautious when dropping tables, in case you need to restore them later.

For these reasons, you may want to 'soft' delete a table. This makes the table unavailable for queries, but does not delete the data.

You can do this in ClickHouse with the `DETACH TABLE` command.

```sql
DETACH TABLE table_name PERMANENTLY;
```

If you restart the ClickHouse server, it will not load data for detatched tables, so they will not impact the startup time of the server.

If needed, you can recover detatched tables with `ATTACH TABLE`.

```sql
ATTACH TABLE table_name;
```