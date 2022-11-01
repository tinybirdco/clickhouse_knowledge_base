---
slug: subtract-datetime64
id: subtract_datetime64
title: Subtract two DateTime64 values
description: Working with datetimes in ClickHouse? Here's how to subtract values from two DateTime64 columns in a ClickHouse table without getting an error.
tags:
  - beginner
  - getting-started
---

# Subtract two DateTime64 Values

If you try to substract values from two DateTime64(3) columns using the minus function you will get an error:

```sql
SELECT CAST('2022-09-23 10:41:47.546', 'DateTime64(3)') - CAST('2022-08-19 14:21:22.123', 'DateTime64(3)')

[Error] Illegal types DateTime64(3) and DateTime64(3) of arguments of function minus: While processing CAST('2022-09-23 10:41:47.546', 'DateTime64(3)') - CAST('2022-08-19 14:21:22.123', 'DateTime64(3)'). (ILLEGAL_TYPE_OF_ARGUMENT)
```

You can workaround this limitation by casting the columns to the equivalent Decimal type (`Decimal64(3)` in this case):

```sql
SELECT
  CAST(
      CAST(CAST('2022-09-23 10:41:47.546', 'DateTime64(3)'), 'Decimal64(3)')
      - 
      CAST(CAST('2022-08-19 14:21:22.123', 'DateTime64(3)'), 'Decimal64(3)'),
      'DateTime64(3)'
  ) AS adate

Query id: da74bd51-43eb-4efc-8088-dc32fd971bf7

┌─adate───────────────────┐
│ 1970-02-04 21:20:25.423 │ 
└─────────────────────────┘

1 row in set. Elapsed: 0.008 sec.
```