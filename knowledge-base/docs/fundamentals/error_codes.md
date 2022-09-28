---
id: error_codes
title: ClickHouse Error Codes
tags:
  - beginner
  - getting-started
---

# ClickHouse Error Codes

You can view all of the possible ClickHouse error codes with this query:

```sql
SELECT concat('\t', name, ' = ', toString(number))
FROM
(
    SELECT
        number,
        errorCodeToName(number) AS name
    FROM system.numbers
    LIMIT 2000
)
WHERE NOT empty(errorCodeToName(number))
```

## HTTP Error Codes

When submitting a query over the ClickHouse HTTP interface, any errors are returned in the response header, in a special field called `X-ClickHouse-Exception-Code`.

```bash
curl -i 'http://localhost:8123?query=select+*+from+wtf'
HTTP/1.1 404 Not Found
Date: Fri, 03 Sep 2021 16:22:40 GMT
Connection: Keep-Alive
Content-Type: text/plain; charset=UTF-8
X-ClickHouse-Server-Display-Name: localhost
Transfer-Encoding: chunked
X-ClickHouse-Exception-Code: 60
Keep-Alive: timeout=3
X-ClickHouse-Summary: {"read_rows":"0","read_bytes":"0","written_rows":"0","written_bytes":"0","total_rows_to_read":"0"}

Code: 60, e.displayText() = DB::Exception: Table default.wtf doesn't exist (version 21.3.1.1)
```