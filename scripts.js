// TODO: Turns feature....1 player (against computer), 2 player1Squares
// TODO: Reset button
// TODO: Give computer intelligence to try to win!!

//GLOBALS
var testClickCount = 0;
var boxSize = 0;
var gameWinnerCombo = [];
haveWinner = false;
var whosTurn = 1;
var squares = [];
player1Squares = [];
player2Squares = [];
var OPEN_SQUARE = '-';
var DEFAULT_SQ_CLASS = "square";
var winningCombos =[];

// var winningCombos = [['00', '10', '20']
// ,['01', '11', '21']
// ,['02', '12', '22']
// ,['00', '01', '02']
// ,['10', '11', '12']
// ,['20', '21', '22']
// ,['00', '11', '22']
// ,['02', '11', '20']];

// Setup board (in HTML)

// User clicks a button then put that player's mark on the board

// Need to track turns!
// Check game status each turn...
// Declare winner when it happens
// Or draw at end and no winner.

function setupBoard(initial){
  var gameRowsHTML = "";
  var winningCombo = [];

  boxSize = parseInt(prompt("Please enter number of rows"));


  for (let rows = 0; rows < boxSize; rows++ ){
    gameRowsHTML += '<div class="board-row">';  // opening for each row
    winningCombo = [];
    for (let columns = 0; columns < boxSize; columns++){
      gameRowsHTML += `<button id="${rows}${columns}" class="${DEFAULT_SQ_CLASS}">${OPEN_SQUARE}</button>`;
      winningCombo.push(`${rows}${columns}`);
    } // end columns
    gameRowsHTML += '</div>'  // closing div for the gameRow
    winningCombos.push(winningCombo);
    console.log(gameRowsHTML);
    console.log(winningCombos);
  }  // end rows

  console.log(gameRowsHTML);
  document.getElementById("board").innerHTML = gameRowsHTML;

  //need to continue to build out winningCombos....need columns and diagnols
  for (let columns = 0; columns < boxSize; columns++){
    winningCombo = [];
    for (let rows = 0; rows < boxSize; rows++){
      winningCombo.push(`${rows}${columns}`); //appends winning columns
    }  //end rows
    winningCombos.push(winningCombo);
  }  // end columns

  console.log(winningCombos);
  //now we need the diags.....
  winningCombo = [];
  for (let i = 0; i < boxSize; i++){  //forward
    winningCombo.push(`${i}${i}`);
  }
  winningCombos.push(winningCombo);

  winningCombo = [];
    rows = 0;
    for (let i = (boxSize - 1); i >= 0; i--){  //backward
      winningCombo.push(`${rows}${i}`);
      rows++;
    }
  winningCombos.push(winningCombo);

// array of 9 objects, each object is a representation of the button object.
  squares = document.getElementsByClassName(DEFAULT_SQ_CLASS);

  for (let i = 0; i < squares.length; i++){
    // we can dynamically add an event listener to each...keeps it out of the HTML
    // using an anonymous function here...meaning it can only be called when 'click' occurs
    // squares[i].innerHTML = OPEN_SQUARE;  // wipe board, set to dash

    squares[i].addEventListener('click', function(event){
    console.log("addEventListener on squares");
    console.log(this);
    if (!haveWinner){
      markSquare(this);
    }
    });
  }
  // add Listener on Reset button....
  if (initial == true){
    document.getElementById('reset').addEventListener('click', function(event){
      resetGame(this);
    });
    document.getElementById('number-spinner-btn').addEventListener('click', function(event){
      handleSpinner(this);
    });
  }
} //end setupBoard

function handleSpinner(spinner){
  var oldValue = spinner.closest('.number-spinner').find('input').val().trim(), newVal = 0;

  if (spinner.attr('data-dir') == 'up'){
    newVal = parseInt(oldValue) + 1;
  } else {
    if (oldValue > 1) {
      newVal = parseInt(oldValue) - 1;
    } else {
      newVal = 1;
    }
  }
  spinner.closest('.number-spinner').find('input').val(newVal);
}
function resetGame(resetClicked){

  // Clear out the buttons in the DOM
  document.getElementById("board").innerHTML = "";

  // original
  // for (let i = 0; i < squares.length; i++){
  //   squares[i].innerHTML = OPEN_SQUARE;  // wipe board, set to dash
  //   squares[i].className = DEFAULT_SQ_CLASS;
  // }
  // Clear any messages too!
  document.getElementById('message').innerHTML = "";

  // Reset Globals
  gameWinnerCombo = [];
  haveWinner = false;
  whosTurn = 1;
  player1Squares = [];
  player2Squares = [];
  squares = [];

  // Now set up the board...
  setupBoard(false);

}  // end resetGame

// 2 things happen onClick....DOM is changed, vars are changedwin
function markSquare(squareClicked){
  testClickCount += 1;
  var tempText = squareClicked.innerHTML;
  if(squareClicked.innerHTML != OPEN_SQUARE){
    document.getElementById('message').innerHTML = "Sorry, that square is occupied";
  }
  else if (whosTurn == 1){
    document.getElementById('message').innerHTML = "";
    squareClicked.innerHTML = "X";
    player1Squares.push(squareClicked.id);
    haveWinner = checkWin(player1Squares, "Player 1 Wins!");
    whosTurn = 2;
  }
  else{
    document.getElementById('message').innerHTML = "";
    squareClicked.innerHTML = "O";
    player2Squares.push(squareClicked.id);
    haveWinner = checkWin(player2Squares, "Player 2 Wins");
    whosTurn = 1;
  }
  if (haveWinner){
    markWinner();
  }
}

function checkWin(currentPlayer, winMsg){
  //Outer loop checks combinations...
  //Inner Loop checks each square
  // indexOf returns -1 on NOT FOUND!
  for (let i = 0; i < winningCombos.length; i++){
    var squareCount = 0; // tracks match on a particular combo
    for (let j = 0; j < winningCombos[i].length; j++){
      var winningSquare = winningCombos[i][j];
      if (currentPlayer.indexOf(winningSquare) !== -1){
        gameWinnerCombo.push(winningCombos[i][j]);
      }
    }
    if (gameWinnerCombo.length == boxSize){   //winner winner
      document.getElementById('message').innerHTML = winMsg;
      return (true);
    }
    gameWinnerCombo = []; // reset for next combination check
  }
  return(false);
}

function markWinner() {
  for (let i = 0; i < gameWinnerCombo.length; i++){
    var theTargetSquare = gameWinnerCombo[i];
    document.getElementById([theTargetSquare]).className += ' winning-square';
  }
}

if (squares.length == 0){  //  first time, not reset
  setupBoard(true);
}
