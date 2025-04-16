function Player() {
  const player = { name: "", mark: "", points: 0, active: false }
  return {
    setName: (newName) => player.name = newName,
    getName: () => player.name,
    setMark: (newMark) => player.mark = newMark,
    getMark: () => player.mark,
    clearPoints: () => player.points = 0,
    addPoint: () => player.points++,
    losePoint: () => player.points--,
    getPoints: () => player.points,
    isActive: () => player.active,
    toggleActive: () => player.active = !player.active,
    getPlayerKeys: () => (Object.keys(player)),
  }
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
    markBoard: (row, col, mark) => board[row][col] = mark,
    clearBoard: () => {
      for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < row.length; col++) board[row][col] = "";
      }
    }
  };
};

function ticTacToe() {

  const defaultMarks = ["X", "O"];
  const board = Board();
  const buildBoard = (players) => board.buildBoard(players.length + 1);
  let message;
  const takeTurn = (row, col, player) => {
    if (isAValidMove(row, col)) {
      board.markBoard(row, col, player.getMark());
      return resolveTurn(row, col, player);
    } else {
      return "invalid";
    }
  };
  const isAValidMove = (row, col) => board.getBoard()[row][col] === "";
  function resolveTurn(row, col, player) {
    if (playerWinsRound(row, col, player)) {
      player.addPoint();
      message = `${player.getName()} wins! play again?`
      return "win";
    } else if (boardIsFull()) {
      message = "it's a draw. play again?"
      return "draw";
    } else {
      return "";
    }
  };
  function playerWinsRound(row, col, player) {
    const playerMark = player.getMark();
    const boardArr = board.getBoard();
    const checkedLines = [[],[],[],[]];
    const isAWinner = [];
    for (let i = 0; i < boardArr.length; i++) {
      checkedLines[0].push(boardArr[row][i]);
      checkedLines[1].push(boardArr[i][col]);
      checkedLines[2].push(boardArr[i][i]);
      checkedLines[3].push(boardArr[i][boardArr.length - 1 - i]);
    }
    checkedLines.forEach((line) => {
      isAWinner.push(line.every((mark) => mark === playerMark));
    })
    return isAWinner.indexOf(true) !== -1
  };
  function boardIsFull() {
    const checks = [];
    board.getBoard().forEach((row) => checks.push(row.every((mark) => mark !== "")));
    return checks.every((check) => check === true);
  };

  return {
    getBoard: board.getBoard,
    clearBoard: board.clearBoard,
    buildBoard,
    takeTurn,
    getMessage: () => message,
    setMessage: (newMessage) => message = newMessage,
    getDefaultMarks: () => defaultMarks,
  }

};

function State() {
  const defaultGame = ticTacToe();
  const defaultMarks = defaultGame.getDefaultMarks();
  const players = [];
  let game = defaultGame;
  let turnResult = "";
  let activePlayer;

  function changeActivePlayer() {
    const i = players.indexOf(activePlayer);
    activePlayer.toggleActive();
    activePlayer = i === players.length - 1 ? players[0] : players[i + 1];
    activePlayer.toggleActive();
  }

  function setDefaultPlayers() {
    defaultMarks.forEach((mark) => {
      const player = Player();
      player.setName(`player ${mark}`);
      player.setMark(mark);
      players.push(player);
    });
    activePlayer = players[0];
  };

  function startNextTurn() {
    changeActivePlayer();
    game.setMessage(`it's ${activePlayer.getName()}'s turn`);
  }
  

  return {
    getPlayers: () => players,
    addPlayer: (player) => players.push(player),
    getActivePlayer: () => activePlayer,
    getGame: () => game,
    setGame: (chosenGame) => game = chosenGame,
    getBoard: game.getBoard,
    getTurnResult: () => turnResult,
    getMessage: game.getMessage,
    initDefaultState: () => {
      game = defaultGame;
      setDefaultPlayers();
      game.buildBoard(players);
      game.setMessage(`it's ${activePlayer.getName()}'s turn`);
    },
    takeTurn: (row, col) => {
      turnResult = game.takeTurn(row, col, activePlayer);
      if (turnResult === "") startNextTurn();
    },
    startNewRound: () => {
      game.clearBoard();
      startNextTurn();
    },
  }
};

(() => {
  const state = State();
  state.initDefaultState();
  state.takeTurn(0,0);
  state.takeTurn(1,1);
  state.takeTurn(0,1);
  state.takeTurn(0,2);
  state.takeTurn(1,0);
  state.takeTurn(2,0);
  console.log(state.getMessage());
  console.log(state.getBoard());

})();