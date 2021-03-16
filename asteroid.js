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
    draw () {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(-this.angle);
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        this.points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.closePath();
        // ctx.moveTo(this.size + ASTEROID_MAX_HEIGHT / 2, 0);
        // ctx.arc(0, 0, this.size + ASTEROID_MAX_HEIGHT / 2, 0, Math.PI * 2);
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.restore();
    }
}