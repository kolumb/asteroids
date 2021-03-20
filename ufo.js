class UFO {
    constructor (pos, size = 20) {
        this.pos = pos;
        this.size = size;
        this.speed = 1.8;
        this.targetRadius = lesser / 3;
        this.target = this.getTarget(player.ship.pos.add(this.pos).scale(0.5), 100);
        this.nearRadius = lesser / 4;
        this.nearTarget = this.getTarget(this.target, this.nearRadius);
        this.health = 3;
        this.dangerous = false;
    }
    getTarget (target, radius) {
        return target.add(Vector.fromAngle(Math.random() * Math.PI * 2).scale(Math.random() * radius));
    }
    update (dt) {
        const chance = Math.random()
        if (chance < 0.05 * dt) {
            if (chance < 0.01 * dt) {
                this.target = this.getTarget(player.ship.pos, this.targetRadius);
            }
            this.nearTarget = this.getTarget(this.target, this.nearRadius);
        }
        const vel = this.nearTarget.sub(this.pos);
        this.pos.addMut(vel.clamp(this.speed).scale(dt));
    }
    destroy () {
        ufos.splice(ufos.indexOf(this), 1);
    }
    draw () {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.beginPath();
        ctx.moveTo(-this.size, 0);
        ctx.arcTo(0, -this.size, this.size, 0, this.size * 1.4);
        ctx.lineTo(this.size, 0);
        ctx.arcTo(0, this.size, -this.size, 0, this.size * 1.4);
        ctx.closePath();
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0,-3*this.size/8,8,-9*Math.PI/5,-6*Math.PI/5,true);
        ctx.fillStyle = this.dangerous ? "#e4a" : "white";
        ctx.fill();
        ctx.restore();
        if (debug) {
            ctx.strokeStyle = "#333";
            ctx.beginPath();
            ctx.arc(this.target.x, this.target.y, this.nearRadius, 0, Math.PI * 2);
            ctx.moveTo(this.pos.x, this.pos.y);
            ctx.lineTo(this.nearTarget.x, this.nearTarget.y);
            ctx.lineTo(this.target.x, this.target.y);
            ctx.stroke();
            ctx.fillStyle = "yellow"
            ctx.fillRect(this.target.x, this.target.y, 4, 4);
            ctx.fillStyle = "red"
            ctx.fillRect(this.nearTarget.x, this.nearTarget.y, 4, 4);
        }
    }
}