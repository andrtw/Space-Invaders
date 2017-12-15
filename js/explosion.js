function Explosion(entity) {
    // animation
    this.anim = new Animation([
        document.getElementById('explosion_0'),
        document.getElementById('explosion_1'),
        document.getElementById('explosion_2'),
        document.getElementById('explosion_3'),
        document.getElementById('explosion_4'),
        document.getElementById('explosion_5'),
        document.getElementById('explosion_6'),
        document.getElementById('explosion_7'),
        document.getElementById('explosion_8'),
        document.getElementById('explosion_9'),
        document.getElementById('explosion_10'),
        document.getElementById('explosion_11'),
        document.getElementById('explosion_12'),
        document.getElementById('explosion_13')
    ], 60, false);

    // dimensions
    this.width = this.anim.width;
    this.height = this.anim.height;

    // position
    this.x = entity.x + (entity.width - this.width) / 2;
    this.y = entity.y + (entity.height - this.height) / 2;

    // the animation has finished to loop
    this.shouldDestroy = function() {
        return this.anim.shouldDestroy;
    };

    this.update = function() {
        this.anim.update();
    };

    this.render = function(context) {
        this.anim.render(context, this.x, this.y);
    };

}
