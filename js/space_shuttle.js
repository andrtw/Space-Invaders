var SIZE = 20;

var MAX_SPEED = 6;
var FRICTION = 0.92;

function SpaceShuttle(canvasWidth, canvasHeight) {
    // dimension
    this.width = SIZE;
    this.height = SIZE;
    // position
    this.x = (canvasWidth - this.width) / 2;
    this.y = (canvasHeight - this.height) / 2;
    // velocity
    this.velX = 0;
    this.velY = 0;

    this.update = function(pressedKeys) {
        // check which direction to move
        if (pressedKeys.up) {
            if (this.velY > -MAX_SPEED) {
                this.velY--;
            }
        }
        if (pressedKeys.down) {
            if (this.velY < MAX_SPEED) {
                this.velY++;
            }
        }
        if (pressedKeys.right) {
            if (this.velX < MAX_SPEED) {
                this.velX++;
            }
        }
        if (pressedKeys.left) {
            if (this.velX > -MAX_SPEED) {
                this.velX--;
            }
        }

        // apply friction
        this.velX *= FRICTION;
        this.velY *= FRICTION;
        this.x += this.velX;
        this.y += this.velY;

        // screen bounds
        if (this.x <= 0) {
            this.x = 0;
        }
        else if (this.x + this.width >= canvasWidth) {
            this.x = canvasWidth - this.width;
        }
        if (this.y <= 0) {
            this.y = 0;
        }
        else if (this.y + this.height >= canvasHeight) {
            this.y = canvasHeight - this.height;
        }
    };

    this.render = function(context) {
        context.fillStyle = '#f00';
        context.fillRect(this.x, this.y, this.width, this.height);
    };
}
