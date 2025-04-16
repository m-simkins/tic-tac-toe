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
    getInputKeys: () => {
      const strings = [];
      for (const [key, value] of Object.entries(player)) {        
        if (typeof value === "string") strings.push(key);
      };
      return strings;
    },
    getDisplayKeys: () => {
      const keys = [];
      for (const [key, value] of Object.entries(player)) {
        if (typeof value === "string" || typeof value === "number") keys.push(key);
      }
      return keys;
    }
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
    const label = document.createElement("label");
    label.classList.add(`${inputName}-label`);
    label.innerText = `${inputName}`;
    const input = document.createElement("input");
    input.classList.add(`${inputName}-input`, "player-info-input");
    input.name = `${inputName}`;
    return { label, input };
  }

  const PlayerInfoInputCard = (inputKeys, playerIndex) => {
    const card = document.createElement("div");
    card.classList.add("player-info-input-card");
    card.id = `${playerIndex}-info-input-card`;
    for (let i = 0; i < inputKeys.length; i++) {
      const key = inputKeys[i];
      const pair = LabelInputPair(key);
      pair.label.htmlFor = `${playerIndex}-${inputKeys[i]}-input`;      
      pair.input.id = `${playerIndex}-${inputKeys[i]}-input`;
      switch (key) {
        case "name":
          pair.input.maxLength = 10;
          break;
        case "mark":
          pair.input.maxLength = 1;
          break;
        default:
          break;
      }
      card.append(pair.label, pair.input);
    }
    return card;
  }

  const PlayerInfoDisplayCard = (player) => {
    const card = document.createElement("div");
    card.classList.add("player-info-display-card");
    for (let i = 0; i < player.getDisplayKeys().length; i++) {
      const display = document.createElement("p");
      const key = player.getDisplayKeys()[i];
      display.classList.add(`${key}-display`);
      switch (key) {
        case "name":
          display.innerText = player.getName();
          break;
        case "mark":
          display.innerText = player.getMark();
          break;
        case "points":
          display.innerText = player.getPoints();
          break;
        default:
          break;
      };
      card.append(display);
    }
    return card;
  }

  return {
    PlayerInfoInputCard,
    PlayerInfoDisplayCard
  }
}

(() => {
  const state = State();
  const elements = Elements();
  state.initDefaultState();
  const players = state.getPlayers();
  for (let i = 0; i < players.length; i++) {
    const card = elements.PlayerInfoInputCard(players[i].getInputKeys(), i);
    card.id = `${i}-info-input-card`;
    document.getElementById("players").append(card);
  };

  const setPlayersButton = document.createElement("button");
  setPlayersButton.innerText = "set players";
  setPlayersButton.addEventListener("click", setPlayers);
  document.body.append(setPlayersButton);

  function setPlayers() {
    const inputCards = document.getElementsByClassName("player-info-input-card");
    for (let i = 0; i < inputCards.length; i++) {
      const player = players[i];
      const inputs = inputCards[i].getElementsByClassName("player-info-input");
      player.setName(inputs[0].value);
      player.setMark(inputs[1].value);
    }
    document.getElementById("players").innerHTML = "";
    for (let i = 0; i < players.length; i++) {
      document.getElementById("players").append(elements.PlayerInfoDisplayCard(players[i]));
    }
  };

})();