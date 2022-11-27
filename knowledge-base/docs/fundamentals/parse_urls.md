---
slug: /parse-urls
id: parse_urls
title: Parse URLs
description: ClickHouse has built-in functions to work with URLs that help you avoid writing custom Regex
tags:
  - beginner
  - getting-started
---

# Parse URLs

ClickHouse was originally created by a web company, so you shouldn't be surprised to find that it contains many [functions to help you work with URLs](https://clickhouse.com/docs/en/sql-reference/functions/url-functions/).

## Get the protocol

You can easily extract the protocol using the built-in function [`protocol()`](https://clickhouse.com/docs/en/sql-reference/functions/url-functions/#protocol).

For example:

```sql
select
    protocol(url) as protocol
from
    analytics_events


┌─protocol─┐
│ https    │
└──────────┘
```

## Get the domain

You can also extract the domain using the [`domain()`](https://clickhouse.com/docs/en/sql-reference/functions/url-functions/#domai) function.

```sql
select
    domain(url) as protocol
from
    analytics_events


┌─referrer_domain──┐
│ www.tinybird.co  │
└──────────────────┘
```

If you want to excude the `www` from the domain, use the [`domainWithoutWWW()](https://clickhouse.com/docs/en/sql-reference/functions/url-functions/#domainwithoutwww) function.

```
select
    domainWithoutWWW(url) as protocol
from
    analytics_events


┌─referrer_domain──┐
│ tinybird.co      │
└──────────────────┘
```

There's also a handful of functions for working with subdomains, such as:

- `firstSignificantSubdomain`
- `cutToFirstSignificantSubdomain`
- `cutToFirstSignificantSubdomainWithWWW`
- `cutToFirstSignificantSubdomainCustom`
- `cutToFirstSignificantSubdomainCustomWithWWW`
- `firstSignificantSubdomainCustom`

## Get URL query parameters

You might have experienced just how painful it can be to work with URL Query Parameters in other databases, but ClickHouse makes it easy with the [`extractURLParameter()`](https://clickhouse.com/docs/en/sql-reference/functions/url-functions/#extracturlparameterurl-name) function.

Imagine you have a URL like the following:

`https://tinybird.co/?utm_source=youtube&utm_medium=referral&utm_campaign=livessessions&utm_content=description`

You want to extract the [UTM parameters](https://en.wikipedia.org/wiki/UTM_parameters) to analyse your marketing campaigns. 

Here's how you can achieve that with ClickHouse:

```sql
select
    extractURLParameter(url, 'utm_source') as utm_source,
    extractURLParameter(url, 'utm_medium') as utm_medium,
    extractURLParameter(url, 'utm_campaign') as utm_campaign,
    extractURLParameter(url, 'utm_content') as utm_content
from
    analytics_events


┌─utm_source─┬─utm_medium─┬─utm_campaign──┬─utm_content──┐
│ youtube    │ referral   │ livessessions │  description │
└────────────────────────────────────────────────────────┘
```