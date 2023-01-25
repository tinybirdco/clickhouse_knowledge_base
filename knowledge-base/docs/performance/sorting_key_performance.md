---
id: sorting_key_performance
slug: /sorting-key-performance
title: How the order of ClickHouse sorting keys affect performance
description: Does the order of ClickHouse sorting keys affect performance? Read this to learn the answer.
tags: 
 - beginner
 - performance
---

# Does the order of the columns in the sorting key affect performance?

The short answer: Yes, a lot.

You can have very different results by simply changing the order of the columns in your sorting keys.

The rule of thumb is: sort the columns from smallest cardinality to largest.

For example, if the column 'type' may have 100 different values, the column 'color' could have 50 values and 'user_id' 1M different values, try:

```sql
ENGINE_SORTING_KEY color, type, user_id
```
