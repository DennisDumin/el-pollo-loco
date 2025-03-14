let canvas;
let world;
let keyboard = new Keyboard();
let gameIntervals = [];
let audioManager = AudioManager.getInstance();

function init() {
    canvas = document.getElementById('canvas');
    setupCanvas();
    startNewGame();
}

function setupCanvas() {
    const parent = canvas.parentNode;
    const canvasContainer = document.createElement('div');
    canvasContainer.id = 'canvas-container';
    parent.insertBefore(canvasContainer, canvas);
    canvasContainer.appendChild(canvas);
    addMuteButton(canvasContainer);
    if (isMobileDevice()) {
        addTouchControls(canvasContainer);
    }
}

function isMobileDevice() {
    const hasTouchCapability = 'ontouchstart' in window || 
                              navigator.maxTouchPoints > 0 || 
                              navigator.msMaxTouchPoints > 0;
    const mobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return hasTouchCapability && mobileUserAgent;
}

function addMuteButton(container) {
    const muteButton = document.createElement('div');
    muteButton.id = 'mute-button';
    muteButton.innerHTML = `<img id="mute-icon" src="img/menu/volume.png" alt="Mute">`;
    muteButton.addEventListener('click', toggleGameAudio);
    container.appendChild(muteButton);
    updateMuteButtonIcon();
}

function updateMuteButtonIcon() {
    const muteIcon = document.getElementById('mute-icon');
    if (muteIcon) {
        muteIcon.src = audioManager.isMuted ? 'img/menu/volume-muted.png' : 'img/menu/volume.png';
    }
}

function toggleGameAudio() {
    audioManager.toggleMute();
    updateMuteButtonIcon();
}

function addTouchControls(container) {
    let existingControls = document.getElementById('touch-controls');
    if (existingControls) {
        existingControls.remove();
    }
    const touchControls = document.createElement('div');
    touchControls.id = 'touch-controls';
    touchControls.innerHTML = `
        <div id="mobile-controls-left">
            <button id="btn-left" class="control-btn">
                <img src="img/menu/keyboard_arrow_left.svg" alt="Left">
            </button>
            <button id="btn-right" class="control-btn">
                <img src="img/menu/keyboard_arrow_right.svg" alt="Right">
            </button>
        </div>
        <div id="mobile-controls-right">
            <button id="btn-jump" class="control-btn">
                <img src="img/menu/keyboard_arrow_top.svg" alt="Jump">
            </button>
            <button id="btn-throw" class="control-btn">
                <img src="img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png" alt="Throw">
            </button>
        </div>
    `;
    touchControls.style.display = 'none';
    container.appendChild(touchControls);
    setupTouchEvents();
}


function setupTouchEvents() {
    const btnLeft = document.getElementById('btn-left');
    btnLeft.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.LEFT = true;
    });
    btnLeft.addEventListener('touchend', () => {
        keyboard.LEFT = false;
    });

    const btnRight = document.getElementById('btn-right');
    btnRight.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.RIGHT = true;
    });
    btnRight.addEventListener('touchend', () => {
        keyboard.RIGHT = false;
    });

    const btnJump = document.getElementById('btn-jump');
    btnJump.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.UP = true;
        keyboard.SPACE = true;
    });
    btnJump.addEventListener('touchend', () => {
        keyboard.UP = false;
        keyboard.SPACE = false;
    });

    const btnThrow = document.getElementById('btn-throw');
    btnThrow.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.THROW = true;
    });
    btnThrow.addEventListener('touchend', () => {
        keyboard.THROW = false;
    });
}

function startNewGame() {
    initLevel();
    world = new World(canvas, keyboard);
    audioManager.playSound('audio/music.mp3', true, 0.3);
    setupEventListeners();
    if (isMobileDevice()) {
        const touchControls = document.getElementById('touch-controls');
        if (touchControls) {
            touchControls.style.display = 'flex';
        }
    }
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
    audioManager.stopSound('audio/pop.mp3');
    setTimeout(() => {
        audioManager.playSound('audio/pop.mp3', false, 0.3);
    }, 10);
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
    const touchControls = document.getElementById('touch-controls');
    if (touchControls) {
        touchControls.style.display = 'none';
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