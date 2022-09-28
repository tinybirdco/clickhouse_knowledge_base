---
id: single_row_join
title: Optimize single row joins
description: Wondering how to optimize single row joins in ClickHouse? Use a CROSS JOIN to improve join efficiency in ClickHouse.
tags:
  - beginner
  - performance
---

# Optimize single row joins

Some use cases require that we select a single row, and join it with data from several other tables.

The natural first approach to implement this is to perform the individual queries, and then using a LEFT/RIGHT/INNER JOIN to merge the results.

You might end up with something like this:

```sql
SELECT 1 pk, n1, n2, n3, n4, n5, n6, u1, u2, u3, u4, u5, u6 FROM (
    SELECT 1 _pk, countMerge(n1) n1, uniqMerge(u1) u1 FROM srj.tableA t WHERE t.pk = 1
) LEFT JOIN (
    SELECT * FROM (SELECT 1 _pk, countMerge(n2) n2, uniqMerge(u2) u2 FROM srj.tableB t WHERE t.pk = 1)
    LEFT JOIN (
        SELECT * FROM (SELECT 1 _pk, countMerge(n3) n3, uniqMerge(u3) u3 FROM srj.tableC t WHERE t.pk = 1)
        LEFT JOIN (
            SELECT * FROM (SELECT 1 _pk, countMerge(n4) n4, uniqMerge(u4) u4 FROM srj.tableD t WHERE t.pk = 1)
            LEFT JOIN (
                SELECT * FROM (SELECT 1 _pk, countMerge(n5) n5, uniqMerge(u5) u5 FROM srj.tableE t WHERE t.pk = 1)
                LEFT JOIN (
                    SELECT 1 _pk, countMerge(n6) n6, uniqMerge(u6) u6 FROM srj.tableF t WHERE t.pk = 10000
                ) USING _pk
            ) USING _pk
        ) USING _pk
    ) USING _pk
) USING _pk
```

Using a CROSS JOIN in this case can create a cartesian product that is about 10% more efficient than the hash merge above.

Here's an example that uses an alternative syntax for a CROSS JOIN, supplying multiple data sources in the FROM clause.

```sql
SELECT 1 pk, n1, n2, n3, n4, n5, n6, u1, u2, u3, u4, u5, u6 FROM
(
    SELECT countMerge(n1) n1, uniqMerge(u1) u1 FROM srj.tableA t WHERE t.pk = 1
),
(
    SELECT countMerge(n2) n2, uniqMerge(u2) u2 FROM srj.tableB t WHERE t.pk = 1
),
(
    SELECT countMerge(n3) n3, uniqMerge(u3) u3 FROM srj.tableC t WHERE t.pk = 1
),
(
    SELECT countMerge(n4) n4, uniqMerge(u4) u4 FROM srj.tableD t WHERE t.pk = 1
),
(
    SELECT countMerge(n5) n5, uniqMerge(u5) u5 FROM srj.tableE t WHERE t.pk = 1
),
(
    SELECT countMerge(n6) n6, uniqMerge(u6) u6 FROM srj.tableF t WHERE t.pk = 10000
)
```