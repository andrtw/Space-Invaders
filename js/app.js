// canvas
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

// controls
window.addEventListener('keydown', function(event) {
    var key = keyMap[event.keyCode];
    pressedKeys[key] = true;
});
window.addEventListener('keyup', function(event) {
    var key = keyMap[event.keyCode];
    pressedKeys[key] = false;
});
var keyMap = {
    38: 'up', 87: 'up',
    39: 'right', 68: 'right',
    40: 'down', 83: 'down',
    37: 'left', 65: 'left',
    32: 'spacebar'
};
var pressedKeys = {
    up: false,
    left: false,
    right: false,
    down: false,
    spacebar: false
};

var spaceShuttle = new SpaceShuttle(canvasWidth, canvasHeight);
var bullets = [];

// ============
// == UPDATE ==
// ============
function update(delta) {
    // spawn new bullet
    if (pressedKeys.spacebar) {
        spawnBullet();
    }

    // update the space shuttle
    spaceShuttle.update(pressedKeys);

    // update the bullets and remove them when out of screen
    bullets.forEach(function(bullet, index) {
        if (bullet.y < 0) {
            bullets.splice(index, 1);
            return;
        }
        bullet.update();
    });
}

// ============
// == RENDER ==
// ============
function render() {
    // clear the canvas
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    // draw the space shuttle
    spaceShuttle.render(context);

    // draw the bullets
    for (bullet of bullets) {
        bullet.render(context);
    }
}

// ===============
// == GAME LOOP ==
// ===============
function loop(timestamp) {
    var delta = timestamp - lastRender;

    update(delta);
    render();

    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}
var lastRender = 0;
window.requestAnimationFrame(loop);

function spawnBullet() {
    var bullet = new Bullet(spaceShuttle);
    bullets.push(bullet);
}
