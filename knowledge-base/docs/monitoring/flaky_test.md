---
id: flaky_test
slug: /flaky-test
title: Check for flaky tests on ClickHouse CI
description: Are you contributing to ClickHouse? Here's how to know which tests are flaky when you submit a new PR.
tags: 
 - advanced
 - monitoring
---

# How do I know if a test is flaky on ClickHouse CI?

If you have ever contributed to ClickHouse you probably noticed how many tasks are run on every pull request. 

To improve bug detection, there are multiple kinds of tests which are run under multiple configurations (local vs s3), build options (multiple sanitizers), etc. This is great, but as tests can be executed many times, flaky tests are particularly painful. 

Luckily for us, ClickHouse publishes the results of all the runs, on a publicly available Clickhouse instance, so we can investigate the runs there and see if a test is flaky.

## Get all flaky tests from a public ClickHouse instance

You can go to https://play.clickhouse.com/play?user=play and PLAY:

```SQL
with 70 as test_name_limit
SELECT
identity(count(*) as fails) as "Fails",
identity(countIf(check_start_time > now() - interval 7 day) as recent) as "Recent",
max(check_start_time) as "Last",
argMax(check_name, check_start_time) "Check Name",
if(length(test_name) < test_name_limit, test_name, substr(test_name, 1, test_name_limit) || '...') "Test Name",
'<a href="' || argMax(report_url, check_start_time) || '">' || argMax(test_status, check_start_time)|| '</a>' "Link to Report"
FROM checks
WHERE
    check_start_time between now() - interval 30 day and now()
    AND check_status != 'success'
    AND test_status not in ('OK', 'SKIPPED', '')
    AND pull_request_number = 0
    AND check_name NOT LIKE '%SQLancer%'
    and check_name not like 'Yandex%'
    and check_name not like 'Testflow%'
-- It is important not to group all tests with empty test_name together,
-- such as AST Fuzzer and Performance.
group by if(test_name != '', test_name, check_name) as test_name
having recent > 0
order by recent desc, fails desc
```

```bash
№	Fails	Recent	Last	Check Name	Test Name	Link to Report
1	160       50  2022-09-22 16:54:28	Stress test (msan)	Hung check failed	<a href="https://s3.amazonaws.com/clickhouse-test-reports/0/2c83abaaba1d8dc48d9932f5e87b9d03b4be5617/stress_test__msan_.html">FLAKY</a>
2	155       49  2022-09-22 16:54:28	Stress test (msan)	Fatal message in clickhouse-server.log (see fatal_messages.txt)	<a href="https://s3.amazonaws.com/clickhouse-test-reports/0/2c83abaaba1d8dc48d9932f5e87b9d03b4be5617/stress_test__msan_.html">FLAKY</a>
3	43        43  2022-09-21 14:48:25	Integration tests (release) [1/2]	test_hive_query/test.py::test_text_count	<a href="https://s3.amazonaws.com/clickhouse-test-reports/0/d59880298868d84c5c6bc38753c9308db6b5db88/integration_tests__release__[1/2].html">FAIL</a>
```