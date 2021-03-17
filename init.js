"use strict";
const canvas = document.querySelector("#Canvas");
const ctx = canvas.getContext("2d", { alpha: false });
let width, height, lesser, bigger;
let pause = false;
const EDGE_BOUNCINESS = 0.7;
const ASTEROID_MAX_HEIGHT = 18;
const ASTEROID_RIGIDITY = 0.95;

updateSize();

const player = new Player(new Ship(new Vector(width / 2, height / 2)));
const asteroids = [];
for (let i = 0; i < 50; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const speed = 0.9
    asteroids.push(
        new Asteroid(
            new Vector(x, y), // pos
            8 + Math.random() * 30, // size
            new Vector(Math.random() * speed * 2 - speed, Math.random() * speed * 2 - speed), // vel
            Math.random() * 0.04 - 0.02
        )
    );
}

frame();
