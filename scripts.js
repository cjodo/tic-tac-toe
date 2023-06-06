(function () {
  const players = {
    X: "X",
    O: "O",
    empty: "",

    chooseRandom: function () {
      const randomIndex = Math.floor(Math.random() * 8);
      return randomIndex;
    },
  };
  const xTurn = document.getElementById("x-turn");
  const oTurn = document.getElementById("o-turn");
  const boardDisplay = document.getElementById("board");
  const board = [...boardDisplay.children];
  let boardStatus = new Array(9);

  const popup = document.getElementById("win-result");
  let isWinner = false;

  board.forEach((cell) => {
    cell.addEventListener("click", () => {
      // Draws player onto the board
      if (cell.innerText != "X" && cell.innerText != "O") {
        changeTurn();
      }
      if (!isWinner) {
        render(cell);
        addPlayers();
      }
      if (checkWin(boardStatus) && popup.innerText == "") {
        popup.innerText = `${checkWin(boardStatus)} Wins!!`;
        isWinner = true;
      }
    });
  });

  const changeTurn = () => {
    
    xTurn.classList.toggle("turn");
    oTurn.classList.toggle("turn");
  };

  var turn = 0;

  const addPlayers = () => {
    for (let i = 0; i < board.length; i++) {
      if (board[i].innerHTML != "") {
        boardStatus[i] = board[i].innerHTML;
      }
    }
  };

  const init = () => {
    // Change it to X turn
    xTurn.classList.add('turn')
    oTurn.classList.remove('turn')
    popup.classList.remove("active");
    popup.innerText = "";
    isWinner = false;
    turn = 0; // Initializes turn
    board.forEach((cell) => (cell.innerHTML = players.empty));
    boardStatus = new Array(9);
    console.log("Init Called");
  };

  const resetButton = document.getElementById("reset");
  resetButton.addEventListener("click", () => init());

  const choosePlayer = () => {
    turn++;
    console.log(`Turn: ${turn}`);
    return turn % 2 == 0 ? players.O : players.X;
  };

  const render = (cell) => {
    if (cell.innerHTML == "") {
      cell.innerHTML += choosePlayer();
    } else console.log("Occupied");
  };

  const checkWin = (board) => {
    const newBoard = buildBoard(board);
    let winner = false;

    for (let row = 0; row < 3; row++) {
      // check for horizontal win anywhere
      let left = newBoard[row][0];
      let middle = newBoard[row][1];
      let right = newBoard[row][2];

      if (left || middle || right) {
        // if theres an undefined spot there can't be a win
        if (left == middle && middle == right) {
          winner = left; // Returns who won
          console.log(`${left} Wins!`);
          return winner;
        }
      }
    }

    for (let col = 0; col < 3; col++) {
      // Check for vertical win
      let left = newBoard[0][col];
      let middle = newBoard[1][col];
      let right = newBoard[2][col];
      if (left || middle || right) {
        if (left == middle && middle == right) {
          winner = left; // Returns who won
          console.log(`${left} Wins!`);
          return winner;
        }
      }
    }

    // Checks for diagonal win

    let UL = newBoard[0][0];
    let M = newBoard[1][1];
    let BR = newBoard[2][2];
    // Check the first diagonal
    if (UL || M || BR) {
      if (UL == M && M == BR) {
        winner = UL; // Returns who won
        console.log(`${UL} Wins!`);
        return winner;
      }
    }

    let UR = newBoard[0][2];
    let BL = newBoard[2][0];
    if (UR || M || BL) {
      if (UR == M && M == BL) {
        winner = UR;
        console.log(`${UR} Wins!`);
        return winner;
      }
    }

    return winner;
  };

  const buildBoard = (board) => {
    const newBoard = [[], [], []];
    const rowsCols = 3;
    let index = 0;
    for (let i = 0; i < rowsCols; i++) {
      for (let j = 0; j < rowsCols; j++) {
        newBoard[i][j] = board[index];
        index++;
      }
    }
    return newBoard;
  };
})();
