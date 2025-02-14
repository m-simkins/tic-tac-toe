function Gameboard() { 
  const board = [
    ["","",""],
    ["","",""],
    ["","",""]
  ];

  const getBoard = () => board;

  const markSquare = (player, row, col) => {
    if (board[row][col] === "") {
      board[row][col] = player.symbol;
    }
  }
  
  return { getBoard, markSquare }
}

function Player(name, symbol) {
  return {
    name: name,
    symbol: symbol,
    score: 0,
    logPlayerInfo() {
      return `${name}: ${symbol}`
    }
  }
}

const game = Gameboard();
const board = game.getBoard();

const player1 = Player("player1", "X");
const player2 = Player("player2", "O");

game.markSquare(player1, 0, 2);

console.log(board);

function checkRow(row, player) {
 return board[row].every((v) => v === player.symbol);
}

function checkCol(col, player) {
  const arr = [
    board[0][col],
    board[1][col],
    board[2][col]
  ];
  return arr.every((v) => v === player.symbol);
}

function checkLtr(player) {
  const ltr = [board[0][0], board[1][1], board[2][2]];
  return ltr.every((v) => v === player.symbol);
}

function checkRtl(player) {
  const rtl = [board[2][0], board[1][1], board[0][2]];
  return rtl.every((v) => v === player.symbol);
}

function checkWin(row, col, player) {
  if (checkRow(row, player) || checkCol(col, player) || checkRtl(player) || checkLtr(player))
     {
    return true;
  } else {
    return false;
  }
}