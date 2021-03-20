class UFO {
    constructor (pos, size = 20) {
        this.pos = pos;
        this.size = size;
        this.speed = 2;
        this.target = player.ship.pos;
        this.health = 3;
    }
    update (dt) {
        if (Math.random() < 0.05 * dt) {
            this.target = player.ship.pos.add(Vector.fromAngle(Math.random() * Math.PI * 2).scale(Math.random() * 300));
        }
        const vel = this.target.sub(this.pos);
        this.pos.addMut(vel.clamp(this.speed).scale(dt));
    }
    destroy () {
        ufos.splice(ufos.indexOf(this), 1);
    }
    draw () {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.beginPath();
        ctx.arc(0,-3*this.size/8,8,-9*Math.PI/5,-6*Math.PI/5,true);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-this.size, 0);
        ctx.arcTo(0, -this.size, this.size, 0, this.size * 1.4);
        ctx.lineTo(this.size, 0);
        ctx.arcTo(0, this.size, -this.size, 0, this.size * 1.4);
        ctx.closePath();
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.restore();
    }
}