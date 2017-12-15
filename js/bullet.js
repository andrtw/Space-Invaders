function Bullet(spaceShuttle) {
    // dimension
    this.width = 4;
    this.height = 4;
    // position
    this.x = spaceShuttle.x + (spaceShuttle.width - this.width) / 2;
    this.y = spaceShuttle.y;

    this.update = function() {
        this.y -= 10;
    };

    this.render = function(context) {
        context.fillStyle = '#0f0';
        context.fillRect(this.x, this.y, this.width, this.height);
    };
}
