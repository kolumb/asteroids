class Particle {
    constructor (pos = new Vector(), vel = new Vector()) {
        this.pos = pos;
        this.vel = vel;
        this.size = Math.random() * 2 + 2;
        this.color = "255, 255, 255";
        this.lifetime = 0;
    }
    update (dt) {
        if (this.lifetime > 0) {
            this.lifetime -= dt;
            this.pos.addMut(this.vel.scale(dt));
        }
    }
    draw () {
        if (this.lifetime > 0) {
            ctx.fillStyle = `rgba(${this.color},${this.lifetime / 100}`;
            ctx.fillRect(this.pos.x, this.pos.y, this.size, this.size);
        }
    }
}