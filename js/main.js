'use strict'
const MINE = '*'
var gMinesCount = 2;


var gBoard;


function init() {

    gBoard = buildBoard()
    renderBoard(gBoard, '.board-container')

}


function buildBoard() {
    var size = 4;
    var board = [];
    var id = 1;
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++)
            board[i].push({ id: id++, isMine: false, isShown: false, minesAroundCount: 0, isMarked: false })
    }
    randomlyPlaceMines(board, gMinesCount)
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
            cell.numOfNighobors = numOfNighobors ? numOfNighobors : "";
            if (!cell.isShown) {
                strHTML += '<td onclick="cellClicked(this)" id="' + cell.id + '" class="' + className + '"/> ' + " </td>"; continue
            }
            if (cell.isMine) {
                strHTML += '<td onclick="cellClicked(this)" id="' + cell.id + '"  class="' + className + '"> ' + MINE + " </td>"; continue
            }
            if (cell.numOfNighobors) {
                strHTML += '<td onclick="cellClicked(this)" id="' + cell.id + '" class="' + className + '"> ' + cell.numOfNighobors + " </td>"; continue
            }

            strHTML += '<td onclick="cellClicked(this)" id="' + cell.id + '" class="' + className + '"/> ' + 0 + " </td>"
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
    var id = cellEl.id
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].id === parseInt(id)) {
                gBoard[i][j].isShown = true
            }
        }
    }
    renderBoard(gBoard, '.board-container')
}

// Step4 – randomize mines' location: 
// 1. Randomly locate the 2 mines on the board 
//2. Present the mines using renderBoard() function. 

function randomlyPlaceMines(board, minesCount) {
    var mineCooridinates = []
    for (var i = 0; i < minesCount; i++) {
        var randomI = getRandomIntInclusive(0, board.length - 1)
        var randomJ = getRandomIntInclusive(0, board.length - 1)
        var cellI = randomI
        var cellJ = randomJ
        // var cell = cellI + "" + cellJ
        // while (mineCooridinates.includes(cell)) {
        //     var randomI = getRandomIntInclusive(0, board.length - 1)
        //     var randomJ = getRandomIntInclusive(0, board.length - 1)
        // }
        // mineCooridinates.push(cell);
        board[cellI][cellJ].isMine = true
    }
    return board
}