"use strict";
function tick() {
    player.update();
    asteroids.forEach(a => a.update());
    for (let i = 0; i < asteroids.length - 1; i++) {
        for (let j = i + 1; j < asteroids.length; j++) {
            const a1 = asteroids[i];
            const a2 = asteroids[j];
            const distEuclidean = a1.pos.distEuclidean(a2.pos);
            const touchEuclidean = (a1.size + a2.size + ASTEROID_MAX_HEIGHT) ** 2;
            if (touchEuclidean > distEuclidean) {
                const distVector = a1.pos.sub(a2.pos);
                const dist = Math.sqrt(distEuclidean);
                const penetrationPercentage = dist / Math.sqrt(touchEuclidean)
                const fix2to1 = distVector.scale(1 - penetrationPercentage)
                a1.pos.addMut(fix2to1.scale(a2.size ** 2 / distEuclidean));
                a2.pos.subMut(fix2to1.scale(a1.size ** 2 / distEuclidean));
            }
        }
    }
}
function render() {
    ctx.fillStyle = pause ? "rgb(80,70,60)" : "rgb(30,30,30)";
    ctx.fillRect(0, 0, width, height);
    player.draw();
    asteroids.forEach(a => a.draw());
}

function frame() {
    tick();
    render();
    if (pause === false) {
        requestAnimationFrame(frame);
    }
}
