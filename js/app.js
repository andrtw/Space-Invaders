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

var spaceShuttle;
var bullets;
var enemyBullets;
var enemies;
var explosions;
var oneEnemyHasReachedTheBound;
var hud;
var gameOver;
var gameWin;

startNewGame();

// ============
// == UPDATE ==
// ============
function update(delta) {
    // no more enemies to kill (game ended or next level)
    // wait for the last enemy explosion to finish
    if (enemies.length <= 0 && explosions.length <= 0) {
        gameWin = true;
    }

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
        enemyBullets.forEach(function(enemyBullet, index) {
            enemyBullet.update();
            if (enemyBullet.y + enemyBullet.height > canvasHeight) {
                enemyBullets.splice(index, 1);
            }
        });

        // update the enemies
        for (enemy of enemies) {
            enemy.update();
            if (enemy.boundReached()) {
                oneEnemyHasReachedTheBound = true;
            }

            // make enemies shoot when they are close enough to space shuttle
            if (enemy.x + enemy.width > spaceShuttle.x &&
                enemy.x < spaceShuttle.x + spaceShuttle.width &&
                enemy.y + enemy.height < spaceShuttle.y) {
                    spawnEnemyBullet(enemy);
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
        collisionBulletSpaceShuttle();

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

    if (!gameOver && !gameWin) {
        // draw the space shuttle
        spaceShuttle.render(context);

        // draw the bullets
        for (bullet of bullets) {
            bullet.render(context);
        }
        for (enemyBullet of enemyBullets) {
            enemyBullet.render(context);
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

        // TODO: implement level system... probably never
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
    enemyBullets = [];
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
function spawnEnemyBullet(enemy) {
    var enemyBullet = new Bullet(enemy, true);
    enemyBullets.push(enemyBullet);
}
function spawnEnemy(y, xOffset=0) {
    var enemy = new Enemy(y, xOffset);
    enemies.push(enemy);
}
function spawnEnemyGroup() {
    // first row
    spawnEnemy(10, -140);
    spawnEnemy(10);
    spawnEnemy(10, 140);
    // second row
    spawnEnemy(80, -80);
    spawnEnemy(80, 80);
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
            // die
            spawnExplosion(spaceShuttle);
            spaceShuttle.die();

            if (spaceShuttle.lives <= 0) {
                gameOver = true;
            }
        }
    });
}
function collisionBulletEnemy() {
    enemies.forEach(function(enemy, enemyIndex) {
        bullets.forEach(function(bullet, bulletIndex) {
            if (bullet.intercepts(enemy)) {
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
function collisionBulletSpaceShuttle() {
    enemyBullets.forEach(function(enemyBullet, index) {
        if (enemyBullet.intercepts(spaceShuttle)) {
            // decrease space shuttle life
            spaceShuttle.collisionWithBullet();
            // destroy enemy bullet
            enemyBullets.splice(index, 1);
            // lose one life if necessary
            if (spaceShuttle.life <= 0) {
                spawnExplosion(spaceShuttle);
                spaceShuttle.die();

                if (spaceShuttle.lives <= 0) {
                    gameOver = true;
                }
            }
        }
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
