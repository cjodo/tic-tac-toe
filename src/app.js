const gameBoard = (function () {
  var turn = 0;

  const players = {
    X: "X",
    O: "O",
    empty: null,
  };

  const init = () => {
    turn = 0;
    emptyCells();
    // for (let i = 0; i < this.board.length; i++) {  
    //   this.board[i] = this.players.empty;
    // }
    console.log("Init Called");
  };

  const choosePlayer = () => {
    if (turn < 9) {
      turn++;
      console.log(`Turn: ${turn}`);
      return turn % 2 == 0 ? players.O : players.X;
    } else console.log("Turn 10");
  };

  const render = (div) => {
    if (div.innerHTML == "") {
      div.innerHTML += choosePlayer();
      console.log(div);
    } else console.log("Occupied");
  };

  return { init, choosePlayer, render };
})();

const emptyCells = () => {
  const cells = document.querySelectorAll("[data-cell]");
  cells.forEach((cell) => (cell.innerHTML = ""));
};

const resetBtn = document.getElementById("reset");

resetBtn.addEventListener("click", () => gameBoard.init());
