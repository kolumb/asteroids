"use strict";
const updateSize = () => {
    width = innerWidth;
    height = innerHeight;
    canvas.height = height;
    canvas.width = width;
    lesser = width < height ? width : height;
    bigger = width > height ? width : height;
};
const resizeHandler = () => {
    updateSize();
    if (player.ship.pos.x < 0)      player.ship.pos.x = player.ship.size;
    if (player.ship.pos.y < 0)      player.ship.pos.y = player.ship.size;
    if (player.ship.pos.x > width)  player.ship.pos.x = width - player.ship.size;
    if (player.ship.pos.y > height) player.ship.pos.y = height - player.ship.size;
    if (pause) render();
}
window.addEventListener("resize", resizeHandler);

const pointerdownHandler = function(e) {
    Input.pointer.set(e.offsetX, e.offsetY);
    Input.downState = true;
};
Canvas.addEventListener("pointerdown", pointerdownHandler);

const pointermoveHandler = function(e) {
    Input.pointer.set(e.offsetX, e.offsetY);
};
Canvas.addEventListener("pointermove", pointermoveHandler);

const pointerupHandler = function(e) {
    Input.pointer.set(e.offsetX, e.offsetY);
    Input.downState = false;
};
window.addEventListener("pointerup", pointerupHandler);

const keydownHandler = function(e) {
    switch (e.code) {
        case "Space":
            player.ship.shot = true;
            break;
        case "KeyE":
            player.ship.shot = !player.ship.shot;
            break;
        case "KeyF":
            if (!player.ship.laserShooting) player.ship.laserSearching = true;
            break;
        case "KeyP":
            pause = !pause;
            if (pause === false) {
                frame();
            }
            break;
        case "KeyI":
            if (e.shiftKey) {
                debugCollisions = !debugCollisions;
                if (debugCollisions) debug = true;
            } else {
                debug = !debug;
            }
            break;
        case "ArrowUp":
        case "KeyW":
            Input.up = true;
            break;
        case "ArrowDown":
        case "KeyS":
            Input.down = true;
            break;
        case "ArrowLeft":
        case "KeyA":
            Input.left = true;
            break;
        case "ArrowRight":
        case "KeyD":
            Input.right = true;
            break;
    }
};
window.addEventListener("keydown", keydownHandler);

const keyupHandler = function(e) {
    switch (e.code) {
        case "Space":
            player.ship.shot = false;
            break;
        case "KeyF":
            player.ship.laserSearching = false;
            break;
        case "ArrowUp":
        case "KeyW":
            Input.up = false;
            break;
        case "ArrowDown":
        case "KeyS":
            Input.down = false;
            break;
        case "ArrowLeft":
        case "KeyA":
            Input.left = false;
            break;
        case "ArrowRight":
        case "KeyD":
            Input.right = false;
            break;
    }
};
window.addEventListener("keyup", keyupHandler);

RestartElem.addEventListener("click", e => {
    location.reload();
})
