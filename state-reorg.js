function Player() {

  let name;
  let mark;
  let points;

  return {
    setName: (newName) => name = newName,
    getName: () => name,
    setMark: (newMark) => mark = newMark,
    getMark: () => mark,
    clearPoints: () => points = 0,
    addPoint: () => points++,
    losePoint: () => points--,
    getPoints: () => points };
};

function Board() {

  const board = [];
  
  return {
    buildBoard: (rows, cols) => {
      if (!cols) cols = rows;
      for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) row.push("");
        board.push(row);
      }
    },
    getBoard: () => board,
    markBoard: (x, y, mark) => board[x][y] = mark,
    clearBoard: () => {
      for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board[x].length; y++) board[x][y] = "";
      }
    }
  };
};

function State() {

  const players = [];
  let activePlayer = players[0];
  let turnResult;

  return {
    getPlayers: () => players,
    addPlayer: (player) => players.push(player),
    getActivePlayer: () => activePlayer,
    setActivePlayer: (player) => activePlayer = player,
    changeActivePlayer: () => {
      const index = players.indexOf(activePlayer)
      if (index === players.length - 1) {
        activePlayer = players[0];
      } else {
        activePlayer = players[index + 1];
      };
    },
    getTurnResult: () => turnResult,
    setTurnResult: (result) => turnResult = result
  }
};

function ticTacToe(state) {

  const board = Board();
  let message;
  const isAValidMove = (row, col) => board.getBoard()[row][col] === "";
  function resolveTurn(row, col) {
    if (checkWin(row, col)) {
      state.getActivePlayer().addPoint();
      state.setTurnResult("win");
    } else if (checkDraw()) {
      state.setTurnResult("draw");
    } else {
      state.setTurnResult("");
      state.changeActivePlayer();
    }
  };
  function setMessage() {
    const activePlayer = state.getActivePlayer();
    switch (state.getTurnResult()) {
      case "win":
        message = `${activePlayer.getName()} wins! play again?`;
        break;
      case "draw":
        message = "it's a draw. play again?";
        break;
      case "invalid":
        message = "you can't do that! try again";
      default:
        message = `it's ${activePlayer.getName()}'s turn`;
        break;
    };
  };
  function checkWin(x, y) {
    const row = board.getBoard()[x];
    const col = [];
    const ltr = [];
    const rtl = [];
    for (let i = 0; i < board.getBoard().length; i++) {
      col.push(board.getBoard()[i][y]);
      ltr.push(board.getBoard()[i][i]);
      rtl.push(board.getBoard()[i][board.getBoard().length - 1 - i]);
    }
    const lines = [row, col, ltr, rtl];
    const checks = [];
    lines.forEach((line) => {
      checks.push(line.every((mark) => mark === state.getActivePlayer().getMark()));
    })
    return checks.indexOf(true) !== -1
  };
  function checkDraw() {
    const checks = [];
    board.getBoard().forEach((row) => checks.push(row.every((mark) => mark !== "")));
    return checks.every((check) => check === true);
  };

  return {
    getBoard: board.getBoard,
    markBoard: board.markBoard,
    clearBoard: board.clearBoard,
    setUpGame: () => {
      state.getPlayers().forEach(player => player.clearPoints());
      board.buildBoard(state.getPlayers().length + 1);
      state.setActivePlayer(state.getPlayers()[0]);
    },
    takeTurn: (row, col) => {
      if (isAValidMove(row, col)) {
        board.markBoard(row, col, state.getActivePlayer().getMark());
        resolveTurn(row, col);
      } else {
        state.setTurnResult("invalid");
      }
      setMessage();
    },
    getMessage: () => message,
    startNewRound: () => {
      board.clearBoard();
      state.setTurnResult("");
      state.changeActivePlayer();
    }
  }
};

