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
      console.log(rows, cols);
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

function ticTacToe() {

  const state = State();
  const board = Board();

  const takeTurn = (row, col) => {
    const activePlayer = state.getActivePlayer();
    if (board.getBoard()[row][col] === "") {
      board.markBoard(row, col, activePlayer.getMark());
      if (checkWin(row, col)) {
        activePlayer.addPoint();
        state.setTurnResult("win");
      } else if (checkDraw()) {
        state.setTurnResult("draw");
      } else {
        state.setTurnResult("");
        state.changeActivePlayer();
      }
    } else {
      state.setTurnResult("invalid");
    }
  }

  const startNewRound = () => {
    board.clearBoard();
    state.setTurnResult("");
    state.changeActivePlayer();
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
    setUpGame: () => {
      const marks = ["X", "O"];
      marks.forEach(mark => {
        const player = Player();
        state.addPlayer(player);
        player.setMark(mark);
        player.clearPoints();
      });
      board.buildSquareBoard(state.getPlayers().length + 1);
      state.setActivePlayer(state.getPlayers()[0]);
    },
    takeTurn,
    startNewRound
  }
};

function Elements() {

  const InputLabelPair = (inputName) => {
    const label = document.createElement("label");
    label.classList.add(`${inputName}-label`);
    label.innerText = `${inputName}`;
    const input = document.createElement("input");
    input.classList.add(`${inputName}-input`);
    input.name = `${inputName}`;
    return {label, input}
  }

  const PlayerInfoInputCard = (i) => {
    const card = document.createElement("div");
    card.classList.add("info-input-card");
    const namePair = InputLabelPair("name");
    namePair.label.htmlFor = `${i}-name-input`;
    namePair.input.type = "text";
    namePair.input.id = `${i}-name-input`;
    namePair.input.maxLength = 10;
    card.append(namePair.label, namePair.input);
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
    const rowCount = board.length;
    const colCount = board[0].length;
    const container = document.createElement("div");
    container.style.display = "grid";
    container.style.gridTemplate = `repeat(${rowCount}, 1fr) / repeat(${colCount}, 1fr)`;
    for (let i = 0; i < rowCount; i++) {
      for (let j = 0; j < colCount; j++) {
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
  
  return { PlayerInfoInputCard, PlayerInfoCard, BoardContainer }
};

// (() => {

//   let game;

//   document.getElementById("game-selector").addEventListener("change", selectGame);

//   document.getElementById("start-game-button").addEventListener("click", startGame);

//   function startGame() {
//     const playerInfoDisplay = document.getElementById("players");
//     const nameInputs = document.getElementsByClassName("name-input");
//     for (let i = 0; i < nameInputs.length; i++) game.getPlayers()[i].setName(nameInputs[i].value);
//     playerInfoDisplay.innerHTML = "";
//     game.getPlayers().forEach(player => playerInfoDisplay.append(Elements().PlayerInfoCard(player)));
//     buildBoard();
//     setMessage();
//   }

//   function buildBoard() {
//     const boardContainer = document.getElementById("board");
//     const board = Elements().BoardContainer(game.getBoard());
//     boardContainer.append(board);
//     board.addEventListener("click", takeTurn);
//   }

//   function takeTurn(e) {
//     const row = e.target.dataset.row;
//     const col = e.target.dataset.col;
//     game.takeTurn(row, col);
//     e.target.innerText = game.getBoard()[row][col];
//     setMessage();
//     if (game.getTurnResult() === "win" || game.getTurnResult() === "draw") setUpRestart();
//   }

//   function setUpRestart() {
//     const scoreDisplays = document.getElementsByClassName("points-display");
//     for (let i = 0; i < game.getPlayers().length; i++) {
//       scoreDisplays[i].innerText = `${game.getPlayers()[i].getPoints()}`;
//     }
    
//     const boardButtons = document.getElementsByClassName("board-button");
//     for (let i = 0; i < boardButtons.length; i++) {
//       boardButtons[i].disabled = true;
//     }

//     const playAgainButton = document.createElement("button");
//     playAgainButton.id = "play-again-button"
//     playAgainButton.innerText = "play again";
//     document.getElementById("setup").append(playAgainButton);
//     playAgainButton.addEventListener("click", playAnotherRound);
//   }

//   function playAnotherRound() {
//     const boardButtons = document.getElementsByClassName("board-button");
//     for (let i = 0; i < boardButtons.length; i++) {
//       boardButtons[i].innerText = "";
//       boardButtons[i].disabled = false;
//     }
//     game.startNewRound();
//     setMessage();
//     document.getElementById("play-again-button").remove();
//   }

//   function setMessage() {
//     let message;
//     switch (game.getTurnResult()) {
//       case "win":
//         message = `${game.getActivePlayer().getName()} wins`
//         break;
//       case "draw":
//         message = "it's a draw"
//         break;
//       case "invalid":
//         message = "you can't do that! try again"
//       default:
//         message = `it's ${game.getActivePlayer().getName()}'s turn`
//         break;
//     }
//     document.getElementById("message").innerText = message;
//   }

//   function selectGame(e) {
//     switch (e.target.value) {
//       case "tic-tac-toe":
//         game = ticTacToe();
//         break;
//       default:
//         break;
//     }
//     game.setUpGame();
//     setUpPlayerNameInput();
//   }
  
//   function setUpPlayerNameInput() {
//     for (let i = 0; i < game.getPlayers().length; i++) document.getElementById("players").append(Elements().PlayerInfoInputCard(i));

//     const nameInputs = document.getElementsByClassName("name-input");
//     for (let i = 0; i < nameInputs.length; i++) {
//       nameInputs[i].addEventListener("blur", checkForAllNames);
//       nameInputs[i].addEventListener("keyup", setEnterFocus);
//     };
//   }

//   function checkForAllNames() {
//     const names = [];
//     const inputs = document.getElementsByClassName("name-input");
//     for (let i = 0; i < inputs.length; i++) names.push(inputs[i].value);
//     if (names.every(name => name !== "")) document.getElementById("start-game-button").disabled = false;
//   }

//   function setEnterFocus(e) {
//     if (e.key === "Enter") {
//       if (document.getElementById("players").lastElementChild === e.target.parentElement) {
//         e.target.blur();
//         document.getElementById("start-game-button").focus();
//       } else {
//         const inputs = document.getElementsByClassName("name-input")
//         const index = Array.from(inputs).indexOf(e.target);
//         inputs[index + 1].focus();
//       }
//     }
//   }

// })();