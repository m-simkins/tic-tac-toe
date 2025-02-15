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

function Player(name, symbol) {
  let score = 0;

  const addWin = (result) => {
    if (result) {
      score++
    }
  }

  return { name, symbol, score, addWin }
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

function Interface() {

  const buildBoard = () => {
    const game = Gameplay();
    const board = game.board;
    const boardDisplay = document.getElementById("gameboard");
  
    for (let i = 0; i < board.length; i++) {
      const rowDisplay = document.createElement("tr");
      rowDisplay.id = `row${i}`;
      boardDisplay.appendChild(rowDisplay);
      for (let j = 0; j < board[i].length; j++) {
        const cellDisplay = document.createElement("td");
        cellDisplay.classList.add(`col${j}`);
        cellDisplay.dataset.row = `${i}`;
        cellDisplay.dataset.col = `${j}`;
        rowDisplay.appendChild(cellDisplay);
      }
    }
    return boardDisplay;
  }



  return { buildBoard }
  
}

document.body.append(Interface().buildBoard());