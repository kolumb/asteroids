"use strict";
function tick() {
    player.update();
    asteroids.forEach(a => a.update());
    bullets.forEach(a => a.update());
    asteroids.forEach(a => {
        bullets.forEach(b => {
            if (a.pos.distEuclidean(b.pos) < (a.size + ASTEROID_MAX_HEIGHT / 2) ** 2) {
                a.split(b.pos.angleTo(a.pos), b.speed);
                b.destroy();
            }
        })
    });
    for (let i = 0; i < asteroids.length - 1; i++) {
        for (let j = i + 1; j < asteroids.length; j++) {
            const a1 = asteroids[i];
            const a2 = asteroids[j];
            const distEuclidean = a1.pos.distEuclidean(a2.pos);
            const touchEuclidean = (a1.size + a2.size + ASTEROID_MAX_HEIGHT) ** 2;
            if (touchEuclidean > distEuclidean) {
                const a1Influence = a1.size ** 2 / touchEuclidean;
                const a2Influence = a2.size ** 2 / touchEuclidean;

                const dist = Math.sqrt(distEuclidean);
                const dist1to2 = a2.pos.sub(a1.pos);
                const dist2to1 = a1.pos.sub(a2.pos);

                const penetrationPercentage = 1 - dist / Math.sqrt(touchEuclidean)
                const fix2to1 = dist2to1.scale(penetrationPercentage)
                a1.pos.addMut(fix2to1.scale(3 * a2Influence));
                a2.pos.subMut(fix2to1.scale(3 * a1Influence));

                if(debug) {
                    a1.oldVel = a1.vel.copy();
                    a2.oldVel = a2.vel.copy();
                }
                const a1Speed = dist1to2.dot(a1.vel) / dist;
                const a2Speed = dist2to1.dot(a2.vel) / dist;
                if (a1Speed > 0) {
                    const force1to2 = dist1to2.normalized().scale(a1Speed * ASTEROID_RIGIDITY);
                    a1.vel.subMut(force1to2.scale(a2Influence * 180 / MAX_ASTEROID_SIZE));
                    a2.vel.addMut(force1to2.scale(a1Influence * 180 / MAX_ASTEROID_SIZE));
                    const perpendicularDir1to2 = dist1to2.y > 0 ? 1 : -1;
                    const perpendicular1to2Normalized = new Vector(perpendicularDir1to2, -perpendicularDir1to2 * dist1to2.x / dist1to2.y);
                    a1.perp = perpendicular1to2Normalized;
                    if(debug) a1.oldAngleSeed = a1.angleSpeed;
                    a2.angleSpeed -= VEL_TO_ROT * a1Influence * perpendicular1to2Normalized.dot(a1.vel) / perpendicular1to2Normalized.length();
                    a1.angleSpeed -= VEL_TO_ROT * a2Influence * perpendicular1to2Normalized.dot(a1.vel) / perpendicular1to2Normalized.length();
                }
                if (a2Speed > 0) {
                    const force2to1 = dist2to1.normalized().scale(a2Speed * ASTEROID_RIGIDITY);
                    a1.vel.addMut(force2to1.scale(a2Influence * 180 / MAX_ASTEROID_SIZE));
                    a2.vel.subMut(force2to1.scale(a1Influence * 180 / MAX_ASTEROID_SIZE));
                    const perpendicularDir2to1 = dist2to1.y > 0 ? 1 : -1;
                    const perpendicular2to1Normalized = new Vector(perpendicularDir2to1, -perpendicularDir2to1 * dist2to1.x / dist2to1.y);
                    a2.perp = perpendicular2to1Normalized;
                    if(debug) a2.oldAngleSeed = a2.angleSpeed;
                    a1.angleSpeed -= VEL_TO_ROT * a2Influence * perpendicular2to1Normalized.dot(a2.vel) / perpendicular2to1Normalized.length();
                    a2.angleSpeed -= VEL_TO_ROT * a1Influence * perpendicular2to1Normalized.dot(a2.vel) / perpendicular2to1Normalized.length();
                }

                const deltaAngleSpeed = a1.angleSpeed + a2.angleSpeed;
                a1.angleSpeed -= deltaAngleSpeed * a2Influence;
                a2.angleSpeed -= deltaAngleSpeed * a1Influence;
                if (debug && debugCollisions) pause = true;
            }
        }
    }
}
function render() {
    ctx.fillStyle = pause ? "rgb(80,70,60)" : "rgb(30,30,30)";
    ctx.fillRect(0, 0, width, height);
    player.draw();
    asteroids.forEach(a => a.draw());
    bullets.forEach(a => a.draw());
}

function frame() {
    frameCount++;
    tick();
    render();
    if (pause === false) {
        requestAnimationFrame(frame);
    }
}
