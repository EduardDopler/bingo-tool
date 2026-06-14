export class Board {
  public id: string;
  public name: string;
  public values: string[];
  public marked: boolean[];
  public isEditMode: boolean;

  private static WINNING_LINES = [
    // Rows
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    // Columns
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    // Diagonals
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20],
  ];

  constructor(
    id: string,
    name: string,
    values?: string[],
    marked?: boolean[],
    isEditMode: boolean = false,
  ) {
    this.id = id;
    this.name = name;
    this.values = values ? [...values] : Array(25).fill("");
    this.marked = marked ? [...marked] : Array(25).fill(false);
    this.isEditMode = isEditMode;
  }

  public toggleMark(index: number): void {
    if (this.isEditMode) return;
    if (index < 0 || index >= 25) return;
    this.marked[index] = !this.marked[index];
  }

  public setEditMode(edit: boolean): void {
    this.isEditMode = edit;
  }

  public updateCell(index: number, val: string): void {
    if (index < 0 || index >= 25) return;
    this.values[index] = val;
  }

  public getWinningIndices(): Set<number> {
    const winning = new Set<number>();
    if (this.isEditMode) {
      return winning;
    }

    for (const line of Board.WINNING_LINES) {
      const isComplete = line.every((idx) => this.marked[idx]);
      if (isComplete) {
        line.forEach((idx) => winning.add(idx));
      }
    }

    return winning;
  }

  public clone(): Board {
    return new Board(
      this.id,
      this.name,
      [...this.values],
      [...this.marked],
      this.isEditMode,
    );
  }
}
