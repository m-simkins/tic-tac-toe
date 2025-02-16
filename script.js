function Gameboard() { 
  const board = [
    ["","",""],
    ["","",""],
    ["","",""]
  ];

  const getBoard = () => board;

  const markSquare = (row, col, player) => {
    if (board[row][col] === "") {
      board[row][col] = player.symbol;
    }
  }

  return { getBoard, markSquare }
}

function Player(symbol) {
  let score = 0;

  const addWin = (result) => {
    if (result) {
      score++
    }
  }

  return { symbol, score, addWin }
}

function Gameplay() {

  const board = Gameboard().getBoard();
  const players = [];

// do not return functions below
  const checkRow = (row, player) => board[row].every((v) => v === player.symbol);
  const checkCol = (col, player) => [board[0][col], board[1][col], board[2][col]].every((v) => v === player.symbol);
  const checkLtr = (player) => [board[0][0], board[1][1], board[2][2]].every((v) => v === player.symbol);
  const checkRtl = (player) => [board[2][0], board[1][1], board[0][2]].every((v) => v === player.symbol);
// do not return functions above

  const checkWin = (row, col, player) => (checkRow(row, player) || checkCol(col, player) || checkLtr(player) || checkRtl(player));

  const takeTurn = (row, col, player) => {
    game.markSquare(row, col, player);
    return game.checkWin(row, col, player);
  }

  return { board, players, checkWin, takeTurn }

};

function DisplayBoard() {

  const game = Gameplay();
  const boardData = game.board;
  const boardDisplay = document.createElement("div");
  boardDisplay.id = "gameboard";
  
  for (let i = 0; i < boardData.length; i++) {
    for (let j = 0; j < boardData.length; j++) {
      const button = document.createElement("button");
      button.classList.add("board-button");
      button.style.gridArea = `${i + 1} / ${j + 1}`;
      button.dataset.row = `${i}`;
      button.dataset.col = `${j}`;
      boardDisplay.appendChild(button);
    }
  }

  boardDisplay.addEventListener("click", (e) => {
    const selection = e.target;
    if (selection.classList.contains("board-button")) {
      const arrRow = Number(selection.dataset.row);
      const arrCol = Number(selection.dataset.col);
      boardData[arrRow][arrCol] = "X";
      selection.innerText = `${boardData[arrRow][arrCol]}`;
      console.log(boardData);
    }
  });

  return boardDisplay;

}

function PlayerInfoInput(player) {
  const container = document.createElement("div");
  const input = document.createElement("input");
  input.type = "text";
  input.name = "player-name";

  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      player.name = input.value;
      input.value = "";
      console.log(player);
    }
  })
  container.append(input);
  return container;
}

function startGame() {
  const players = [Player("X"), Player("O")];

  players.forEach(player => {
    document.body.appendChild(PlayerInfoInput(player));
  });
  
  // for (let i = 0; i < players.length; i++) {
    // document.body.appendChild(PlayerInfo(players[i]));
  // }

}

startGame();