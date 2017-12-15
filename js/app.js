// canvas
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

// ============
// == UPDATE ==
// ============
function update(delta) {
    console.log('update');
}

// ============
// == RENDER ==
// ============
function render() {
    // clear the canvas
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    console.log('render');
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
