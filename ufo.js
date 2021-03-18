class UFO {
    constructor (pos, size = 10) {
        this.pos = pos;
        this.size = size;
    }
    update () {
        
    }
    draw () {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.beginPath();
        ctx.arc(0,-3*this.size/4,8,-9*Math.PI/5,-6*Math.PI/5,true);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-this.size * 2, 0);
        ctx.arcTo(0, -this.size * 2, this.size * 2, 0, this.size * 2.8);
        ctx.lineTo(this.size * 2, 0);
        ctx.arcTo(0, this.size * 2, -this.size * 2, 0, this.size * 2.8);
        ctx.closePath();
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.restore();
    }
}