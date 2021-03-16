class Asteroid {
    constructor (pos, size = 10, vel = new Vector(), angleSpeed = 0) {
        this.pos = pos;
        this.angle = 0;
        this.angleSpeed = angleSpeed;
        this.size = size;
        this.vel = vel;
        this.points = [];
        const numberOfPoints = size * 0.75;
        const radiusCore = 1;
        const radiusNoise = 18 / size;
        let lastAngle = 0;
        for (let i = 0; i < numberOfPoints; i++) {
            const angleStep = (Math.random() * 1.6 + 0.2) * (Math.PI * 2 - lastAngle) / (numberOfPoints - i);
            const angle = clamp(lastAngle + angleStep, Math.PI * 2);
            lastAngle = angle;
            const radius = size * radiusCore + Math.random() * size * radiusNoise;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            this.points.push(new Vector(x, y));
        }
    }
    update () {
        this.pos.addMut(this.vel);
    }
    draw () {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(-this.direction);
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        this.points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.restore();
    }
}