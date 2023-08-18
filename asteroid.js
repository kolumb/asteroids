class Asteroid {
    constructor (pos, size = 10, vel = new Vector(), angleSpeed = 0, points, angle) {
        this.pos = pos;
        this.angle = 0//points ? angle : 0;
        this.angleSpeed = angleSpeed;
        this.oldAngleSpeed = angleSpeed;
        this.size = size * 10;
        this.maxSize = size + ASTEROID_MAX_HEIGHT;
        this.vel = vel;
        this.dangerous = false;
        this.points = points || [];
        const numberOfPoints = 20// points ? points.length : Math.floor(size * 0.75);
        if (numberOfPoints < Math.floor(MIN_ASTEROID_SIZE * 0.75)) {
            this.size = 0;
            setTimeout(this.destroy.bind(this), 500)
            return;
        }
        if (!points) {
            let lastAngle = 0;
            for (let i = 0; i < numberOfPoints; i++) {
                const angleStep = (Math.random() * 1.6 + 0.2) * (Math.PI * 2 - lastAngle) / (numberOfPoints - i);
                const angle = clamp(lastAngle + angleStep, Math.PI * 2);
                lastAngle = angle;
                const radius = size/*3*size + i*1*/ + Math.random() * ASTEROID_MAX_HEIGHT;
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                this.points.push(new Vector(x, y));
            }
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
        // if (points) this.size = Math.min(maxX - minX, maxY - minY) / 2;
        this.points.forEach(p => p.subMut(newCenter));
        this.pos.addMut(newCenter);
    }
    update (dt) {
        this.pos.addMut(this.vel.scale(dt));
        if (this.pos.x + this.size * 2 < 0)      this.pos.x = width + this.size * 2;
        if (this.pos.y + this.size * 2 < 0)      this.pos.y = height + this.size * 2;
        if (this.pos.x - this.size * 2 > width)  this.pos.x = -this.size * 2;
        if (this.pos.y - this.size * 2 > height) this.pos.y = -this.size * 2;
        this.angle += this.angleSpeed * dt;
    }
    split (direction, pos) {
        const dir1 = Vector.fromAngle(direction - Math.PI / 3);
        const dir2 = Vector.fromAngle(direction + Math.PI / 3);
        const relativePos = pos.sub(this.pos);
        const dir = Vector.fromAngle(direction).add(relativePos);
        // const startingToLeft = determinant(this.points[0], relativePos, dir) < 0;
        // let lastToLeft = startingToLeft;
        let currentToLeft = determinant(this.points[0], relativePos, dir) < 0;
        let l = 0;
        let r = 1;
        const len = this.points.length
        // console.log(this.points[0], relativePos, dir)
        // console.log(this.points.map(p => determinant(p, relativePos, dir) < 0))
        while ((Math.abs(l) + Math.abs(r)) < len) {
            let newPoints = [];
            let newLeftPoints = [];
            let newRightPoints = [];
            let point = this.points[mod(l, len)];
            let newToLeft = currentToLeft;
            // console.log({currentToLeft})
            while (currentToLeft === newToLeft) {
                newLeftPoints.push(point)
                l--;
                point = this.points[mod(l, len)]
                // console.log(l, len, (l % len + len) % len)
                newToLeft = determinant(point, relativePos, dir) < 0;
                // console.log(newToLeft);
            }
            if (mod(l, len) !== mod(r, len)) {
                // r++;
                point = this.points[mod(r, len)]
                newToLeft = determinant(point, relativePos, dir) < 0;
                while (currentToLeft === newToLeft) {
                    newRightPoints.push(point)
                    r++;
                    point = this.points[mod(r, len)]
                    newToLeft = determinant(point, relativePos, dir) < 0;
                }
            }
            let fixDir = currentToLeft ? dir2 : dir1;
            asteroids.push(new Asteroid(this.pos.add(fixDir.scale(this.size * 3)),
                2 * this.size / 3,
                this.vel,//.add(fixDir.scale(BULLET_SPEED / 5)),
                0,//this.angleSpeed + VEL_TO_ROT * BULLET_SPEED / 20 * (currentToLeft ? -1 : 1),
                newRightPoints.concat(newLeftPoints.reverse()),
                this.angle + Math.PI
            ));
            currentToLeft = !currentToLeft;
        }
        // const a1 = new Asteroid(this.pos.add(dir1.scale(this.size)), 2 * this.size / 3, this.vel.add(dir1.scale(BULLET_SPEED / 5)), this.angleSpeed + VEL_TO_ROT * BULLET_SPEED / 20)
        // const a2 = new Asteroid(this.pos, 2 * this.size / 3, this.vel.add(dir2.scale(BULLET_SPEED / 5)), this.angleSpeed - VEL_TO_ROT * BULLET_SPEED / 20)
        // asteroids.push(a1)
        // asteroids.push(a2)
        const pool = particles.filter(p => p.lifetime <= 0);
        for (let i = 0; i < Math.min(pool.length, this.size); i++) {
            pool[i].lifetime = 100;
            pool[i].pos = this.pos.copy();
            pool[i].vel = Vector.fromAngle(direction + Math.random() * 0.8 - 0.4).scale(-Math.random() * 3 + 1).add(this.vel);
            pool[i].color = "255, 255, 255";
        }
        this.destroy();
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
        ctx.fillStyle = "white";
        ctx.font = "10px serif"
            this.points.forEach((p,i) => ctx.fillText(i, p.x, p.y));
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