// dom elements
const cells = document.querySelectorAll('.cell');
const gridContainer = document.querySelector('.grid-container');
const endNote = document.querySelector('.end-note');
const restartScreen = document.querySelector('.restart-screen');
const restartButton = document.querySelector('.restart-btn');
const blackScreen = document.querySelector('.black-screen');

// main game
(function() {
let board = ['', '', '', '', '', '', '', '', ''];
let origBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const huPlayer = "X";
const aiPlayer = "O";
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
];

setTimeout(firstMove, 3500);
setTimeout(() => gridContainer.style.cursor = 'default', 3500);
let animationComplete = false;
setTimeout(() => animationComplete = true, 3500);
cells.forEach(cell => cell.addEventListener('click', playerMove, true));

function firstMove() {
  player = aiPlayer;
  let randomMove = Math.floor(Math.random() * 8) + 0;
  origBoard[randomMove] = aiPlayer;
  render();
};

function playerMove(e) {
  if (animationComplete === true && board[e.target.getAttribute("data-position")] === '') {
    player = huPlayer;
    origBoard[e.target.getAttribute("data-position")] = huPlayer;
    gridContainer.style.pointerEvents = 'none';
    render();
    setTimeout(aiMove, 1000);
  }
};

function aiMove() {
  player = aiPlayer;
  let bestMove = minimax(origBoard, aiPlayer).index;
  origBoard[bestMove] = aiPlayer;
  render();
  gridContainer.style.pointerEvents = 'auto';
};

// function for rendering the board to UI
function render() {
  for (let i = 0; i < cells.length; i++) {
    if (origBoard[i] === 'X' || origBoard[i] === 'O') {
      board[i] = origBoard[i];
      cells[i].style.cursor = 'not-allowed';
    }
    cells[i].textContent = board[i];
  }
  gameOver(board, player);
};

// function that checks winning situation
function gameOver(board, player) {
  for (let combo of winCombos) {
    if (combo.every(check) === false && emptySpots(board).length === 0) {
      restart('DRAW');
    } else if (combo.every(check) === true) {
      for (let index of combo) {
        cells[index].style.backgroundColor = 'crimson';
        cells[index].style.transitionDuration = '1s';
        restart('YOU LOSE!')
      }
    }
  }

  function check(index) {
    return board[index] === player;
  }
};

// restart screen loader
function restart(result) {
  cells.forEach(cell => cell.removeEventListener('click', playerMove, true));
  gridContainer.style.pointerEvents = 'none';
  gridContainer.style.cursor = 'not-allowed';
  blackScreen.style.display = 'block';
  restartScreen.style.display = 'flex';
  restartScreen.addEventListener('click', () => window.location.reload());
  endNote.textContent = result
};

function emptySpots(board) {
  return board.filter(s => s != "O" && s != "X");
};

function winning(board, player) {
  if (
    (board[0] == player && board[1] == player && board[2] == player) ||
    (board[3] == player && board[4] == player && board[5] == player) ||
    (board[6] == player && board[7] == player && board[8] == player) ||
    (board[0] == player && board[3] == player && board[6] == player) ||
    (board[1] == player && board[4] == player && board[7] == player) ||
    (board[2] == player && board[5] == player && board[8] == player) ||
    (board[0] == player && board[4] == player && board[8] == player) ||
    (board[2] == player && board[4] == player && board[6] == player)
  ) {
    return true;
  } else {
    return false;
  }
};


//minimax algorithm for unbeatable ai
function minimax(newBoard, player, depth = 0) {

  let availableSpots = emptySpots(newBoard);

  if (winning(newBoard, huPlayer)) {
    return {
      score: -10 + depth
    };
  } else if (winning(newBoard, aiPlayer)) {
    return {
      score: 10 - depth
    };
  } else if (availableSpots.length === 0) {
    return {
      score: 0
    };
  }

  let moves = [];

  for (let i = 0; i < availableSpots.length; i++) {
    let move = {};
    move.index = newBoard[availableSpots[i]];
    newBoard[availableSpots[i]] = player;

    if (player == aiPlayer) {
      let result = minimax(newBoard, huPlayer, depth + 1);
      move.score = result.score;
    } else {
      let result = minimax(newBoard, aiPlayer, depth + 1);
      move.score = result.score;
    }
    newBoard[availableSpots[i]] = move.index;
    moves.push(move);
  }

  let bestMove;

  if (player === aiPlayer) {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = +Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
};

})();