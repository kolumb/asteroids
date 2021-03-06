class Asteroid {
    constructor (pos, size = 10, vel = new Vector(), angleSpeed = 0) {
        this.pos = pos;
        this.angle = 0;
        this.angleSpeed = angleSpeed;
        this.oldAngleSpeed = angleSpeed;
        this.size = size;
        this.maxSize = size + ASTEROID_MAX_HEIGHT;
        this.vel = vel;
        this.dangerous = false;
        this.points = [];
        const numberOfPoints = Math.floor(size * 0.75);
        let lastAngle = 0;
        for (let i = 0; i < numberOfPoints; i++) {
            const angleStep = (Math.random() * 1.6 + 0.2) * (Math.PI * 2 - lastAngle) / (numberOfPoints - i);
            const angle = clamp(lastAngle + angleStep, Math.PI * 2);
            lastAngle = angle;
            const radius = size + Math.random() * ASTEROID_MAX_HEIGHT;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            this.points.push(new Vector(x, y));
        }
        const middlePoints = [];
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (let i = 0; i < numberOfPoints; i++) {
            middlePoints.push(this.points[i].add(this.points[(i + 1) % numberOfPoints]).scale(0.5));
            minX = Math.min(minX, middlePoints[i].x);
            minY = Math.min(minY, middlePoints[i].y);
            maxX = Math.max(maxX, middlePoints[i].x);
            maxY = Math.max(maxY, middlePoints[i].y);
        }
        const newCenter = new Vector((minX + maxX) * 0.5, (minY + maxY) * 0.5);
        this.points.forEach(p => p.subMut(newCenter));
    }
    update (dt) {
        this.pos.addMut(this.vel.scale(dt));
        if (this.pos.x + this.size * 2 < 0)      this.pos.x = width + this.size * 2;
        if (this.pos.y + this.size * 2 < 0)      this.pos.y = height + this.size * 2;
        if (this.pos.x - this.size * 2 > width)  this.pos.x = -this.size * 2;
        if (this.pos.y - this.size * 2 > height) this.pos.y = -this.size * 2;
        this.angle += this.angleSpeed * dt;
    }
    split (direction) {
        this.destroy();
        if (this.size >= MIN_ASTEROID_SIZE * 2) {
            const dir1 = Vector.fromAngle(direction + Math.PI / 3);
            const dir2 = Vector.fromAngle(direction - Math.PI / 3);
            const pos1 = this.pos.add(dir1.scale(this.size))
            const pos2 = this.pos.add(dir2.scale(this.size))
            const a1 = new Asteroid(pos1, 2 * this.size / 3, this.vel.add(dir1.scale(BULLET_SPEED / 5)), this.angleSpeed + VEL_TO_ROT * BULLET_SPEED / 20)
            const a2 = new Asteroid(pos2, 2 * this.size / 3, this.vel.add(dir2.scale(BULLET_SPEED / 5)), this.angleSpeed - VEL_TO_ROT * BULLET_SPEED / 20)
            asteroids.push(a1)
            asteroids.push(a2)
        }
        const pool = particles.filter(p => p.lifetime <= 0);
        for (let i = 0; i < Math.min(pool.length, this.size); i++) {
            pool[i].lifetime = 100;
            pool[i].pos = this.pos.copy();
            pool[i].vel = Vector.fromAngle(direction + Math.random() * 0.8 - 0.4).scale(-Math.random() * 3 + 1).add(this.vel);
            pool[i].color = "255, 255, 255";
        }
    }
    destroy () {
        asteroids.splice(asteroids.indexOf(this), 1);
    }
    draw () {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(-this.angle);
        ctx.beginPath();
        if (!debug || !debugCollisions) {
            ctx.moveTo(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y);
            this.points.forEach(p => ctx.lineTo(p.x, p.y));
        }
        if (debug || this.dangerous) {
            ctx.moveTo(this.size + ASTEROID_MAX_HEIGHT / 2, 0);
            ctx.arc(0, 0, this.size + ASTEROID_MAX_HEIGHT / 2, 0, Math.PI * 2);
            ctx.lineTo(this.size, 0);
        }
        ctx.strokeStyle = "white";
        ctx.stroke();
        if (debug || this.dangerous) {
            const angleSpeedMult = 100
            ctx.beginPath();
            ctx.arc(0, 0, this.size, Math.min(0, -this.angleSpeed * angleSpeedMult), Math.max(-this.angleSpeed * angleSpeedMult, 0));
            ctx.strokeStyle = "#f88";
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, this.size - ASTEROID_MAX_HEIGHT / 4, Math.min(0, -this.oldAngleSpeed * angleSpeedMult), Math.max(-this.oldAngleSpeed * angleSpeedMult, 0));
            ctx.strokeStyle = "#ff8";
            ctx.stroke();
        }
        ctx.restore();
        if (debug) {
            const speedMult = 50
            if (this.perp) {
                ctx.strokeStyle = this.bad ? "red" : "white";
                this.perp.normalized().scale(20).drawFrom(this.pos)
            }
            if (this.oldVel) {
                ctx.strokeStyle = "grey";
                this.oldVel.scale(speedMult).drawFrom(this.pos)
            }
            ctx.strokeStyle = "blue";
            this.vel.scale(speedMult).drawFrom(this.pos)
        }
    }
}