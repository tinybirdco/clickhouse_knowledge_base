---
id: monitor_clickhouse_threads
slug: /monitor-clickhouse-threads
title: Monitor ClickHouse threads
description: Can't get to the bottom of a performance issue with your ClickHouse server? Here's how to monitor ClickHouse threads to find performance killers.
tags: 
 - monitoring
 - advanced
---

# Monitor ClickHouse Threads
So your ClickHouse server isn't performing as well as you'd like it to. You've checked all the typical metrics and inspected the running queries, but you still can't get to the bottom of the performance issues.

Sometimes you need to go deeper and inspect what the ClickHouse threads are doing to be able to dig
into a particular performance degradation.

In these cases, a common strategy you might be tempted to use is to dump all the thread stacktraces with a tool like GDB. 

However, ClickHouse has some built-in introspection features that makes this much easier.

## Using introspection functions to monitoring threads
Here a oneliner that you can execute in a command terminal in the target machine:

```bash
    clickhouse client -mn <<<"SET allow_introspection_functions = 1; WITH arrayMap(x -> demangle(addressToSymbol(x)), trace) AS all SELECT thread_name, thread_id, query_id, arrayStringConcat(all, '\n') AS res FROM system.stack_trace format Vertical" > ch_stacks
```

This command will dump the state of all the ClickHouse threads into the ch_stacks file. 

As an added bonus, you can execute the command on multiple instances to compare their performance if you are investigating a degradation on a particular instance.
