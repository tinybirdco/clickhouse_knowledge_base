---
slug: /parse-json-array
id: parse_json_array
title: Parse an array of JSON objects
description: ClickHouse has functions to extract data from JSON strings, but what if you want to parse an array of JSON objects? Here's how.
tags:
  - intermediate
  - getting-started
---

# Parse an array of JSON objects

While ClickHouse has some functions to extract data from JSON strings, parsing an array of JSON objects needs an additional step to iterate over each object in the array.

You can achieve this using the `arrayJoin` and `JSONExtractArrayRaw` functions.

For example:

```sql
WITH arrayJoin(JSONExtractArrayRaw('[{"a": 1, "b": "bla"}, {"a": 2, "b": "blo"}]')) AS rows
SELECT
    JSONExtract(rows, 'a', 'Int32') AS a,
    JSONExtract(rows, 'b', 'String') AS b

Query id: 1eb8c6cd-ab16-4ad1-a349-cef0d5a27245

┌─a─┬─b───┐
│ 1 │ bla │
│ 2 │ blo │
└───┴─────┘
```