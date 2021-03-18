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
const MAX_ASTEROID_SIZE = 50; // minimum 20
const VEL_TO_ROT = 0.2;
let frameCount = 0;
const MINING_DURATION = 20;
const BULLET_SPEED = 10;

updateSize();

const bullets = [];
const player = new Player(new Ship(new Vector(width / 2, height / 2)));
const asteroids = [];
function spawnAsteroid() {
    if (Math.random() < 0.5) {
        var x = Math.random() * width;
        var y = Math.random() < 0.5 ? -100 : height + 100;
    } else {
        var x = Math.random() < 0.5 ? -100 : width + 100;
        var y = Math.random() * height;
    }
    const vel = 0.9;
    const angleSpeed = 0.0;
    asteroids.push(
        new Asteroid(
            new Vector(x, y),
            8 + (Math.random() ** 3) * MAX_ASTEROID_SIZE,
            new Vector(Math.random() * vel * 2 - vel, Math.random() * vel * 2 - vel),
            Math.random() * 2 * angleSpeed - angleSpeed
        )
    );
}
function asteroidSpawner() {
    if (asteroids.length < MAX_ASTEROID_SIZE) spawnAsteroid();
    setTimeout(asteroidSpawner, asteroids.length * 100);
}
asteroidSpawner();

frame();
