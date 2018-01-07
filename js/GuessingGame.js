// First, you'll need to create a constructor function, Game, that will create your game instances. You'll define all the methods that can modify or read data from game on Game.prototype. You'll also need a couple of helper functions that are not defined on Game.prototype, but will be used inside the instance methods.

function Game() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

function generateWinningNumber() {
    return Math.floor(Math.random() * 100 + 1);
}

function shuffle(arr) {
    var remaining = arr.length;
    var temp;
    var currentNum;

    while (remaining) {
        currentNum = Math.floor(Math.random() * remaining--);

        temp = arr[remaining];
        arr[remaining] = arr[currentNum];
        arr[currentNum] = temp;
    }

    return arr;

}

Game.prototype.difference = function() {
    if (this.playersGuess > this.winningNumber) {
        return this.playersGuess - this.winningNumber;
    } else if (this.playersGuess < this.winningNumber) {
        return this.winningNumber - this.playersGuess;
    } else {
        return 0;
    }
}

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber ? true : false;
}

Game.prototype.checkGuess = function() {
    if (this.playersGuess === this.winningNumber) {
        $('#hint, #submit').prop("disabled", true);
        $("#winLoseWrap").toggleClass('hidden');
        $('#winLoseNote').text("You Win!");
        return 'You Win!'
    } else {
        if (this.pastGuesses.includes(this.playersGuess)) {
            return 'You have already guessed that number.';
        } else {
            this.pastGuesses.push(this.playersGuess);
            $('#guess-list li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess);
            if (this.pastGuesses.length === 5) {
                $('#hint, #submit').prop("disabled", true);
                $("#winLoseWrap").toggleClass('hidden');
                $('#winLoseNote').text("You Lose!");
                return 'You Lose.';
            } else {
                if (this.isLower()) {
                    $('#note-2').text("Guess Higher!");
                } else {
                    $('#note-2').text("Guess Lower!");
                }
                var diff = this.difference();
                if (diff < 10) return 'You\'re burning up! ';
                else if (diff < 25) return 'You\'re lukewarm. ';
                else if (diff < 50) return 'You\'re a bit chilly. ';
                else return 'You\'re ice cold! ';
            }
        }
    }
}

Game.prototype.playersGuessSubmission = function(num) {
    if (num < 1 || num > 100 || typeof num !== "number") {
        throw "That is an invalid guess.";
    } else {
        this.playersGuess = num;
    }
    return this.checkGuess();
}

function newGame() {
    return new Game;
}

Game.prototype.provideHint = function() {
    var hintArr = [];
    hintArr.push(this.winningNumber, generateWinningNumber(), generateWinningNumber());

    return shuffle(hintArr);
}

function makeAGuess(game) {
    var guess = $("#player-input").val();
    $("#player-input").val("");
    var output = game.playersGuessSubmission(Number(guess));
    $('#note-1').text(output);
}


$(document).ready(function() {
    var game = new Game();

    $("#submit").click(function() {
        makeAGuess(game);
    })

    $("#player-input").keypress(function(event) {
        if (event.which == 13) {
            makeAGuess(game);
        }
    })

    $('#hint').click(function() {
        var hints = game.provideHint();
        $('#note-1').text('Hint: The winning number is ' + hints[0] + ', ' + hints[1] + ', or ' + hints[2]);
    });

    $('.reset').click(function() {
        game = newGame();
        $('#note-1').text('');
        $('#note-2').text('');
        $('.guess').text('--');
        $('#hint, #submit').prop("disabled", false);
        $("#winLoseWrap").toggleClass('hidden');
    })
});