---
id: clickhouse_to_markdown
title: Export query results to Markdown table
description: Want to post your ClickHouse query results online? Here's how to export your ClickHouse query results to a Markdown table.
tags:
  - beginner
  - random
---

# Export query results to Markdown table

You might want to export the results of your query as a nicely formatted Markdown table.

For example, take the following query with the default output:

```sql
SELECT
    number AS number,
    now() AS date
FROM numbers(10)

┌─number─┬────────────────date─┐
│      0 │ 2022-09-22 08:38:59 │
│      1 │ 2022-09-22 08:38:59 │
│      2 │ 2022-09-22 08:38:59 │
│      3 │ 2022-09-22 08:38:59 │
│      4 │ 2022-09-22 08:38:59 │
│      5 │ 2022-09-22 08:38:59 │
│      6 │ 2022-09-22 08:38:59 │
│      7 │ 2022-09-22 08:38:59 │
│      8 │ 2022-09-22 08:38:59 │
│      9 │ 2022-09-22 08:38:59 │
└────────┴─────────────────────┘
```

ClickHouse supports a variety of alternative output formats, but you can use `FORMAT Template` to export data using your own custom format template.

First, you must create a table template, which is used to display the entire result set. Save this as `/tmp/rows.format`.

``` 
|number|date|
|---|---|
${data}
```

Next, create a row template, which is used to display each individual row of the result set. Save this as `/tmp/row.format`.

```
|${number:CSV}|${date:CSV}|
```

Finally, to export the results into a Markdown file using your templates, use the following query:

```sql
SELECT
    number AS number,
    now() AS date
FROM numbers(10) INTO OUTFILE '/tmp/tt.md'
FORMAT Template
SETTINGS
format_template_resultset = '/tmp/rows.format',
format_template_row = '/tmp/row.format',
format_template_rows_between_delimiter = '';
```

The contents of your output file will look like this:

```markdown
|number|date|
|---|---|
|0|"2022-09-22 08:47:52"|
|1|"2022-09-22 08:47:52"|
|2|"2022-09-22 08:47:52"|
|3|"2022-09-22 08:47:52"|
|4|"2022-09-22 08:47:52"|
|5|"2022-09-22 08:47:52"|
|6|"2022-09-22 08:47:52"|
|7|"2022-09-22 08:47:52"|
|8|"2022-09-22 08:47:52"|
|9|"2022-09-22 08:47:52"|
```