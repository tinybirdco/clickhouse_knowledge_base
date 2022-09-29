---
id: test_clickhouse_arm
title: Testing ClickHouse on ARM
description: 
tags:
  - intermediate
  - random
---

# Testing ClickHouse on ARM

Sometimes you need to investigate bugs on architectures that you don't have readily available. For example, you might only have x86 machines, but need to test on ARM. You can get an ARM instance through most cloud providers, but you might not want to incur the cost.

We can use QEMU to emulate an ARM machine, and use that to run our ClickHouse build. Just be aware, performance won't be quite as good as a native ARM machine.

```bash
qemu-aarch64-static -L /mnt/ch/ClickHouse/contrib/sysroot/linux-aarch64/aarch64-linux-gnu/libc/ /tmp/clickhouse server
```

Here `/mnt/ch/ClickHouse/` is the path to the ClickHouse repository, and `/tmp/clickhouse` points at our compiled ClickHouse binary.