---
id: 200_on_error
slug: /200-on-error
title: Why does ClickHouse returns a 200 code on error and how can I avoid it?
description: When using the HTTP endpoint, sometimes ClickHouse will return a 200 status code with an error inside the body. Here's how to avoid that.
tags:
  - intermediate
  - random
---

# Why does ClickHouse returns a 200 code on error and how can I avoid it?

When using the HTTP endpoint, there are situations where ClickHouse will return a 200 status code with an error inside the body.

This happens because in order to start streaming data back to the client ClickHouse needs to add the HTTP Headers first. If everything has gone correctly up to that point, ClickHouse has to assume everything will be ok and sets the status code to 200. If then an error happen, the headers (and part of the data) have been sent already and the only way ClickHouse has, with HTTP 1, to now notify an error is to write it inside the body of the message.

For example:

```sql
    $ echo 'SELECT number FROM system.numbers' | curl -v 'http://localhost:8123/?max_execution_time=0.1' --data-binary @-
    *   Trying 127.0.0.1:8123...
    > POST /?max_execution_time=0.1 HTTP/1.1
    > Host: localhost:8123
    > User-Agent: curl/7.85.0
    > Accept: */*
    > Content-Length: 34
    > Content-Type: application/x-www-form-urlencoded
    > 
    * Mark bundle as not supporting multiuse
    < HTTP/1.1 200 OK
    < Date: Fri, 23 Sep 2022 09:44:06 GMT
    < Connection: Keep-Alive
    < Content-Type: text/tab-separated-values; charset=UTF-8
    < X-ClickHouse-Server-Display-Name: Mordor
    < Transfer-Encoding: chunked
    < X-ClickHouse-Query-Id: a2a72c72-a0a9-44d3-bc8f-7765cf247e15
    < X-ClickHouse-Format: TabSeparated
    < X-ClickHouse-Timezone: Europe/Madrid
    < Keep-Alive: timeout=3
    < X-ClickHouse-Summary: {"read_rows":"1244595","read_bytes":"9956760","written_rows":"0","written_bytes":"0","total_rows_to_read":"0","result_rows":"0","result_bytes":"0"}
    <
    0
    1
    2
    3
    4
    5
    6
    7
    8
    9
    10
    11
    12
    13
    ...
    ...
    524039
    Code: 159. DB::Exception: Timeout exceeded: elapsed 0.719864458 seconds, maximum: 0.1. (TIMEOUT_EXCEEDED) (version 22.10.1.1)
```
Here ClickHouse returned the 200 code, started streaming data to the client and then it got the error, too late to now change the headers.

If you would rather avoid this behaviour, you can set ClickHouse to wait until the end of the query (`wait_end_of_query=1`) to start streaming data. This means that ClickHouse will use memory (or disk) to buffer it until everything is ready to be sent.


```sql
    $ echo 'SELECT number FROM system.numbers' | curl -v 'http://localhost:8123/?max_execution_time=0.1&wait_end_of_query=1' --data-binary @-
    *   Trying 127.0.0.1:8123...
    * Connected to localhost (127.0.0.1) port 8123 (#0)
    > POST /?max_execution_time=0.1&wait_end_of_query=1 HTTP/1.1
    > Host: localhost:8123
    > User-Agent: curl/7.85.0
    > Accept: */*
    > Content-Length: 34
    > Content-Type: application/x-www-form-urlencoded
    > 
    * Mark bundle as not supporting multiuse
    < HTTP/1.1 408 Request Time-out
    < Date: Fri, 23 Sep 2022 09:46:37 GMT
    < Connection: Keep-Alive
    < Content-Type: text/tab-separated-values; charset=UTF-8
    < X-ClickHouse-Server-Display-Name: Mordor
    < Transfer-Encoding: chunked
    < X-ClickHouse-Query-Id: e008af2c-8d37-4740-a31f-24899d54214b
    < X-ClickHouse-Format: TabSeparated
    < X-ClickHouse-Timezone: Europe/Madrid
    < X-ClickHouse-Exception-Code: 159
    < Keep-Alive: timeout=3
    < X-ClickHouse-Summary: {"read_rows":"30066795","read_bytes":"240534360","written_rows":"0","written_bytes":"0","total_rows_to_read":"0","result_rows":"0","result_bytes":"0"}
    < 
    Code: 159. DB::Exception: Timeout exceeded: elapsed 0.100000874 seconds, maximum: 0.1: While executing Numbers. (TIMEOUT_EXCEEDED) (version 22.10.1.1)
    * Connection #0 to host localhost left intact
```