class Game {
  constructor({ containerDiv }) {
    this.containerDiv = containerDiv;
    this.board = null;
    this.ready = false;
  }

  startGame({ cols, rows, mineRatio }) {
    this.board = new Board(this.containerDiv, cols, rows, mineRatio, this);
    this.board.drawGrid();
    this.ready = true;
  }

  saveGame() {
    const boardState = this.board.getBoardState();
    window.localStorage.setItem('boardState', JSON.stringify(boardState));
    alert('Juego guardado!');
  }

  loadGame() {
    const savedState = window.localStorage.getItem('boardState');
    if (savedState) {
      this.board.cells = JSON.parse(savedState);
      this.board.drawGrid();
      alert('Juego cargado!');
    } else {
      alert('No hay juegos para cargar!');
    }
  }

  checkGameStatus(gameStatus) {
    switch (gameStatus) {
      case 'won':
        this.ready = false;
        alert('Ganaste!');
        break;

      case 'lost':
        this.ready = false;
        alert('Perdiste!');
        this.board.drawGrid(true);
        break;

      default:
        this.ready = true;
        break;
    }

  }
}