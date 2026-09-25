// Game variables
let board = ["", "", "", "", "", "", "", ""];

let humanPlayer = "X";
let aiPlayer = "O";

let gameActive = true;
let humanTurn = true;
let humanScore = 0;
let aiScore = 0;
let drawScore = 0;


// Get HTML elements
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");


// Winning patterns
const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
];


// Check result for any board
function getResult(currentBoard) {

    for (let pattern of winningPatterns) {

        const a = pattern[0];
        const b = pattern[1];
        const c = pattern[2];

        if (
            currentBoard[a] !== "" &&
            currentBoard[a] === currentBoard[b] &&
            currentBoard[a] === currentBoard[c]
        ) {
            return currentBoard[a];
        }
    }

    if (!currentBoard.includes("")) {
        return "DRAW";
    }

    return null;
}


// Check winner of actual game
function checkWinner() {

    const result = getResult(board);

    if (result === humanPlayer || result === aiPlayer) {

        for (let pattern of winningPatterns) {

            const a = pattern[0];
            const b = pattern[1];
            const c = pattern[2];

            if (
                board[a] !== "" &&
                board[a] === board[b] &&
                board[a] === board[c]
            ) {
                cells[a].classList.add("winner");
                cells[b].classList.add("winner");
                cells[c].classList.add("winner");

                break;
            }
        }
    }

    return result;
}


// Human move
cells.forEach(function(cell) {

    cell.addEventListener("click", function() {

        const index = Number(cell.getAttribute("data-index"));

        // Ignore invalid moves
        if (
            board[index] !== "" ||
            !gameActive ||
            !humanTurn
        ) {
            return;
        }


        // Place X
        board[index] = humanPlayer;
        cell.textContent = humanPlayer;


        // Check result
        const result = checkWinner();

       if (result === humanPlayer) {

    humanScore++;
    updateScoreBoard();

    statusText.textContent = "You Win! 🎉";
    gameActive = false;
    return;
}

if (result === "DRAW") {

    drawScore++;
    updateScoreBoard();

    statusText.textContent = "It's a Draw! 🤝";
    gameActive = false;
    return;
}


        // AI turn
        humanTurn = false;
        statusText.textContent = "AI is thinking... 🤖";
statusText.classList.add("ai-thinking");

        setTimeout(aiMove, 500);

    });

});


// Minimax algorithm
function minimax(newBoard, depth, isMaximizing) {

    const result = getResult(newBoard);


    if (result === aiPlayer) {
        return 10 - depth;
    }

    if (result === humanPlayer) {
        return depth - 10;
    }

    if (result === "DRAW") {
        return 0;
    }


    if (isMaximizing) {

        let bestScore = -Infinity;

        for (let i = 0; i < newBoard.length; i++) {

            if (newBoard[i] === "") {

                newBoard[i] = aiPlayer;

                const score =
                    minimax(newBoard, depth + 1, false);

                newBoard[i] = "";

                bestScore = Math.max(bestScore, score);
            }
        }

        return bestScore;

    } else {

        let bestScore = Infinity;

        for (let i = 0; i < newBoard.length; i++) {

            if (newBoard[i] === "") {

                newBoard[i] = humanPlayer;

                const score =
                    minimax(newBoard, depth + 1, true);

                newBoard[i] = "";

                bestScore = Math.min(bestScore, score);
            }
        }

        return bestScore;
    }
}


// AI move
function aiMove() {
    statusText.classList.remove("ai-thinking");

    if (!gameActive) {
        return;
    }


    let bestScore = -Infinity;
    let bestMove = -1;


    // Find best move
    for (let i = 0; i < board.length; i++) {

        if (board[i] === "") {

            board[i] = aiPlayer;

            const score =
                minimax(board, 0, false);

            board[i] = "";


            if (score > bestScore) {

                bestScore = score;
                bestMove = i;
            }
        }
    }


    // Place O
    if (bestMove !== -1) {

        board[bestMove] = aiPlayer;
        cells[bestMove].textContent = aiPlayer;
    }


    // Check result
    const result = checkWinner();


   if (result === aiPlayer) {

    aiScore++;
    updateScoreBoard();

    statusText.textContent = "AI Wins! 🤖";
    gameActive = false;
    return;
}

if (result === "DRAW") {

    drawScore++;
    updateScoreBoard();

    statusText.textContent = "It's a Draw! 🤝";
    gameActive = false;
    return;
}


    // Back to human
    humanTurn = true;
    statusText.textContent = "Your Turn — You are X";
}
function updateScoreBoard() {

    document.getElementById("humanScore").textContent = humanScore;
    document.getElementById("aiScore").textContent = aiScore;
    document.getElementById("drawScore").textContent = drawScore;

}

// Reset game
function resetGame() {

    board = ["", "", "", "", "", "", "", ""];

    gameActive = true;
    humanTurn = true;


    cells.forEach(function(cell) {

        cell.textContent = "";
        cell.classList.remove("winner");

    });


    statusText.textContent = "Your Turn — You are X";
    updateScoreBoard();
}