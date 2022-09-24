
# What ClickHouse version am I using?

It's easy to forget the exact of version of ClickHouse we installed, so we need a way to find that out - thankfully, that's nice and easy too.

Use the following query to get your current ClickHouse version

```sql Get your ClickHouse version
SELECT version()
```

If you're using the CLI, you can run this query as follows

```bash Get your ClickHouse version via the CLI 
clickhouse-client -q "SELECT version()"
```

If you don't have the client, you can also do it over the HTTP interface

```bash Get your ClickHouse version via the HTTP interface
curl http://ch_host:8123/?q=select+version()
```

