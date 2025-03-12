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
    showLoadingScreen();
    initLevel();
    world = new World(canvas, keyboard);
    audioManager.playSound('audio/music.mp3', true, 0.3);
    setTimeout(() => {
        console.log('🚀 Starting game...');
        hideLoadingScreen();
        setupEventListeners();
    }, 2000);
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
    if (world) {
        if (world.endboss) {
            world.endboss.stopMotion();
        }
        if (world.character) {
            world.character.stopCharacter();
        }
        world = null;
    }
    level1 = null;
    let winScreen = document.getElementById('win-menu');
    if (winScreen) winScreen.remove();
    
    // Stop all audio
    audioManager.stopSound('audio/music.mp3');
    audioManager.stopSound('audio/win.ogg');
    
    startNewGame();
}

function setGameInterval(callback, time) {
    let interval = setInterval(callback, time);
    gameIntervals.push(interval);
    return interval;
}

function clearAllGameIntervals() {
    gameIntervals.forEach(clearInterval);
    gameIntervals = [];
    console.log("⏹️ All game intervals cleared");
}

function goToMenu() {
    playPopSound();
    clearAllGameIntervals();
    audioManager.stopSound('audio/music.mp3');
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

function setupEventListeners() {
    window.addEventListener("keydown", (e) => handleKeyEvent(e, true));
    window.addEventListener("keyup", (e) => handleKeyEvent(e, false));
}

function showLoadingScreen() {
    document.getElementById('loading-screen').classList.add('show');
}

function hideLoadingScreen() {
    document.getElementById('loading-screen').classList.remove('show');
}