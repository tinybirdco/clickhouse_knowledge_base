---
id: aggr_intermediate_state
title: View the intermediate states of aggregations
description: ClickHouse stores intermediate aggregation states for materializations. Here's how to view intermediate states of aggregations and finalize aggregations.
tags:
  - intermediate
  - getting-started
---

# View the intermediate states of aggregations

Using aggregation functions with the `-State` modifier (e.g. `sumState`) result in intermediate states being stored in ClickHouse. These intermediate states generally cannot be read, as they are stored in a binary representation. Thus, to read the result, we must use the corresponding `-Merge` modifer when selecting the result (e.g. `sumMerge`).

For example:

```sql
SELECT
    number % 4 AS pk,
    avgState(number) AS avg_state
FROM numbers(2000)
GROUP BY pk

Query id: af1c69e7-b5d2-4063-9b8d-1ac08598fc79

┌─pk─┬─avg_state─┐
│  0 │ 8��         │
│  1 │ ,��         │
│  2 │  ��         │
│  3 │ ��          │
└────┴───────────┘
```

If you want to explore the intermediate states, perhaps without knowing what the original aggregation method was, you can instead use the `finalizeAggregation` function.

```sql
SELECT
    pk,
    finalizeAggregation(avg_state)
FROM
(
    SELECT
        number % 4 AS pk,
        avgState(number) AS avg_state
    FROM numbers(2000)
    GROUP BY pk
)

Query id: 7cf3a07f-f5d1-4ddd-891f-a89bb304b227

┌─pk─┬─finalizeAggregation(avg_state)─┐
│  0 │                            998 │
│  1 │                            999 │
│  2 │                           1000 │
│  3 │                           1001 │
└────┴────────────────────────────────┘
```