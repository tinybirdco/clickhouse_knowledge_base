---
id: http_sessions
title: Client sessions over HTTP
description: 
tags:
  - beginner
  - getting-started
---

# Client sessions over HTTP

Launching the ClickHouse client automatically creates a persistent session for you to send consecutive queries. But how do you do this when using the ClickHouse HTTP endpoint? 

The HTTP endpoint accepts a query parameter called `session_id`. The value of this parameter can be anything, it is up to you to pick a unique String as the value to use as your session ID. So you might pick something like `session_id=this_is_my_super_unique_session_id`, just try to pick something that won't clash with anyone else's session ID.

```bash
$ echo "SET max_execution_time=0.5" | curl 'http://localhost:8123/?session_id=this_is_my_super_unique_session_id&session_timeout=600' --data-binary @-
```

To submit another query to the same session, just include the same `session_id` in the next call.

```bash
$ echo "Select max(number) from system.numbers" | curl 'http://localhost:8123/?session_id=this_is_my_super_unique_session_id' --data-binary @-
```

It can also be good practice to add `session_check=1` as an option to subsequent calls. This checks that the session exists, and returns an error if it does not. This is useful as sessions can be killed by timeouts or server restarts, and you might want to know if session settings have been lost.

```bash
$ echo "Select max(number) from system.numbers" | curl 'http://localhost:8123/?session_id=this_is_my_super_unique_session_id&session_check=1' --data-binary @-

Code: 159. DB::Exception: Timeout exceeded: elapsed 0.500299438 seconds, maximum: 0.5. (TIMEOUT_EXCEEDED) (version 22.10.1.1)
```
