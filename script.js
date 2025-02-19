const boardControl = (function() {
  const board = [
    [" "," "," "],
    [" "," "," "],
    [" "," "," "]
  ];

  const getBoard = () => board;

  const markSquare = (row, col, mark) => {
    if (board[row][col] === " ") {
      board[row][col] = mark;
    }
  };

  return { getBoard, markSquare }
})();

function Player(mark) {
  let score = 0;
  const player = { mark, score };
  const getPlayer = () => player;
  return { getPlayer };
}

const gameControl = (function() {
  const board = boardControl.getBoard();
  const checkedRow = (row) => board[row];
  const checkedCol = (col) => [
    board[0][col],
    board[1][col],
    board[2][col]
  ];
  const ltr = [
    board[0][2],
    board[1][1],
    board[2][0]
  ];
  const rtl = [
    board[0][0],
    board[1][1],
    board[2][2]
  ];
  const winner = (line, mark) => line.every((square) => square === mark);

  const checkWin = (row, col, player) => {
    const conditions = [checkedRow(row), checkedCol(col), ltr, rtl];
    for (let i = 0; i < conditions.length; i++) {
      if (winner(conditions[i], player.mark)) {
        player.score++;
        return "you win!"
      }
    }
  }

  const takeTurn = (row, col, player) => {
    boardControl.markSquare(row, col, player.mark);
    console.log(board);
    console.log(checkWin(row, col, player));
  }

  const startGame = () => {
    const player1 = Player("X").getPlayer();
    player1.name = document.getElementById("player-1-name-input").value;
    
    const player2 = Player("O").getPlayer();
    player2.name = document.getElementById("player-2-name-input").value;
  
    UIControl.buildBoard();

    console.log(player1, player2);
  };  

  return { startGame, takeTurn }
})();

const UIControl = (function() {
  
  const board = boardControl.getBoard();

  const updateButton = (button) => {
    if (button.classList.contains("board-square")) {
      button.innerText = "X";
      board[button.dataset.row][button.dataset.col] = "X";
      console.log(board);
    };
  }

  const buildBoard = () => {
    const boardUI = document.createElement("div");
    boardUI.id = "board";
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        const button = document.createElement("button");
        button.type = "button";
        button.classList.add("board-square");
        button.dataset.row = i;
        button.dataset.col = j;
        boardUI.appendChild(button);
      }
    }
    document.getElementById("start-game-button").style.display = "none";
    document.body.appendChild(boardUI);

    boardUI.addEventListener("click", (e) => { updateButton(e.target) });
  };

  document.getElementById("start-game-button").addEventListener("click", gameControl.startGame);

  return { buildBoard }
})();
