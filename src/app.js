const players = {
  X: "X",
  O: "O",
  empty: "",
};

const gameBoard = (function () {
  const boardDisplay = document.getElementById("board");
  const board = [...boardDisplay.children];

  board.forEach((cell) => cell.addEventListener("click", () => render(cell)));

  var turn = 0;

  const emptyCells = () => {
    board.forEach((cell) => (cell.innerHTML = ""));
  };

  const init = () => {
    turn = 0;
    emptyCells();
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
    } else console.log("Occupied");
    console.log(div);
  };

  document.getElementById("reset").addEventListener("click", () => init());
})();
