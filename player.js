class Player {
    constructor (ship) {
        this.ship = ship;
        this.rotationSpeed = 0.1;
        this.thrust = 0.1;
    }
    update () {
        if (Input.left) {
            this.ship.direction += this.rotationSpeed;
        }
        if (Input.right) {
            this.ship.direction -= this.rotationSpeed;
        }
        if (Input.up) {
            this.ship.velocity
                .addMut(Vector.fromAngle(this.ship.direction)
                    .scale(this.thrust));
        }
        this.ship.update();
    }
    draw () {
        this.ship.draw();
    }
}