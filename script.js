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

  return { name, symbol, addWin }
}

function Gameplay() {
  const board = Gameboard().getBoard();

  const player1 = Player("player 1", "X");
  const player2 = Player("player 2", "O");

  const checkRow = (row, player) => board[row].every((v) => v === player.symbol);
  const checkCol = (col, player) => [board[0][col], board[1][col], board[2][col]].every((v) => v === player.symbol);
  const checkLtr = (player) => [board[0][0], board[1][1], board[2][2]].every((v) => v === player.symbol);
  const checkRtl = (player) => [board[2][0], board[1][1], board[0][2]].every((v) => v === player.symbol);

  const checkWin = (row, col, player) => (checkRow(row, player) || checkCol(col, player) || checkLtr(player) || checkRtl(player));

  const takeTurn = (row, col, player) => {
    game.markSquare(row, col, player);
    return game.checkWin(row, col, player);
  }

  return { board, player1, player2, checkWin, takeTurn }

};