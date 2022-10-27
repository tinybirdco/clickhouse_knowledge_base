---
slug: /get-clickhouse-version
id: get_clickhouse_version
title: Get your ClickHouse version
description: Wondering what version of ClickHouse you're running? Here's how to get your ClickHouse version with a query, in the CLI, or over the HTTP interface.
tags:
  - beginner
  - getting-started
---

# Get your ClickHouse version

It's easy to forget the exact of version of ClickHouse you installed, so you might want an easy way to find it - thankfully, there is an easy way.

Use the following query to get your current ClickHouse version:

```sql Get your ClickHouse version
SELECT version()
```

If you're using the CLI, you can run this query as follows:

```bash Get your ClickHouse version via the CLI 
clickhouse-client -q "SELECT version()"
```

If you don't have the client, you can also do it over the HTTP interface

```bash Get your ClickHouse version via the HTTP interface
curl http://ch_host:8123/?q=select+version()
```

