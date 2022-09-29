---
id: working_with_dates
title: Handle uncommon or variable date patterns
description: Getting errors trying to cast toDateTime in ClickHouse? Use this ClickHouse function to handle most DateTime variations without throwing an exception.
tags:
  - beginner
  - getting-started
---

# Handle uncommon or variable date patterns

There are almost infinite ways to represent a date as a string.

For example:

```bash
2022-09-15
15-09-2022
1662984446
2022-09-12 14:10:48.324612
03/07/2022 6:10:08
2019-09-03T04:23:19.000Z
```

Some of these are well-known and ClickHouse can easily cast them into a `DateTime` type.


```sql
SELECT toDateTime(1662984446);

SELECT toDateTime(1662984446)

Query id: f06de0c3-1a0c-4c8a-82a2-a57d7ceafd4d

┌─toDateTime(1662984446)─┐
│    2022-09-12 14:07:26 │
└────────────────────────┘

1 row in set. Elapsed: 0.001 sec. 


SELECT toDateTime('1662984446');

SELECT toDateTime('1662984446')

Query id: e5269fdb-e64b-42fc-858c-b60c2ea9b1c0

┌─toDateTime('1662984446')─┐
│      2022-09-12 14:07:26 │
└──────────────────────────┘

1 row in set. Elapsed: 0.000 sec. 

SELECT toDateTime('2022-09-15');

SELECT toDateTime('2022-09-15')

Query id: 9d461f53-4a4d-46b4-8c86-f8f681953a92

┌─toDateTime('2022-09-15')─┐
│      2022-09-15 00:00:00 │
└──────────────────────────┘

1 row in set. Elapsed: 0.000 sec.
```

But this won't handle every single possible variation out there:

```sql
SELECT toDateTime('2022-09-12 14:10:48.324612');

SELECT toDateTime('2022-09-12 14:10:48.324612')

Query id: 4588a035-c83c-4234-bd00-bc223a2d1940


0 rows in set. Elapsed: 0.009 sec. 

Received exception:
Code: 6. DB::Exception: Cannot parse string '2022-09-12 14:10:48.324612' as DateTime: syntax error at position 19 (parsed just '2022-09-12 14:10:48'): While processing toDateTime('2022-09-12 14:10:48.324612'). (CANNOT_PARSE_TEXT)

SELECT toDateTime('2019-09-03T04:23:19.000Z');

SELECT toDateTime('2019-09-03T04:23:19.000Z')

Query id: 9c92f93f-e649-4543-b1b2-a501d5dcd0f0


0 rows in set. Elapsed: 0.000 sec. 

Received exception:
Code: 6. DB::Exception: Cannot parse string '2019-09-03T04:23:19.000Z' as DateTime: syntax error at position 19 (parsed just '2019-09-03T04:23:19'): While processing toDateTime('2019-09-03T04:23:19.000Z'). (CANNOT_PARSE_TEXT)
```

## Handling uncommon date patterns

ClickHouse has a function `parseDateTimeBestEffort` which can handle uncommon date patterns.

This function cannot handle every possible variation, but searches for a much wider range of date formats. It's worth noting that searching for these formats does have efficiency trade offs, so using a standard date format is preferred, but this function is perfect if you can't control the incoming date format.


```sql
SELECT parseDateTimeBestEffort('2022-09-12 14:10:48.324612');

SELECT parseDateTimeBestEffort('2022-09-12 14:10:48.324612')

Query id: 6db9117f-b8a9-4d4d-a32e-fb28a37118b6

┌─parseDateTimeBestEffort('2022-09-12 14:10:48.324612')─┐
│                                   2022-09-12 14:10:48 │
└───────────────────────────────────────────────────────┘

1 row in set. Elapsed: 0.000 sec. 

SELECT parseDateTimeBestEffort('2019-09-03T04:23:19.000Z');

SELECT parseDateTimeBestEffort('2019-09-03T04:23:19.000Z')

Query id: d22891df-dae8-414c-a2b3-8f76f0e98c88

┌─parseDateTimeBestEffort('2019-09-03T04:23:19.000Z')─┐
│                                 2019-09-03 06:23:19 │
└─────────────────────────────────────────────────────┘

1 row in set. Elapsed: 0.000 sec.
```