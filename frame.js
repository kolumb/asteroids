"use strict";
function tick() {
    player.update();
    asteroids.map(a => a.update());
}
function render() {
    ctx.fillStyle = pause ? "rgb(80,70,60)" : "rgb(30,30,30)";
    ctx.fillRect(0, 0, width, height);
    player.draw();
    asteroids.map(a => a.draw());
}

function frame() {
    tick();
    render();
    if (pause === false) {
        requestAnimationFrame(frame);
    }
}
