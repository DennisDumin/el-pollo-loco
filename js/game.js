let canvas;
let world;
let levelMusic = new Audio('audio/music.mp3');
levelMusic.loop = true;
levelMusic.volume = 0.3;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById('canvas');
    initLevel();
    world = new World(canvas, keyboard);
}

const keyMap = {
    32: 'SPACE',
    37: 'LEFT',
    38: 'UP',
    39: 'RIGHT',
    40: 'DOWN',
    68: 'THROW'
};

function handleKeyEvent(e, state) {
    if (keyMap[e.keyCode] !== undefined) {
        keyboard[keyMap[e.keyCode]] = state;
    }
}

window.addEventListener("keydown", (e) => handleKeyEvent(e, true));
window.addEventListener("keyup", (e) => handleKeyEvent(e, false));
