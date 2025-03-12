let canvas;
let world;
let keyboard = new Keyboard();
let gameIntervals = [];
let audioManager = AudioManager.getInstance();

function init() {
    canvas = document.getElementById('canvas');
    startNewGame();
}

function startNewGame() {
    initLevel();
    world = new World(canvas, keyboard);
    audioManager.playSound('audio/music.mp3', true, 0.3);
    setupEventListeners();
}

const keyMap = {
    32: 'SPACE',
    37: 'LEFT',
    38: 'UP',
    39: 'RIGHT',
    40: 'DOWN',
    68: 'THROW'
};

function playPopSound() {
    audioManager.playSound('audio/pop.mp3');
}

function handleKeyEvent(e, state) {
    if (keyMap[e.keyCode] !== undefined) {
        keyboard[keyMap[e.keyCode]] = state;
    }
}

function restartGame() {
    clearAllGameIntervals();
    playPopSound();
    cleanupGameWorld();
    hideGameMenus();
    audioManager.stopSound('audio/music.mp3');
    audioManager.stopSound('audio/win.ogg');
    audioManager.stopSound('audio/kikiriki.mp3');
    startNewGame();
}

function cleanupGameWorld() {
    if (world) {
        if (world.endboss) world.endboss.stopMotion();
        if (world.character) world.character.stopCharacter();
        world = null;
    }
    level1 = null;
}

function setGameInterval(callback, time) {
    let interval = setInterval(callback, time);
    gameIntervals.push(interval);
    return interval;
}

function clearAllGameIntervals() {
    gameIntervals.forEach(clearInterval);
    gameIntervals = [];
}

function goToMenu() {
    playPopSound();
    clearAllGameIntervals();
    audioManager.stopSound('audio/music.mp3');
    hideGameMenus();
    let startscreen = document.getElementById('startscreen');
    if (startscreen) {
        startscreen.style.display = 'block';
        startscreen.classList.remove('fade-out');
    }
    if (canvas) {
        canvas.style.display = 'none';
    }
}

function hideGameMenus() {
    let winScreen = document.getElementById('win-menu');
    if (winScreen) {
        winScreen.style.opacity = '0';
        setTimeout(() => winScreen.remove(), 500);
    }
    let loseScreen = document.getElementById('lose-menu');
    if (loseScreen) {
        loseScreen.style.display = 'none';
    }
}

function setupEventListeners() {
    window.addEventListener("keydown", (e) => handleKeyEvent(e, true));
    window.addEventListener("keyup", (e) => handleKeyEvent(e, false));
}