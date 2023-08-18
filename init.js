"use strict";
const canvas = document.querySelector("#Canvas");
const ctx = canvas.getContext("2d", { alpha: false });
let width, height, lesser, bigger;
let tutorial = false;
let pause = false;
let gameOver = false;
let debug = false;
let debugCollisions = false;
const EDGE_BOUNCINESS = 0.7;
const ASTEROID_MAX_HEIGHT = 18;
const ASTEROID_RIGIDITY = 0.9;
const MIN_ASTEROID_SIZE = 8;
const MAX_ASTEROID_SIZE = 50; // minimum 20
const VEL_TO_ROT = 0.2;
let frameCount = 0;
let nextAsteroidSpawn = 0;
const MINING_DURATION = 20;
const BULLET_SPEED = 10;
const SHOOT_COOLDOWN = 5;
var lastFrameTime = 0;

updateSize();

const bullets = [];
const player = new Player(new Ship(new Vector(width / 2, 3*height / 4), 13));
const asteroids = [];
const ufos = [];
const particles = [];
for (let i = 0; i < 1000; i++) {
    particles.push(new Particle());
}

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
            new Vector(width/2, height/3),//x, y),
            50,//MIN_ASTEROID_SIZE + (Math.random() ** 3) * MAX_ASTEROID_SIZE,
            new Vector(Math.random() * vel * 2 - vel, Math.random() * vel * 2 - vel),
            Math.random() * 2 * angleSpeed - angleSpeed
        )
    );
}
const gameOverHandler = () => {
    ufos.forEach(u => u.dangerous = false)
    MenuElem.classList.remove("hidden");
    ScoreElem.textContent = player.score;
}

frame();
