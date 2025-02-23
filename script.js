function Player(mark, name) {
  const getMark = () => mark;
  const setName = (newName) => name = newName;
  const getName = () => name;
  return { getMark, setName, getName };
}

const gameboard = (function() {
  const board = [];
  for (let i = 0; i < 3; i++) {
    const row = [];
      for (let j = 0; j < 3; j++) {
        const square = " ";
        row.push(square);
      }  
    board.push(row);  
  }  
  const getBoard = () => board;
  return { getBoard };
})();  

function game() {
  const player1 = Player("X","");
  const player2 = Player("O","");
  const board = gameboard.getBoard();
  let activePlayer;
  let turnCount = 0;

  function startGame() {
    interface.displayBoard();
    activePlayer = player1;
    console.table(board);
    console.log(`it's ${activePlayer.getName()}'s turn`);
  };

  function pickSquare(row, col) {
    const square = board[row][col];
    if (square = " ") {
      resolveTurn(row, col);
    } else if (square = activePlayer.getMark()) {
      console.log("you're already here");
    } else {
      console.log("your opponent is already here");
    }
  };

  function resolveTurn(row, col) {
    board[row][col] = activePlayer.getMark();
    turnCount++;
    console.table(board);

    if (checkWin(row, col, activePlayer)) {
      console.log(`${activePlayer.getName()} wins!`);
    } else if (turnCount === 9) {
      console.log("it's a tie");
    } else {
      activePlayer = activePlayer === player1 ? player2 : player1;
      console.log(`it's ${activePlayer.getName()}'s turn`);
    }

  };

  function checkWin(row, col, player) {
    const thisRow = board[row];
    const thisCol = [board[0][col], board[1][col], board[2][col]];
    const ltr = [board[0][0], board[1][1], board[2][2]];
    const rtl = [board[0][2], board[1][1], board[2][0]];
    const lines = [thisRow, thisCol, ltr, rtl];
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].every(square => square === player.getMark())) {
        return true;
      }
    }
  };

  return { startGame, pickSquare }

};

const interface = (function() {
  function displayBoard() {
    const board = gameboard.getBoard();
    const boardDiv = document.getElementById("board");
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {        
        const button = document.createElement("button");
        button.type = "button";
        button.classList.add("square");
        button.dataset.row = `${i}`;
        button.dataset.col = `${j}`;
        boardDiv.appendChild(button);
      }
    }
  }

  return { displayBoard }
})();

game().startGame();