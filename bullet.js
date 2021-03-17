class Bullet {
    constructor (pos, speed, direction) {
        this.pos = pos;
        this.vel = Vector.fromAngle(direction).scale(speed);
        this.direction = direction;
        this.length = 10;
    }
    update() {
        this.pos.addMut(this.vel);
        if (this.pos.x < -100 || this.pos.y < -100 || this.pos.x > width + 100 || this.pos.y > height + 100) {
            this.destroy();
        };
    }
    draw() {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(-this.direction);
        ctx.fillStyle = "yellow";
        ctx.fillRect(-this.length, -2, this.length * 2, 4);
        ctx.restore();
    }
    destroy() {
        bullets.splice(bullets.indexOf(this), 1);
    }
}