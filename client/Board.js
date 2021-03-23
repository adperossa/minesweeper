
class Board {
  constructor(containerDiv, cols, rows, game) {
    this.containerDiv = containerDiv;
    this.cols = cols;
    this.rows = rows;
    this.cells = this.createCells();
    this.game = game;
    this.allowedActions = ['uncover', 'flag'];
  }

  createCells() {
    const cellMatrix = [];
    for (let row = 0; row < this.cols; row++) {
      const column = [];

      for (let col = 0; col < this.rows; col++) {
        const newCell = new Cell(row, col);
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
    this.containerDiv.style.gridTemplateColumns = `repeat(${this.rows}, 1fr)`;

    //create the necessary divs and append them to the container
    for (const column of this.cells) {
      for (const cell of column) {
        const newDiv = document.createElement('div');
        newDiv.classList.add('grid-item');

        //set html attribute to avoid triggering the drag gesture (works so-so)
        newDiv.setAttribute('draggable', 'false');
        newDiv.setAttribute('id', cell.id);

        newDiv.style.width = `${size}px`;
        newDiv.style.height = `${size}px`;

        this.containerDiv.appendChild(newDiv);
        cell.element = newDiv;
        this.addCellListeners(cell);
        this.drawCellStyle(cell, shouldRevealBoard);
      }
    }
  }

  addCellListeners(cell) {
    cell.element.addEventListener('mouseup', (e) => {
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
    //if (cell.hasBomb && action === 'uncover') return this.showBomb(cell);

    let dimensions = { rows: this.rows, cols: this.cols };
    const response = await sendData(this.cells, dimensions, action, cell);
    this.cells = response.newBoardState;
    this.drawGrid();
    this.game.checkGameStatus(response.gameStatus);
  }

  drawCellStyle(cell, shouldRevealBoard) {
    if (cell.hasBomb && shouldRevealBoard) {
      cell.element.innerHTML = '';
      cell.element.style.backgroundColor = 'tomato';
    } else if (cell.flagged) {
      cell.element.innerText = 'F';
      cell.element.style.backgroundColor = 'darkgoldenrod';
    } else if (!cell.uncovered) {
      cell.element.innerText = '';
      cell.element.style.backgroundColor = 'lightgray';
    } else if (cell.hasBomb) {
      cell.element.innerHTML = '';
      cell.element.style.backgroundColor = 'tomato';
    } else {
      cell.element.style.backgroundColor = 'white';
      cell.element.innerText = cell.adjacentBombCount ? cell.adjacentBombCount : '';
    }
  }

  getBoardState() {
    return this.cells;
  }
}
