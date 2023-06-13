const players = {
  human: "X",
  ai: "O",
  empty: "",
};

const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
]

const boardDisplay = document.getElementById("board");
const board = [...boardDisplay.children];
const popup = document.getElementById("win-result");
let isWinner = false;
let boardStatus;



const init = () => {
  // Hide winner popup
  popup.classList.remove("active");
  popup.innerText = "";
  isWinner = false;
  turn = 0; 
  // Empty board
  board.forEach((cell) => (cell.innerHTML = players.empty));
  boardStatus = Array.from(Array(9).keys());
  console.log("Init Called");
};

init();


const bestSpot = () => {
  return minimax(boardStatus, players.ai).index
} 

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
            board[bestSpot()].innerHTML = players.ai;
            addPlayers()
            changeTurn()

            // console.log(bestSpot())
          }
        }
      };

      
      if (checkWin(boardStatus) && popup.innerText == "") {
        popup.innerText = `${checkWin(boardStatus)} Wins!!`;
        isWinner = true;
      }
      
    });
  });
})();

function newSquares() {
  const empty = [];
  for(let i = 0; i < boardStatus.length; i++){
    if(boardStatus[i] == undefined){
      empty[i] = i;
    } else empty[i] = boardStatus[i]
  }
  return empty
}

function emptySquares(board) {
  return boardStatus.filter(s => typeof s == 'number')
}

const aiCheck = (board, player) => {
  let plays = board.reduce((a, e, i) =>
      (e === player) ? a.concat(i) : a, []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
      if (win.every(elem => plays.indexOf(elem) > -1)) {
          gameWon = { index: index, player: player };
          break;
      }
  }
  return gameWon;
};

function minimax(newBoard, player) {
  var availSpots = emptySquares();

  if (aiCheck(newBoard, players.human)) {
      return { score: -10 };
  } else if (aiCheck(newBoard, players.ai)) {
      return { score: 10 };
  } else if (availSpots.length === 0) {
      return { score: 0 };
  }
  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
      var move = {};
      move.index = newBoard[availSpots[i]];
      newBoard[availSpots[i]] = player;

      if (player == players.ai) {
          var result = minimax(newBoard, players.human);
          move.score = result.score;
      } else {
          var result = minimax(newBoard, players.ai);
          move.score = result.score;
      }

      newBoard[availSpots[i]] = move.index;

      moves.push(move);
  }

  var bestMove;
  if (player === players.ai) {
      var bestScore = -10000;
      for (var i = 0; i < moves.length; i++) {
          if (moves[i].score > bestScore) {
              bestScore = moves[i].score;
              bestMove = i;
          }
      }
  } else {
      var bestScore = 10000;
      for (var i = 0; i < moves.length; i++) {
          if (moves[i].score < bestScore) {
              bestScore = moves[i].score;
              bestMove = i;
          }
      }
  }

  return moves[bestMove];
}

const randomAiPick = () => {
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



const resetButton = document.getElementById("reset");
resetButton.addEventListener("click", () => init());

const choosePlayer = () => {
  return turn % 2 == 0 ? players.ai : players.human;
};

const render = (cell) => {
    cell.innerHTML += choosePlayer();
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

