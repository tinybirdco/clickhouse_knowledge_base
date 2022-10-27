---
slug: /faster-joins
id: faster_joins
title: Make joins faster by moving your filter
description: Want to speed up your joins in ClickHouse? Here is a smart approach to improving ClickHouse join speed by applying your filters earlier in a subquery.
tags:
  - beginner
  - performance
---

# Make joins faster by moving your filter

The key to making your joins faster in ClickHouse is to apply your filter as soon as possible.

For example, take the following query, which applies a LEFT JOIN with a WHERE clause.

```sql
SELECT 
    purchase_id,
    client_id,
    article_id,
    a.article_price,
    a.article_description
FROM sales 
ANY LEFT JOIN articles a using article_id
WHERE a.color='red'
```

You can improve the performance of this query by applying the filter earlier in the subquery.

```sql
SELECT 
    purchase_id,
    client_id,
    article_id,
    a.article_price,
    a.article_description
FROM sales 
ANY LEFT JOIN (
    SELECT
        article_price,
        article_description
    FROM articles
    WHERE color='red'
)
```