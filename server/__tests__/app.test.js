const { handler } = require('../app');
const sampleBoard = require('./mockBoard.json');
const baseRequestBody = {
  boardState: sampleBoard,
  dimensions: { rows: 3, cols: 3 },
  cell: {
    "row": 0,
    "col": 0,
    "id": "cell-0-0",
    "uncovered": false,
    "hasBomb": true,
    "flagged": false,
    "adjacentBombCount": null
  }
}

test('lose game when uncovering bomb', async () => {
  const { statusCode, body: responseBody } = await handler({
    body: {
      ...baseRequestBody,
      action: 'uncover'
    }
  });

  const {
    success,
    error,
    gameStatus
  } = JSON.parse(responseBody);

  // Should return with no errors
  expect(statusCode).toBe(200);
  expect(success).toBe(true);
  expect(error).toBe(undefined);

  // Should return a won game state
  expect(gameStatus).toBe('lost');
});

test('win game when all bombs are flagged', async () => {
  const { statusCode, body: responseBody } = await handler({
    body: {
      ...baseRequestBody,
      action: 'flag'
    }
  });

  const {
    success,
    error,
    gameStatus
  } = JSON.parse(responseBody);

  // Should return with no errors
  expect(statusCode).toBe(200);
  expect(success).toBe(true);
  expect(error).toBe(undefined);

  // Should return a won game state
  expect(gameStatus).toBe('won');
});

test('return an error when receiving an unknown user action', async () => {
  const { statusCode, body: responseBody } = await handler({
    body: {
      ...baseRequestBody,
      action: 'explode'
    }
  });

  const {
    success,
    error,
    gameStatus
  } = JSON.parse(responseBody);

  // Should return with no errors
  expect(statusCode).toBe(500);
  expect(success).toBe(false);
  expect(error).toBe('Unknown action');

  // Should not return a game state
  expect(gameStatus).toBe(null);
});

