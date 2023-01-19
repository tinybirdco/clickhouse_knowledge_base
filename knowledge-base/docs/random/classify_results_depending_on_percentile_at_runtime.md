---
id: classify_results_by_percentile
slug: /classify-results-by-percentile
title: Classify results by percentile in ClickHouse at runtime
description: Have you ever wanted to classify results from a query by percentile? Here's how to do it at runtime in ClickHouse.
tags: 
 - random
 - intermediate
---

# How to classify results depending on percentiles at runtime?

If you want to classify each result row in a query based on percentile, you can combine arrayMap and arraySum to classify each row.

``` SQL
    WITH (
            SELECT quantiles(0.33, 0.66)(number)
            FROM numbers(10)
        ) AS cuts
    SELECT
        number,
        arraySum(arrayMap(x -> (x > number), cuts)) AS t,
        multiIf(t = 0, 'high', t = 1, 'med', t = 2, 'low', 'none') AS c
    FROM numbers(10)

    Query id: 71952567-ff29-4559-bacc-1d27d5fdacf9

    ┌─number─┬─t─┬─c────┐
    │      0 │ 2 │ low  │
    │      1 │ 2 │ low  │
    │      2 │ 2 │ low  │
    │      3 │ 1 │ med  │
    │      4 │ 1 │ med  │
    │      5 │ 1 │ med  │
    │      6 │ 0 │ high │
    │      7 │ 0 │ high │
    │      8 │ 0 │ high │
    │      9 │ 0 │ high │
    └────────┴───┴──────┘
```

You can set up a materialized view and pull the percentiles from it instead of computing them at runtime.
