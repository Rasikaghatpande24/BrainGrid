// Complete JavaScript Code for BrainGrid Tic Tac Toe (Human vs Computer)

let board = ['', '', '', '', '', '', '', '', ''];
let playerSymbol = '';
let computerSymbol = '';
let currentTurn = '';
let isGameStarted = false;
let gameOver = false;

// Modal utilities
function showModal(message) {
  const modal = document.getElementById('modal');
  const modalMessage = document.getElementById('modal-message');
  modalMessage.textContent = message;
  modal.style.display = 'block';
}

document.getElementById('modal-close-btn').addEventListener('click', () => {
  document.getElementById('modal').style.display = 'none';
});

// Start Game Button
const startBtn = document.getElementById('start-btn');
startBtn.addEventListener('click', () => {
  document.getElementById('symbol-modal').style.display = 'block';
  startBtn.style.display = 'none';
});

function chooseSymbol(symbol) {
  playerSymbol = symbol;
  computerSymbol = symbol === 'X' ? 'O' : 'X';
  document.getElementById('symbol-modal').style.display = 'none';
  document.getElementById('start-screen').style.display = 'block';
}

function startGame(firstPlayer) {
  isGameStarted = true;
  currentTurn = firstPlayer;
  document.getElementById('start-screen').style.display = 'none';
  renderBoard();
  if (firstPlayer === 'computer') {
    setTimeout(() => {
      computerMove();
      currentTurn = 'human';
    }, 500);
  }
}

function renderBoard() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    const index = parseInt(cell.getAttribute('data-index'));
    cell.textContent = board[index];
    cell.classList.remove('taken');
    if (board[index] !== '') cell.classList.add('taken');
  });
}

function makeMove(index, symbol) {
  if (board[index] !== '') {
    showModal('Invalid move!');
    return false;
  }

  board[index] = symbol;
  const cell = document.querySelector(`.cell[data-index='${index}']`);
  cell.textContent = symbol;
  cell.classList.add('taken');

  if (checkWinner(symbol)) {
    gameOver = true;
    showModal(symbol === playerSymbol ? '🎉 Congratulations! You win!' : '😈 Computer wins!');
    document.getElementById('play-again-btn').style.display = 'block';
    return true;
  }

  if (board.every(cell => cell !== '')) {
    gameOver = true;
    showModal("🤝 It's a draw!");
    document.getElementById('play-again-btn').style.display = 'block';
    return true;
  }

  return true;
}

function computerMove() {
  if (gameOver) return;

  let moveMade = false;

  // Try to win
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = computerSymbol;
      if (checkWinner(computerSymbol)) {
        makeMove(i, computerSymbol);
        moveMade = true;
        break;
      }
      board[i] = '';
    }
  }

  // Try to block player from winning
  if (!moveMade) {
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = playerSymbol;
        if (checkWinner(playerSymbol)) {
          board[i] = computerSymbol;
          makeMove(i, computerSymbol);
          moveMade = true;
          break;
        }
        board[i] = '';
      }
    }
  }

  // Choose center if available
  if (!moveMade && board[4] === '') {
    makeMove(4, computerSymbol);
    moveMade = true;
  }

  // Choose a corner
  if (!moveMade) {
    const corners = [0, 2, 6, 8];
    for (let i of corners) {
      if (board[i] === '') {
        makeMove(i, computerSymbol);
        moveMade = true;
        break;
      }
    }
  }

  // Choose a side
  if (!moveMade) {
    const sides = [1, 3, 5, 7];
    for (let i of sides) {
      if (board[i] === '') {
        makeMove(i, computerSymbol);
        moveMade = true;
        break;
      }
    }
  }

  renderBoard();
}

function checkWinner(symbol) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  return winPatterns.some(pattern =>
    pattern.every(index => board[index] === symbol)
  );
}

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  gameOver = false;
  isGameStarted = false;
  document.getElementById('start-screen').style.display = 'block';
  document.getElementById('play-again-btn').style.display = 'none';
  renderBoard();
  document.getElementById('start-btn').style.display = 'block';
}

document.getElementById('play-again-btn').addEventListener('click', resetGame);

document.querySelectorAll('.cell').forEach(cell => {
  cell.addEventListener('click', () => {
    if (!isGameStarted || gameOver) return;

    const index = parseInt(cell.getAttribute('data-index'));
    if (currentTurn === 'human' && board[index] === '') {
      if (makeMove(index, playerSymbol)) {
        currentTurn = 'computer';
        setTimeout(() => {
          computerMove();
          if (!gameOver) {
            currentTurn = 'human';
            showModal('Your turn');
          }
        }, 500);
      }
    } else if (currentTurn === 'human') {
      showModal('Invalid move!');
    }
  });
});
