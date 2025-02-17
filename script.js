const board = (function() {
  const board = [
    ["","",""],
    ["","",""],
    ["","",""]
  ];

  const logBoard = () => console.log(board);

  const getBoard = () => board;

  const markSquare = (row, col, mark) => {
    if (board[row][col] === "") {
      board[row][col] = mark;
    }
    logBoard();
  };

  const checkCondition = (line, mark) => line.every((square) => square === mark);

  const checkRow = (row, mark) => checkCondition(board[row], mark);

  const checkCol = (col, mark) => checkCondition([board[0][col], board[1][col]], board[2][col], mark);

  const checkLtr = (mark) => checkCondition([board[0][0], board[1][1], board[2][2]], mark);

  const checkRtl = (mark) => checkCondition([board[2][0], board[1][1], board[2][0]], mark);

  const checkWin = (row, col, mark) => (checkRow(row, mark) || checkCol(col, mark) || checkLtr(mark) || checkRtl(mark))

  return { getBoard, logBoard, markSquare, checkWin }
})();

function Player(name, mark) {
  let score = 0;
  const player = { name, mark, score };
  const getPlayer = () => player;
  const logPlayer = () => console.log(player);
  return { getPlayer, logPlayer };
}

const player1 = Player("arlo", "X").getPlayer();
console.log(player1);
player1.addWin;
console.log(player1);