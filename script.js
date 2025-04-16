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
      state.getPlayers().forEach(player => player.clearPoints());
      board.buildBoard(state.getPlayers().length + 1);
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
    card.id = `${i}-info-input-card`;
    const info = ["name", "mark"];
    for (let j = 0; j < info.length; j++) {
      const pair = InputLabelPair(info[j]);
      pair.label.htmlFor = `${i}-${info[j]}-input`;
      pair.input.id = `${i}-${info[j]}-input`;
      switch (info[j]) {
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
  };

  const PlayerInfoDisplayCard = (player) => {
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
  
  return { PlayerInfoInputCard, PlayerInfoDisplayCard, BoardContainer }
};