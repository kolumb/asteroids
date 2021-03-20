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
        this.ship.update(dt);
    }
    draw () {
        if(!this.ship.abducted) this.ship.draw();
    }
}