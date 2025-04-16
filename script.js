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
      for (let j = 0; j < size; j++) row.push("");
      board.push(row);
    }
  };
  const getBoard = () => board;
  const markBoard = (x, y, mark) => board[x][y] = mark;
  const clearBoard = () => {
    for (let x = 0; x < board.length; x++) {
      for (let y = 0; y < board.length; y++) board[x][y] = "";
    }
  };
  return { buildBoard, getBoard, markBoard, clearBoard };
};

function State() {

  const players = [];
  const addPlayer = (player) => players.push(player);
  const getPlayers = () => players;
  
  let activePlayer = players[0];
  const getActivePlayer = () => activePlayer;
  const setActivePlayer = (player) => activePlayer = player;
  const switchActivePlayer = () => {
    const index = players.indexOf(activePlayer)
    if (index < players.length - 1) {
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
    setActivePlayer,
    switchActivePlayer,
    setTurnResult,
    getTurnResult
  }
};

function ticTacToe() {

  const state = State();
  const board = SquareBoard();

  const setUpGame = () => {
    const marks = ["X", "O"];
    marks.forEach(mark => {
      const player = Player();
      state.addPlayer(player);
      player.setMark(mark);
      player.clearPoints();
    });
    board.buildBoard(state.getPlayers().length + 1);
    state.setActivePlayer(state.getPlayers()[0]);
  };

  const takeTurn = (x, y) => {
    if (board.getBoard()[x][y] === "") {
      board.markBoard(x, y, state.getActivePlayer().getMark());
      if (checkWin(x, y)) {
        state.getActivePlayer().gainPoint();
        state.setTurnResult("win");
      } else if (checkDraw()) {
        state.setTurnResult("draw");
      } else {
        state.setTurnResult("");
        state.switchActivePlayer();
      }
    } else {
      state.setTurnResult("invalid");
    }
  }

  const startNewRound = () => {
    board.clearBoard();
    state.setTurnResult("");
    state.switchActivePlayer();
  }

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
  }

  function checkDraw() {
    const checks = [];
    board.getBoard().forEach((row) => checks.push(row.every((mark) => mark !== "")));
    return checks.every((check) => check === true);
  }

  return {
    getBoard: board.getBoard,
    markBoard: board.markBoard,
    clearBoard: board.clearBoard,
    getPlayers: state.getPlayers,
    addPlayer: state.addPlayer,
    getTurnResult: state.getTurnResult,
    getActivePlayer: state.getActivePlayer,
    setActivePlayer: state.setActivePlayer,
    setUpGame,
    takeTurn,
    startNewRound
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
    points.classList.add("points-display");
    points.innerText = `${player.getPoints()}`;
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
    const playerInfoDisplay = document.getElementById("players");
    const nameInputs = document.getElementsByClassName("player-name-input");
    for (let i = 0; i < nameInputs.length; i++) game.getPlayers()[i].setName(nameInputs[i].value);
    playerInfoDisplay.innerHTML = "";
    game.getPlayers().forEach(player => playerInfoDisplay.append(Elements().PlayerInfoCard(player)));
    buildBoard();
    setMessage();
  }

  function buildBoard() {
    const boardContainer = document.getElementById("board");
    const board = Elements().BoardContainer(game.getBoard());
    boardContainer.append(board);
    board.addEventListener("click", takeTurn);
  }

  function takeTurn(e) {
    const row = e.target.dataset.row;
    const col = e.target.dataset.col;
    game.takeTurn(row, col);
    e.target.innerText = game.getBoard()[row][col];
    setMessage();
    if (game.getTurnResult() === "win" || game.getTurnResult() === "draw") setUpRestart();
  }

  function setUpRestart() {
    const scoreDisplays = document.getElementsByClassName("points-display");
    for (let i = 0; i < game.getPlayers().length; i++) {
      scoreDisplays[i].innerText = `${game.getPlayers()[i].getPoints()}`;
    }
    
    const boardButtons = document.getElementsByClassName("board-button");
    for (let i = 0; i < boardButtons.length; i++) {
      boardButtons[i].disabled = true;
    }

    const playAgainButton = document.createElement("button");
    playAgainButton.id = "play-again-button"
    playAgainButton.innerText = "play again";
    document.getElementById("setup").append(playAgainButton);
    playAgainButton.addEventListener("click", playAnotherRound);
  }

  function playAnotherRound() {
    const boardButtons = document.getElementsByClassName("board-button");
    for (let i = 0; i < boardButtons.length; i++) {
      boardButtons[i].innerText = "";
      boardButtons[i].disabled = false;
    }
    game.startNewRound();
    setMessage();
    document.getElementById("play-again-button").remove();
  }

  function setMessage() {
    let message;
    switch (game.getTurnResult()) {
      case "win":
        message = `${game.getActivePlayer().getName()} wins`
        break;
      case "draw":
        message = "it's a draw"
        break;
      case "invalid":
        message = "you can't do that! try again"
      default:
        message = `it's ${game.getActivePlayer().getName()}'s turn`
        break;
    }
    document.getElementById("message").innerText = message;
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
    setUpPlayerNameInput();
  }
  
  function setUpPlayerNameInput() {
    for (let i = 0; i < game.getPlayers().length; i++) document.getElementById("players").append(Elements().PlayerInfoInputCard(i));

    const nameInputs = document.getElementsByClassName("player-name-input");
    for (let i = 0; i < nameInputs.length; i++) {
      nameInputs[i].addEventListener("blur", checkForAllNames);
      nameInputs[i].addEventListener("keyup", setEnterFocus);
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
        document.getElementById("start-game-button").focus();
      } else {
        const inputs = document.getElementsByClassName("player-name-input")
        const index = Array.from(inputs).indexOf(e.target);
        inputs[index + 1].focus();
      }
    }
  }


})();