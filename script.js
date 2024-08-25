document.addEventListener('DOMContentLoaded', function() {
    const BOARD_SIZE = 5;
    const board = [];
    let currentPlayer = 'A';
    let selectedPiece = null;
    let possibleMoves = [];

    // Initialize board with empty cells
    for (let i = 0; i < BOARD_SIZE; i++) {
        board[i] = Array(BOARD_SIZE).fill(null);
    }

    // Setup initial pieces
    board[0][0] = { type: 'P', player: 'A' };
    board[0][1] = { type: 'P', player: 'A' };
    board[0][2] = { type: '1', player: 'A' };
    board[0][3] = { type: 'P', player: 'A' };
    board[0][4] = { type: '2', player: 'A' };

    board[4][0] = { type: 'P', player: 'B' };
    board[4][1] = { type: 'P', player: 'B' };
    board[4][2] = { type: '1', player: 'B' };
    board[4][3] = { type: 'P', player: 'B' };
    board[4][4] = { type: '2', player: 'B' };

    function renderBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                if (board[i][j]) {
                    cell.textContent = board[i][j].player + board[i][j].type;
                    cell.dataset.x = i;
                    cell.dataset.y = j;
                    cell.onclick = () => handleCellClick(i, j);
                }
                boardElement.appendChild(cell);
            }
        }
    }

    function renderPieceSelection() {
        const pieceSelectionElement = document.getElementById('pieceSelection');
        pieceSelectionElement.innerHTML = '';
        const pieceList = [];
        let pieceIndex = 1;
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (board[i][j] && board[i][j].player === currentPlayer) {
                    pieceList.push({ index: pieceIndex++, x: i, y: j });
                }
            }
        }

        pieceList.forEach(piece => {
            const button = document.createElement('div');
            button.className = 'button';
            button.textContent = `${piece.index}. ${board[piece.x][piece.y].player}${board[piece.x][piece.y].type}`;
            button.onclick = () => selectPiece(piece.x, piece.y);
            pieceSelectionElement.appendChild(button);
        });
    }

    function renderMoveOptions() {
        const moveOptionsElement = document.getElementById('moveOptions');
        moveOptionsElement.innerHTML = '';
        possibleMoves.forEach((move, index) => {
            const button = document.createElement('div');
            button.className = 'button';
            button.textContent = `${index + 1}. (${move.x}, ${move.y})`;
            button.onclick = () => makeMove(move.x, move.y);
            moveOptionsElement.appendChild(button);
        });
    }

    function handleCellClick(x, y) {
        if (selectedPiece) {
            // Attempt to move the selected piece
            if (isValidMove(selectedPiece.x, selectedPiece.y, x, y)) {
                movePiece(selectedPiece.x, selectedPiece.y, x, y);
                selectedPiece = null;
                possibleMoves = [];
                renderBoard();
                updateStatus();
                renderPieceSelection();
            } else {
                alert('Invalid move!');
            }
        }
    }

    function selectPiece(x, y) {
        selectedPiece = { x, y };
        possibleMoves = getPossibleMoves(x, y);
        renderBoard();
        highlightPossibleMoves(x, y);
        renderMoveOptions();
    }

    function highlightPossibleMoves(x, y) {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            const cellX = parseInt(cell.dataset.x);
            const cellY = parseInt(cell.dataset.y);
            if (possibleMoves.some(move => move.x === cellX && move.y === cellY)) {
                cell.classList.add('highlight');
            } else {
                cell.classList.remove('highlight');
            }
        });
    }

    function getPossibleMoves(x, y) {
        const moves = [];
        const piece = board[x][y];
        const pieceType = piece.type;

        if (pieceType === 'P') {
            // Pawn moves
            if (x > 0 && !board[x - 1][y]) moves.push({ x: x - 1, y });
            if (x < BOARD_SIZE - 1 && !board[x + 1][y]) moves.push({ x: x + 1, y });
            if (y > 0 && !board[x][y - 1]) moves.push({ x, y: y - 1 });
            if (y < BOARD_SIZE - 1 && !board[x][y + 1]) moves.push({ x, y: y + 1 });
        } else if (pieceType === '1') {
            // Hero1 moves (1 or 2 steps in any direction)
            for (let dx = -2; dx <= 2; dx++) {
                for (let dy = -2; dy <= 2; dy++) {
                    if ((Math.abs(dx) > 0 || Math.abs(dy) > 0) && Math.abs(dx) + Math.abs(dy) <= 2) {
                        const nx = x + dx;
                        const ny = y + dy;
                        if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE) {
                            if (!board[nx][ny] || board[nx][ny].player !== piece.player) {
                                moves.push({ x: nx, y: ny });
                            }
                        }
                    }
                }
            }
        } else if (pieceType === '2') {
            // Hero2 moves (diagonally by 2 steps)
            for (let dx = -2; dx <= 2; dx += 2) {
                for (let dy = -2; dy <= 2; dy += 2) {
                    if ((dx !== 0 || dy !== 0) && Math.abs(dx) === Math.abs(dy)) {
                        const nx = x + dx;
                        const ny = y + dy;
                        if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE) {
                            if (!board[nx][ny] || board[nx][ny].player !== piece.player) {
                                moves.push({ x: nx, y: ny });
                            }
                        }
                    }
                }
            }
        }

        return moves;
    }

    function isValidMove(x1, y1, x2, y2) {
        return possibleMoves.some(move => move.x === x2 && move.y === y2);
    }

    function movePiece(x1, y1, x2, y2) {
        if (x2 < 0 || x2 >= BOARD_SIZE || y2 < 0 || y2 >= BOARD_SIZE) {
            alert('Move out of bounds!');
            return;
        }
        if (board[x2][y2] && board[x2][y2].player === currentPlayer) {
            alert('Cannot move to a cell occupied by your own piece!');
            return;
        }

        board[x2][y2] = board[x1][y1];
        board[x1][y1] = null;
        currentPlayer = (currentPlayer === 'A') ? 'B' : 'A';
    }

    function updateStatus() {
        const statusElement = document.getElementById('status');
        statusElement.textContent = `Player ${currentPlayer}'s turn.`;
    }

    function initGame() {
        renderBoard();
        renderPieceSelection();
        updateStatus();
    }

    initGame();
});
