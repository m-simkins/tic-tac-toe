function Player(mark, name) {
  const getMark = () => mark;
  const setName = (newName) => name = newName;
  const getName = () => name;
  return { getMark, setName, getName };
}

const board = (function() {
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

const game = (function() {
  const player1 = Player("X","");
  const player2 = Player("O","");
  let activePlayer;
  let turnCount = 0;

  function startGame() {
    player1.setName(prompt("player 1 name"));
    player2.setName(prompt("player 2 name"));
    activePlayer = player1;
    console.table(board.getBoard());
    console.log(`it's ${activePlayer.getName()}'s turn`);
  };

  function pickSquare(row, col) {
    const square = board.getBoard()[row][col];
    if (square = " ") {
      resolveTurn(row, col);
    } else if (square = activePlayer.getMark()) {
      console.log("you're already here");
    } else {
      console.log("your opponent is already here");
    }
  }

  function resolveTurn(row, col) {
    board.getBoard()[row][col] = activePlayer.getMark();
    turnCount++;
    console.table(board.getBoard());

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
    const b = board.getBoard();
    const thisRow = b[row];
    const thisCol = [b[0][col], b[1][col], b[2][col]];
    const ltr = [b[0][0], b[1][1], b[2][2]];
    const rtl = [b[0][2], b[1][1], b[2][0]];
    const lines = [thisRow, thisCol, ltr, rtl];
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].every(square => square === player.getMark())) {
        return true;
      }
    }
  };

  return { startGame, pickSquare }

})();

game.startGame();