const table = document.getElementById("sudoku-table");


function restrictInput() {
    const cells = table.getElementsByTagName("td");

    for (let cell of cells) {
        cell.setAttribute("contenteditable", "true");

        // Only allow one digit from 1 to 9
        cell.addEventListener("input", () => {
            const val = cell.innerText.trim();

            // If more than one character, take only first valid digit (1-9)
            if (!/^[1-9]?$/.test(val)) {
                const cleaned = val.replace(/[^1-9]/g, "").slice(0, 1);
                cell.innerText = cleaned;
            }
        });

        // Prevent typing anything other than 1-9
        cell.addEventListener("keydown", (e) => {
            const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Tab"];
            if (allowedKeys.includes(e.key)) return;

            if (!/^[1-9]$/.test(e.key)) {
                e.preventDefault();
            }
        });
    }
}

// Call this once when the page loads
window.onload = () => {
    restrictInput();
}






function getBoard(){
    board = [];
    const rows = table.getElementsByTagName("tr");

    for(let i = 0 ; i<9 ; i++){
        const row = [];
        const cols = rows[i].getElementsByTagName("td");
        for(let j = 0; j<9; j++){
            const value = cols[j].innerText.trim();
            row.push(value === "" ? 0 : parseInt(value));
        }
        board.push(row);
    }
    return board;

}


function setBoard(board){
    const rows = table.getElementsByTagName("tr");
    for(let i= 0 ; i<9; i++){
        const cols = rows[i].getElementsByTagName("td");
        for(let j =0; j < 9; j++){
            cols[j].innerText = board[i][j] === 0 ? "" : board[i][j].toString();
        }
    }
}

function isValid(board,row,col,num){
     for(let i= 0; i < 9; i++){
        if(board[row][i] === num || board[i][col] === num ) return false;
        const boxRow = 3 * Math.floor(row / 3) + Math.floor(i/3);
        const boxCol = 3 * Math.floor(col / 3) + (i % 3);
        if (board[boxRow][boxCol] == num ) return false;

    }
    return true;
}

function solve(board){
    for(let row = 0; row < 9 ;row ++){
        for(let col = 0; col <9; col++){
            if(board[row][col] == 0){
                for(let num = 1; num <= 9; num++){
                   if(isValid(board,row,col,num)){
                        board[row][col] = num;
                        if (solve(board)) return true;
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }

    return true;
}


function solveSudoku() {
    const board = getBoard();
    console.log("Initial Borad :", board);
    if(solve(board)){
        setBoard(board);
        alert("Sudoku Solved!!!");
    }
    else {
        alert("No solution found. Try again....");
    }
}



function clearBoard(){
    const rows = table.getElementsByTagName("tr");
    for(let i= 0; i< 9; i++){
        const cols = rows[i].getElementsByTagName("td");
        for(let j = 0; j< 9; j++){
            cols[j].innerText = "";
        }
    }
}