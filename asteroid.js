class Asteroid {
    constructor (pos, size = 10, vel = new Vector(), angleSpeed = 0) {
        this.pos = pos;
        this.angle = 0;
        this.angleSpeed = angleSpeed;
        this.size = size;
        this.vel = vel;
        this.points = [new Vector(20, 20), new Vector(-20, 20), new Vector(-20, -20), new Vector(20, -20)];
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