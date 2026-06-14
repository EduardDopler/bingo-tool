---
id: US009
title: "History Menu & Renaming"
status: done
epic_id: E003
created: 2026-06-05 13:15
updated: 2026-06-05 13:21
---

# US009: History Menu & Renaming

As a user, I want a history panel or sidebar that allows me to switch between saved boards, rename boards, and delete boards.

## Acceptance Criteria

- [x] A history panel/sidebar list is displayed.
- [x] Clicking a board switches active view to that board.
- [x] Double clicking or clicking edit icon on a board item enables renaming.
- [x] A delete button on a board item deletes it from storage (asking for confirmation or deleting immediately, checking if it was the last board).
- [x] If the current board is deleted, switch active view to the next available board or create a new default one.

## Comments

- **2026-06-05 13:15**: Initial analysis. The history panel should animate smoothly. Deleting the last board should fall back to creating a new empty board.
- **2026-06-05 13:21**: Status set to `done`. Implemented full history list component with board-swapping click handlers, double-click inline input renaming, custom icons, confirmation dialogs for deletion, and default creation fallbacks.
