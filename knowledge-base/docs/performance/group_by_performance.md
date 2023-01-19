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

Yes. Although it is not as crystal-clear as the order of the columns in a sorting key, as a `GROUP BY` is a heavy operation, you should always try to improve the performance.

Plus, changing the order of the columns in your `GROUP BY` is an easy and sometimes effective way to do so. 

Experiement with the order of columns in your `GROUP BY` clause to find the most performant query.
