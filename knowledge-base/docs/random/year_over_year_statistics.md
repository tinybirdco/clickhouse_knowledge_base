---
id: year_over_year_statistics
slug: /year-over-year-statistics
title: How to calculate YoY statistics in ClickHouse
description: Ever wonderered how to calculate year over year growth in ClickHouse? Read this to learn how it's done.
tags: 
 - beginner
 - random
---

# HHow to calculate YoY statistics in ClickHouse

You can get year over year (yoy) growth in ClickHouse with a simple query like this:

```sql
    CREATE TABLE events
    (
        timestamp DateTime,
        key LowCardinality(String),
        value UInt32
    ) engine=MergeTree()
    ORDER BY (key, timestamp)
```

Now insert some random data...

```sql
    INSERT INTO events SELECT
        now() - toIntervalYear(1),
        toString(number % 10),
        rand()
    FROM numbers(1000000)

    INSERT INTO events SELECT
        now(),
        toString(number % 10),
        rand()
    FROM numbers(1000000)
```

...and calculate the year over year growth with `sumIf()`!

```sql
WITH toYear(timestamp) AS year
SELECT
    key,
    sumIf(value, year = toYear(now())) AS this_year,
    sumIf(value, year = (toYear(now()) - 1)) AS past_year,
    round(this_year / past_year, 3) AS yoy
FROM events
WHERE key = '1'
GROUP BY key

┌─key─┬────────this_year─┬───────past_year─┬───yoy─┐
│ 1   │ 1287242645303686 │ 430070569519055 │ 2.993 │
└─────┴──────────────────┴─────────────────┴───────┘
```