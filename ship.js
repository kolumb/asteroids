class Ship {
    constructor (pos, size = 10, direction = Math.PI / 2) {
        this.pos = pos;
        this.size = size;
        this.direction = direction;
        this.vel = new Vector();
        this.rotationSpeed = 0.05;
        this.thrustPower = 0.05;
        this.knockback = 0.02;
        this.laserEnergy = 9.8;
        this.laserEnergyRestorationSpeed = 0.002;
        this.laserSearching = false;
        this.laserShooting = false;
        this.laserTarget = null;
        this.lastShotFrame = 0;
        this.abducted = false;
    }
    turnLeft (dt) {
        this.direction += this.rotationSpeed * dt;
    }
    turnRight (dt) {
        this.direction -= this.rotationSpeed * dt;
    }
    thrust (dt) {
        this.vel.addMut(Vector.fromAngle(this.direction)
            .scale(this.thrustPower * dt));
    }
    update (dt) {
        this.laserEnergy = Math.min(this.laserEnergy + this.laserEnergyRestorationSpeed * dt, 10);
        const probePos = this.pos.add(this.vel.scale(dt));
        if (probePos.x < 0 || probePos.x > width) {
            this.vel.x *= -EDGE_BOUNCINESS;
        }
        if (probePos.y < 0 || probePos.y > height) {
            this.vel.y *= -EDGE_BOUNCINESS;
        }
        this.pos.addMut(this.vel.scale(dt));
        if (gameOver) return;
        const direction = Vector.fromAngle(this.direction);
        const gun = this.pos.add(direction.scale(this.size));
        if (this.laserSearching && !this.laserShooting && this.laserEnergy > 1) {
            const laserCap = this.pos.add(direction.scale(bigger));
            const candidates = [];
            asteroids.forEach(a => {
                const distToLazer = distPointToLine(a.pos, gun, laserCap);
                if (distToLazer < a.size + ASTEROID_MAX_HEIGHT / 2) {
                    if (direction.dot(this.pos.sub(a.pos)) < 0) {
                        candidates.push(a);
                    }
                }
            })
            ufos.forEach(u => {
                const distToLazer = distPointToLine(u.pos, gun, laserCap);
                if (distToLazer < u.size) {
                    if (direction.dot(this.pos.sub(u.pos)) < 0) {
                        candidates.push(u);
                    }
                }
            })
            let closestOne;
            let minDist = Infinity;
            candidates.forEach(a => {
                const dist = a.pos.distEuclidean(gun);
                if (dist < minDist) {
                    minDist = dist;
                    closestOne = a;
                }
            })
            if (closestOne) {
                this.laserShooting = true;
                this.laserTarget = closestOne;
                this.miningStart = frameCount;
            }
        }
        if (this.laserShooting) {
            this.laserEnergy -= dt / (this.laserTarget.size * 2);
            if (frameCount - this.miningStart > this.laserTarget.size * 2 / dt) {
                this.laserShooting = false;
                if (this.laserTarget.target) {
                    player.score += this.laserTarget.size;
                    ufos.splice(ufos.indexOf(this.laserTarget), 1);
                } else {
                    player.score += 2 ** Math.floor(this.laserTarget.size / MIN_ASTEROID_SIZE) / 2;
                    asteroids.splice(asteroids.indexOf(this.laserTarget), 1);
                }
            }
        }
        if (this.shot) {
            if (frameCount - this.lastShotFrame > SHOOT_COOLDOWN / dt) {
                this.vel.addMut(Vector.fromAngle(this.direction).scale(-this.knockback * dt))
                bullets.push(new Bullet(gun, this.direction));
                this.lastShotFrame = frameCount;
            }
        }
    }
    draw () {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(-this.direction);
        ctx.beginPath();
        ctx.moveTo( this.size    , 0            );
        ctx.lineTo(-this.size / 2, this.size / 2);
        ctx.lineTo(-this.size / 4, 0            );
        ctx.lineTo(-this.size / 2,-this.size / 2);
        ctx.closePath();
        ctx.strokeStyle = "#baf";
        ctx.stroke();
        if (Input.up) {
            ctx.beginPath();
            ctx.moveTo(-this.size / 4,-this.size / 4);
            ctx.lineTo(-this.size    , 0            );
            ctx.lineTo(-this.size / 4, this.size / 4);
            ctx.strokeStyle = "orange";
            ctx.stroke();
        }
        if (this.laserSearching && !this.laserShooting && (this.laserEnergy > 1 || Math.random() < 0.3)) {
            ctx.beginPath();
            ctx.moveTo(this.size, 0);
            ctx.lineTo(bigger, 0);
            ctx.strokeStyle = "red";
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        ctx.restore();
        if (this.laserShooting) {
            ctx.save();
            ctx.beginPath();
            const direction = Vector.fromAngle(this.direction);
            const laserStart = this.pos.add(direction.scale(this.size));
            ctx.moveTo(laserStart.x, laserStart.y);
            ctx.lineTo(this.laserTarget.pos.x, this.laserTarget.pos.y);
            ctx.strokeStyle = "red";
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.lineWidth = 1;
            const pool = particles.filter(p => p.lifetime <= 0);
            for (let i = 0; i < Math.min(pool.length, this.laserTarget.size/20); i++) {
                pool[i].lifetime = 100;
                pool[i].pos = this.laserTarget.pos.copy();
                pool[i].vel = Vector.fromAngle(Math.PI * 2 * Math.random()).scale(4*Math.random() - 2);
                pool[i].color = "255, 0, 0";
            }
        }
    }
}