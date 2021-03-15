"use strict";
const canvas = document.querySelector("#Canvas");
const ctx = canvas.getContext("2d", { alpha: false });
let width, height, lesser, bigger;
let pause = false;

updateSize();

const player = new Player(new Ship(new Vector(width / 2, height / 2)));

frame();
