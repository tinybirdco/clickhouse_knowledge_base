---
id: detect_memory_leaks_with_jemalloc
slug: /detect-memory-leaks-with-jemalloc
title: Detect ClickHouse memory leaks with jemalloc
description: Trying to detect memory leaks in ClickHouse with Valgrind? Here's why and how to use jemalloc instead.
tags: 
 - advanced
 - monitoring
---

# Detect ClickHouse memory leaks with jemalloc

By default, ClickHouse uses the [jemalloc](http://jemalloc.net) allocator. When you're trying to identify where a memory leak might be within ClickHouse, you might think that [Valgrind's memcheck](https://valgrind.org/docs/manual/mc-manual.html) or even [Valgrind's massif](https://valgrind.org/docs/manual/ms-manual.html) might be the right tools. 

However, they require that you compile ClickHouse disabling jemalloc. That is, using `-DENABLE_JEMALLOC=0`. The reasoning is that Valgrind tools require the
use of glibc's allocator to work properly. Also, using Valgrind significantly slows down the execution at runtime, usually by a factor of 100x.

On the other hand, jemalloc already provides an extensive set of tools for profiling purposes. Among other things, it lets you get a nice report after the application shuts down with information about where unfreed memory has been
allocated. That is, it allows you to [detect memory leaks](https://github.com/jemalloc/jemalloc/wiki/Use-Case%3A-Leak-Checking). This is done by setting the `MALLOC_CONF` environment variable. Thus, you can use official deliveries for ClickHouse and run the following to collect a nice report:

```bash

   MALLOC_CONF=prof_leak:true,lg_prof_sample:0,prof_final:true /home/pablo/Tinybird/ch_versions/21.9.5.16/clickhouse server
   ...
   2022.09.23 14:44:36.032533 [ 548012 ] {} <Information> Application: shutting down
   2022.09.23 14:44:36.032851 [ 548072 ] {} <Information> BaseDaemon: Stop SignalListener thread
   <jemalloc>: Leak approximation summary: ~3636968 bytes, ~1669 objects, >= 1206 contexts
   <jemalloc>: Run jeprof on "jeprof.548012.0.f.heap" for leak detail
```

Then, you need to use the `jeprof` tool that is provided along with the `jemalloc` package to analyze the result. It can be used in an interactive way to analyze the report:

```bash

   jeprof --show_bytes /home/pablo/Tinybird/ch_versions/21.9.5.16/clickhouse jeprof.548012.0.f.heap
   Using local file /home/pablo/Tinybird/ch_versions/21.9.5.16/clickhouse.
   Using local file jeprof.548012.0.f.heap.
   Welcome to jeprof!  For help, type 'help'.
   (jeprof) top
   Total: 3636968 B
   3216152  88.4%  88.4%  3216152  88.4% malloc_default
   143360   3.9%  92.4%   143360   3.9% DB::DataTypeCustomSimpleAggregateFunction::DataTypeCustomSimpleAggregateFunction
   143360   3.9%  96.3%   143360   3.9% DB::IAggregateFunction::IAggregateFunction
   51696   1.4%  97.7%    80592   2.2% LLVMParseCommandLineOptions
   47424   1.3%  99.0%    47424   1.3% __libc_calloc
       9552   0.3%  99.3%    26960   0.7% llvm::PassRegistry::registerPass
       8192   0.2%  99.5%     8224   0.2% llvm::legacy::PassManagerBase::~PassManagerBase
       4640   0.1%  99.7%    22304   0.6% std::__1::__tree::__emplace_hint_unique_key_args
       4352   0.1%  99.8%     8928   0.2% std::__1::__tree::__emplace_unique_key_args
       2784   0.1%  99.8%     2784   0.1% __libc_realloc
```

Or even better, you can generate a graph with all allocations:

```bash

   jeprof --show_bytes /home/pablo/Tinybird/ch_versions/21.9.5.16/clickhouse jeprof.548012.0.f.heap --pdf > memory_leak_report.pdf
```

![Memory leak report](./img/memory_leak_graph.svg)
