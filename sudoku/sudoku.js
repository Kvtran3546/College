var numSelected = null;
var tileSelected = null;
var errors = 0;

var Uni_board = []
var solution = []
for(let r = 0; r < 9; r++){
    Uni_board.push("")
    for(let c = 0; c < 9 ; c++){
        Uni_board[r] = Uni_board[r]+"0"
    }
}

async function setGame(){
    document.getElementById("newboard").addEventListener("click", newBoard);
    // createBoard();
    createBoard(Uni_board);
    for(let i = 0; i < 9 ; i++){
        solution.push(Uni_board[i]);
    }
    var game_board = Uni_board;
    for(let i = 1; i<=9 ; i++){
        let number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }
    set_grid();
    await remove_Num(Uni_board);
    start_grid();
}

function selectNumber(){
    if(numSelected != null){
        numSelected.classList.remove("number-selected");
    }
    numSelected = this;
    numSelected.classList.add("number-selected");
}

function set_grid(){
    for(let r = 0; r < 9; r++){
        for(c = 0; c < 9; c++){
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            if(r == 2 || r == 5){
                tile.classList.add("horz-line");
            }
            if(c == 2 || c == 5){
                tile.classList.add("vert-line");
            }
            if(Uni_board[r][c] == "0"){
                tile.innerText = "";
            }
            tile.addEventListener("click", selectTile);
            document.getElementById("board").appendChild(tile);
        }
    }
}

function start_grid(){
    errors =0;
    document.getElementById("errors").innerText = errors;
    for(let r = 0; r < 9; r++){
        for(let c = 0; c < 9; c++){
            console.log(Uni_board);
            let tile = document.getElementById(r.toString()+"-"+c.toString());
            if(Uni_board[r][c] != "0"){
                tile.classList.add("start-tile");
            }else{
                if(tile.classList.contains("start-tile")){
                    tile.classList.remove("start-tile");
                }
            }
        }
    }
}



function selectTile(){
    tileSelected = this;
    if(numSelected){
        if(this.innerText != ""){
            if(this.classList.contains("start-tile")){
                return
            }else{
                if(tileSelected.innerText == numSelected.id){
                    return
                }else{
                    if(numSelected.id != solution[tileSelected.id[0]][tileSelected.id[2]] && tileSelected.innerText != solution[tileSelected.id[0]][tileSelected.id[2]]){
                        tileSelected.innerText = numSelected.id;
                        return;
                    }else if(numSelected.id == solution[tileSelected.id[0]][tileSelected.id[2]]){
                        tileSelected.innerText = numSelected.id;
                        errors--;
                    }
                }
            }
        }else{
            tileSelected.innerText = numSelected.id;
            if(tileSelected.innerText != solution[tileSelected.id[0]][tileSelected.id[2]]){
                errors++;
            }
        }
    }else{
        return;
    }
    document.getElementById("errors").innerText = errors;
}


function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

function checkCol(board, col, n){
    for(let i = 0; i<9; i++){
        if(board[i][col] == n){
            return true;
        }
    }
    return false;
}
function get_sub_grid(board, row, col){
    var grid = []
    if(row < 3){
        if(col<3){
            for(let i=0; i<3; i++){
                grid.push(board[i].substring(0,3));
            }
        }else if(col<6){
            for(let i=0; i<3; i++){
                grid.push(board[i].substring(3,6));
            }
        }else{
            for(let i=0; i<3; i++){
                grid.push(board[i].substring(6,9));
            }
        }
    }else if(row < 6){
        if(col<3){
            for(let i=3; i<6; i++){
                grid.push(board[i].substring(0,3));
            }
        }else if(col<6){
            for(let i=3; i<6; i++){
                grid.push(board[i].substring(3,6));
            }
        }else{
            for(let i=3; i<6; i++){
                grid.push(board[i].substring(6,9));
            }
        }
    }else{
        if(col<3){
            for(let i=6; i<9; i++){
                grid.push(board[i].substring(0,3));
            }
        }else if(col<6){
            for(let i=6; i<9; i++){
                grid.push(board[i].substring(3,6));
            }
        }else{
            for(let i=6; i<9; i++){
                grid.push(board[i].substring(6,9));
            }
        }
    }
    return grid; 
}
function checkBox(grid, n){
    for(let i = 0; i<3; i++){
        if(grid[i].includes(n)){
            return true;
        }
    }
    return false;
}

function checkBoard(board){
    for(let r = 0; r < 9; r++){
        for(let c = 0; c < 9 ; c++){
            if(board[r][c] == "0"){
                return false;
            }
        }
    }
    return true; 
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

async function newBoard(){
    Uni_board = []
    for(let r = 0; r < 9; r++){
        Uni_board.push("")
        for(let c = 0; c < 9 ; c++){
            Uni_board[r] = Uni_board[r]+"0"
        }
    }
    createBoard(Uni_board);
    redo_grid();
    for(let i = 0; i < 9 ; i++){
        solution.push(Uni_board[i]);
    }
    await remove_Num(Uni_board);
    redo_grid();
    start_grid();
}

function redo_grid(){
    for(let r = 0; r < 9; r++){
        for(c = 0; c < 9; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            if(Uni_board[r][c] == "0"){
                tile.innerText = "";
            }
            else{
                tile.innerText = Uni_board[r][c];
            }
        }
    }
}

var numbers = ["1","2","3","4","5","6","7","8","9"];
function createBoard(cr_board){
    solution = []
    let row = 0;
    let col = 0;
    for(let i =0; i <81; i++){
        row = Math.floor(i/9);
        col = i%9;
        if(cr_board[row][col] == "0"){
            shuffle(numbers);
            for(let n of numbers){
                if(!cr_board[row].includes(n)){
                    if(!checkCol(cr_board, col, n)){
                        let sub_grid = get_sub_grid(cr_board, row, col);
                        if(!checkBox(sub_grid, n)){
                            cr_board[row] = cr_board[row].replaceAt(col, n);
                            if(checkBoard(cr_board)){
                                return true;
                            }else{
                                if(createBoard(cr_board)){
                                    return true;
                                }
                            }
                        }
                    }
                }
            }break;
        }
    }
    cr_board[row] = cr_board[row].replaceAt(col,"0");
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var counter = 0; 
async function remove_Num(board){
    count = 1;
    attempts = 5;
    origin_grid = board;
    while(attempts > 0){
        count=0;
        grid_backup = board;
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        while(board[row][col] == "0"){
            row = Math.floor(Math.random() * 9);
            col = Math.floor(Math.random() * 9);
        }
        board[row] = board[row].replaceAt(col, "0");
        grid_removed = board;
        solve_grid(board);
        if(count > 1){
            board = grid_backup;
            attempts--;
        }
        redo_grid();
        await sleep(50);
        board = grid_removed;
        
    }
}

function solve_grid(board){
    let row = 0;
    let col = 0;
    for(let i =0; i <81; i++){
        row = Math.floor(i/9);
        col = i%9;
        if(board[row][col] == "0"){
            shuffle(numbers);
            for(let n of numbers){
                if(!board[row].includes(n)){
                    if(!checkCol(board, col, n)){
                        let sub_grid = get_sub_grid(board, row, col);
                        if(!checkBox(sub_grid, n)){
                            board[row] = board[row].replaceAt(col, n);
                            if(checkBoard(board)){
                                count++;
                            }else{
                                if(solve_grid(board)){
                                    return true;
                                }
                            }
                        }
                    }
                }
            }break;
        }
    }
    board[row] = board[row].replaceAt(col,"0");
}