---
id: US003
title: 'Grid Editing and Mode Selection'
status: done
epic_id: E002
created: 2026-06-05 13:15
updated: 2026-06-05 13:19
---

# US003: Grid Editing and Mode Selection

As a user, I want to toggle between Play and Edit mode and manually enter or modify grid cell numbers, so that I can set up and adjust my Bingo board.

## Acceptance Criteria

- [x] The grid is a fixed 5x5 matrix holding numbers.
- [x] Toggling Edit Mode allows keyboard entry for numbers in individual cells.
- [x] Modifying a cell's number preserves its marked status.
- [x] Entering Edit Mode clears any active Bingo line highlights.
- [x] Exiting Edit Mode triggers a re-evaluation of winning lines.

## Comments

- **2026-06-05 13:15**: Initial analysis. Edit Mode can be toggled by a primary/ghost style button. Focus styling should feature a Soft Gold neon underline.
- **2026-06-05 13:19**: Status set to `done`. Implemented `Board` class containing states, mode toggling, cell values editing, and cell-marking preservation. Added Unit tests confirming expected behavior.
