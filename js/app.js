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
window.addEventListener('click', function(event) {
    if (gameOver) {
        startNewGame();
    }
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

var spaceShuttle = new SpaceShuttle();
var bullets = [];
var enemies = [];
var oneEnemyHasReachedTheBound = false;
var hud = new Hud();
var gameOver = false;

startNewGame();

// ============
// == UPDATE ==
// ============
function update(delta) {
    if (!gameOver) {
        // spawn new bullet
        if (pressedKeys.spacebar) {
            spawnBullet();
        }

        // update the space shuttle
        spaceShuttle.update(pressedKeys);

        // update the bullets and remove them when out of screen
        bullets.forEach(function(bullet, index) {
            bullet.update();
            if (bullet.y < 0) {
                bullets.splice(index, 1);
            }
        });

        // update the enemies
        for (enemy of enemies) {
            enemy.update();
            if (enemy.boundReached()) {
                oneEnemyHasReachedTheBound = true;
            }
        }
        if (oneEnemyHasReachedTheBound) {
            invertEnemiesMovement();
        }

        // collision detection
        collisionSpaceShuttleEnemy();
        collisionBulletEnemy();

        // update the hud
        hud.update();
    }
}

// ============
// == RENDER ==
// ============
function render() {
    // clear the canvas
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    if (!gameOver) {
        // draw the space shuttle
        spaceShuttle.render(context);

        // draw the bullets
        for (bullet of bullets) {
            bullet.render(context);
        }

        // draw the enemies
        for (enemy of enemies) {
            enemy.render(context);
        }

        // draw the hud
        hud.render(context);
    }

    if (gameOver) {
        context.font = '30px Consolas';
        context.fillStyle = '#ddd';
        var text = 'GAME OVER';
        context.fillText(text, (canvasWidth - context.measureText(text).width) / 2, canvasHeight / 2);
        context.font = '18px Consolas';
        text = 'With score: ' + hud.score;
        context.fillText(text, (canvasWidth - context.measureText(text).width) / 2, canvasHeight / 2 + 30);
        context.font = '12px Consolas';
        text = 'Click to play again';
        context.fillText(text, (canvasWidth - context.measureText(text).width) / 2, canvasHeight / 2 + 50);
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

// =============================================

// start game
function startNewGame() {
    spaceShuttle = new SpaceShuttle();
    bullets = [];
    enemies = [];
    oneEnemyHasReachedTheBound = false;
    hud = new Hud();
    gameOver = false;
    spawnEnemyGroup();
}

// spawn functions
function spawnBullet() {
    var bullet = new Bullet(spaceShuttle);
    bullets.push(bullet);
}
function spawnEnemy(y, xOffset=0) {
    var enemy = new Enemy(y, xOffset);
    enemies.push(enemy);
}
function spawnEnemyGroup() {
    // first row
    spawnEnemy(10, -100);
    spawnEnemy(10, );
    spawnEnemy(10, 100);
    // second row
    spawnEnemy(60, -100);
    spawnEnemy(60, );
    spawnEnemy(60, 100);
}
function invertEnemiesMovement() {
    for (enemy of enemies) {
        enemy.invertMovement();
    }
    oneEnemyHasReachedTheBound = false;
}

// collision functions
function collisionSpaceShuttleEnemy() {
    enemies.forEach(function(enemy, index) {
        if (spaceShuttle.interceptsEnemy(enemy)) {
            // destroy enemy
            enemies.splice(index, 1);
            // decrease lives
            hud.lives--;
            // reset space shuttle position
            spaceShuttle.x = canvasWidth / 2;
            spaceShuttle.y = canvasHeight / 2;

            if (hud.lives <= 0) {
                gameOver = true;
            }
        }
    });
}
function collisionBulletEnemy() {
    enemies.forEach(function(enemy, index) {
        for (bullet of bullets) {
            if (bullet.interceptsEnemy(enemy)) {
                // destroy enemy
                enemies.splice(index, 1);
                // increase score
                hud.score++;
            }
        }
    });
}
