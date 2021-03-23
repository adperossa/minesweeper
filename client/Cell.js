class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.id = `cell-${row}-${col}`;
    this.element = null;
    this.uncovered = false;
    this.hasBomb = this.defineBombStatus();
    this.flagged = false;
    this.adjacentBombCount = null;
  }

  defineBombStatus() {
    const rnd = Math.random();
    return rnd < 0.15;
  }
}