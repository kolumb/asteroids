"use strict";
const canvas = document.querySelector("#Canvas");
const ctx = canvas.getContext("2d", { alpha: false });
let width, height, lesser, bigger;
let pause = false;
let debug = false;
let debugCollisions = false;
const EDGE_BOUNCINESS = 0.7;
const ASTEROID_MAX_HEIGHT = 18;
const ASTEROID_RIGIDITY = 0.9;
let frameCount = 0;
const MINING_DURATION = 20;

updateSize();

const player = new Player(new Ship(new Vector(width / 2, height / 2)));
const asteroids = [];
for (let i = 0; i < 50; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const vel = 1.9;
    const angleSpeed = 0.0;
    asteroids.push(
        new Asteroid(
            new Vector(x, y),
            8 + Math.random() * 30, // size
            new Vector(Math.random() * vel * 2 - vel, Math.random() * vel * 2 - vel),
            Math.random() * 2 * angleSpeed - angleSpeed
        )
    );
}

frame();
