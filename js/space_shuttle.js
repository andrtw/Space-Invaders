var FRAMES = [
    document.getElementById('space_shuttle'),
    document.getElementById('space_shuttle_2')
];
var frame = 0;
var lastTime = Date.now();

var MAX_SPEED = 6;
var FRICTION = 0.92;

function SpaceShuttle() {
    // dimension
    this.width = FRAMES[0].width;
    this.height = FRAMES[0].height;
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

        // animation
        var now = Date.now();
        if (now - lastTime > 100) {
            frame++;
            if (frame >= FRAMES.length) {
                frame = 0;
            }
            lastTime = now;
        }
    };

    this.render = function(context) {
        context.drawImage(FRAMES[frame], this.x, this.y);
    };

    this.interceptsEnemy = function(enemy) {
        if (this.x + this.width > enemy.x && this.x < enemy.x + enemy.width) {
            if (this.y + this.height > enemy.y && this.y < enemy.y + enemy.height) {
                return true;
            }
        }
        return false;
    };
}
