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
  const getLines = (x, y) => [
    board[x],
    [board[0][y], board[1][y], board[2][y]],
    [board[0][0], board[1][1], board[2][2]],
    [board[0][2], board[1][1], board[2][0]]
  ]
  
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
  let message = "choose a square to start the game";
  const getBoard = () => board.getBoard();
  const getActiveMark = () => activePlayer.getMark();
  const getMessage = () => message;
  const getPoints = () => [playerX.getPoints(), playerO.getPoints()];
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
  return { getBoard, getActiveMark, getMessage, getPoints, takeTurn }
};

(function display() {

  const game = Gameplay();

  function refreshDisplay() {    
    document.getElementById("turn").innerText = `${game.getActiveMark()}'s turn`;
    document.getElementById("message").innerText = `${game.getMessage()}`;
    document.getElementById("playerX-points").innerText = `${game.getPoints()[0]}`;
    document.getElementById("playerO-points").innerText = `${game.getPoints()[1]}`;
  }

  refreshDisplay();

  document.getElementById("board").addEventListener("click", (e) => {
    const row = e.target.dataset.row;
    const col = e.target.dataset.col;
    const board = e.target.parentElement.children;
    game.takeTurn(row, col);
    Array.from(board).forEach(square => {
      square.innerText = game.getBoard()[square.dataset.row][square.dataset.col]
    });
    refreshDisplay();
  })

})();