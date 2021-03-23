
class Board {
  constructor(containerDiv, cols, rows, mineRatio, game) {
    this.containerDiv = containerDiv;
    this.cols = cols;
    this.rows = rows;
    this.cells = this.createCells(mineRatio);
    this.game = game;
    this.allowedActions = ['uncover', 'flag'];
  }

  createCells(mineRatio) {
    const cellMatrix = [];
    for (let row = 0; row < this.cols; row++) {
      const column = [];

      for (let col = 0; col < this.rows; col++) {
        const newCell = new Cell(row, col, mineRatio);
        column.push(newCell);
      }

      cellMatrix.push(column);
    }

    return cellMatrix;
  }

  drawGrid(shouldRevealBoard = false) {
    let size = 20;

    //set the grid style and empty the container from possible old grid
    this.containerDiv.innerHTML = "";
    this.containerDiv.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;

    //create the necessary divs and append them to the container
    for (const column of this.cells) {
      for (const cell of column) {
        //const newDiv = document.createElement('div');
        const newDiv = document.createElement('button');
        newDiv.classList.add('grid-item', 'btn', 'btn-primary');

        //set html attribute to avoid triggering the drag gesture (works so-so)
        newDiv.setAttribute('draggable', 'false');
        newDiv.setAttribute('id', cell.id);

        newDiv.style.width = `${size}px`;
        newDiv.style.height = `${size}px`;

        this.containerDiv.appendChild(newDiv);
        this.addCellListeners(cell);
        this.drawCellStyle(cell, shouldRevealBoard);
      }
    }
  }

  addCellListeners(cell) {
    const cellElement = document.getElementById(cell.id);
    cellElement.addEventListener('mouseup', (e) => {
      e.preventDefault();
      if (!this.game.ready || cell.uncovered) return false;
      let userAction;

      switch (e.button) {
        case 0:
          userAction = 'uncover';
          break;

        case 2:
          userAction = 'flag';
          break;

        default:
          userAction = 'unknown';
          break;
      }

      if (!this.allowedActions.includes(userAction)) {
        return alert('Unrecognized user action');
      }

      this.handleUserAction(userAction, cell);
    });
  }

  async handleUserAction(action, cell) {

    try {
      this.game.ready = false;
      let dimensions = { rows: this.rows, cols: this.cols };
      const response = await sendData(this.cells, dimensions, action, cell);
      this.cells = response.newBoardState;
      this.drawGrid();
      this.game.checkGameStatus(response.gameStatus);
    } catch(err) {
      alert('Ocurrió un error :( intente nuevamente.');
      console.error(err);
    }

  }

  drawCellStyle(cell, shouldRevealBoard) {
    const cellElement = document.getElementById(cell.id);
    if (cell.hasBomb && shouldRevealBoard) {
      cellElement.innerHTML = '';
      cellElement.style.backgroundColor = 'tomato';
    } else if (cell.flagged) {
      cellElement.innerText = '🚩';
      cellElement.style.backgroundColor = 'lightgray';
    } else if (!cell.uncovered) {
      cellElement.innerText = '';
      cellElement.style.backgroundColor = 'lightgray';
    } else if (cell.hasBomb) {
      cellElement.innerHTML = '';
      cellElement.style.backgroundColor = 'tomato';
    } else {
      cellElement.style.backgroundColor = 'white';
      cellElement.innerText = cell.adjacentBombCount ? cell.adjacentBombCount : '';
    }
  }

  getBoardState() {
    return this.cells;
  }
}
