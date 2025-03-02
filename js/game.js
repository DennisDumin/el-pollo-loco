let canvas;
let world;
let levelMusic = new Audio('audio/music.mp3');
levelMusic.loop = true;
levelMusic.volume = 0.3;
let keyboard = new Keyboard();
let gameIntervals = [];

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

function restartGame() {
    clearAllGameIntervals();
    if (world) {
        if (world.endboss) {
            world.endboss.stopMotion(); 
        }
        world = null;
    }
    level1 = null;
    let winScreen = document.getElementById('win-menu');
    if (winScreen) winScreen.remove();
    levelMusic.pause();
    levelMusic.currentTime = 0; 
    initLevel();
    world = new World(canvas, keyboard);
    levelMusic.play();
}

function setGameInterval(callback, time) {
    let interval = setInterval(callback, time);
    gameIntervals.push(interval);
    return interval;
}

function clearAllGameIntervals() {
    gameIntervals.forEach(clearInterval);
    gameIntervals = [];
    console.log("⏹️ Alle Spiel-Intervalle wurden gestoppt!");
}

function goToMenu() {
    console.log("📜 Zurück ins Menü...");
    clearAllGameIntervals();
    levelMusic.pause();
    levelMusic.currentTime = 0;
    let winScreen = document.getElementById('win-menu');
    if (winScreen) {
        winScreen.style.opacity = '0';
        setTimeout(() => {
            winScreen.remove(); 
        }, 500);
    }

    let startscreen = document.getElementById('startscreen');
    if (startscreen) {
        startscreen.style.display = 'block';
        startscreen.classList.remove('fade-out'); 
    }

    if (canvas) {
        canvas.style.display = 'none';
    }
}

window.addEventListener("keydown", (e) => handleKeyEvent(e, true));
window.addEventListener("keyup", (e) => handleKeyEvent(e, false));