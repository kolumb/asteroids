class Ship {
    constructor (pos, direction = Math.PI / 2, size = 10) {
        this.pos = pos;
        this.direction = direction;
        this.velocity = new Vector();
        this.size = size;
    }
    update () {
        const probePos = this.pos.add(this.velocity);
        if (probePos.x < 0 || probePos.x > width) {
            this.velocity.x *= -EDGE_BOUNCINESS;
        }
        if (probePos.y < 0 || probePos.y > height) {
            this.velocity.y *= -EDGE_BOUNCINESS;
        }
        this.pos.addMut(this.velocity);
    }
    draw () {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(-this.direction);
        ctx.beginPath();
        ctx.moveTo( this.size    , 0            );
        ctx.lineTo(-this.size / 2, this.size / 2);
        ctx.lineTo(-this.size / 4, 0            );
        ctx.lineTo(-this.size / 2,-this.size / 2);
        ctx.closePath();
        ctx.strokeStyle = "white";
        ctx.stroke();
        if (Input.up) {
            ctx.beginPath();
            ctx.moveTo(-this.size / 4,-this.size / 4);
            ctx.lineTo(-this.size    , 0            );
            ctx.lineTo(-this.size / 4, this.size / 4);
            ctx.strokeStyle = "orange";
            ctx.stroke();
        }
        ctx.restore();
    }
}