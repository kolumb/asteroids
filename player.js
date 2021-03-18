class Player {
    constructor (ship) {
        this.ship = ship;
        this.rotationSpeed = 0.1;
        this.thrust = 0.1;
    }
    update () {
        if (gameOver) {
            this.ship.direction += this.rotationSpeed * 2;
            Input.up = false;
        } else {
            if (Input.left) {
                this.ship.direction += this.rotationSpeed;
            }
            if (Input.right) {
                this.ship.direction -= this.rotationSpeed;
            }
            if (Input.up) {
                this.ship.vel
                    .addMut(Vector.fromAngle(this.ship.direction)
                        .scale(this.thrust));
            }
        }
        this.ship.update();
    }
    draw () {
        this.ship.draw();
    }
}