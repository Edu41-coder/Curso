const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const ROWS = 20;
const COLS = 15; // Changed from 10 to 15
const BLOCK_SIZE = canvas.height / ROWS;

// Adjust canvas width to match the new column count
canvas.width = BLOCK_SIZE * COLS;

// Define Tetriminos
const tetriminos = [
    [[1, 1, 1, 1]],           // I
    [[1, 1, 1], [0, 1, 0]],   // T
    [[1, 1, 1], [1, 0, 0]],   // L
    [[1, 1, 1], [0, 0, 1]],   // J
    [[1, 1], [1, 1]],         // O
    [[1, 1, 0], [0, 1, 1]],   // Z
    [[0, 1, 1], [1, 1, 0]],   // S
];

let board = createBoard();
let currentTetrimino;
let currentRow = 0;
let currentCol = Math.floor(COLS / 2) - 1; // Adjust starting position

function createBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function drawBlock(x, y) {
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'gray';
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell) {
                drawBlock(colIndex, rowIndex);
            }
        });
    });
}

function drawTetrimino() {
    ctx.fillStyle = 'blue';
    currentTetrimino.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell) {
                drawBlock(currentCol + colIndex, currentRow + rowIndex);
            }
        });
    });
}

function moveDown() {
    if (validMove(currentTetrimino, currentRow + 1, currentCol)) {
        currentRow++;
    } else {
        mergeTetrimino();
        clearLines();
        currentTetrimino = getRandomTetrimino();
        currentRow = 0;
        currentCol = Math.floor(COLS / 2) - 1; // Reset to center
        if (!validMove(currentTetrimino, currentRow, currentCol)) {
            alert('Game Over!');
            clearInterval(gameLoop);
        }
    }
}

function validMove(tetrimino, row, col) {
    return tetrimino.every((rowArray, rowIndex) => {
        return rowArray.every((cell, colIndex) => {
            const nextRow = row + rowIndex;
            const nextCol = col + colIndex;
            return (
                cell === 0 ||
                (nextRow >= 0 && nextRow < ROWS && nextCol >= 0 && nextCol < COLS && board[nextRow][nextCol] === 0)
            );
        });
    });
}

function mergeTetrimino() {
    currentTetrimino.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell) {
                const boardRow = currentRow + rowIndex;
                const boardCol = currentCol + colIndex;
                board[boardRow][boardCol] = 1;
            }
        });
    });
}

function clearLines() {
    let linesCleared = 0;
    for (let row = 0; row < ROWS; row++) {
        if (board[row].every(cell => cell === 1)) {
            board.splice(row, 1);
            board.unshift(Array(COLS).fill(0));
            linesCleared++;
        }
    }
    // Scoring system can be added here
}

function getRandomTetrimino() {
    const index = Math.floor(Math.random() * tetriminos.length);
    return tetriminos[index];
}

function rotateTetrimino() {
    const rotated = [];
    for (let col = 0; col < currentTetrimino[0].length; col++) {
        rotated[col] = [];
        for (let row = currentTetrimino.length - 1; row >= 0; row--) {
            rotated[col].push(currentTetrimino[row][col]);
        }
    }
    if (validMove(rotated, currentRow, currentCol)) {
        currentTetrimino = rotated;
    }
}

function handleKeyPress(event) {
    switch (event.key) {
        case 'ArrowLeft':
            if (validMove(currentTetrimino, currentRow, currentCol - 1)) {
                currentCol--;
            }
            break;
        case 'ArrowRight':
            if (validMove(currentTetrimino, currentRow, currentCol + 1)) {
                currentCol++;
            }
            break;
        case 'ArrowDown':
            moveDown();
            break;
        case 'ArrowUp':
            rotateTetrimino();
            break;
    }
}

currentTetrimino = getRandomTetrimino();
const gameLoop = setInterval(() => {
    moveDown();
    drawBoard();
    drawTetrimino();
}, 500);

document.addEventListener('keydown', handleKeyPress);