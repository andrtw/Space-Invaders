var ENEMY_SIZE = 20;

function Enemy(y, xOffset=0) {
    // speed
    var SPEED = 1.5;

    this.name = name;
    // dimension
    this.width = ENEMY_SIZE;
    this.height = ENEMY_SIZE;
    // position
    this.x = (canvasWidth - this.width) / 2 + xOffset;
    this.y = y;
    // color
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);

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
        context.fillStyle = 'rgb('+r+','+g+','+b+')';
        context.fillRect(this.x, this.y, this.width, this.height);
    };
}
