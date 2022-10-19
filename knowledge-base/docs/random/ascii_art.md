---
id: ascii_art
title: Create ASCII art
description: Ever wanted to create ASCII art from your database? If you're crazy enough to try it, here's how!
tags:
  - beginner
  - random
---

# Creating ASCII art

Ever wanted to create ASCII art from your database? Here's the magic!

```sql
    SELECT *
    FROM
    (
        SELECT msg AS `  Hello!   `
        FROM
        (
            SELECT *
            FROM
            (
                SELECT
                    0 AS or,
                    arrayStringConcat(tb, '') AS msg
                FROM
                (
                    WITH 20 AS N
                    SELECT
                        N - number AS y,
                        arrayMap(x -> if(x > 0, if(x > 2, 'X', '·'), ' '), arrayMap(x -> (if(abs((y - (N / 2)) - 1) > ((x / 3) * 0.4), -1, 3) + if((2 * ((x / 3) - 2)) < y, 0, if((0.8 * ((x / 3) - 2)) < y, if((4 * ((x / 3) - 10)) < y, 2, if(abs((y - (N / 2)) - 9) > (((N - (x / 3)) - 3) * 0.5), -4, 2)), -3))), range(N * 3))) AS tb
                    FROM numbers(20)
                ) AS bird
                UNION ALL
                SELECT
                    1 AS or,
                    arrayJoin(arrayMap(x -> replace(CAST(concat(' ', x), 'FixedString(60)'), '\0', ' '), ['', 'We look at birds as creatures that', 'do amazing things that we cannot.', '', 'They can go (almost) anywhere by flying', 'while apparently enjoying the journey a lot', '', 'And when in a flock, they seem to enjoy it even more.', '', '-----', 'Tinybird founding team', 'https://tinybird.co', ''])) AS msg
            ) AS bird_and_text
            ORDER BY or ASC
        )
    ) AS hello_generic
    FORMAT CSV


    "                                    ··········              "
    "                                   ·················        "
    "                                 ·············              "
    "                                ···········                 "
    "                              ········XXXX                  "
    "                             ·XXXXXXXXXXXX                  "
    "                       XXXXXXXXXXXXXXXXXX                   "
    "               XXXXXXXXXXXXXXXXXXXXXXXXX                    "
    "        XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX                     "
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX                     "
    "        XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX                      "
    "               XXXXXXXXXXXXXXXXXXXXXX                       "
    "                  ·····XXXXXXXXXXXXX                        "
    "                 ·············XXX                           "
    "               ··············                               "
    "              ···········                                   "
    "            ·········                                       "
    "           ·······                                          "
    "         ·····                                              "
    "        ··                                                  "
    "                                                            "
    " We look at birds as creatures that                         "
    " do amazing things that we cannot.                          "
    "                                                            "
    " They can go (almost) anywhere by flying                    "
    " while apparently enjoying the journey a lot                "
    "                                                            "
    " And when in a flock, they seem to enjoy it even more.      "
    "                                                            "
    " -----                                                      "
    " Tinybird founding team                                     "
    " https://tinybird.co                                        "
    "                                                            "
```