import { describe, it, expect } from 'vitest';
import { Board } from '../core/board';
import { UndoManager } from '../core/undo';

describe('Undo Action Manager', () => {
  it('should initialize empty and report canUndo as false', () => {
    const undoManager = new UndoManager();
    expect(undoManager.canUndo()).toBe(false);
  });

  it('should push snapshots and pop them back, restoring board state', () => {
    const board = new Board('board-1', '2026-06-05');
    const undoManager = new UndoManager();

    // Take snapshot of initial state, then toggle mark
    undoManager.push(board);
    board.toggleMark(3);

    expect(undoManager.canUndo()).toBe(true);

    // Revert state
    const previousState = undoManager.pop();
    expect(previousState).toBeDefined();
    if (previousState) {
      board.values = [...previousState.values];
      board.marked = [...previousState.marked];
    }

    expect(board.marked[3]).toBe(false);
    expect(undoManager.canUndo()).toBe(false);
  });

  it('should handle edit mode sessions where multiple edits are reverted as one', () => {
    const board = new Board('board-1', '2026-06-05');
    const undoManager = new UndoManager();

    // 1. Entering Edit Mode - save session start snapshot
    const sessionStartSnapshot = board.clone();

    // 2. Perform edits
    board.setEditMode(true);
    board.updateCell(0, '10');
    board.updateCell(1, '20');
    board.updateCell(2, '30');
    board.setEditMode(false);

    // 3. Exiting Edit Mode - check if changes occurred and push session snapshot
    if (JSON.stringify(sessionStartSnapshot.values) !== JSON.stringify(board.values)) {
      undoManager.push(sessionStartSnapshot);
    }

    // Verify board values are modified
    expect(board.values[0]).toBe('10');
    expect(board.values[1]).toBe('20');
    expect(board.values[2]).toBe('30');
    expect(undoManager.canUndo()).toBe(true);

    // 4. Trigger Undo
    const reverted = undoManager.pop();
    expect(reverted).toBeDefined();
    if (reverted) {
      board.values = [...reverted.values];
      board.marked = [...reverted.marked];
    }

    // Verify all values reverted to empty strings
    expect(board.values[0]).toBe('');
    expect(board.values[1]).toBe('');
    expect(board.values[2]).toBe('');
  });

  it('should clear stack on command', () => {
    const board = new Board('board-1', '2026-06-05');
    const undoManager = new UndoManager();
    undoManager.push(board);
    expect(undoManager.canUndo()).toBe(true);
    undoManager.clear();
    expect(undoManager.canUndo()).toBe(false);
  });
});
