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
    if (gameOver || gameWin) {
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
var explosions = [];
var oneEnemyHasReachedTheBound = false;
var hud = new Hud();
var gameOver = false;
var gameWin = false;

startNewGame();

// ============
// == UPDATE ==
// ============
function update(delta) {

    if (!gameOver && !gameWin) {
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
                hud.decreaseScore();
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

        // update the explosions and remove them when they are done
        explosions.forEach(function(explosion, index) {
            explosion.update();
            if (explosion.shouldDestroy()) {
                explosions.splice(index, 1);
            }
        });

        // collision detection
        collisionSpaceShuttleEnemy();
        collisionBulletEnemy();

        // update the hud
        hud.update();

        // no more enemies to kill (game ended or next level)
        if (enemies.length <= 0) {
            gameWin = true;
        }
    }
}

// ============
// == RENDER ==
// ============
function render() {
    // clear the canvas
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    if (!gameOver && !gameWin) {
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

        // draw the explosions
        for (explosion of explosions) {
            explosion.render(context);
        }

        // draw the hud
        hud.render(context);
    }

    if (gameOver) {
        textCenter('GAME OVER', -10);
        smallTextCenter('With score: ' + hud.score, 30);
        tinyTextCenter('Click to play again', 50);
    }
    else if (gameWin) {
        textCenter('YOU WIN', -10);
        smallTextCenter('With score: ' + hud.score, 30);
        tinyTextCenter('Go to next level', 50);

        // TODO: implement level system (never)
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
    explosions = [];
    oneEnemyHasReachedTheBound = false;
    hud = new Hud();
    gameOver = false;
    gameWin = false;

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
function spawnExplosion(entity) {
    var explosion = new Explosion(entity);
    explosions.push(explosion);
}

// enemies bounds
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
            // decrease enemy life
            enemy.collisionWithSpaceShuttle();
            // destroy enemy if needed
            if (enemy.life <= 0) {
                spawnExplosion(enemy);
                enemies.splice(index, 1);
            }
            // decrease lives
            hud.lives--;
            // reset space shuttle to original position
            spaceShuttle.die();

            if (hud.lives <= 0) {
                gameOver = true;
            }
        }
    });
}
function collisionBulletEnemy() {
    enemies.forEach(function(enemy, enemyIndex) {
        bullets.forEach(function(bullet, bulletIndex) {
            if (bullet.interceptsEnemy(enemy)) {
                // decrease enemy life
                enemy.collisionWithBullet();
                // destroy bullet
                bullets.splice(bulletIndex, 1);
                // increase score
                hud.increaseScore();
                // destroy enemy if dead
                if (enemy.life <= 0) {
                    spawnExplosion(enemy);
                    enemies.splice(enemyIndex, 1);
                }
            }
        });
    });
}

// write text functions
function _textCenter(text, y) {
    context.fillStyle = '#ddd';
    context.fillText(text, (canvasWidth - context.measureText(text).width) / 2, canvasHeight / 2 + y);
}
function textCenter(text, y=0) {
    context.font = '30px Consolas';
    _textCenter(text, y);
}
function smallTextCenter(text, y=0) {
    context.font = '18px Consolas';
    _textCenter(text, y);
}
function tinyTextCenter(text, y=0) {
    context.font = '12px Consolas';
    _textCenter(text, y);
}
