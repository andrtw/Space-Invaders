var ENEMY_IMAGE = document.getElementById('enemy');

function Enemy(y, xOffset=0) {
    // speed
    var SPEED = 1.5;

    this.name = name;
    // dimension
    this.width = ENEMY_IMAGE.width;
    this.height = ENEMY_IMAGE.height;
    // position
    this.x = (canvasWidth - this.width) / 2 + xOffset;
    this.y = y;

    this.update = function() {
        this.x += SPEED;
    };

    this.boundReached = function() {
        return this.x <= 0 || this.x + this.width >= canvasWidth;
    };

    this.invertMovement = function() {
        SPEED = -SPEED;
    };

    this.render = function(context) {
        context.drawImage(ENEMY_IMAGE, this.x, this.y);
    };
}
