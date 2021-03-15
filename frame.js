"use strict";
function tick() {
    player.update();
}
function render() {
    ctx.fillStyle = pause ? "rgb(80,70,60)" : "rgb(30,30,30)";
    ctx.fillRect(0, 0, width, height);
    player.draw();
}

function frame() {
    tick();
    render();
    if (pause === false) {
        requestAnimationFrame(frame);
    }
}
