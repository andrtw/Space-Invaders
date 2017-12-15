var MAX_LIVES = 3;
var HEART_IMAGE = document.getElementById('heart');
var HEART_EMPTY_IMAGE = document.getElementById('heart_empty');

function Hud() {
    this.score = 0;
    this.lives = MAX_LIVES;

    this.update = function() {

    };

    this.render = function(context) {
        // draw the score
        context.font = '16px Consolas';
        context.fillStyle = '#ddd';
        context.fillText('SCORE: ' + this.score, 10, canvasHeight - 10);

        // draw the lives
        for (var i = 0; i < MAX_LIVES; i++) {
            var image = HEART_EMPTY_IMAGE;
            if (i < this.lives) {
                image = HEART_IMAGE;
            }
            context.drawImage(image, 10 + (16 * i), canvasHeight - 40);
        }
    };
}
