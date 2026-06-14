---
id: US004
title: "Pasted Text Parser & Warning Banner"
status: done
epic_id: E002
created: 2026-06-05 13:15
updated: 2026-06-05 13:20
---

# US004: Pasted Text Parser & Warning Banner

As a user, I want to paste raw text from my clipboard in Edit Mode to populate the board row-first, and see a warning banner if the text doesn't contain exactly 25 numbers.

## Acceptance Criteria

- [x] Text parser runs in Edit Mode when pasting.
- [x] Row-first sequential processing (left-to-right, top-to-bottom).
- [x] Any non-digit character behaves as a separator.
- [x] Negative values are silently converted to positive numbers.
- [x] Single digit values are zero-prepended (e.g. 7 -> "07").
- [x] If number count is != 25, a visual warning banner appears, filling up to capacity and leaving others blank or discarding overflows.

## Comments

- **2026-06-05 13:15**: Initial analysis. We must write tests covering spaces, tabs, commas, newlines, overflows, and underflows.
- **2026-06-05 13:19**: Status set to `in-progress`. Starting development of pasting logic. First step: write unit tests.
- **2026-06-05 13:20**: Status set to `done`. Implemented the `parseBingoInput` function in `src/core/parser.ts` using regular expression matching and sequential digit formatting. Verified all rules with comprehensive Vitest unit tests.
