---
slug: /integer-overflows
id: integer_overflows
title: Handle integer overflows
description: ClickHouse doesn't perform overflow checks when casting between integer types. Here's how to handle integer overflows in ClickHouse with accurateCast.
tags:
  - beginner
  - getting-started
---

# Handle integer overflows

By default, ClickHouse does not perform overflow checks when casting between integer types.

```sql
SELECT 300::Int8;

SELECT CAST('300', 'Int8')

Query id: 31b30fe5-b0c4-4d67-8836-803bc665ed46

┌─CAST('300', 'Int8')─┐
│                  44 │
└─────────────────────┘

1 row in set. Elapsed: 0.001 sec.

SELECT cast(-10, 'UInt64');

SELECT CAST(-10, 'UInt64')

Query id: ca8d0576-0946-4506-b021-1daa171e3357

┌──CAST(-10, 'UInt64')─┐
│ 18446744073709551606 │
└──────────────────────┘

1 row in set. Elapsed: 0.000 sec.
```

Although people with knowledge of the underlying architecture might understand this behavior, it might not be desirable in many cases. If you would rather get an exception you can use the `accurateCast` function.

```sql
SELECT accurateCast(100, 'Int8');

SELECT accurateCast(100, 'Int8')

Query id: 865bc0b7-4ac4-472a-8819-985ebbd29490

┌─accurateCast(100, 'Int8')─┐
│                       100 │
└───────────────────────────┘

1 row in set. Elapsed: 0.001 sec. 


SELECT accurateCast(300, 'Int8');

SELECT accurateCast(300, 'Int8')

Query id: 0484ef62-c67d-49a3-9c49-2d4fa432653e


0 rows in set. Elapsed: 0.001 sec. 

Received exception:
Code: 70. DB::Exception: Value in column UInt16 cannot be safely converted into type Int8: While processing accurateCast(300, 'Int8'). (CANNOT_CONVERT_TYPE)
```
