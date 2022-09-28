---
id: filter_with_prewhere
title: Filter with PREWHERE
description: Wondering when to use PREWHERE in ClickHouse? Here's how to optimize filtering with PREWHERE and minimize scan size in ClickHouse.
tags:
  - beginner
  - performance
---

# Filter with PREWHERE

ClickHouse has a `PREWHERE` statement, which optimizes filtering; you can read more about it [here](https://clickhouse.com/docs/en/sql-reference/statements/select/prewhere/).

In summary, the `PREWHERE` condition only reads the columns that are needed to assess the filter first, and then reads the additional columns after the filter is applied.

For example, if you have a query like this:

```sql
SELECT col1, col2, col3, col4, col5, col6 FROM table
WHERE col1 BETWEEN 1 AND 10
```

When running this query, ClickHouse will read all 6 columns, and then filter out the rows you don't want based only on col1.

You can optimize this by chaning the `WHERE` to a `PREWHERE`.

```sql
SELECT col1, col2, col3, col4, col5, col6 FROM table
PREWHERE col1 BETWEEN 1 AND 10
```

When running this query, ClickHouse will only read col1, and filter out all rows that don't meet the condition. After the filter is applied, ClickHouse then reads the remaining columns only for the rows that meet the filter criteria.

This can significantly reduce the amount of data that is read from disk when filtering on a smaller subset of columns.
