---
id: group_by_performance
slug: /group_by_performance
title: How the order of GROUP BY in ClickHouse affects performance
description: Does the order of your GROUP BY in ClickHouse affect query performance? Read this to learn why GROUP BY order matters.
tags: 
 - beginner
 - performance
---

# Does the order of the columns in the group by affect the performance?

The short answer: Yes.

It's not always as obvious as the order of the columns in a sorting key, but as `GROUP BY` is a heavy operation, you should always experiment with the `GROUP BY` to find the optimal order. Changing the order of the columns in your `GROUP BY` is pretty easy, and can be surprisingly effective!