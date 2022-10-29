---
slug: import_remote_files_by_url
id: import_remote_files_by_url
title: import_remote_files_by_url
description:
tags:
  - beginner
  - getting-started
---

# Create tables from remote file URLs

ClickHouse has many tricks to make it easier to work with data from remote sources.

You can use the `url` function in your `FROM` clause to import a remote data file from a URL. You can combine this with a `CREATE TABLE...AS SELECT` to import the remote file directly into a table.

For example:

```sql
CREATE TABLE events
ENGINE = MergeTree
ORDER BY tuple() AS
SELECT *
FROM url('https://storage.googleapis.com/tinybird-assets/datasets/guides/how-to-ingest-ndjson-data/events_100k.ndjson', JSONEachRow)

Query id: e813ce99-a195-4ac1-8414-354b01991525

SELECT count()
FROM events

Query id: e368da22-f0a3-4021-999f-e303f4c8b9c3

┌─count()─┐
│  100000 │
└─────────┘
````