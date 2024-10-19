// Obtener el elemento canvas del DOM y su contexto 2D
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Definir las dimensiones del tablero
const ROWS = 20;
const COLS = 15;
// Calcular el tamaño de cada bloque basado en la altura del canvas
const BLOCK_SIZE = canvas.height / ROWS;

// Ajustar el ancho del canvas para que coincida con el número de columnas
canvas.width = BLOCK_SIZE * COLS;

// Definir los Tetriminos con sus formas y colores
const tetriminos = [
    { shape: [[1, 1, 1, 1]], color: 'cyan' },           // I
    { shape: [[1, 1, 1], [0, 1, 0]], color: 'purple' }, // T
    { shape: [[1, 1, 1], [1, 0, 0]], color: 'orange' }, // L
    { shape: [[1, 1, 1], [0, 0, 1]], color: 'blue' },   // J
    { shape: [[1, 1], [1, 1]], color: 'yellow' },       // O
    { shape: [[1, 1, 0], [0, 1, 1]], color: 'red' },    // Z
    { shape: [[0, 1, 1], [1, 1, 0]], color: 'green' },  // S
];

// Inicializar el tablero de juego
let board = createBoard();
// Variable para almacenar el Tetrimino actual
let currentTetrimino;
// Posición inicial del Tetrimino (fila)
let currentRow = 0;
// Posición inicial del Tetrimino (columna, centrado)
let currentCol = Math.floor(COLS / 2) - 1;

// Función para crear un tablero vacío
function createBoard() {
    // Crear un array 2D lleno de ceros
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

// Función para dibujar un bloque individual
function drawBlock(x, y, color) {
    // Establecer el color de relleno
    ctx.fillStyle = color;
    // Dibujar un rectángulo relleno
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    // Establecer el color del borde
    ctx.strokeStyle = 'black';
    // Dibujar el borde del rectángulo
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

// Función para dibujar todo el tablero
function drawBoard() {
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Recorrer cada celda del tablero
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            // Si la celda no está vacía, dibujar un bloque
            if (cell) {
                drawBlock(colIndex, rowIndex, cell);
            }
        });
    });
}

// Función para dibujar el Tetrimino actual
function drawTetrimino() {
    // Recorrer la forma del Tetrimino actual
    currentTetrimino.shape.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            // Si la celda no está vacía, dibujar un bloque
            if (cell) {
                drawBlock(currentCol + colIndex, currentRow + rowIndex, currentTetrimino.color);
            }
        });
    });
}

// Función para mover el Tetrimino hacia abajo
function moveDown() {
    // Verificar si el movimiento es válido
    if (validMove(currentTetrimino.shape, currentRow + 1, currentCol)) {
        // Si es válido, mover el Tetrimino una fila hacia abajo
        currentRow++;
    } else {
        // Si no es válido, fusionar el Tetrimino con el tablero
        mergeTetrimino();
        // Eliminar las líneas completas
        clearLines();
        // Obtener un nuevo Tetrimino aleatorio
        currentTetrimino = getRandomTetrimino();
        // Reiniciar la posición
        currentRow = 0;
        currentCol = Math.floor(COLS / 2) - 1;
        // Verificar si el juego ha terminado
        if (!validMove(currentTetrimino.shape, currentRow, currentCol)) {
            alert('¡Juego terminado!');
            clearInterval(gameLoop);
        }
    }
}

// Función para verificar si un movimiento es válido
function validMove(shape, row, col) {
    // Verificar cada celda del Tetrimino
    return shape.every((rowArray, rowIndex) => {
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

// Función para fusionar el Tetrimino con el tablero
function mergeTetrimino() {
    currentTetrimino.shape.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell) {
                const boardRow = currentRow + rowIndex;
                const boardCol = currentCol + colIndex;
                board[boardRow][boardCol] = currentTetrimino.color;
            }
        });
    });
}

// Función para eliminar las líneas completas
function clearLines() {
    let linesCleared = 0;
    for (let row = ROWS - 1; row >= 0; row--) {
        // Si la fila está llena
        if (board[row].every(cell => cell !== 0)) {
            // Eliminar la fila
            board.splice(row, 1);
            // Añadir una nueva fila vacía en la parte superior
            board.unshift(Array(COLS).fill(0));
            linesCleared++;
            row++; // Verificar la misma fila de nuevo
        }
    }
    // Aquí se podría añadir un sistema de puntuación
}

// Función para obtener un Tetrimino aleatorio
function getRandomTetrimino() {
    const index = Math.floor(Math.random() * tetriminos.length);
    return tetriminos[index];
}

// Función para rotar el Tetrimino actual
function rotateTetrimino() {
    const rotated = [];
    for (let col = 0; col < currentTetrimino.shape[0].length; col++) {
        rotated[col] = [];
        for (let row = currentTetrimino.shape.length - 1; row >= 0; row--) {
            rotated[col].push(currentTetrimino.shape[row][col]);
        }
    }
    // Si la rotación es válida, aplicarla
    if (validMove(rotated, currentRow, currentCol)) {
        currentTetrimino.shape = rotated;
    }
}

// Función para manejar las teclas presionadas
function handleKeyPress(event) {
    switch (event.key) {
        case 'ArrowLeft':
            // Mover a la izquierda si es válido
            if (validMove(currentTetrimino.shape, currentRow, currentCol - 1)) {
                currentCol--;
            }
            break;
        case 'ArrowRight':
            // Mover a la derecha si es válido
            if (validMove(currentTetrimino.shape, currentRow, currentCol + 1)) {
                currentCol++;
            }
            break;
        case 'ArrowDown':
            // Mover hacia abajo
            moveDown();
            break;
        case 'ArrowUp':
            // Rotar el Tetrimino
            rotateTetrimino();
            break;
    }
}

// Iniciar el juego con un Tetrimino aleatorio
currentTetrimino = getRandomTetrimino();
// Configurar el bucle principal del juego
const gameLoop = setInterval(() => {
    moveDown();
    drawBoard();
    drawTetrimino();
}, 500);

// Agregar el evento de escucha para las teclas
document.addEventListener('keydown', handleKeyPress);