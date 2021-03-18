class Asteroid {
    constructor (pos, size = 10, vel = new Vector(), angleSpeed = 0) {
        this.pos = pos;
        this.angle = 0;
        this.angleSpeed = angleSpeed;
        this.size = size;
        this.maxSize = size + ASTEROID_MAX_HEIGHT;
        this.vel = vel;
        this.points = [];
        const numberOfPoints = size * 0.75;
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
    }
    update () {
        this.pos.addMut(this.vel);
        if (this.pos.x + this.maxSize < 0)      this.pos.x = width + this.maxSize;
        if (this.pos.y + this.maxSize < 0)      this.pos.y = height + this.maxSize;
        if (this.pos.x - this.maxSize > width)  this.pos.x = -this.maxSize;
        if (this.pos.y - this.maxSize > height) this.pos.y = -this.maxSize;
        this.angle += this.angleSpeed;
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
            ctx.moveTo(this.points[0].x, this.points[0].y);
            this.points.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.closePath();
        }
        if (debug) {
            ctx.moveTo(this.size + ASTEROID_MAX_HEIGHT / 2, 0);
            ctx.arc(0, 0, this.size + ASTEROID_MAX_HEIGHT / 2, 0, Math.PI * 2);
            ctx.lineTo(this.size, 0);
        }
        ctx.strokeStyle = "white";
        ctx.stroke();
        if (debug) {
            const angleSpeedMult = 100
            ctx.beginPath();
            ctx.arc(0, 0, this.size, Math.min(0, -this.angleSpeed * angleSpeedMult), Math.max(-this.angleSpeed * angleSpeedMult, 0));
            ctx.strokeStyle = "#f88";
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, this.size - ASTEROID_MAX_HEIGHT / 4, Math.min(0, -this.oldAngleSeed * angleSpeedMult), Math.max(-this.oldAngleSeed * angleSpeedMult, 0));
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