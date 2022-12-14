---
slug: /format-queries
id: format_queries
title: Format queries
description: Are your ClickHouse queries ugly? Here's how to format them in the command line with the ClickHouse query formatter.
tags:
  - beginner
  - getting-started
---

# Format queries

ClickHouse comes with a handy query formatter included.

You can use it from the command line, for example:

```bash
$ echo "Select a + b as value, max(date) as max_date from my_table where c > 0 group by value order by max_date" | clickhouse format

    SELECT
        a + b AS value,
        max(date) AS max_date
    FROM my_table
    WHERE c > 0
    GROUP BY value
    ORDER BY max_date ASC
```