function Bullet(entity, enemyBullet=false) {
    var SPEED = 10;

    // dimension
    this.width = 2;
    this.height = 3;
    // position
    this.x = entity.x + (entity.width - this.width) / 2;
    this.y = entity.y;

    this.update = function() {
        if (enemyBullet) {
            this.y += SPEED;
        }
        else {
            this.y -= SPEED;
        }
    };

    this.render = function(context) {
        var color = '#0f0';
        if (enemyBullet) {
            color = '#f00';
        }
        context.fillStyle = color;
        context.fillRect(this.x, this.y, this.width, this.height);
    };

    this.intercepts = function(entity) {
        if (this.x + this.width > entity.x && this.x < entity.x + entity.width) {
            if (this.y + this.height > entity.y && this.y < entity.y + entity.height) {
                return true;
            }
        }
        return false;
    };
}
