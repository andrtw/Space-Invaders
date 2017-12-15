function Enemy(y, xOffset=0) {
    var ENEMY_IMAGE = document.getElementById('enemy');
    var SPEED = 1.5;
    var MAX_LIFE = 100;

    this.name = name;
    // dimension
    this.width = ENEMY_IMAGE.width;
    this.height = ENEMY_IMAGE.height;
    // position
    this.x = (canvasWidth - this.width) / 2 + xOffset;
    this.y = y;
    // life
    this.life = MAX_LIFE;

    this.update = function() {
        this.x += SPEED;
    };
    this.boundReached = function() {
        return this.x <= 0 || this.x + this.width >= canvasWidth;
    };
    this.invertMovement = function() {
        SPEED = -SPEED;
    };

    this.collisionWithBullet = function() {
        this.life--;
    };
    this.collisionWithSpaceShuttle = function() {
        this.life -= 25;
    };

    this.render = function(context) {
        context.drawImage(ENEMY_IMAGE, this.x, this.y);

        // draw life bar
        context.fillStyle = '#000';
        context.fillRect(this.x, this.y + this.height + 4, this.width, 2);
        var lifeColor = '#0f0';
        if (this.life <= 25) {
            lifeColor = '#f00';
        }
        else if (this.life <= 50) {
            lifeColor = '#ff7f27';
        }
        context.fillStyle = lifeColor;
        context.fillRect(this.x, this.y + this.height + 4, this.life * (this.width / MAX_LIFE), 2);
    };
}
