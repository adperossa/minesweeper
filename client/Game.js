class Game {
  constructor({ containerDiv }) {
    this.containerDiv = containerDiv;
    this.board = null;
    this.ready = false;
  }

  startGame({ cols, rows }) {
    this.board = new Board(this.containerDiv, cols, rows, this);
    this.board.drawGrid();
    this.ready = true;
  }

  saveGame() {
    const boardState = this.board.getBoardState();
    window.localStorage.setItem('boardState', JSON.stringify(boardState));
  }

  loadGame() {
    const savedState = window.localStorage.getItem('boardState');
    if (savedState) {
      this.board.cells = JSON.parse(savedState);
      this.board.drawGrid();
    } else {
      alert('No saved game to load!');
    }
  }

  checkGameStatus(gameStatus) {
    switch (gameStatus) {
      case 'won':
        this.ready = false;
        alert('You win!');
        break;

      case 'lost':
        this.ready = false;
        alert('You lose!');
        this.board.drawGrid(true);
        break;

      default:
        break;
    }

  }
}