class Ship {
    constructor (pos, direction = 0, size = 10) {
        this.pos = pos;
        this.direction = direction;
        this.velocity = new Vector();
        this.size = size;
    }
    update () {
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
        ctx.strokeStyle = "white";
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
}