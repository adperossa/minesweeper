class Cell {
  constructor(row, col, mineRatio) {
    this.row = row;
    this.col = col;
    this.id = `cell-${row}-${col}`;
    this.uncovered = false;
    this.hasBomb = this.defineBombStatus(mineRatio);
    this.flagged = false;
    this.adjacentBombCount = null;
  }

  defineBombStatus(mineRatio) {
    const rnd = Math.random();
    return rnd < (mineRatio / 100);
  }
}