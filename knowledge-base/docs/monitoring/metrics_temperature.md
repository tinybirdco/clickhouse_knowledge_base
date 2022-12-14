---
slug: /metrics-temperature
id: metrics_temperature
title: Get your ClickHouse Server Temperature
description: Curious to know your ClickHouse server temperature? Here's a query to get your ClickHouse server temperature.
tags:
  - beginner
  - monitoring
---

# Get your ClickHouse Server Temperature

ClickHouse collects and stores system metrics, allowing you to query these metrics as a table.

This makes it very easy to connect your monitoring tools, like Grafana, and visualise metrics about your ClickHouse install.

Here's a query that lets you monitor your ClickHouse server temperatures.

```sql
SELECT *
FROM system.asynchronous_metrics
WHERE metric ILIKE '%temp%'

Query id: a59f1f17-1c5d-4a32-ad71-581a24ddf178

┌─metric───────────────────────────┬──value─┐
│ Temperature_nvme_Composite       │  48.85 │
│ Temperature_nvme_Sensor_2        │  49.85 │
│ Temperature_k10temp_Tctl         │ 40.625 │
│ Temperature_nct6797_SYSTIN       │     38 │
│ Temperature_nct6797_AUXTIN0      │     43 │
│ Temperature_nct6797_AUXTIN1      │   -128 │
│ Temperature_nct6797_AUXTIN2      │     50 │
│ Temperature_nct6797_Virtual_TEMP │     41 │
│ Temperature_nct6797_TSI0_TEMP    │  41.25 │
│ Temperature_nct6797_CPUTIN       │     36 │
│ Temperature_nvme_Sensor_1        │  48.85 │
│ Temperature_nct6797_AUXTIN3      │     -1 │
└──────────────────────────────────┴────────┘

12 rows in set. Elapsed: 0.008 sec.
```

You can also see the historic values in `system.asynchronous_metric_log`. Here's a query that charts average server temperature every 15 minutes with `bar` formatting.


```sql
SELECT
    toStartOfFifteenMinutes(event_time) AS q,
    avg(value) AS v,
    bar(v, 40, 60)
FROM system.asynchronous_metric_log
WHERE (metric LIKE 'Temperature_nct6797_AUXTIN0') AND (event_date = today())
GROUP BY q
ORDER BY q ASC

Query id: b0414dc5-fd5d-4aed-8467-880583487cdf

┌───────────────────q─┬──────────────────v─┬─bar(avg(value), 40, 60)──────────────────────────────────────────────────┐
│ 2022-09-22 12:00:00 │  46.22857142857143 │ ████████████████████████▊                                                │
│ 2022-09-22 12:15:00 │ 47.230923694779115 │ ████████████████████████████▊                                            │
│ 2022-09-22 12:30:00 │  47.84572072072072 │ ███████████████████████████████▍                                         │
│ 2022-09-22 13:00:00 │  43.93069306930693 │ ███████████████▋                                                         │
│ 2022-09-22 13:15:00 │  44.05388888888889 │ ████████████████▏                                                        │
│ 2022-09-22 13:30:00 │ 44.347417840375584 │ █████████████████▍                                                       │
│ 2022-09-22 13:45:00 │ 42.968333333333334 │ ███████████▋                                                             │
│ 2022-09-22 14:00:00 │  43.19166666666667 │ ████████████▋                                                            │
│ 2022-09-22 14:15:00 │               43.2 │ ████████████▋                                                            │
│ 2022-09-22 14:30:00 │  43.75638179800222 │ ███████████████                                                          │
│ 2022-09-22 14:45:00 │  43.23915461624027 │ ████████████▊                                                            │
│ 2022-09-22 15:00:00 │  43.17055555555555 │ ████████████▋                                                            │
│ 2022-09-22 15:15:00 │               40.6 │ ██▍                                                                      │
│ 2022-09-22 15:30:00 │ 44.458888888888886 │ █████████████████▋                                                       │
│ 2022-09-22 15:45:00 │  46.53611111111111 │ ██████████████████████████▏                                              │
│ 2022-09-22 16:00:00 │  45.07666666666667 │ ████████████████████▎                                                    │
│ 2022-09-22 16:15:00 │ 45.413333333333334 │ █████████████████████▋                                                   │
│ 2022-09-22 16:30:00 │             43.595 │ ██████████████▍                                                          │
│ 2022-09-22 16:45:00 │ 47.988901220865706 │ ███████████████████████████████▊                                         │
│ 2022-09-22 17:00:00 │  45.49944382647386 │ █████████████████████▊                                                   │
│ 2022-09-22 17:15:00 │ 52.343333333333334 │ █████████████████████████████████████████████████▎                       │
│ 2022-09-22 17:30:00 │ 57.888888888888886 │ ███████████████████████████████████████████████████████████████████████▌ │
│ 2022-09-22 17:45:00 │  44.00944444444445 │ ████████████████                                                         │
│ 2022-09-22 18:00:00 │ 45.916666666666664 │ ███████████████████████▋                                                 │
│ 2022-09-22 18:15:00 │ 47.227222222222224 │ ████████████████████████████▊                                            │
│ 2022-09-22 18:30:00 │  46.48057713651498 │ █████████████████████████▊                                               │
│ 2022-09-22 18:45:00 │ 46.810344827586206 │ ███████████████████████████▏                                             │
│ 2022-09-22 19:00:00 │  45.95722222222222 │ ███████████████████████▋                                                 │
│ 2022-09-22 19:15:00 │  44.11944444444445 │ ████████████████▍                                                        │
│ 2022-09-22 19:30:00 │  42.40611111111111 │ █████████▌                                                               │
│ 2022-09-22 19:45:00 │ 42.770042194092824 │ ███████████                                                              │
│ 2022-09-22 20:15:00 │  47.02116402116402 │ ████████████████████████████                                             │
│ 2022-09-22 20:30:00 │             46.705 │ ██████████████████████████▋                                              │
│ 2022-09-22 20:45:00 │             43.355 │ █████████████▍                                                           │
│ 2022-09-22 21:00:00 │  44.76166666666666 │ ███████████████████                                                      │
│ 2022-09-22 21:15:00 │  43.95530726256983 │ ███████████████▋                                                         │
│ 2022-09-22 21:30:00 │ 43.636752136752136 │ ██████████████▌                                                          │
└─────────────────────┴────────────────────┴──────────────────────────────────────────────────────────────────────────┘

37 rows in set. Elapsed: 0.030 sec. Processed 443.45 thousand rows, 7.21 MB (14.93 million rows/s., 242.86 MB/s.)
```
