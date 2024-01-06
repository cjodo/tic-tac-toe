const players = {
  empty: "",
};

const boardDisplay = document.getElementById("board");
const board = [...boardDisplay.children];
const popup = document.getElementById("win-result");
let isWinner = false;
let isDraw = false;
let boardStatus;
let aiScore = 0;
let playerScore = 0;
let scoreboard = document.querySelector(".score").children;

const init = () => {
  // Hide winner popup'
  popup.classList.remove("active");
  popup.innerText = "";
  isWinner = false;
  isDraw = false;
  turn = 0;
  // Empty board
  board.forEach((cell) => (cell.innerHTML = players.empty));
  boardStatus = Array.from(Array(9).keys());
  updateScore(aiScore, playerScore);
  getPlayerSelection();
  handleTurnOne();
};

const getPlayerSelection = () => {
  players.human = document.querySelector(".selected").innerHTML;
  if (players.human == "X") {
    players.ai = "O";
  } else {
    players.ai = "X";
  }
};

const handleTurnOne = () => {
  if (players.ai == "X" && turn == 0) {
    turn = 1;
<<<<<<< HEAD
    const index = Math.floor(Math.random() * 9); // More interesting if first computer turn is random
=======
    const index = Math.floor(Math.random() * 8); // More interesting if first computer turn is random
>>>>>>> edf7b47c6f4e313e44f2eea937f0d03ca31942d2
    // Computer will choose 0th every time if minimax is called
    // const index = bestSpot(players.ai)
    board[index].innerHTML = players.ai;
    addPlayers();
    changeTurn();
  }
};

const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];

// returns index of the best spot for current player
const bestSpot = (player) => {
  return minimax(boardStatus, player).index;
};

const handleClick = (() => {
  board.forEach((cell) => {
    cell.addEventListener("click", () => {
      if (!cell.innerText && !isWinner && !isDraw) {
        // changeTurn();
        turn++;
        render(cell);
        addPlayers();

        if (!checkWin(boardStatus)) {
          // Has to check that win or draw conditions aren't met before letting ai play
          if (turn == 9) {
            popup.innerHTML += "It's a Draw!";
            isDraw = true;
            return;
          } else {
            const index = bestSpot(players.ai);
            board[index].innerHTML = players.ai;
            addPlayers();
            changeTurn();
          }
        }
      }

      if (checkWin(boardStatus) && popup.innerText == "") {
        let winner = checkWin(boardStatus);
        isWinner = true;
        popup.innerText = `${winner} Wins!!`;
        switch (winner) {
          case players.human:
            playerScore += 1;
            break;
          case players.ai:
            aiScore += 1;
            break;
        }
        updateScore(aiScore, playerScore);
      }
    });
  });
})();

function newSquares() {
  const empty = [];
  for (let i = 0; i < boardStatus.length; i++) {
    if (boardStatus[i] == undefined) {
      empty[i] = i;
    } else empty[i] = boardStatus[i];
  }
  return empty;
}

function emptySquares() {
  return boardStatus.filter((s) => typeof s == "number");
}

function updateScore(aiScore, playerScore) {
  let aiScoreDisplay = scoreboard[0];
  let humanScoreDisplay = scoreboard[1];
  aiScoreDisplay.innerHTML = `Computer: ${aiScore}`;
  humanScoreDisplay.innerHTML = `Player: ${playerScore}`;
  if (aiScore > 5) {
    aiScoreDisplay.innerHTML += " <strong>You cannot win. Give up</strong>";
  }
}

const aiCheck = (board, player) => {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
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
  if (players.ai == "X") {
    return "O";
  } else if (players.ai == "O") {
    return "X";
  }
};

const render = (cell) => {
  let currPlayer = choosePlayer();
  cell.innerHTML += currPlayer;
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

init();

const selectionDiv = document.querySelector(".player-selection");
const selectionButtons = document.querySelectorAll(".selection");

selectionDiv.addEventListener("click", () => {
  selectionButtons.forEach((button) => {
    button.classList.toggle("selected");
  });
  init();
  handleTurnOne();
});
