"use strict";
function randomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
}

function clamp(n, limit) {
    let lim = Math.abs(limit);
    if (n < 0) {
        if (Math.abs(n) > lim) {
            return -lim;
        }
    } else {
        if (Math.abs(n) > lim) {
            return lim;
        }
    }
    return n;
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}
