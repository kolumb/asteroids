class Particle {
    constructor (pos = new Vector(), vel = new Vector()) {
        this.pos = pos;
        this.vel = vel;
        this.size = Math.random() * 2 + 2
        this.lifetime = 0;
    }
    update () {
        if (this.lifetime > 0) {
            this.lifetime--;
            this.pos.addMut(this.vel);
        }
    }
    draw () {
        if (this.lifetime > 0) {
            ctx.fillStyle = `rgba(255,255,255,${this.lifetime / 100}`;
            ctx.fillRect(this.pos.x, this.pos.y, this.size, this.size);
        }
    }
}