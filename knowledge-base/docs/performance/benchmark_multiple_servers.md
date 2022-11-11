---
slug: /benchmark_multiple_servers
id: benchmark_multiple_servers
title: Benchmark query against multiple servers
description: Benchmark is a powerfull ClickHouse tool. Here's how to run benchmark a query against different versions, or configurations.
tags:
  - performance
---

# Benchmark query against multiple servers

When running `clickhouse benchmark` you can run same test against two different CH servers by passing multiple hosts and ports.

This way you can easily test if there are statistically significant differences between two different versions, or configurations:

```bash

./master/clickhouse-benchmark -h clickhouse-01 clickhouse-02 --port 9000 9001 -i 400 -d 0 --max_threads 1 --query "..."

Loaded 1 queries.

Queries executed: 400.

clickhouse-01:9000, queries 194, QPS: 8.375, RPS: 37085.049, MiB/s: 2.501, result RPS: 8.375, result MiB/s: 0.003.
clickhouse-02:9001, queries 206, QPS: 11.869, RPS: 48615.636, MiB/s: 18.314, result RPS: 11.869, result MiB/s: 0.004.

0.000%		0.110 sec.	0.077 sec.
10.000%		0.113 sec.	0.079 sec.
20.000%		0.114 sec.	0.079 sec.
30.000%		0.115 sec.	0.080 sec.
40.000%		0.115 sec.	0.080 sec.
50.000%		0.116 sec.	0.081 sec.
60.000%		0.117 sec.	0.081 sec.
70.000%		0.118 sec.	0.082 sec.
80.000%		0.119 sec.	0.082 sec.
90.000%		0.124 sec.	0.087 sec.
95.000%		0.135 sec.	0.095 sec.
99.000%		0.150 sec.	0.147 sec.
99.900%		0.407 sec.	0.345 sec.
99.990%		0.407 sec.	0.345 sec.

Difference at 99.5% confidence: mean difference is 0.03514849, but confidence interval is 0.00664633
```