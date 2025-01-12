const boardSize = 4;
let board;
let score;
let newTiles = []; // Track new tiles for animation
let mergedTiles = []; // Track merged tiles for animation

document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    document.getElementById('reset-button').addEventListener('click', initializeGame);
    document.addEventListener('keydown', handleKeyPress);
});

function initializeGame() {
    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
    score = 0;
    newTiles = [];
    mergedTiles = [];
    updateScore();
    addRandomTile();
    addRandomTile();
    renderBoard();
}

function renderBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const value = board[row][col];
            if (value !== 0) {
                const tile = document.createElement('div');
                tile.classList.add('tile');
                tile.textContent = value;
                tile.style.backgroundColor = getTileColor(value);
                tile.style.top = `${row * 110 + 10}px`;
                tile.style.left = `${col * 110 + 10}px`;

                // Add animation for new tiles
                if (isNewTile(row, col)) {
                    tile.classList.add('new');
                }

                // Add animation for merged tiles
                if (isMergedTile(row, col)) {
                    tile.classList.add('merged');
                }

                gameBoard.appendChild(tile);
            }
        }
    }

    // Clear new and merged tiles after rendering
    newTiles = [];
    mergedTiles = [];
}

function isNewTile(row, col) {
    return newTiles.some(tile => tile.row === row && tile.col === col);
}

function isMergedTile(row, col) {
    return mergedTiles.some(tile => tile.row === row && tile.col === col);
}

function getTileColor(value) {
    const colors = {
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f65e3b',
        128: '#edcf72',
        256: '#edcc61',
        512: '#edc850',
        1024: '#edc53f',
        2048: '#edc22e'
    };
    return colors[value] || '#cdc1b4';
}

function addRandomTile() {
    const emptyTiles = [];
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col] === 0) {
                emptyTiles.push({ row, col });
            }
        }
    }
    if (emptyTiles.length > 0) {
        const { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[row][col] = Math.random() < 0.9 ? 2 : 4;
        newTiles.push({ row, col }); // Track new tiles for animation
    }
}

function handleKeyPress(event) {
    const key = event.key;
    let moved = false;

    if (key === 'ArrowUp') {
        moved = moveUp();
    } else if (key === 'ArrowDown') {
        moved = moveDown();
    } else if (key === 'ArrowLeft') {
        moved = moveLeft();
    } else if (key === 'ArrowRight') {
        moved = moveRight();
    }

    if (moved) {
        addRandomTile();
        renderBoard();
        updateScore();
        if (isGameOver()) {
            alert('Game Over!');
        }
    }
}

function moveUp() {
    let moved = false;
    for (let col = 0; col < boardSize; col++) {
        for (let row = 1; row < boardSize; row++) {
            if (board[row][col] !== 0) {
                let currentRow = row;
                while (currentRow > 0 && board[currentRow - 1][col] === 0) {
                    board[currentRow - 1][col] = board[currentRow][col];
                    board[currentRow][col] = 0;
                    currentRow--;
                    moved = true;
                }
                if (currentRow > 0 && board[currentRow - 1][col] === board[currentRow][col]) {
                    board[currentRow - 1][col] *= 2;
                    score += board[currentRow - 1][col];
                    board[currentRow][col] = 0;
                    mergedTiles.push({ row: currentRow - 1, col }); // Track merged tiles for animation
                    moved = true;
                }
            }
        }
    }
    return moved;
}

function moveDown() {
    let moved = false;
    for (let col = 0; col < boardSize; col++) {
        for (let row = boardSize - 2; row >= 0; row--) {
            if (board[row][col] !== 0) {
                let currentRow = row;
                while (currentRow < boardSize - 1 && board[currentRow + 1][col] === 0) {
                    board[currentRow + 1][col] = board[currentRow][col];
                    board[currentRow][col] = 0;
                    currentRow++;
                    moved = true;
                }
                if (currentRow < boardSize - 1 && board[currentRow + 1][col] === board[currentRow][col]) {
                    board[currentRow + 1][col] *= 2;
                    score += board[currentRow + 1][col];
                    board[currentRow][col] = 0;
                    mergedTiles.push({ row: currentRow + 1, col }); // Track merged tiles for animation
                    moved = true;
                }
            }
        }
    }
    return moved;
}

function moveLeft() {
    let moved = false;
    for (let row = 0; row < boardSize; row++) {
        for (let col = 1; col < boardSize; col++) {
            if (board[row][col] !== 0) {
                let currentCol = col;
                while (currentCol > 0 && board[row][currentCol - 1] === 0) {
                    board[row][currentCol - 1] = board[row][currentCol];
                    board[row][currentCol] = 0;
                    currentCol--;
                    moved = true;
                }
                if (currentCol > 0 && board[row][currentCol - 1] === board[row][currentCol]) {
                    board[row][currentCol - 1] *= 2;
                    score += board[row][currentCol - 1];
                    board[row][currentCol] = 0;
                    mergedTiles.push({ row, col: currentCol - 1 }); // Track merged tiles for animation
                    moved = true;
                }
            }
        }
    }
    return moved;
}

function moveRight() {
    let moved = false;
    for (let row = 0; row < boardSize; row++) {
        for (let col = boardSize - 2; col >= 0; col--) {
            if (board[row][col] !== 0) {
                let currentCol = col;
                while (currentCol < boardSize - 1 && board[row][currentCol + 1] === 0) {
                    board[row][currentCol + 1] = board[row][currentCol];
                    board[row][currentCol] = 0;
                    currentCol++;
                    moved = true;
                }
                if (currentCol < boardSize - 1 && board[row][currentCol + 1] === board[row][currentCol]) {
                    board[row][currentCol + 1] *= 2;
                    score += board[row][currentCol + 1];
                    board[row][currentCol] = 0;
                    mergedTiles.push({ row, col: currentCol + 1 }); // Track merged tiles for animation
                    moved = true;
                }
            }
        }
    }
    return moved;
}

function updateScore() {
    document.getElementById('score').textContent = score;
}

function isGameOver() {
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col] === 0) {
                return false;
            }
            if (row < boardSize - 1 && board[row][col] === board[row + 1][col]) {
                return false;
            }
            if (col < boardSize - 1 && board[row][col] === board[row][col + 1]) {
                return false;
            }
        }
    }
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    document.getElementById('reset-button').addEventListener('click', initializeGame);
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme); // Add this line
    document.addEventListener('keydown', handleKeyPress);
});

function toggleTheme() {
    const body = document.body;
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
    } else {
        body.setAttribute('data-theme', 'dark');
    }
}
function moveTile(tile, newX, newY) {
    tile.classList.add('moving');
    tile.style.left = newX + 'px';
    tile.style.top = newY + 'px';
    
    setTimeout(() => {
        tile.classList.remove('moving');
    }, 300);
}

function mergeTiles(tile1, tile2) {
    const newValue = parseInt(tile1.dataset.value) * 2;
    tile2.dataset.value = newValue;
    tile2.textContent = newValue;
    tile2.classList.remove('moving');
    tile2.classList.add('merged');
    
    setTimeout(() => {
        tile2.classList.remove('merged');
    }, 400);
    
    tile1.remove();
}function mergeTiles(tile1, tile2) {
    const newValue = parseInt(tile1.dataset.value) * 2;
    
    // Add spin animation to merging tile
    tile2.classList.add('merged');
    tile2.dataset.value = newValue;
    tile2.textContent = newValue;
    
    // Update score
    updateScore(newValue);
    
    // Remove animation class after it completes
    setTimeout(() => {
        tile2.classList.remove('merged');
    }, 500);
    
    // Remove the other tile
    tile1.remove();
}
