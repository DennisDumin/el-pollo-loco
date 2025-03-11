let canvas;
let world;
let levelMusic = new Audio('audio/music.mp3');
popSound = new Audio('audio/pop.mp3');
levelMusic.loop = true;
levelMusic.volume = 0.3;
let keyboard = new Keyboard();
let gameIntervals = [];

function init() {
    canvas = document.getElementById('canvas');
    startNewGame();
}

function startNewGame() {
    showLoadingScreen();
    initLevel();
    world = new World(canvas, keyboard);
    levelMusic.play(); 
    setTimeout(() => {
        console.log('🚀 Starting game...');
        hideLoadingScreen();
        setupEventListeners();
        initializeGameSounds(); 
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
    popSound.currentTime = 0;
    popSound.play();
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
        world = null;
    }
    level1 = null;
    let winScreen = document.getElementById('win-menu');
    if (winScreen) winScreen.remove();
    levelMusic.pause();
    levelMusic.currentTime = 0;
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

function initializeGameSounds() {
    console.log('🎵 Initializing game sounds...');

    let sounds = [
        world?.character?.walkSound,
        world?.character?.jumpSound,
        world?.character?.hurtSound,
        world?.character?.snoreSound,
        world?.character?.throwSound,
        world?.endboss?.alarmSound,
        world?.endboss?.deathSound,
        world?.endboss?.hurtSound,
        world?.collectSound,
        world?.winSound,
        ...(world?.level?.bottles?.map(bottle => bottle.collectSound) || []),
        ...(world?.level?.coins?.map(coin => coin.collectSound) || []),
        ...(world?.level?.enemies?.map(enemy => enemy.chickenDeath) || []),
        ...(world?.level?.enemies?.map(enemy => enemy.breakSound) || [])
    ].flat().filter(Boolean);
    sounds.forEach(sound => playAndPause(sound));
    console.log('✅ All game sounds initialized');
}

function playAndPause(sound) {
    if (!sound) return;
    let loaded = false;
    sound.load();
    let playPromise = sound.play();
    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                console.log(`✅ Sound loaded: ${sound.src}`);
                loaded = true;
                if (loaded) {
                    sound.pause(); 
                    sound.currentTime = 0;
                }
            })
            .catch((error) => {
                console.warn(`⚠️ Sound preloading failed for ${sound.src}:`, error);
            });
    }
}
