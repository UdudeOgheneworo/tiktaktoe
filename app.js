const gameBody = document.querySelector(".container");
const playerOneScore = gameBody.querySelector("#playerOne");
const playerTwoScore = gameBody.querySelector("#playerTwo");
const displayWinner = gameBody.querySelector(".displayWinner");
const playerTurnDisplay = gameBody.querySelector("#player ");
const squares = [...gameBody.querySelectorAll(".squares")];
const form = gameBody.querySelector("form");
const upto = gameBody.querySelector("#upto");
const reset = gameBody.querySelector("#reset");
const aside = gameBody.querySelector("aside");
let player = "X";
let playUpto;
let playerA = "X";
let playerB = "O";
let displayPlayer = "A";
let playerStart = "A";
let state = "playing";
let path;
let pathIndex;
let winner;
let tray = [];

const gameBoard = {
  row: [[], [], []],
  column: [[], [], []],
  diagonal: [[], []],
};

upto.addEventListener("change", () => {
  playUpto = upto.value;
  upto.disabled = "true";
  aside.style.display = "none";
});

squares.forEach((el, idx, arr) => {
  el.addEventListener("click", () => {
    if (state != "playing") return;
    if (el.childNodes[1].innerText) return;
    updateSquare(idx, arr);
    storePositionPicked(idx);
    changeTurn();
    checkStatus();
    displayTurn();
    updateScore();
    end();
    if (state == "won") paintSquares();
    if (state == "won" || state == "draw") {
      setTimeout(resetDisplay, 3000);
    }
  });
});

reset.addEventListener("click", () => {
  upto.removeAttribute("disabled");
  resetDisplay();
  playerA = "X";
  playerB = "O";
  upto.value = "...";
  displayPlayer = "A";
  playerStart = "A";
  aside.style.display = "flex";
  playerOneScore.innerHTML = "0";
  playerTwoScore.innerHTML = "0";
});

function updateSquare(idx, arr) {
  arr[idx].firstElementChild.innerHTML = player;
}

function storePositionPicked(idx) {
  if (idx == 0 || idx == 4 || idx == 8) gameBoard.diagonal[0].push(player);
  if (idx == 2 || idx == 4 || idx == 6) gameBoard.diagonal[1].push(player);
  let rowIndex = Math.floor(idx / 3);
  gameBoard.row[rowIndex].push(player);
  let columnIndex = idx % 3;
  gameBoard.column[columnIndex].push(player);
}

function checkStatus() {
  if (gameBoard["row"].every((el) => el.length == 3)) {
    state = "draw";
  }
  for (paths in gameBoard) {
    for (let i = 0; i < 3; i++) {
      if (!gameBoard[paths][i]) return;
      if (
        gameBoard[paths][i].length == 3 &&
        gameBoard[paths][i].every((el, index, arr) => el == arr[0])
      ) {
        state = "won";
        path = paths;
        pathIndex = i;
        winner = gameBoard[path][pathIndex][0];
      }
    }
  }
}

function displayTurn() {
  if (state == "playing") {
    if (displayPlayer == "A") {
      displayPlayer = "B";
      playerTurnDisplay.innerHTML = displayPlayer;
    } else {
      displayPlayer = "A";
      playerTurnDisplay.innerHTML = displayPlayer;
    }
  } else {
    if (playerStart == "A") {
      playerStart = "B";
    } else {
      playerStart = "A";
    }
    displayPlayer = playerStart;
    displayWinner.innerHTML = state;
    setTimeout(timeDisplay, 2000);
  }
}

function timeDisplay() {
  displayWinner.innerHTML = "";
  const textOne = document.createTextNode("player");
  const newSpan = document.createElement("span");
  newSpan.id = "player";
  const spanText = document.createTextNode(displayPlayer);

  newSpan.append(spanText);
  const textTwo = document.createTextNode("turn");
  displayWinner.append(textOne);
  displayWinner.append(newSpan);
  displayWinner.append(textTwo);
  console.dir(displayWinner);
  // displayWinner.innerHTML = `player <span id="player">${displayPlayer}</span> <span id="state">turn</span>`;
}

function updateScore() {
  if (state != "won") return;
  if (playerA == winner) {
    playerOneScore.innerHTML = parseInt(playerOneScore.innerHTML) + 1;
  } else {
    playerTwoScore.innerHTML = parseInt(playerTwoScore.innerHTML) + 1;
  }
  if (playerA == "X") {
    playerA = "O";
    playerB = "X";
  } else {
    playerB = "O";
    playerA = "X";
  }
}

function toPaint(coloredPath, coloredIndex) {
  if (coloredPath == "row") {
    coloredIndex = coloredIndex * 3;
  }
  if (coloredPath == "diagonal") {
    if (coloredIndex == 0) {
      tray = [0, 4, 8];
    } else {
      tray = [2, 4, 6];
    }
  }
  for (let i = 0; i < 3; i++) {
    if (coloredPath == "row") {
      tray.push(coloredIndex);
      coloredIndex++;
    }
    if (coloredPath == "column") {
      tray.push(coloredIndex);
      coloredIndex = coloredIndex + 3;
    }
  }
}

function paintSquares() {
  toPaint(path, pathIndex);
  for (let i = 0; i < 3; i++) {
    squares[tray[i]].style.backgroundColor = "green";
  }
}

function resetDisplay() {
  gameBoard["row"] = [[], [], []];
  gameBoard["column"] = [[], [], []];
  gameBoard["diagonal"] = [[], []];
  for (let i = 0; i < squares.length; i++) {
    squares[i].firstElementChild.innerText = "";
    squares[i].style.backgroundColor = "blue";
  }
  state = "playing";
  player = "X";
  tray = [];
}
function changePlayer() {}

function changeTurn() {
  if (player == "X") {
    player = "O";
  } else {
    player = "X";
  }
}
function end() {
  if (
    playUpto == playerOneScore.innerHTML ||
    playUpto == playerTwoScore.innerHTML
  ) {
    state = "end";
    displayWinner.innerHTML = state;
  }
}
