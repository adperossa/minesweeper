const APIEndpoint = 'https://638i4o7tdb.execute-api.sa-east-1.amazonaws.com/default';

const startBtn = document.getElementById("startBtn");
const saveBtn = document.getElementById("saveBtn");
const loadBtn = document.getElementById("loadBtn");
const inputRows = document.getElementById("rows");
const inputCols = document.getElementById("cols");

const data = {
    containerDiv: document.getElementById("container")
}

const game = new Game(data);

startBtn.addEventListener("click", function() {
    game.startGame({
        cols: inputCols.value,
        rows: inputRows.value
    });
});

saveBtn.addEventListener("click", function() {
    game.saveGame();
});

loadBtn.addEventListener("click", function() {
    if (!game.ready) startBtn.click();
    game.loadGame();
});

//avoid opening the context menu on right click
document.getElementsByTagName("body")[0].addEventListener("contextmenu", function(e){
    e.preventDefault();
});

async function sendData(boardState, dimensions, action, cell) {
    const body = {
        boardState,
        dimensions,
        action,
        cell
    };

    const response = await fetch(APIEndpoint, {
        method: 'POST',
        body: JSON.stringify(body)
    });
    const data = await response.json();
    return data;
}