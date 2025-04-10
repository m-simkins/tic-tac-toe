function Player(name, mark) {
  let points = 0;
  const getName = () => name;
  const getMark = () => mark;
  const addPoint = () => points++;
  const clearPoints = () => points = 0;
  const getPoints = () => points;
  return { getName, getMark, addPoint, clearPoints, getPoints };
};

function Board() {
  const board = [];
  const buildBoard = (size) => {
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) row.push(" ");
      board.push(row);
    }
  };
  const getBoard = () => board;
  const markBoard = (x, y, mark) => board[x][y] = mark;
  const clearBoard = () => {
    for (let x = 0; x < board.length; x++) {
      for (let y = 0; y < board.length; y++) board[x][y] = " ";
    }
  };
  const getLines = (x, y) => {
    const col = [];
    const ltr = [];
    const rtl = [];
    for (let i = 0; i < board.length; i++) {
      col.push(board[i][y]);
      ltr.push(board[i][i]);
      rtl.push(board[i][board.length - 1 - i]);
    }
    return [board[x], col, ltr, rtl];
  };
  return { buildBoard, getBoard, markBoard, clearBoard, getLines };
};

function Game() {
  const board = Board();
  const getBoard = () => board;
  const players = [];
  const getPlayers = () => players;
  const addPlayer = (name, mark) => players.push(Player(name, mark));
  let activePlayer;
  const getActivePlayer = () => activePlayer;
  let turnResult;
  const getTurnResult = () => turnResult;
  const startGame = (size) => {
    players.forEach((player) => player.clearPoints());
    board.buildBoard(size);
    activePlayer = players[0];
  }
  const takeTurn = (x, y) => {
    if (turnResult === "win" || turnResult === "draw") board.clearBoard();
    if (board.getBoard()[x][y] === " ") {
      board.markBoard(x, y, activePlayer.getMark());
      if (checkWin(x, y)) {
        activePlayer.addPoint();
        turnResult = "win";
      } else if (checkDraw()) {
        turnResult = "draw";
      } else {
        turnResult = "";
      }
      switchActivePlayer();
    } else {
      turnResult = "invalid";
    }
  }
  function checkWin(x, y) {
    const checks = [];
    board.getLines(x, y).forEach((line) => checks.push(line.every((mark) => mark === activePlayer.getMark())))
    return checks.indexOf(true) !== -1
  }
  function checkDraw() {
    const checks = [];
    board.getBoard().forEach((row) => checks.push(row.every((mark) => mark !== " ")));
    return checks.every((check) => check === true);
  }
  function switchActivePlayer() {
    const index = players.indexOf(activePlayer)
    activePlayer = index < players.length - 1 ? players[index + 1] : players[0];
  }
  return { getBoard, getPlayers, addPlayer, getActivePlayer, getTurnResult, startGame, takeTurn }
}