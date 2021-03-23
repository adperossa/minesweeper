'use strict';

const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');
const httpErrorHandler = require('@middy/http-error-handler');
const cors = require('@middy/http-cors');

const minesweeperEngine = async (event) => {

  let body = event.body;
  const {
    boardState,
    dimensions,
    action,
    cell
  } = body;

  let selectedCell = boardState[cell.row][cell.col];
  let newBoardState = null;
  let error = null;

  switch (action) {
    case 'flag':
      newBoardState = flagCell(selectedCell);
      break;

    case 'uncover':
      newBoardState = uncoverCell(selectedCell);
      break;

    default:
      error = 'Unknown action';
  }

  function flagCell(cell) {
    cell.flagged = !cell.flagged;
    return boardState;
  }

  function uncoverCell(cell) {
    cell.uncovered = true;

    const { adjacentBombCount, adjCellsArray } = checkAdjacentCells(cell);
    cell.adjacentBombCount = adjacentBombCount;
    if (adjacentBombCount === 0) {
      for (const cell of adjCellsArray) {
        if (!cell.uncovered) uncoverCell(cell);
      }
    }

    return boardState;
  }

  function checkAdjacentCells(cell) {
    const adjCellsArray = [];

    for (let newRow = cell.row - 1; newRow < cell.row + 2; newRow++) { // left-up, left, left-down
      if (
        (cell.col - 1) < 0 ||
        newRow < 0 ||
        newRow >= dimensions.rows
      ) continue;
      adjCellsArray.push(boardState[newRow][cell.col - 1]);
    }

    // up, down
    if (!((cell.row - 1) < 0)) adjCellsArray.push(boardState[cell.row - 1][cell.col]);
    if (!((cell.row + 1) >= dimensions.rows)) adjCellsArray.push(boardState[cell.row + 1][cell.col]);


    for (let newRow = cell.row - 1; newRow < cell.row + 2; newRow++) { // right-up, right, right-down
      if (
        (cell.col + 1) >= dimensions.cols ||
        newRow < 0 ||
        newRow >= dimensions.rows
      ) continue;
      adjCellsArray.push(boardState[newRow][cell.col + 1]);
    }

    const adjacentBombCount = adjCellsArray.reduce((count, cell) => cell.hasBomb ? count + 1 : count, 0);

    return { adjacentBombCount, adjCellsArray };
  }

  function checkGameStatus() {
    if (selectedCell.hasBomb && action === 'uncover') {
      return 'lost';
    } else {
      const unflaggedBombs = boardState.flat().filter(cell => cell.hasBomb && !cell.flagged);
      return unflaggedBombs.length === 0 ? 'won' : 'playing';
    }
  }

  let response = {
    statusCode: error ? 500 : 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      success: !error,
      error: error ? error : undefined,
      gameStatus: checkGameStatus(),
      newBoardState
    })
  };
  return response;
};

const handler = middy(minesweeperEngine)
  .use(httpErrorHandler())
  .use(jsonBodyParser())
  .use(cors())

module.exports = { handler };
