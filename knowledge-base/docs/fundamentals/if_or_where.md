---
id: if_or_where
title: When to use -If vs WHERE
description: Wondering the difference between the -If combinator and the WHERE statement in ClickHouse? Here are some guidelines to help you choose between -If and WHERE in ClickHouse.
tags:
  - beginner
  - getting-started
---

# When to use -If or WHERE

In SQL, there are always multiple solutions to a problem and these solutions can have different performance characteristics.

In ClickHouse, many functions include an `-If` combinator that allows you to selectively run a function based on a condition. Because of this, you might ask whether you should use `WHERE` or an `-If` function.

The correct answer depends on your use case, and you should always experiment with different solutions, using the query statistics to measure the differences.

That said, here are some guidelines to follow.

## Use WHERE if you are using the same filter for several columns

Use:

```sql
SELECT
    avg(d1),
    avg(d2),
    avg(d3)
FROM table
WHERE date > (today() - toIntervalDay(7))
```

Not:

```sql
SELECT
    avgIf(d1, date > (today() - toIntervalDay(7))),
    avgIf(d2, date > (today() - toIntervalDay(7))),
    avgIf(d2, date > (today() - toIntervalDay(7)))
FROM table
```
## Use WHERE if the filter is part of an index

Use:

```sql
SELECT
    avg(d1)
FROM table
WHERE toYYYYMM(date) = '202002'
```
Not:

```sql
SELECT
    avgIf(d1, toYYYYMM(date) = '202002'),
FROM table
```
    
## Use the -If combinator if the WHERE does not filter out data

Use:

```sql
SELECT
    avgIf(d1, nonIndexedColumn == 10.0)
FROM table
```
Not:

```sql
SELECT
    avg(d1),
FROM table
WHERE nonIndexedColumn == 10.0
```