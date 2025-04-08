function Player(mark) {
  let points = 0;
  const getMark = () => mark;
  const addPoint = () => points++;
  const getPoints = () => points;
  return { getMark, addPoint, getPoints };
};

function Gameboard() {
  const board = [
    [" "," "," "],
    [" "," "," "],
    [" "," "," "]
  ]

  const getBoard = () => board;

  const getLines = (x, y) => {

    const row = board[x];
    const col = [board[0][y], board[1][y], board[2][y]];  
    const diagLtr = [board[0][0], board[1][1], board[2][2]];
    const diagRtl = [board[0][2], board[1][1], board[2][0]];

    return [row, col, diagLtr, diagRtl]

  }
  
  const markSquare = (x, y, mark) => board[x][y] = mark;
  
  const clearBoard = () => {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        board[row][col] = " ";
      }
    }
  }

  return { getBoard, getLines, markSquare, clearBoard };
};

function Gameplay() {

  const board = Gameboard();
  const playerX = Player("X");
  const playerO = Player("O");

  let activePlayer = playerX;
  let turnsTaken = 0;
  let message;

  const getActivePlayer = () => activePlayer;
  const getBoard = () => board.getBoard();
  const getPlayers = () => [playerX, playerO];
  const getMessage = () => message;

  const takeTurn = (row, col) => {
    if (board.getBoard()[row][col] === " ") {
      board.markSquare(row, col, activePlayer.getMark());
      turnsTaken++;
      if (isAWinner(row, col)) {
        activePlayer.addPoint();
        message = `${activePlayer.getMark()} won the round! choose a square to play again`;
        resetRound();
      } else if (turnsTaken === 9) {
        message = "you tied! choose a square to play again";
        resetRound();
      } else {
        message = "";
      }
      activePlayer === playerX ? activePlayer = playerO : activePlayer = playerX;
    } else {
      message = "invalid move! try again"
    }
  };

  function resetRound() {
    turnsTaken = 0;
    board.clearBoard();
  }

  function isAWinner(row, col) {
    const checks = [];
    for (const line of board.getLines(row, col)) {
      if (line.every((square) => square === activePlayer.getMark())) {
        checks.push(true);
      } else {
        checks.push(false);
      }
    }
    return checks.findIndex((check) => check === true) !== -1;
  }

  return { getActivePlayer, getBoard, getPlayers, getMessage, takeTurn }
};