---
id: if_or_where
title: If or WHERE?
tags:
  - beginner
  - getting-started
---

# If or WHERE?

In SQL, there are always multiple solutions to a problem and these solutions can have different performance characteristics.

In ClickHouse, many functions include an `-If` combinator, that allows you to selectively run a function based on a condition. This can sometimes lead to the questions, should I use `WHERE` or an `-If` function?

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