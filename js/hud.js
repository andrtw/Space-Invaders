var LIFE_SIZE = 6;

function Hud() {
    this.score = 0;
    this.lives = 3;

    this.update = function() {

    };

    this.render = function(context) {
        // draw the score
        context.font = '16px Consolas';
        context.fillStyle = '#ddd';
        context.fillText('SCORE: ' + this.score, 10, canvasHeight - 10);

        // draw the lives
        context.fillStyle = '#f00';
        for (var i = 0; i < this.lives; i++) {
            context.fillRect(10 + (10 * i), canvasHeight - 40, LIFE_SIZE, LIFE_SIZE);
        }
    };
}
