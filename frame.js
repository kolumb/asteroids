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
                const dist = Math.sqrt(distEuclidean);
                const distVector2to1 = a1.pos.sub(a2.pos);
                const distVector1to2 = distVector2to1.scale(-1);
                const distVector2to1Normalized = distVector2to1.normalized();
                const distVector1to2Normalized = distVector1to2.normalized();
                const vel2to1 = Math.max(distVector2to1.dot(a2.vel) / dist, 0);
                const vel1to2 = Math.max(distVector1to2.dot(a1.vel) / dist, 0);
                const force2to1 = distVector2to1Normalized.scale(vel2to1 * ASTEROID_RIGIDITY)
                const force1to2 = distVector1to2Normalized.scale(vel1to2 * ASTEROID_RIGIDITY)
                a1.vel.addMut(force2to1);
                a1.vel.subMut(force1to2);
                a2.vel.addMut(force1to2);
                a2.vel.subMut(force2to1);
                const penetrationPercentage = 1 - dist / Math.sqrt(touchEuclidean)
                const fix2to1 = distVector2to1.scale(penetrationPercentage)
                a1.pos.addMut(fix2to1.scale(a2.size ** 2 / touchEuclidean));
                a2.pos.subMut(fix2to1.scale(a1.size ** 2 / touchEuclidean));
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
