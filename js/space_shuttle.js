function SpaceShuttle() {
    var MAX_SPEED = 6;
    var FRICTION = 0.92;

    this.MAX_LIFE = 100;
    this.MAX_LIVES = 3;

    // animation
    this.anim = new Animation([
        document.getElementById('space_shuttle_0'),
        document.getElementById('space_shuttle_1')
    ], 100);
    // dimension
    this.width = this.anim.width;
    this.height = this.anim.height;
    // position
    var START_Y = canvasHeight - this.height - 50;
    this.x = (canvasWidth - this.width) / 2;
    this.y = START_Y;
    // velocity
    this.velX = 0;
    this.velY = 0;
    // life
    this.lives = this.MAX_LIVES;
    this.life = this.MAX_LIFE;

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
        this.anim.update();
    };

    this.render = function(context) {
        this.anim.render(context, this.x, this.y);
    };

    this.interceptsEnemy = function(enemy) {
        if (this.x + this.width > enemy.x && this.x < enemy.x + enemy.width) {
            if (this.y + this.height > enemy.y && this.y < enemy.y + enemy.height) {
                return true;
            }
        }
        return false;
    };

    this.die = function() {
        this.x = (canvasWidth - this.width) / 2;
        this.y = START_Y;
        this.velX = 0;
        this.velY = 0;
        this.lives--;
        this.life = this.MAX_LIFE;
    };

    this.collisionWithBullet = function() {
        this.life--;
    };
}
