---
id: clickhouse_local
title: Analysing local files with clickhouse-local
tags:
  - beginner
  - getting-started
---

# Analysing local files with clickhouse-local

`clickhouse-local` is like running a temporary ClickHouse server that only lasts for your session. It's great for exploring local files to quickly experiment with data, without needing to set up a proper ClickHouse deployment.

It's possible to use to `clickhouse-local` to analyse files of structured data directly from the local file system. 

```sql
SELECT count() FROM file('final.ndjson');

SELECT count()
FROM file('final.ndjson')

Query id: a0a1f4b5-40cb-4125-b68b-4ed978c41576

┌─count()─┐
│  100000 │
└─────────┘

1 row in set. Elapsed: 0.659 sec. Processed 55.38 thousand rows, 96.97 MB (84.04 thousand rows/s., 147.16 MB/s.)


SELECT countDistinct(public_ip) FROM file('final.ndjson');

SELECT countDistinct(public_ip)
FROM file('final.ndjson')

Query id: 21df7ca5-e3bf-4010-b2a0-bf8b854502d2

┌─uniqExact(public_ip)─┐
│                   71 │
└──────────────────────┘

1 row in set. Elapsed: 0.225 sec. Processed 77.53 thousand rows, 96.45 MB (345.22 thousand rows/s., 429.46 MB/s.)
```

You can create tables from the local file if you want to do more than one analysis on the data. The table is destroyed when your `clickhouse-local` session ends.


```sql
CREATE TABLE auxiliar Engine=MergeTree() ORDER BY tuple() AS SELECT * FROM file('final.ndjson');

CREATE TABLE auxiliar
ENGINE = MergeTree
ORDER BY tuple() AS
SELECT *
FROM file('final.ndjson')

Query id: a1732be5-a912-41a5-bf8e-e524db8f12f4

Ok.

0 rows in set. Elapsed: 0.486 sec. Processed 100.00 thousand rows, 161.88 MB (205.73 thousand rows/s., 333.03 MB/s.)


SHOW CREATE TABLE auxiliar;

SHOW CREATE TABLE auxiliar

Query id: dffbcd4b-2c08-4d07-916c-b8e1b668c202


│ CREATE TABLE _local.auxiliar
(
    `timestamp_iso8601` Nullable(DateTime64(9)),
    `host` Nullable(String),
    `public_ip` Nullable(String),
    `request_method` Nullable(String),
    `request_path` Nullable(String),
    `status` Nullable(Int64),
    `body_bytes_sent` Nullable(Int64),
    `request_length` Nullable(Int64),
    `first_byte` Nullable(Float64),
    `request_time` Nullable(Float64),
    `lambda_name` Nullable(String),
    `lambda_region` Nullable(String),
    `path_type` Nullable(String),
    `hit_level` Nullable(String),
    `hit_state` Nullable(String),
    `error_details` Nullable(String),
    `owner_id` Nullable(String),
    `project_id` Nullable(String),
    `target_path` Nullable(String),
    `deployment_plan` Nullable(String),
    `lambda_duration` Nullable(Float64),
    `lambda_billed_duration` Nullable(Int64),
    `lambda_memory_size` Nullable(Int64),
    `http_user_agent` Nullable(String),
    `full_vercel_id` Nullable(String),
    `dc` Nullable(String),
    `public_ip_country` Nullable(String),
    `public_ip_city` Nullable(String),
    `asn_id` Nullable(String),
    `asn_name` Nullable(String)
)
ENGINE = MergeTree
ORDER BY tuple()
SETTINGS index_granularity = 8192 │


1 row in set. Elapsed: 0.001 sec.

SELECT count(), status - status % 100 AS status_range FROM auxiliar GROUP BY status_range;

SELECT
    count(),
    status - (status % 100) AS status_range
FROM auxiliar
GROUP BY status_range

Query id: 2685e0d4-827a-4306-8598-5d6e589dbd15

┌─count()─┬─status_range─┐
│   74000 │          200 │
│    5000 │          400 │
│   21000 │          300 │
└─────────┴──────────────┘

3 rows in set. Elapsed: 0.015 sec.
```