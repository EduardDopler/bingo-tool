import { Board } from "./board";

export interface BoardSnapshot {
  values: string[];
  marked: boolean[];
}

/**
 * Manages an undo history stack of board snapshots.
 */
export class UndoManager {
  private stack: BoardSnapshot[] = [];

  /**
   * Pushes a snapshot of the current board's state onto the history stack.
   */
  public push(board: Board): void {
    this.stack.push({
      values: [...board.values],
      marked: [...board.marked],
    });
  }

  /**
   * Pops the top snapshot from the history stack.
   * Returns undefined if the stack is empty.
   */
  public pop(): BoardSnapshot | undefined {
    return this.stack.pop();
  }

  /**
   * Clears the undo history stack.
   */
  public clear(): void {
    this.stack = [];
  }

  /**
   * Returns true if there is at least one snapshot in the undo stack.
   */
  public canUndo(): boolean {
    return this.stack.length > 0;
  }
}
