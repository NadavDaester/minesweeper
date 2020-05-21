'use strict'
const MINE = '💣'
const FLAG = '🚩'
const WIN = '😎'
const LOSE = '🤯'
const NORMAL = '😃'
const LIFE = '❤'
var gStopTime = 0;
var gSeconds = 0;
var gMinesCount = 0;
var gTotalCells = 0;
var gNumberOfFlags = 0;
var gShowenNum = 0;
var lifeCount = 3;
var gIsFirstClick = false;
var gIsGameOver = false;

var status;

var gBoard;


function init(size, MinesCount) {
    status = NORMAL;
    gIsGameOver = false;
    gMinesCount = MinesCount;
    gTotalCells = (size * size);
    lifeCount = 3;
    gSeconds = 0;
    gNumberOfFlags = 0;
    gShowenNum = 0;
    gIsFirstClick = false;
    clearInterval(gStopTime);
    document.querySelector('.status').innerHTML = status + lifeCount + LIFE;
    document.querySelector('.timer').innerText = 'Game Time: ' + gSeconds;
    gBoard = buildBoard(size, MinesCount);
    renderBoard(gBoard, '.board-container');
}


function buildBoard(size, MinesCount) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++)
            board[i].push({ id: { i: i, j: j }, isMine: false, isShown: false, numOfNighobors: 0, isMarked: false })
    }
    randomlyPlaceMines(board, MinesCount)
    console.log(board)
    return board

}

function renderBoard(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += "<tr>";
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = "cell cell" + i + "-" + j;
            var numOfNighobors = setMineseNighborsCount(i, j, mat);
            cell.numOfNighobors = numOfNighobors ? numOfNighobors : ' ';
            if (cell.isMarked) {
                strHTML += '<td onclick="cellClicked(this)" oncontextmenu="flagCell(event)" id="' + [cell.id.i, cell.id.j] + '" class="' + className + '"> ' + FLAG + " </td>"; continue
            }
            if (!cell.isShown) {
                strHTML += '<td onclick="cellClicked(this)" oncontextmenu="flagCell(event)" id="' + [cell.id.i, cell.id.j] + '" class="' + className + '"/> ' + " </td>"; continue
            }
            if (cell.isMine) {
                strHTML += '<td onclick="cellClicked(this)" oncontextmenu="flagCell(event)" id="' + [cell.id.i, cell.id.j] + '"  class="' + className + '"> ' + MINE + " </td>"; continue
            }


            strHTML += '<td onclick="cellClicked(this)" oncontextmenu="flagCell(event)" id="' + [cell.id.i, cell.id.j] + '" class="' + className + ' shown"/> ' + cell.numOfNighobors + " </td>"
        }

    }
    strHTML += "</tr>";

    strHTML += "</tbody></table>";
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;

}



function setMineseNighborsCount(cellI, cellJ, mat) {
    var neighborsSum = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (mat[i][j].isMine) neighborsSum++;
        }
    }

    return neighborsSum;
}



function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}

// 1. Make sure your renderBoard() function adds the cell ID to each cell and 
// onclick on each cell calls cellClicked() function. 
// 2. Make the default “isShown” to be “false”
// 3. Implement that clicking a cell with “number” reveals the number of this cell 
function cellClicked(cellEl) {

    if (gIsGameOver) return;
    var locationParts = cellEl.id.split(',');
    var indxI = +locationParts[0];
    var indxJ = +locationParts[1];
    if (!gIsFirstClick) {
        if(gBoard[indxI][indxJ].isMine) {
            randomlyPlaceMines(gBoard, 1);
            gBoard[indxI][indxJ].isMine = false;
        }
        gStopTime = setInterval(incrementSeconds, 1000);
        gIsFirstClick = true;
    }
    
    if (gBoard[indxI][indxJ].isMarked) return

    if (gBoard[indxI][indxJ].isShown === false) {
        gShowenNum++;
        gBoard[indxI][indxJ].isShown = true;
    }

    
    if (gBoard[indxI][indxJ].isMine) {
        lifeCount--;
        document.querySelector('.status').innerHTML = status + lifeCount + LIFE;
        if(lifeCount === 0){
            for (var i = 0; i < gBoard.length; i++) {
                for (var j = 0; j < gBoard[i].length; j++) {
                    var cell = gBoard[i][j]
                    if (cell.isMine) {
                        cell.isShown = true;
                    }
                }
            }
            gameOver()
        } else {
            // show the mine if we have more life
            setTimeout(function (){         
                gBoard[indxI][indxJ].isShown = false;    
                gShowenNum--;        
                renderBoard(gBoard, '.board-container')
            }, 500);
        }
        
    }
    /// reveal
    if (gBoard[indxI][indxJ].numOfNighobors === ' ') {
        reveal(indxI, indxJ);
    }
    // check victory 
    checkVictory()
    renderBoard(gBoard, '.board-container')
}

function reveal(indxI, indxJ) {
    // flase condition (out of boundries)
    if (indxI < 0 || indxI > gBoard.length || indxJ < 0 || indxJ > gBoard.length) {
        return;
    }
    else if (gBoard[indxI][indxJ].isMine) {
        return;
    }
    else {
        if (gBoard[indxI][indxJ].isShown === false) {
            gShowenNum++;
            gBoard[indxI][indxJ].isShown = true;
        }
    }

    // recursion step (find mine in area)
    for (var i = indxI - 1; i <= indxI + 1; i++) {
        for (var j = indxJ - 1; j <= indxJ + 1; j++) {
            if (!(i < 0 || i >= gBoard.length || j < 0 || j >= gBoard.length)) {
                if (!gBoard[i][j].isMine) {
                    if (gBoard[i][j].isShown === false) {
                        gShowenNum++;
                        gBoard[i][j].isShown = true;
                        // open recursive cells
                        if (gBoard[i][j].numOfNighobors === ' ') { 
                            reveal(i, j);
                        }
                    }
                }
            }
            // reveal(i, j);
        }
    }
    return false;
}

// Step4 – randomize mines' location: 
// 1. Randomly locate the 2 mines on the board 
//2. Present the mines using renderBoard() function. 

function randomlyPlaceMines(board, minesCount) {
    for (var i = 0; i < minesCount; i++) {
        var cellI = getRandomIntInclusive(0, board.length - 1);
        var cellJ = getRandomIntInclusive(0, board.length - 1);
        if (!board[cellI][cellJ].isMine) {
            board[cellI][cellJ].isMine = true;
        }
        else {
            //if isMine = true try another loop
            i--;
        }
    }
    return board
}

var gSeconds = 0;


function incrementSeconds() {
    var el = document.querySelector('.timer');
    gSeconds += 1;
    el.innerText = 'Game Time: ' + gSeconds;
}

function gameOver() {
    clearInterval(gStopTime)
    gSeconds = 0;
    status = LOSE;
    document.querySelector('.status').innerHTML = status + 'Game over!';
    gIsGameOver = true;
    gIsFirstClick = false;

}
function flagCell(ev) {
    ev.preventDefault();
    var locationParts = ev.target.id.split(',');
    var indxI = +locationParts[0];
    var indxJ = +locationParts[1];

    if (gBoard[indxI][indxJ].isShown) return;

    if (gBoard[indxI][indxJ].isMarked) {
        gBoard[indxI][indxJ].isMarked = false;
        gNumberOfFlags--;
    }
    else {
        gBoard[indxI][indxJ].isMarked = true;
        gNumberOfFlags++;
    }

    checkVictory()
    renderBoard(gBoard, '.board-container');
}

function checkVictory() {
    if ((gNumberOfFlags === gMinesCount) && (gTotalCells - gMinesCount === gShowenNum)) {
        clearInterval(gStopTime)
        status = WIN;
        document.querySelector('.status').innerHTML = status + 'YOU WON!';

        return true;
    }
}
