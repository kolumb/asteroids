class Bullet {
    constructor (pos, direction) {
        this.pos = pos;
        this.vel = Vector.fromAngle(direction).scale(BULLET_SPEED);
        this.direction = direction;
        this.length = 10;
    }
    update(dt) {
        this.pos.addMut(this.vel.scale(dt));
        if (this.pos.x < -this.length
        ||  this.pos.y < -this.length
        ||  this.pos.x > width + this.length
        ||  this.pos.y > height + this.length) {
            this.destroy();
        };
    }
    draw() {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(-this.direction);
        ctx.fillStyle = "yellow";
        ctx.fillRect(-this.length, -1, this.length * 2, 2);
        ctx.restore();
    }
    destroy() {
        bullets.splice(bullets.indexOf(this), 1);
    }
}