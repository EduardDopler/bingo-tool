---
id: US008
title: 'Board Lifecycle Management'
status: done
epic_id: E003
created: 2026-06-05 13:15
updated: 2026-06-05 13:21
---

# US008: Board Lifecycle Management

As a user, I want to create new boards with date-based names (e.g. YYYY-MM-DD (2)), and have untouched/empty boards automatically discarded, so that my board history remains organized.

## Acceptance Criteria

- [x] A "New" button creates a blank board.
- [x] Default name is current date `YYYY-MM-DD`.
- [x] If a board with that date already exists, append a sequence number: `YYYY-MM-DD (2)`.
- [x] If a board is untouched (all cells empty) and the user switches to another board or reloads, it is discarded from storage.

## Comments

- **2026-06-05 13:15**: Initial analysis. We must detect if a board is completely untouched (i.e. contains no values and no marks) when navigating away.
- **2026-06-05 13:21**: Status set to `done`. Added date-naming generators with collision checks and automatic removal of untouched/empty boards during selection changes, creations, and startup.
