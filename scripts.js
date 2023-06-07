const players = {
  X: "X",
  O: "O",
  empty: "",
};

const xTurn = document.getElementById("x-turn");
const oTurn = document.getElementById("o-turn");

const boardDisplay = document.getElementById("board");
const board = [...boardDisplay.children];
let boardStatus = new Array(9);

const popup = document.getElementById("win-result");

let isWinner = false;

const handleClick = (() => {
  board.forEach((cell) => {
    cell.addEventListener("click", () => {
      if (!cell.innerText && !isWinner) {
        changeTurn();
        render(cell);
        addPlayers();

        
        if (!checkWin(boardStatus)) {
          // Has to check that win or draw conditions aren't met before letting ai play
          if (turn == 9) {
            popup.innerHTML += "It's a Draw!";
            return;
          } else {
            aiPick();
          }
        }
      }
      
      if (checkWin(boardStatus) && popup.innerText == "") {
        popup.innerText = `${checkWin(boardStatus)} Wins!!`;
        isWinner = true;
      }

    });
  });
})();

const aiPick = () => {
  // A little gross 
  while (true) {
    const randomIndex = Math.floor(Math.random() * 9);

    if (board[randomIndex].innerHTML == "") {
      board[randomIndex].innerHTML += players.O;
      addPlayers();
      changeTurn();
      return;
    }
  }
};

const changeTurn = () => {
  if (!isWinner) {
    turn++;
  }
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
  // Hide winner popup
  popup.classList.remove("active");
  popup.innerText = "";
  isWinner = false;
  turn = 0; 
  // Empty board
  board.forEach((cell) => (cell.innerHTML = players.empty));
  boardStatus = new Array(9);
  console.log("Init Called");
};

const resetButton = document.getElementById("reset");
resetButton.addEventListener("click", () => init());

const choosePlayer = () => {
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
    // check for horizontal win
    let left = newBoard[row][0];
    let middle = newBoard[row][1];
    let right = newBoard[row][2];

    if (left || middle || right) {
      // if theres an undefined spot there can't be a win
      if (left == middle && middle == right) {
        winner = left; // Returns who won
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
      return winner;
    }
  }

  let UR = newBoard[0][2];
  let BL = newBoard[2][0];
  if (UR || M || BL) {
    if (UR == M && M == BL) {
      winner = UR;
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
