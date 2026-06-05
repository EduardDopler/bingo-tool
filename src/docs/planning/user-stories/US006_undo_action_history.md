---
id: US006
title: 'Undo Action History'
status: done
epic_id: E002
created: 2026-06-05 13:15
updated: 2026-06-05 13:20
---

# US006: Undo Action History

As a user, I want to click an Undo button to revert markings in Play Mode or batch edits from an Edit Mode session, so that I can correct mistakes.

## Acceptance Criteria

- [x] An Undo button exists in the main interface.
- [x] Reverts individual marking/unmarking in Play Mode.
- [x] Reverts all value changes made during an Edit Mode session as a single combined action.
- [x] Changing boards or reloading clears the undo stack.
- [x] Redo is not supported.
- [x] Creation, renaming, deletion are not part of the undo stack.

## Comments

- **2026-06-05 13:15**: Initial analysis. We need to save board snapshot before entering Edit Mode, and push it to the undo stack upon exit if there are any changes.
- **2026-06-05 13:20**: Status set to `in-progress`. Initiating the undo core history manager. Let's write unit tests for the undo capability.
- **2026-06-05 13:20**: Status set to `done`. Developed the `UndoManager` in `src/core/undo.ts` that stores deep board snapshots. Added unit tests for tracking state change snapshots and edit sessions.
