function generateWinningNumber(){
    var decNum = Math.random(1,101)+0.01;
    var randNum = parseInt(decNum * 100);
    if (randNum === 0){
        return 1;
    }
    return randNum;
}

function shuffle(array){ //Fisher-Yates - https://bost.ocks.org/mike/shuffle/

    var n = array.length;
    var t;
    var i;

    while(n){
        i = Math.floor(Math.random() * n--);
        t = array[n];
        array[n] = array[i];
        array[i] = t;
    }
    return array;
}

function Game(){ //constructor function for the Game object
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
    return Math.abs(this.winningNumber - this.playersGuess);
}

Game.prototype.isLower = function(){
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(submission){
    if (typeof submission != 'number' || submission < 1 || submission > 100 || typeof submission != 'number'){
        throw 'That is an invalid guess.';
    }
    this.playersGuess = submission;
    return this.checkGuess();
}

Game.prototype.checkGuess = function(){
    if (this.playersGuess === this.winningNumber){
        $('#hint, #submit').prop("disabled", true);
        $('#subtitle').text("Click the Reset button to play again.")
        return "You Win!";
    }
    if (this.pastGuesses.includes(this.playersGuess)){
        //this.pastGuesses.push(this.playersGuess);
        return "You have already guessed that number.";
    }
    this.pastGuesses.push(this.playersGuess);
    $('.guesses li:nth-child('+this.pastGuesses.length+')').text(this.playersGuess);
    if (this.pastGuesses.length === 5){
        $('#hint, #submit').prop("disabled", true);
        $('#subtitle').text("Click the Reset button to try again.");
        return `You Lose. The winning number was ${this.winningNumber}`;
    }
    else {
        var diff = this.difference();
        if (this.isLower()){
            $('#subtitle').text("Try guessing higher.");
        }
        else {
            $('#subtitle').text("Try guessing lower.");
        }
        if(diff < 10)
            return "You're burning up!";
        if(diff < 25)
            return "You're lukewarm.";
        if(diff < 50)
            return "You're a bit chilly."
        return "You're ice cold!";
    }
}

Game.prototype.provideHint = function(){
    let deck = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
    shuffle(deck);
    return deck;
}

function newGame() {
    return new Game();
}

function GuessToValue(game){
    var guess = $('#player-input').val();
    $('#player-input').val("");
    var output = game.playersGuessSubmission(parseInt(guess,10));
    $('#title').text(output);
}

$(document).ready(function(){
    var game = new Game();

    //submit button click functionality here
    $('#submit').click(function(event){
        GuessToValue(game);
    })

    //player input keypress functionality here
    $('#player-input').keypress(function(e){
        if (e.which === 13){ //e.which === 13 means that the enter button was hit
            GuessToValue(game);
        }
    })

    //hint button click functionality here
    $('#hint').click(function(ev){
        var hints = game.provideHint();
        $('#title').text(`Try the following values: ${hints[0]}, ${hints[1]}, ${hints[2]}`);
        $('#hint').prop("disabled", true);
    });

    //reset button click functionality here
    $('#reset').click(function(ev){
        game = newGame();
        $('#title').text('Play the Guessing Game!');
        $('#subtitle').text('Guess a number between 1-100!');
        $('.guess').text('_');
        $('#hint, #submit').prop("disabled", false);
    });
});