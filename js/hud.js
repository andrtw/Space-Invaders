function Hud() {
    var HEART_IMAGE = document.getElementById('heart');
    var HEART_EMPTY_IMAGE = document.getElementById('heart_empty');

    var SCORE_STEP_INCREASE = 5;
    var SCORE_STEP_DECREASE = 2;

    this.score = 0;

    this.update = function() {

    };

    this.increaseScore = function() {
        this.score += SCORE_STEP_INCREASE;
    };
    this.decreaseScore = function() {
        this.score -= SCORE_STEP_DECREASE;
        if (this.score < 0) {
            this.score = 0;
        }
    };

    this.render = function(context) {
        // draw the score
        context.font = '16px Consolas';
        context.fillStyle = '#ddd';
        context.fillText('SCORE: ' + this.score, 10, canvasHeight - 10);

        // draw life bar
        context.fillStyle = '#000';
        context.fillRect(canvasWidth - 100 - 10, canvasHeight - 18, spaceShuttle.MAX_LIFE, 5);
        var lifeColor = '#0f0';
        if (this.life <= 25) {
            lifeColor = '#f00';
        }
        else if (this.life <= 50) {
            lifeColor = '#ff7f27';
        }
        context.fillStyle = lifeColor;
        context.fillRect(canvasWidth - 100 - 10, canvasHeight - 18, spaceShuttle.life, 5);
        // draw lives
        for (var i = 0; i < spaceShuttle.MAX_LIVES; i++) {
            var image = HEART_EMPTY_IMAGE;
            if (i < spaceShuttle.lives) {
                image = HEART_IMAGE;
            }
            context.drawImage(image, canvasWidth - 22 - (16 * i), canvasHeight - 40);
        }
    };
}
