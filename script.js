function Player() {
  let name;
  const setName = (newName) => name = newName;
  const getName = () => name;
  let mark;
  const setMark = (newMark) => mark = newMark;
  const getMark = () => mark;
  let points;
  const clearPoints = () => points = 0;
  const gainPoint = () => points++;
  const losePoint = () => points--;
  const getPoints = () => points;
  return { setName, getName, setMark, getMark, clearPoints, gainPoint, losePoint, getPoints };
};

function SquareBoard() {
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
  return { buildBoard, getBoard, markBoard, clearBoard };
};

function State() {

  const players = [];
  const addPlayer = (player) => players.push(player);
  const getPlayers = () => players;
  
  let activePlayer;
  const getActivePlayer = () => activePlayer;
  const switchActivePlayer = () => {
    if (players.indexOf(activePlayer) < players.length - 1) {
      activePlayer = players[index + 1];
    } else {
      activePlayer = players[0];
    };
  };

  let turnResult;
  const getTurnResult = () => turnResult;
  const setTurnResult = (result) => turnResult = result;

  return {
    addPlayer,
    getPlayers,
    getActivePlayer,
    switchActivePlayer,
    setTurnResult,
    getTurnResult
  }
};

function ticTacToe() {

  const state = State();
  const board = SquareBoard();
  const activePlayer = state.getActivePlayer();

  const setUpGame = () => {
    const marks = ["X", "O"];
    marks.forEach(mark => {
      const player = Player();
      state.addPlayer(player);
      player.setMark(mark);
      player.clearPoints();
    });
    board.buildBoard(state.getPlayers().length + 1);
  };

  const takeTurn = (x, y) => {
    const turnResult = state.getTurnResult();
    if (turnResult === "win" || turnResult === "draw") state.clearBoard();
    if (boardState[x][y] === " ") {
      boardState.markBoard(x, y, activePlayer.getMark());
      if (checkWin(x, y)) {
        activePlayer.addPoint();
        state.setTurnResult("win");
      } else if (checkDraw()) {
        state.setTurnResult("draw");
      } else {
        state.setTurnResult("");
      }
      state.switchActivePlayer();
    } else {
      state.setTurnResult("invalid");
    }
  }

  function checkWin(x, y) {
    const row = board[x];
    const col = [];
    const ltr = [];
    const rtl = [];
    for (let i = 0; i < board.length; i++) {
      col.push(board[i][y]);
      ltr.push(board[i][i]);
      rtl.push(board[i][board.length - 1 - i]);
    }
    const lines = [row, col, ltr, rtl];
    const checks = [];
    lines.forEach((line) => {
      console.log(line);
      checks.push(line.every((mark) => mark === activePlayer.getMark()));
    })
    return checks.indexOf(true) !== -1
  }

  function checkDraw() {
    const checks = [];
    board.forEach((row) => checks.push(row.every((mark) => mark !== " ")));
    return checks.every((check) => check === true);
  }

  return {
    getBoard: board.getBoard,
    markBoard: board.markBoard,
    clearBoard: board.clearBoard,
    getPlayers: state.getPlayers,
    addPlayer: state.addPlayer,
    getTurnResult: state.getTurnResult,
    setUpGame,
    takeTurn
  }
};

function Elements() {
  const PlayerInfoInputCard = (i) => {
    const card = document.createElement("div");
    card.classList.add("player-name-input-card");
    const label = document.createElement("label");
    label.htmlFor = `${i}-name-input`;
    label.innerText = "name";
    const input = document.createElement("input");
    input.type = "text";
    input.id = `${i}-name-input`;
    input.classList.add("player-name-input");
    input.name = "name";
    input.maxLength = 10;
    card.append(label, input);
    return card;
  };

  const PlayerInfoCard = (player) => {
    const card = document.createElement("div");
    const name = document.createElement("p");
    name.innerText = `${player.getName()}`;
    const mark = document.createElement("p");
    mark.innerText = `${player.getMark()}`;
    const points = document.createElement("p");
    points.innerText = `points: ${player.getPoints()}`;
    card.append(name, mark, points);
    return card;
  };

  const BoardContainer = (board) => {
    const container = document.createElement("div");
    container.style.display = "grid";
    container.style.gridTemplateColumns = `repeat(${board.length}, 1fr)`;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        const button = document.createElement("button");
        button.dataset.row = `${i}`;
        button.dataset.col = `${j}`;
        button.innerText = board[i][j];
        button.classList.add("board-button");
        button.disabled = true;
        container.append(button);
      }
    }
    return container;
  };
  return { PlayerInfoInputCard, BoardContainer, PlayerInfoCard }
};

(() => {

  let game;

  document.getElementById("game-selector").addEventListener("change", selectGame);

  document.getElementById("start-game-button").addEventListener("click", startGame);

  function startGame() {
    const boardButtons = document.getElementsByClassName("board-button");
    const nameInputs = document.getElementsByClassName("player-name-input");
    const playerInfoDisplay = document.getElementById("players");
    for (let i = 0; i < boardButtons.length; i++) boardButtons[i].disabled = false;
    for (let i = 0; i < nameInputs.length; i++) game.getPlayers()[i].setName(nameInputs[i].value);
    playerInfoDisplay.innerHTML = "";
    game.getPlayers().forEach(player => playerInfoDisplay.append(Elements().PlayerInfoCard(player)));
  }

  function selectGame(e) {
    switch (e.target.value) {
      case "tic-tac-toe":
        game = ticTacToe();
        break;
      default:
        break;
    }
    game.setUpGame();
    setUpDisplay();
  }

  function setUpDisplay() {
    for (let i = 0; i < game.getPlayers().length; i++) document.getElementById("players").append(Elements().PlayerInfoInputCard(i));
    document.getElementById("board").append(Elements().BoardContainer(game.getBoard()));
    const nameInputs = document.getElementsByClassName("player-name-input");
    for (let i = 0; i < nameInputs.length; i++) {
      nameInputs[i].addEventListener("blur", checkForAllNames);
      nameInputs[i].addEventListener("keydown", setEnterFocus);
    };
  }

  function checkForAllNames() {
    const names = [];
    const inputs = document.getElementsByClassName("player-name-input");
    for (let i = 0; i < inputs.length; i++) names.push(inputs[i].value);
    if (names.every(name => name !== "")) document.getElementById("start-game-button").disabled = false;
  }

  function setEnterFocus(e) {
    if (e.key === "Enter") {
      if (document.getElementById("players").lastElementChild === e.target.parentElement) {
        e.target.blur();
      } else {
        const inputs = document.getElementsByClassName("player-name-input")
        const index = Array.from(inputs).indexOf(e.target);
        inputs[index + 1].focus();
      }
    }
  }


})();