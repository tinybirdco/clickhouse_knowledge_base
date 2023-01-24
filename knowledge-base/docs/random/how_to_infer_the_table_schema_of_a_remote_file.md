---
id: how_to_infer_the_table_schema_of_a_remote_file
slug: /how-to-infer-the-table-schema-of-a-remote-file
title: Infer the table schema of a remote file
description: Want to infer the table schema of a remote file using ClickHouse? Here's how to do that with DESCRIBE TABLE.
tags: 
 - beginner
 - random
---

# How to infer the table schema of a remote file
If you want to create a ClickHouse table from a remote file, you can infer the schema based on the data in that file. To do so, just use ``DESCRIBE TABLE`` and the url.

```SQL
    DESCRIBE TABLE url('https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_2022-05.parquet')

    ┌─name──────────────────┬─type────────────────────┬─default_type─┬─default_expression─┬─comment─┬─codec_expression─┬─ttl_expression─┐
    │ VendorID              │ Nullable(Int64)         │              │                    │         │                  │                │
    │ tpep_pickup_datetime  │ Nullable(DateTime64(6)) │              │                    │         │                  │                │
    │ tpep_dropoff_datetime │ Nullable(DateTime64(6)) │              │                    │         │                  │                │
    │ passenger_count       │ Nullable(Float64)       │              │                    │         │                  │                │
    │ trip_distance         │ Nullable(Float64)       │              │                    │         │                  │                │
    │ RatecodeID            │ Nullable(Float64)       │              │                    │         │                  │                │
    │ store_and_fwd_flag    │ Nullable(String)        │              │                    │         │                  │                │
    │ PULocationID          │ Nullable(Int64)         │              │                    │         │                  │                │
    │ DOLocationID          │ Nullable(Int64)         │              │                    │         │                  │                │
    │ payment_type          │ Nullable(Int64)         │              │                    │         │                  │                │
    │ fare_amount           │ Nullable(Float64)       │              │                    │         │                  │                │
    │ extra                 │ Nullable(Float64)       │              │                    │         │                  │                │
    │ mta_tax               │ Nullable(Float64)       │              │                    │         │                  │                │
    │ tip_amount            │ Nullable(Float64)       │              │                    │         │                  │                │
    │ tolls_amount          │ Nullable(Float64)       │              │                    │         │                  │                │
    │ improvement_surcharge │ Nullable(Float64)       │              │                    │         │                  │                │
    │ total_amount          │ Nullable(Float64)       │              │                    │         │                  │                │
    │ congestion_surcharge  │ Nullable(Float64)       │              │                    │         │                  │                │
    │ airport_fee           │ Nullable(Float64)       │              │                    │         │                  │                │
    └───────────────────────┴─────────────────────────┴──────────────┴────────────────────┴─────────┴──────────────────┴────────────────┘
```