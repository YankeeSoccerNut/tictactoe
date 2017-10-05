// TODO: Give computer more intelligence to try to win!! (plays dumb now)
// TODO: consider choice for computer skill level -- dumb, defensive, win!
// TODO: track game stats...player moves...squares remaining...stop turns when 0
// TODO: score remaining squares based...by player? to allow computer to make smarter choice.  Could also be used to enable "hint" for human player


//GLOBALS
numPlayers = 1;
var boxSize = 0;
var gameWinnerCombo = [];
haveWinner = false;
var whosTurn = 1;
var squares = [];

// player1Squares = [];
// player2Squares = [];
var OPEN_SQUARE = '-';
var DEFAULT_SQ_CLASS = "square";
var winningCombos =[];
// var player1PotentialWinCombos[];
// var player2PotentialWinCombos[];


function Player() {     // Constructor for players
    this.minMovesToWin = 0;
    this.numWinningCombosRemaing = 0;
    this.potentialWinCombos = [];
    this.squares = [];
}

var player1 = new Player;
var player2 = new Player;



// Need to track turns!
// Check game status each turn...
// Declare winner when it happens
// Or draw at end and no winner.
// Setup board (in HTML)

$(document).ready(run);

function run(){
  if (squares.length == 0){  //  first time, not reset
    setupBoard(true);
    var utterance = new SpeechSynthesisUtterance('Would you like to play a game?');
    window.speechSynthesis.speak(utterance);
  }
}

function setupBoard(initial){
  var gameRowsHTML = "";
  var winningCombo = [];
  boxSize = parseInt(prompt("Please enter number of rows"));


  for (let rows = 0; rows < boxSize; rows++ ){
    gameRowsHTML += '<div class="board-row">';  // opening for each row
    winningCombo = [];
    for (let columns = 0; columns < boxSize; columns++){
      gameRowsHTML += `<button id="${rows}${columns}" class="btn-lg ${DEFAULT_SQ_CLASS}">${OPEN_SQUARE}</button>`;
      winningCombo.push(`${rows}${columns}`);
    } // end columns
    gameRowsHTML += '</div>'  // closing div for the gameRow
    winningCombos.push(winningCombo);
    console.log(gameRowsHTML);
    console.log(winningCombos);
  }  // end rows

  console.log(gameRowsHTML);
  $('#board').html(gameRowsHTML);

  //need to continue to build out winningCombos....need columns and diagnols
  for (let columns = 0; columns < boxSize; columns++){
    winningCombo = [];
    for (let rows = 0; rows < boxSize; rows++){
      winningCombo.push(`${rows}${columns}`); //appends winning columns
    }  //end rows
    winningCombos.push(winningCombo);
  }  // end columns

  //now we need the diags.....forward and backward
  winningCombo = [];
  for (let i = 0; i < boxSize; i++){  //forward
    winningCombo.push(`${i}${i}`);
  }
  winningCombos.push(winningCombo);  // fwd diag

  winningCombo = [];
    rows = 0;
    for (let i = (boxSize - 1); i >= 0; i--){  //backward
      winningCombo.push(`${rows}${i}`);
      rows++;
    }
  winningCombos.push(winningCombo);  // bkwd diag

// winningCombos is fully loaded....copy to each players potential Wins
  player1.potentialWinCombos = winningCombos.slice(0,winningCombos.length);
  player2.potentialWinCombos = winningCombos.slice(0,winningCombos.length);

// array of boxSize*boxSize objects, each object is a representation of the button object.
  squares = $(`.${DEFAULT_SQ_CLASS}`);

  for (let i = 0; i < squares.length; i++){
    // we can dynamically add an event listener to each...keeps it out of the HTML
    // using an anonymous function here...meaning it can only be called when 'click' occurs

    squares[i].addEventListener('click', function(event){
    if (!haveWinner){
      markSquare(this);
    }
    });
  }
  // add Listener on Reset
  if (initial == true){
    $('#reset').click(resetGame);
    $('#one-player').click(function () {
      numPlayers = 1;
      resetGame(this);
    });
    $('#two-player').click(function () {
      numPlayers = 2;
      resetGame(this);
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
  $('#board').html("");

  // original
  // for (let i = 0; i < squares.length; i++){
  //   squares[i].innerHTML = OPEN_SQUARE;  // wipe board, set to dash
  //   squares[i].className = DEFAULT_SQ_CLASS;
  // }
  // Clear any messages too!
  $('#message').html("");

  // Reset Globals
  gameWinnerCombo = [];
  haveWinner = false;
  whosTurn = 1;
  player1.minMovesToWin = 0;
  player1.numWinningCombosRemaing = 0;
  player1.potentialWinCombos = [];
  player1.squares = [];
  player2.minMovesToWin = 0;
  player2.numWinningCombosRemaing = 0;
  player2.potentialWinCombos = [];
  player2.squares = [];

  squares = [];

  // Now set up the board...
  setupBoard(false);

}  // end resetGame

// This is the listener for click on each Square
// User clicks a button then put that player's mark on the board

function markSquare(squareClicked){
  var tempText = squareClicked.innerHTML;
  if(squareClicked.innerHTML != OPEN_SQUARE){
    $('#message').html("Sorry, that square is occupied");
  }
  else if (whosTurn == 1){
    $('#message').html("");

    squareClicked.innerHTML = "X";
    player1.squares.push(squareClicked.id);
    haveWinner = checkWin(player1.squares, "Player 1 Wins!");
    if ((!haveWinner) && (numPlayers == 1)){
      // Eliminate potential winning combos from Player 2 that rely on this square  (Computer is Player 2)
      reducePotentialWinCombos(player2, squareClicked.id);
      computerTurn();  // no need to pass anything...computer knows all ;-)
      haveWinner = checkWin(player2.squares, "Computer Wins!");
      whosTurn = 1;
    }
    else{
      whosTurn = 2;
    }
  }
  else{    // Human Player 2's turn
    $('#message').html("");

    squareClicked.innerHTML = "O";
    player2.squares.push(squareClicked.id);
    haveWinner = checkWin(player2.squares, "Player 2 Wins");
    whosTurn = 1;
  }

  if (haveWinner){
    markWinner();
  }
}

//Determine if there is a winner....uses the winningCombos array that was built during setupBoard

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
      $('#message').html(winMsg);

      return (true);
    }
    gameWinnerCombo = []; // reset for next combination check
  }
  return(false);
}

function markWinner() {

  for (let i = 0; i < gameWinnerCombo.length; i++){
    var theTargetSquare = gameWinnerCombo[i];
    $(`#${theTargetSquare}`).addClass('winning-square');
  }
}

function reducePotentialWinCombos(player, squareId){
  //Take the given square and eliminate it from a player's potential win combinations.  Typically this will be called within a players turn to affect the OTHER PLAYER'S potentialWinCombos
  console.log("reducePotentialWinCombos");
  console.log(squareId);
  console.log(`potentials BEFORE: ${player.potentialWinCombos}`);

  //find all winning combinations with this square and remove it from this players potential...the other player has claimed it!
  // potentialWinCombos is an array of arrays

  // filter says return the item when a condition is true....doesn't have to be anything related to the item....any true will do.
  var viableCombos = player.potentialWinCombos.filter((item) => {
    return (item.indexOf(squareId) == -1);
  });

  // my understanding is that we have to "copy" our result to the source array to replace it....cannot just assign (becomes pass by reference)
  player.potentialWinCombos = viableCombos.slice(0,viableCombos.length);

  console.log(`potentials AFTER: ${player.potentialWinCombos}`);

}

function computerTurn(){
  var computerPick;

  console.log("computerTurn...");
  // simple logic for now...take any open square....
  //$('div:contains("test"):last')
  computerPick = $('button:contains("-"):first');  // returns an array!!
  console.log(computerPick[0].id);

  // Save the players move for checking against win combos...
  player2.squares.push(computerPick[0].id);

  // Update the DOM with the Computer's Pick
  $(`#${computerPick[0].id}`).html('O');
}
