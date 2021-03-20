class Player {
    constructor (ship) {
        this.ship = ship;
        this.score = 0;
    }
    update (dt) {
        if (gameOver) {
            this.ship.turnLeft(dt * 3);
            Input.up = false;
        } else {
            if (Input.left) {
                this.ship.turnLeft(dt);
            }
            if (Input.right) {
                this.ship.turnRight(dt);
            }
            if (Input.up) {
                this.ship.thrust(dt);
            }
        }
        if (this.ship.abductedBy) {
            this.ship.size = Math.max(this.ship.size - 0.01, 6);
            this.ship.pos.addMut(this.ship.abductedBy.pos.add(new Vector(0, this.ship.size * 2)).sub(this.ship.pos).clamp(this.ship.abductedBy.speed * 0.95));
        }
        this.ship.update(dt);
    }
    draw () {
        this.ship.draw();
    }
}