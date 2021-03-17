class Ship {
    constructor (pos, direction = Math.PI / 2, size = 10) {
        this.pos = pos;
        this.direction = direction;
        this.vel = new Vector();
        this.size = size;
        this.laser = false;
        this.mining = false;
        this.targetedAsteroid = null;
    }
    update () {
        const probePos = this.pos.add(this.vel);
        if (probePos.x < 0 || probePos.x > width) {
            this.vel.x *= -EDGE_BOUNCINESS;
        }
        if (probePos.y < 0 || probePos.y > height) {
            this.vel.y *= -EDGE_BOUNCINESS;
        }
        this.pos.addMut(this.vel);
        const direction = Vector.fromAngle(this.direction);
        const gun = this.pos.add(direction.scale(this.size));
        if (this.laser && !this.mining) {
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
                this.laser = false;
                this.targetedAsteroid = closestOne;
                this.mining = true;
                this.miningStart = frameCount;
            }
        }
        if (this.mining) {
            if (frameCount - this.miningStart > MINING_DURATION) {
                this.mining = false;
                this.laser = false;
                asteroids.splice(asteroids.indexOf(this.targetedAsteroid), 1);
            }
        }
        if (this.shot) {
            this.shot = false;
            bullets.push(new Bullet(gun, 10, this.direction));
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
        ctx.strokeStyle = "white";
        ctx.stroke();
        if (Input.up) {
            ctx.beginPath();
            ctx.moveTo(-this.size / 4,-this.size / 4);
            ctx.lineTo(-this.size    , 0            );
            ctx.lineTo(-this.size / 4, this.size / 4);
            ctx.strokeStyle = "orange";
            ctx.stroke();
        }
        if (!this.mining && this.laser) {
            ctx.beginPath();
            ctx.moveTo(this.size, 0);
            ctx.lineTo(bigger, 0);
            ctx.strokeStyle = "red";
            ctx.lineWidth = 3;
            ctx.stroke();
        }
        ctx.restore();
        if (this.mining) {
            ctx.save();
            ctx.beginPath();
            const direction = Vector.fromAngle(this.direction);
            const laserStart = this.pos.add(direction.scale(this.size));
            ctx.moveTo(laserStart.x, laserStart.y);
            ctx.lineTo(this.targetedAsteroid.pos.x, this.targetedAsteroid.pos.y);
            ctx.strokeStyle = "red";
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.lineWidth = 1;
        }
    }
}