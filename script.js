function Player() {
  const player = { name: "", mark: "", points: 0, active: false }
  
  return {
    getEntries: () => Object.entries(player),
    setValue: (key, value) => player[key] = value,
    getValue: (key) => player[key],
    clearPoints: () => player.points = 0,
    addPoint: () => player.points++,
    losePoint: () => player.points--,
    isActive: () => player.active,
    toggleActive: () => player.active = !player.active,
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
      for (let i = 0; i < board.length; i++) {
        const newRow = [];
        for (let j = 0; j < board[i].length; j++) newRow.push("");
        board.shift();
        board.push(newRow);        
      };
    }
  };
};

function ticTacToe() {
  const defaultMarks = ["X", "O"];
  const board = Board();
  let message;
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
    getDefaultMarks: () => defaultMarks,
    getBoard: board.getBoard,
    clearBoard: board.clearBoard,
    buildBoard: (players) => board.buildBoard(players.length + 1),
    takeTurn: (row, col, player) => {
      if (board.getBoard()[row][col] === "") {
        board.markBoard(row, col, player.getMark());
        return resolveTurn(row, col, player);
      } else {
        return "invalid";
      }
    },
    getMessage: () => message,
    setMessage: (newMessage) => message = newMessage,
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

  function setPlayerDefaults() {
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
      setPlayerDefaults();
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
    }
  }
};

function Elements() {
  const LabelInputPair = (inputName) => {
    const pair = document.createElement("div");
    pair.classList.add(`${inputName}-input-label-pair`, "input-label-pair");
    const label = document.createElement("label");
    label.classList.add(`${inputName}-label`);
    label.innerText = `${inputName}`;
    const input = document.createElement("input");
    input.classList.add(`${inputName}-input`, "player-input");
    input.name = `${inputName}`;
    pair.append(label, input);
    return pair;
  }

  const PlayerInputCard = (player) => {
    const card = document.createElement("div");
    card.classList.add("player-input-card");
    for (let i = 0; i < player.getEntries().length; i++) {
      const entry = player.getEntries()[i];
      if (typeof entry[1] === "string") card.append(LabelInputPair(entry[0]));
    }
    return card;
  }

  const PlayerDisplayCard = (player) => {
    const card = document.createElement("div");
    card.classList.add("player-display-card");
    for (let i = 0; i < player.getEntries().length; i++) {
      const entry = player.getEntries()[i];
      if (typeof entry[1] !== "boolean") {
        const display = document.createElement("p");
        display.classList.add(`${entry[0]}-display`);
        display.innerText = `${entry[1]}`;
        card.append(display);
      }
    }
    return card;
  }

  const SetupButton = (text) => {
    const button = document.createElement("button");
    button.id = `${text.replace(" ","-")}-button`;
    button.classList.add("setup-button");
    button.innerText = text;
    return button;
  }

  return {
    PlayerInputCard,
    PlayerDisplayCard,
    SetupButton
  }
};

(() => {
  const state = State();
  const elem = Elements();
  state.initDefaultState();

  const players = state.getPlayers();
    const playersDisplay = document.getElementById("players");
  players.forEach(player => playersDisplay.append(elem.PlayerInputCard(player)));

  const startGameButton = elem.SetupButton("start game");
  startGameButton.addEventListener("click", () => {
    playersDisplay.innerHTML = "";
    players.forEach(player => playersDisplay.append(elem.PlayerDisplayCard(player)));
  })
  document.getElementById("setup").append(startGameButton);

})();