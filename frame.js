"use strict";
function tick(dt) {
    player.update(dt);
    ufos.forEach(u => u.update(dt));
    asteroids.forEach(a => a.update(dt));
    bullets.forEach(b => b.update(dt));
    particles.forEach(p => p.update(dt));
    asteroids.forEach(a => {
        bullets.forEach(b => {
            if (a.pos.distEuclidean(b.pos) < (a.size + ASTEROID_MAX_HEIGHT / 2) ** 2) {
                const angle = b.pos.angleTo(a.pos);
                a.split(angle);
                b.destroy();
                player.score += Math.floor(a.size / MIN_ASTEROID_SIZE);
                if (player.ship.laserTarget === a && !player.ship.laserTarget.target) {
                    player.ship.laserShooting = false;
                }
            }
        })
        if (player.ship.pos.distEuclidean(a.pos) < (a.size + ASTEROID_MAX_HEIGHT / 2 + player.ship.size / 2) ** 2) {
            const collisionVector = player.ship.pos.sub(a.pos);
            player.ship.vel.addMut(collisionVector.scale(0.05));
            player.ship.pos.addMut(collisionVector.scale(0.05));
            a.split(player.ship.pos.angleTo(a.pos));
            if (!gameOver) {
                player.ship.bulletShooting = false;
                player.ship.laserShooting = false;
                setTimeout(gameOverHandler, 1000);
                gameOver = true;
            }
        }
        a.dangerous = false;
        if (player.ship.pos.sub(a.pos).dot(a.vel) > 0 && distPointToLine(player.ship.pos, a.pos, a.pos.add(a.vel)) < a.size * 2) {
            a.dangerous = true;
        }
    });
    ufos.forEach(u => {
        bullets.forEach(b => {
            if (u.pos.distEuclidean(b.pos) < u.size ** 2) {
                b.destroy();
                u.health--;
                const playerToUFO = u.pos.sub(player.ship.pos);
                u.target = u.getTarget(playerToUFO.scale(3).add(u.pos), lesser / 4);
                u.nearTarget = u.getTarget(u.target, lesser / 4);
                u.pos.addMut(playerToUFO.clamp(5));
                const pool = particles.filter(p => p.lifetime <= 0);
                for (let i = 0; i < Math.min(pool.length, u.size/4); i++) {
                    pool[i].lifetime = 100;
                    pool[i].pos = b.pos.copy();
                    pool[i].vel = Vector.fromAngle(b.direction + Math.PI / 2 + Math.random() * 1.6 - 0.8).scale(8*Math.random() - 4);
                    pool[i].color = "255, 150, 255";
                }
                if (u.health <= 0) {
                    u.destroy();
                    player.score += 16;
                }
            }
        });
        if (!gameOver && u.pos.distEuclidean(player.ship.pos) < (u.size + player.ship.size) ** 2) {
            gameOver = true;
            player.ship.abductedBy = u;
            setTimeout(gameOverHandler, 1000);
        }
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
                const pool = particles.filter(p => p.lifetime <= 0);
                const collisionPos = a1.pos.add(dist1to2.normalized().scale(a1.size + ASTEROID_MAX_HEIGHT / 2));
                const p1 = pool[0] || {};
                const p2 = pool[1] || {};
                const a1Speed = dist1to2.dot(a1.vel) / dist;
                const a2Speed = dist2to1.dot(a2.vel) / dist;
                if (a1Speed > 0) {
                    const force1to2 = dist1to2.normalized().scale(a1Speed * ASTEROID_RIGIDITY);
                    a1.vel.subMut(force1to2.scale(a2Influence * 180 / MAX_ASTEROID_SIZE));
                    a2.vel.addMut(force1to2.scale(a1Influence * 180 / MAX_ASTEROID_SIZE));
                    const perpendicularDir1to2 = dist1to2.y > 0 ? 1 : -1;
                    const perpendicular1to2 = new Vector(perpendicularDir1to2, -perpendicularDir1to2 * dist1to2.x / dist1to2.y);
                    a1.perp = perpendicular1to2;
                    p1.lifetime = 50;
                    p1.pos = collisionPos.copy();
                    p1.vel = perpendicular1to2.normalized().add(a1.vel);
                    if(debug) a1.oldAngleSeed = a1.angleSpeed;
                    a2.angleSpeed -= VEL_TO_ROT * a1Influence * perpendicular1to2.dot(a1.vel) / perpendicular1to2.length();
                    a1.angleSpeed -= VEL_TO_ROT * a2Influence * perpendicular1to2.dot(a1.vel) / perpendicular1to2.length();
                }
                if (a2Speed > 0) {
                    const force2to1 = dist2to1.normalized().scale(a2Speed * ASTEROID_RIGIDITY);
                    a1.vel.addMut(force2to1.scale(a2Influence * 180 / MAX_ASTEROID_SIZE));
                    a2.vel.subMut(force2to1.scale(a1Influence * 180 / MAX_ASTEROID_SIZE));
                    const perpendicularDir2to1 = dist2to1.y > 0 ? 1 : -1;
                    const perpendicular2to1 = new Vector(perpendicularDir2to1, -perpendicularDir2to1 * dist2to1.x / dist2to1.y);
                    a2.perp = perpendicular2to1;
                    p2.lifetime = 50;
                    p2.pos = collisionPos.copy();
                    p2.vel = perpendicular2to1.normalized().add(a2.vel);
                    if(debug) a2.oldAngleSeed = a2.angleSpeed;
                    a1.angleSpeed -= VEL_TO_ROT * a2Influence * perpendicular2to1.dot(a2.vel) / perpendicular2to1.length();
                    a2.angleSpeed -= VEL_TO_ROT * a1Influence * perpendicular2to1.dot(a2.vel) / perpendicular2to1.length();
                }

                const deltaAngleSpeed = a1.angleSpeed + a2.angleSpeed;
                a1.angleSpeed -= deltaAngleSpeed * a2Influence;
                a2.angleSpeed -= deltaAngleSpeed * a1Influence;
                if (debug && debugCollisions) pause = true;
            }
        }
    }
    if (frameCount > nextAsteroidSpawn) {
        if (asteroids.length < MAX_ASTEROID_SIZE) spawnAsteroid();
        nextAsteroidSpawn = frameCount + asteroids.length * 7;
        if (ufos.length < player.score / 120 && Math.random() < 0.4 * dt) {
            if (Math.random() < 0.5) {
                var x = Math.random() * width;
                var y = Math.random() < 0.5 ? -100 : height + 100;
            } else {
                var x = Math.random() < 0.5 ? -100 : width + 100;
                var y = Math.random() * height;
            }
            ufos.push(new UFO(new Vector(x, y)))
        }
    }
}
function render() {
    ctx.fillStyle = pause ? "rgb(80,70,60)" : "rgb(30,30,30)";
    ctx.fillRect(0, 0, width, height);
    player.draw();
    asteroids.forEach(a => a.draw());
    bullets.forEach(a => a.draw());
    ufos.forEach(u => u.draw());
    particles.forEach(p => p.draw());
    ctx.fillStyle = "#e11";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ccc";
    for (var i = 0; i <= player.ship.laserEnergy - 1; i++) {
        ctx.fillRect(10 + i*50, 10, 40, 8);
        ctx.strokeRect(10 + i*50, 10, 40, 8);
    }
    ctx.lineWidth = 1;
    ctx.fillStyle = "#e11";
    ctx.fillRect(10 + i*50, 10, player.ship.laserEnergy%1*40, 8);

    ctx.fillStyle = "white";
    ctx.textAlign = "right";
    ctx.font = "20px sans-serif";
    ctx.fillText(player.score, width - 10, 25);
}
function frame(time) {
    const dt = time - lastFrameTime;
    lastFrameTime = time;
    frameCount++;
    if (dt < 1000) tick(dt * 0.06);
    render();
    if (pause === false) {
        requestAnimationFrame(frame);
    }
}
