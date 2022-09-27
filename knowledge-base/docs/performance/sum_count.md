---
id: sum_count
title: Optimise queries with Sum and Count
tags:
  - beginner
  - performance
---

# Optimise queries with Sum and Count

Imagine you want to both sum the values of `ColumnA` and count the number of rows at the same time.

You would normally write this like as follow:

```sql
SELECT sum(ColumnA), count(ColumnA) FROM my_table
```

However, traditionaly this is performed by calculating one value, and then the next, as separate operations - meaning twice the reads.

ClickHouse contains the function `sumCount` which optimises this query by calculating both values at the same time and returning a tuple with the results in the format `(sum, count)`.

```sql
SELECT sumCount(ColumnA) FROM my_table

┌─sumCount(x)─┐
│ (122,14)    │
└─────────────┘
```

## Enable automatic optimisation

You can enable automatic optimisation of queries that use both `sum()` and `count()` by using the flag `optimize_syntax_fuse_functions`.

## Check if automatic optimisation is enabled

To verify is automatic optimisation is enabled, you can use `EXPLAIN SYNTAX`.

```sql
EXPLAIN SYNTAX SELECT sum(ColumnA), count(ColumnA) FROM my_table
```