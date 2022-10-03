---
id: monitor_server_errors
title: Monitor for server errors
description:
tags:
  - beginner
  - getting-started
---

# Monitor for server errors

You can use the `system.errors` table to see all errors that have occured since the ClickHouse server started.

This can be used for monitoring, and is also particularly useful in a CI process to discover if your changes have introduced new errors.

```sql
SELECT *
FROM system.errors

Query id: b0b33ee8-3d69-4206-a76a-0195fdd7d6c3

Row 1:
──────
name:               CANNOT_OPEN_FILE
code:               76
value:              1
last_error_time:    2022-09-23 11:14:27
last_error_message: Cannot open certificate file: /etc/clickhouse-server/server.crt.
last_error_trace:   [411056556,274636808,373796314,373793573,275220227,275089724,275184637,275157606,409980372,275094329,410064590,275084802,192344697,140684615164560,140684615164746,192342254]
remote:             0

Row 2:
──────
name:               NOT_AN_AGGREGATE
code:               215
value:              2
last_error_time:    2022-09-23 11:18:55
last_error_message: Column `_partition_id` is not under aggregate function and not in GROUP BY. Have columns: ['count()']
last_error_trace:   [411056556,274636808,196780545,354757704,354786429,354664707,354594247,354633905,354651659,359523047,359498339,359480912,359471762,359489150,370718129,370733171,359522916,359498339,359480912,359472098,359772417,359765631,359212706,359209076,362345720,362336958,373947906,374012298,409906599,409907866,411477979,411468053]
remote:             0

2 rows in set. Elapsed: 0.001 sec.
```