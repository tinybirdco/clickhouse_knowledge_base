---
id: parse_complex_emojis
slug: /parse_complex_emojis
title: Parse complex emojis with tokens()
description: Sometimes you need to parse complex emojis in your ClickHouse queries. Here's how to do that with the ClickHouse tokens() function.
tags: 
 - random
 - beginner
---

# Parse complex emojis with the ``tokens()`` function

Every emoji has a Unicode representation. But did you know that some emojis are actually Unicode combinations of other emojis? Check [this](https://unicode.org/emoji/charts/emoji-zwj-sequences.html) out if you're interested.

Of course, this can create problems when you're processing text in ClickHouse.

Fortunately, you can use the ``tokens()`` function to extract words from text in ClickHouse while preserving combined emojis. This works even where a regex would fail:

```SQL
    WITH 'this is a test. And you know what that means! ❤️ 🤯 👨‍👨‍👧‍👦 #whatever @text' AS text
    SELECT
        extractAll(text, '[\\p{L}\\p{N}\\p{S}]+') AS words,
        tokens(text) AS tokens
    FORMAT Vertical

    Query id: 9e40796f-698b-44d4-ac2c-33a9b7eb511b

    Row 1:
    ──────
    words:  ['this','is','a','test','And','you','know','what','that','means','❤','🤯','👨','👨','👧','👦','whatever','text']
    tokens: ['this','is','a','test','And','you','know','what','that','means','❤️','🤯','👨‍👨‍👧‍👦','whatever','text']

    1 row in set. Elapsed: 0.006 sec.
```