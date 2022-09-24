---
id: get_clickhouse_latest
title: Getting the latest ClickHouse build
tags:
  - beginner
  - performance
---

# Getting the latest ClickHouse build


ClickHouse development is pretty fast, with hundreds of on-going pull requests and many changes happening daily. If you don't want to build ClickHouse to get the latest changes from HEAD you can simply download the latest build with:


```bash
curl https://clickhouse.com/ | sh
```

Then you can follow the instructions to either simply execute the binary or install it in the system.

For example:

```bash
$ ./clickhouse local
ClickHouse local version 22.9.1.1702 (official build).

Mordor :) Select version();

SELECT version()

Query id: 26b5ae47-e866-4912-95dd-156990ff5420

┌─version()───┐
│ 22.9.1.1702 │
└─────────────┘

1 row in set. Elapsed: 0.001 sec. 

Mordor :) Bye.
```

This way you can test any new feature that hasn't been released yet to provide feedback, verify if bugs are already fixed and so on.
