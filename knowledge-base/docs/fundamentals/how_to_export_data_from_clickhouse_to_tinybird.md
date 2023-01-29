---
id: export_data_from_clickhouse_to_tinybird
slug: /export-data-from-clickhouse-to-tinybird
title: Export data from ClickHouse to Tinybird
description: Want to export data from your existing ClickHouse instance to Tinybird's hosted ClickHouse? Here's how to do it.
tags: 
 - getting-started
 - intermediate
---

## Export data from ClickHouse to Tinybird
So you already have some data in ClickHouse, and you want to quickly export it to Tinybird for the amazing developer experience? 😏 Here's how to do it from your ClickHouse server, with the ClickHouse HTTP interface and a couple of terminal commands. 

ClickHouse and Tinybird both support NDJSON natively, so for example, let's export the contents of the `system.query_log` to an NDJSON file using `FORMAT JSONEachRow` as the output format.

```bash
echo "SELECT event_time, toInt32(read_rows) read_rows, toFloat32(read_bytes) read_bytes FROM system.query_log WHERE event_time > now() - INTERVAL 1 YEAR FORMAT JSONEachRow" | curl 'http://localhost:8123/' --data-binary @- > /tmp/out.ndjson
% Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                Dload  Upload   Total   Spent    Left  Speed
100 1283M    0 1283M  100   125   703M     68  0:00:01  0:00:01 --:--:--  703M

real	0m6.693s
user	0m0.178s
sys	    0m1.464s

wc -l /tmp/out.ndjson
19189831 /tmp/out.ndjson
```

The command above in my case generated a ~1GB `/tmp/out.ndjon` file with ~20M rows. To push it to Tinybird you just need a `TOKEN` with permissions to create a Data Source. Then, just run this command to stream that data to Tinybird using the Tinybird [Events API](https://www.tinybird.co/docs/api-reference/events-api.html):

```bash
echo TTOKEN=
time cat /tmp/out.ndjson | curl -H "Authorization: Bearer $TTOKEN" -X POST --data-binary @- https://api.tinybird.co/v0/events?name=query_log_example
{"successful_rows":19189831,"quarantined_rows":0}

real	57.074s
user	0m0.676s
sys	    0m1.787s
```

Your data is now stored in a hosted ClickHouse table in Tinybird, and is ready to be analyzed with SQL [Pipes](https://www.tinybird.co/docs/concepts/pipes.html) and published as [API endpoints](https://www.tinybird.co/docs/concepts/apis.html) in a flash:

```bash
curl -G 'https://api.tinybird.co/v0/sql' \
    -H 'Authorization: Bearer $TTOKEN' \
    --data-urlencode 'q=select count() from query_log_example FORMAT JSON'

{
    "meta":
    [
        {
            "name": "count()",
            "type": "UInt64"
        }
    ],

    "data":
    [
        {
            "count()": 19189831
        }
    ],

    "rows": 1,

    "statistics":
    {
        "elapsed": 0.000097258,
        "rows_read": 1,
        "bytes_read": 4104
    }
}
```

And the whole process took less than a minute!