// TODO:
// Change the draw funtionality, turn 9 doesn't mean there is a draw.   
// When player is O, the ai can still play on the last available spot but is not allowed.

const players = {
  empty: "",
  human: null,
  ai: null,
};

const board = document.getElementById("board").children; 
const popup = document.querySelector('.win-result')
let isWinner;
let turn;
let isDraw;
let boardStatus;
let aiScore = 0;
let playerScore = 0; 
let scoreboard = document.querySelector(".score").children;

const init = () => {
  // Hide winner popup'
  scoreboard[0].innerHTML = `Computer: ${aiScore}`
  scoreboard[1].innerHTML = `Player: ${playerScore}`
  popup.classList.remove("active");
  popup.innerText = "";
  turn = 0
  isWinner = false;
  isDraw = false;
  // Empty board
  for (const cell in board) {
    board[cell].innerHTML = players.empty
  }
  // board.forEach(cell => cell.innerHTML = players.empty);
  boardStatus = Array.from(Array(9).keys()); 
  setPlayerSelection();
  handleTurnOne();
};

const setPlayerSelection = () => {
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
    const index = Math.floor(Math.random() * 9); // More interesting if first computer turn is random
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

const handleClick = (event) => {
  const cell = event.target
  
  if(isDraw) {
    console.log('draw')
    return
  }

  if (!cell.innerText && !isWinner) { // player turn
    turn++;
    render(cell);
    addPlayers();
  }

  let playerWin = checkWin(boardStatus);

  if (!playerWin) { // AI Turn
    const index = bestSpot(players.ai);
    if(index === undefined){
      checkDraw(boardStatus)
      return
    } 
    board[index].innerHTML = players.ai;
    addPlayers();
    changeTurn();
  }
  let aiWin = checkWin(boardStatus)

  if (aiWin && popup.innerText == "") {
    let winner = aiWin;
    isWinner = true;
    popup.innerText = `${winner} Wins!!`;
    updateScore(winner);
  }
  checkDraw(boardStatus)
};

function checkDraw(board) {
  if(checkWin(boardStatus)){
    return
  }
  if(board.filter(c => typeof c === 'string').length == 9){
    isDraw = true
    popup.innerHTML += "It's a Draw!"
  }
}

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
  return boardStatus.filter(s => typeof s == "number");
}

function updateScore(winner) {
  if(!winner){
    return
  }
  let aiScoreDisplay = scoreboard[0];
  let humanScoreDisplay = scoreboard[1];

  winner == players.human ? playerScore++ : aiScore++
  aiScoreDisplay.innerHTML = `Computer: ${aiScore}`;
  humanScoreDisplay.innerHTML = `Player: ${playerScore}`;
}

const aiCheck = (board, player) => {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);

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

const changeTurn = () => {
  if (!isWinner) {
    turn++;
  }
};

const addPlayers = () => {
  for (let i = 0; i < board.length; i++) {
    if (board[i].innerHTML != "") {
      boardStatus[i] = board[i].innerHTML;
    }
  }
};


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

//returns a board that is in a better form for the ai
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

init(); // Initializes players for first turn

for (const cell in board) {
  if(typeof board[cell]== 'object'){
    board[cell].addEventListener("click", handleClick)
  }
}

const resetButton = document.querySelector("#reset");
const selectionDiv = document.querySelector(".player-selection");

const selectionButtons = document.querySelectorAll(".selection");

resetButton.addEventListener("click", init);

selectionDiv.addEventListener("click", () => {
  selectionButtons.forEach( button => button.classList.toggle("selected"));
  init();
  handleTurnOne();
});

