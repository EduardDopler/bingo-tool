import { describe, it, expect } from "vitest";
import { Board } from "../core/board";

describe("Board Core Logic", () => {
  it("should initialize with default empty values, unmarked cells, and in play mode", () => {
    const board = new Board("test-id", "2026-06-05");
    expect(board.id).toBe("test-id");
    expect(board.name).toBe("2026-06-05");
    expect(board.values).toEqual(Array(25).fill(""));
    expect(board.marked).toEqual(Array(25).fill(false));
    expect(board.isEditMode).toBe(false);
    expect(board.getWinningIndices()).toEqual(new Set());
  });

  it("should toggle marked state in Play Mode", () => {
    const board = new Board("test-id", "2026-06-05");
    board.toggleMark(5);
    expect(board.marked[5]).toBe(true);
    board.toggleMark(5);
    expect(board.marked[5]).toBe(false);
  });

  it("should not toggle marked state in Edit Mode", () => {
    const board = new Board("test-id", "2026-06-05");
    board.setEditMode(true);
    board.toggleMark(5);
    expect(board.marked[5]).toBe(false);
  });

  it("should highlight a completed horizontal row in Play Mode", () => {
    const board = new Board("test-id", "2026-06-05");
    // Mark first row (indices 0, 1, 2, 3, 4)
    board.toggleMark(0);
    board.toggleMark(1);
    board.toggleMark(2);
    board.toggleMark(3);
    board.toggleMark(4);

    expect(board.getWinningIndices()).toEqual(new Set([0, 1, 2, 3, 4]));
  });

  it("should highlight a completed vertical column in Play Mode", () => {
    const board = new Board("test-id", "2026-06-05");
    // Mark second column (indices 1, 7, 13, 19, 25 is index 25-1 = 24? no, 1 + 5*k: 1, 6, 11, 16, 21)
    board.toggleMark(1);
    board.toggleMark(6);
    board.toggleMark(11);
    board.toggleMark(16);
    board.toggleMark(21);

    expect(board.getWinningIndices()).toEqual(new Set([1, 6, 11, 16, 21]));
  });

  it("should highlight completed diagonals in Play Mode", () => {
    const board = new Board("test-id", "2026-06-05");
    // Diagonal 1: 0, 6, 12, 18, 24
    board.toggleMark(0);
    board.toggleMark(6);
    board.toggleMark(12);
    board.toggleMark(18);
    board.toggleMark(24);

    expect(board.getWinningIndices()).toEqual(new Set([0, 6, 12, 18, 24]));
  });

  it("should clear winning highlights in Edit Mode and restore them on exit", () => {
    const board = new Board("test-id", "2026-06-05");
    // Mark first row
    for (let i = 0; i < 5; i++) board.toggleMark(i);
    expect(board.getWinningIndices().size).toBe(5);

    // Enter Edit Mode
    board.setEditMode(true);
    expect(board.getWinningIndices().size).toBe(0);

    // Exit Edit Mode
    board.setEditMode(false);
    expect(board.getWinningIndices().size).toBe(5);
  });

  it("should preserve marked state when modifying a cell number in Edit Mode", () => {
    const board = new Board("test-id", "2026-06-05");
    board.toggleMark(0);
    board.setEditMode(true);
    board.updateCell(0, "42");
    expect(board.values[0]).toBe("42");
    expect(board.marked[0]).toBe(true);
  });
});
