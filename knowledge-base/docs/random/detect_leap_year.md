---
slug: /detect-leap-year
id: detect_leap_year
title: Detect leap years
description: Need to detect leap years in ClickHouse? Here's a query to find years that contain 366 days instead of 365.
tags:
  - beginner
  - random
---

# Detec leap years

A leap year is a year that contains 366 days instead of 365 days, with the extra day occuring on February 29th (rather than February ending on the 28th), and happens every 4 years. They can be really annoying for date math! 

So, how can you detect whether a year is a leap year? 

Quite easily actually; ClickHouse contains a function `toLastDayOfMonth` which, as you might have guessed, takes an input Date, and returns a Date representing the last day of the given month. So, to find a leap year, simply ask for the last day of February for a given year, and if the returned day is the 29th, you know it is a leap year!

```sql
SELECT toLastDayOfMonth(makeDate(2020, 2, 1))

┌─toLastDayOfMonth(makeDate(2020, 2, 1))─┐
│                             2020-02-29 │
└────────────────────────────────────────┘
```