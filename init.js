"use strict";
const canvas = document.querySelector("#Canvas");
const ctx = canvas.getContext("2d", { alpha: false });
let width, height, lesser, bigger;
let pause = false;
const EDGE_BOUNCINESS = 0.7;

updateSize();

const player = new Player(new Ship(new Vector(width / 2, height / 2)));
const asteroid = new Asteroid(new Vector(width / 3, height / 3), 10, new Vector(1, 1));

frame();
