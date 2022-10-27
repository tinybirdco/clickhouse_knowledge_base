---
slug: /low-cardinality
id: low_cardinality
title: Use LowCardinality
description: ClickHouse LowCardinality types can improve the speed of your queries. Here is how and when to use LowCardinality to optimize column storage for faster queries.
tags:
  - intermediate
  - performance
---

# Use LowCardinality

The fewer bytes you read from disk, the faster your query.

If your column contains a limited set of repeated values (otherwise known as low cardinality, or low unique-ness) you can optimize the storage of the value of this column by using the `LowCardinality` type.

The `LowCardinality` type encapsulates other data types, creating a dictionary of possible column values. Rather than storing the raw value many, many times, instead, the column value is a key that points to the raw value in a dictionary.

For example, if you had `ColumnA` with 5 possible unique values:

```bash Unique values
'Possible String Value 1'
'Possible String Value 2'
'Possible String Value 3'
'Possible String Value 4'
'Possible String Value 5'
```

Your table may contain 1 million rows, and 300,000 rows have the value `'Possible String Value 1'` for `ColumnA`. If you use a standard `STRING` type, you will store the entire value `'Possible String Value 1'` 300,000 times, which uses 25 bytes each time, for a total of 7.5 megabytes.

To optimize, you can set the column type to `LowCardinality`. Every unique value will be stored once, in a dictionary table, for example:

```bash Unique values dictionary
1: 'Possible String Value 1'
2: 'Possible String Value 2'
3: 'Possible String Value 3'
4: 'Possible String Value 4'
5: 'Possible String Value 5'
```

Now, rather than each of the 300,000 rows storing `'Possible String Value 1'` for `ColumnA`, instead, each of these rows stores the key `1`. When selecting `ColumnA`, you would retrieve the value for key `1` from the dictionary of values. Storing `1` as a 4 byte integer, 300,000 times, would result in a total of 1.2 megabytes, or a 6.25x reduction in bytes.

Here's an example:

```sql
DROP DATABASE IF EXISTS lc;
CREATE DATABASE lc;

CREATE TABLE lc.base
ENGINE = MergeTree
ORDER BY (n1, s1) AS
SELECT
    number n1,
    [
        'The tattered work gloves speak of the many hours of hard labor he endured throughout his life.',
        'The glacier came alive as the climbers hiked closer.',
        'Nancy was proud that she ran a tight shipwreck.',
        'The ants enjoyed the barbecue more than the family.',
        'The bug was having an excellent day until he hit the windshield.'
    ][(rand() % 5) + 1] s1
FROM numbers(2000000);

CREATE TABLE lc.lowcard
ENGINE = MergeTree
ORDER BY (n1, s1) AS
SELECT
    n1,
    toLowCardinality(s1) s1
FROM lc.base;

select formatReadableSize(sum(bytes_on_disk)), count() from system.parts WHERE table = 'base' and active FORMAT PrettyCompact;
select formatReadableSize(sum(bytes_on_disk)), count() from system.parts WHERE table = 'lowcard' and active FORMAT PrettyCompact;
```

You can already see that the table using the LowCardinality column requires less disk space.
You can confirm this by doing a query and checking the statistics returned by ClickHouse.

```sql
localhost :) SELECT * FROM lc.base WHERE n1 = 10 ;

┌─n1─┬─s1───────────────────────────────────────────────────┐
│ 10 │ The glacier came alive as the climbers hiked closer. │
└────┴──────────────────────────────────────────────────────┘

1 rows in set. Elapsed: 0.006 sec. Processed 8.19 thousand rows, 646.57 KB (1.39 million rows/s., 110.00 MB/s.)

localhost :) SELECT * FROM lc.lowcard WHERE n1 = 10 ;

┌─n1─┬─s1───────────────────────────────────────────────────┐
│ 10 │ The glacier came alive as the climbers hiked closer. │
└────┴──────────────────────────────────────────────────────┘

1 rows in set. Elapsed: 0.004 sec. Processed 8.19 thousand rows, 74.09 KB (1.83 million rows/s., 16.51 MB/s.)
```

As expected, both queries are reading the same number of rows but the one not using LowCardinality is reading almost 9 times more data!