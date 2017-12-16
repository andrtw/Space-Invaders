function Animation(frames, time, loop=true) {
    this.width = frames[0].width;
    this.height = frames[0].height;
    this.shouldDestroy = false;

    var lastTime = Date.now();
    var currentFrame = 0;

    this.update = function() {
        if (!this.shouldDestroy) {
            var now = Date.now();
            if (now - lastTime > time) {
                currentFrame++;
                if (currentFrame > frames.length - 1) {
                    if (loop) {
                        currentFrame = 0;
                    }
                    else {
                        this.shouldDestroy = true;
                    }
                }
                lastTime = now;
            }
        }
    };

    this.render = function(context, x, y) {
        if (!this.shouldDestroy) {
            context.drawImage(frames[currentFrame], x, y);
        }
    };

}
