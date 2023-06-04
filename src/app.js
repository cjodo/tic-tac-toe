(function() {
  
  const players = {
    X: "X",
    O: "O",
    empty: "",
  };
  
  const gameBoard = (function () {
  
    const boardDisplay = document.getElementById("board");
    const board = [...boardDisplay.children];
    let boardStatus = new Array(9);
  
    var turn = 0;
  
    const addPlayers = () => {                        // Refactor to work with the choose player method
      for (let i = 0; i < board.length; i++) {
        if (board[i].innerHTML != "") {
          boardStatus[i] = board[i].innerHTML;
        }
      }
    };
  
    board.forEach((cell) =>                         // Could be seperated into its own / merged with another method
      cell.addEventListener("click", () => {
        // Draws player onto the board
        render(cell);
        // Adds player to the board array 
        addPlayers();
        checkWin(boardStatus)
      })
    );
  
    const init = () => {
      turn = 0;  // Initializes turn
      board.forEach((cell) => (cell.innerHTML = players.empty)); 
      boardStatus = new Array(9);
      console.log("Init Called");
    };
  
    const resetButton = document.getElementById("reset");
    resetButton.addEventListener("click", () => init());
  
    const choosePlayer = () => {
      if (turn < 9) {
        turn++;
        console.log(`Turn: ${turn}`);
        return turn % 2 == 0 ? players.O : players.X;
      } else {
        console.log("Turn 10");
      }
    };
  
    const render = (cell) => {
      if (cell.innerHTML == "") {
        cell.innerHTML += choosePlayer();
      } else console.log("Occupied");
    };
  
    return { init, boardStatus };
  })();

  const checkWin = (board) => {
    const newBoard = buildBoard(board);
    let isWin = false;
    
    for(let row = 0; row < 3; row++){ // check for horizontal win anywhere
      let left = newBoard[row][0];
      let middle = newBoard[row][1];
      let right = newBoard[row][2];

      if(left || middle || right){ // if theres an undefined spot there can't be a win
        if(left == middle && middle == right){
          isWin = left; // Returns who won
          console.log(`${left} Wins!`);
          return isWin;
        }
      }
    }

    for(let col = 0; col < 3; col++){   // Check for vertical win
      let left = newBoard[0][col];
      let middle = newBoard[1][col];
      let right = newBoard[2][col];
      if(left || middle || right){ 
        if(left == middle && middle == right){
          isWin = left; // Returns who won
          console.log(`${left} Wins!`);
          return isWin;
        }
      }
    };
    
    // Checks for diagonal win 

    let UL = newBoard[0][0];
    let M = newBoard[1][1];
    let BR = newBoard[2][2];
    // Check the first diagonal
    if(UL || M || BR){
      if(UL == M && M == BR){
          isWin = UL; // Returns who won
          console.log(`${UL} Wins!`);
          return isWin;
      }
    }

    let UR = newBoard[0][2];
    let BL = newBoard[2][0];
    if(UR || M || BL){
      if(UR == M && M == BL){
        isWin = UR;
        console.log(`${UR} Wins!`);
        return isWin
      }
    }
    
   
    return isWin;
  }

  const buildBoard = (board) => {
    const newBoard = [[],[],[]];
    const rowsCols = 3;
    let index = 0;
    for(let i = 0; i < rowsCols; i++){
      for(let j = 0; j < rowsCols; j++){
        newBoard[i][j] = (board[index]);
        index++
      }
    }
    return newBoard
  }
  
})();

