let canvas;
let world;
let keyboard = new Keyboard();
let gameIntervals = [];
let audioManager = AudioManager.getInstance();
const keyMap = {
    32: 'SPACE',
    37: 'LEFT',
    38: 'UP',
    39: 'RIGHT',
    40: 'DOWN',
    68: 'THROW'
};

/**
 * Initializes the game by setting up canvas and starting a new game
 */
function init() {
    canvas = document.getElementById('canvas');
    setupCanvas();
    startNewGame();
}

/**
 * Sets up the canvas container and adds controls
 */
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

/**
 * Checks if the device is a mobile device
 * @returns {boolean} True if mobile device, false otherwise
 */
function isMobileDevice() {
    const hasTouchCapability = 'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0;
    const mobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return hasTouchCapability && mobileUserAgent;
}

/**
 * Adds a mute button to the container with correct ID structure
 * @param {HTMLElement} container - The container to add the button to
 */
function addMuteButton(container) {
    const existingButton = document.getElementById('mute-button-container');
    if (existingButton) {
        existingButton.remove();
    }
    const muteButton = document.createElement('div');
    muteButton.id = 'mute-button-container'; 
    muteButton.innerHTML = `<img id="mute-icon" src="img/menu/volume.png" alt="Mute">`;
    muteButton.addEventListener('click', toggleGameAudio);
    container.appendChild(muteButton);
    updateMuteButtonIcon();
    muteButton.style.display = 'none';
}

/**
 * Updates the mute button icon based on the audio state
 */
function updateMuteButtonIcon() {
    const muteIcon = document.getElementById('mute-icon');
    if (muteIcon) {
        muteIcon.src = audioManager.isMuted ? 'img/menu/volume-muted.png' : 'img/menu/volume.png';
    }
}

/**
 * Toggles the game audio on/off
 */
function toggleGameAudio() {
    audioManager.toggleMute();
    updateMuteButtonIcon();
}

/**
 * Adds touch controls to the container
 * @param {HTMLElement} container - The container to add the controls to
 */
function addTouchControls(container) {
    removeExistingTouchControls();
    const touchControls = createTouchControlsElement();
    touchControls.innerHTML = createTouchControlsHTML();
    touchControls.style.display = 'none';
    container.appendChild(touchControls);
    setupTouchEvents();
}

/**
 * Removes existing touch controls if they exist
 */
function removeExistingTouchControls() {
    let existingControls = document.getElementById('touch-controls');
    if (existingControls) {
        existingControls.remove();
    }
}

/**
 * Creates the touch controls container element
 * @returns {HTMLElement} The touch controls element
 */
function createTouchControlsElement() {
    const touchControls = document.createElement('div');
    touchControls.id = 'touch-controls';
    return touchControls;
}

/**
 * Creates the HTML content for touch controls
 * @returns {string} HTML string for touch controls
 */
function createTouchControlsHTML() {
    return `
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
}

/**
 * Sets up touch event listeners for mobile controls
 */
function setupTouchEvents() {
    setupLeftButtonEvents();
    setupRightButtonEvents();
    setupJumpButtonEvents();
    setupThrowButtonEvents();
}

/**
 * Sets up event listeners for the left button
 */
function setupLeftButtonEvents() {
    const btnLeft = document.getElementById('btn-left');
    btnLeft.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.LEFT = true;
    });
    btnLeft.addEventListener('touchend', () => {
        keyboard.LEFT = false;
    });
}

/**
 * Sets up event listeners for the right button
 */
function setupRightButtonEvents() {
    const btnRight = document.getElementById('btn-right');
    btnRight.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.RIGHT = true;
    });
    btnRight.addEventListener('touchend', () => {
        keyboard.RIGHT = false;
    });
}

/**
 * Sets up event listeners for the jump button
 */
function setupJumpButtonEvents() {
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
}

/**
 * Sets up event listeners for the throw button
 */
function setupThrowButtonEvents() {
    const btnThrow = document.getElementById('btn-throw');
    btnThrow.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.THROW = true;
    });
    btnThrow.addEventListener('touchend', () => {
        keyboard.THROW = false;
    });
}

/**
 * Shows the mute button
 */
function showMuteButton() {
    const muteButton = document.getElementById('mute-button-container');
    if (muteButton) {
        muteButton.style.display = 'block';
    }
}

/**
 * Hides the mute button
 */
function hideMuteButton() {
    const muteButton = document.getElementById('mute-button-container');
    if (muteButton) {
        muteButton.style.display = 'none';
    }
}

/**
 * Returns to the main menu
 */
function goToMenu() {
    playPopSound();
    clearAllGameIntervals();
    audioManager.stopSound('audio/music.mp3');
    hideGameMenus();
    hideTouchControls();
    hideMuteButton();
    showStartScreen();
}

/**
 * Starts a new game
 */
function startNewGame() {
    initLevel();
    world = new World(canvas, keyboard);
    audioManager.playSound('audio/music.mp3', true, 0.3);
    setupEventListeners();
    showTouchControlsIfMobile();
    showMuteButton();  // Show the mute button when starting a new game
}

/**
 * Shows touch controls if on a mobile device
 */
function showTouchControlsIfMobile() {
    if (isMobileDevice()) {
        const touchControls = document.getElementById('touch-controls');
        if (touchControls) {
            touchControls.style.display = 'flex';
        }
    }
}

/**
 * Plays a pop sound effect
 */
function playPopSound() {
    audioManager.stopSound('audio/pop.mp3');
    setTimeout(() => {
        audioManager.playSound('audio/pop.mp3', false, 0.3);
    }, 10);
}

/**
 * Handles keyboard events
 * @param {Event} e - The keyboard event
 * @param {boolean} state - The state to set the key to
 */
function handleKeyEvent(e, state) {
    if (keyMap[e.keyCode] !== undefined) {
        keyboard[keyMap[e.keyCode]] = state;
    }
}

/**
 * Restarts the game
 */
function restartGame() {
    clearAllGameIntervals();
    playPopSound();
    cleanupGameWorld();
    hideGameMenus();
    stopAllGameSounds();
    startNewGame();
}

/**
 * Stops all game sounds
 */
function stopAllGameSounds() {
    audioManager.stopSound('audio/music.mp3');
    audioManager.stopSound('audio/win.ogg');
    audioManager.stopSound('audio/kikiriki.mp3');
}

/**
 * Cleans up the game world
 */
function cleanupGameWorld() {
    if (world) {
        if (world.endboss) world.endboss.stopMotion();
        if (world.character) world.character.stopCharacter();
        world = null;
    }
    level1 = null;
}

/**
 * Sets a game interval and adds it to the interval list
 * @param {Function} callback - The callback function
 * @param {number} time - The interval time
 * @returns {number} The interval ID
 */
function setGameInterval(callback, time) {
    let interval = setInterval(callback, time);
    gameIntervals.push(interval);
    return interval;
}

/**
 * Clears all game intervals
 */
function clearAllGameIntervals() {
    gameIntervals.forEach(clearInterval);
    gameIntervals = [];
}

/**
 * Hides the touch controls
 */
function hideTouchControls() {
    const touchControls = document.getElementById('touch-controls');
    if (touchControls) {
        touchControls.style.display = 'none';
    }
}

/**
 * Shows the start screen
 */
function showStartScreen() {
    let startscreen = document.getElementById('startscreen');
    if (startscreen) {
        startscreen.style.display = 'block';
        startscreen.classList.remove('fade-out');
    }
    if (canvas) {
        canvas.style.display = 'none';
    }
}

/**
 * Hides game menus
 */
function hideGameMenus() {
    hideWinScreen();
    hideLoseScreen();
}

/**
 * Hides the win screen with animation
 */
function hideWinScreen() {
    let winScreen = document.getElementById('win-menu');
    if (winScreen) {
        winScreen.style.opacity = '0';
        setTimeout(() => winScreen.remove(), 500);
    }
}

/**
 * Hides the lose screen
 */
function hideLoseScreen() {
    let loseScreen = document.getElementById('lose-menu');
    if (loseScreen) {
        loseScreen.style.display = 'none';
    }
}

/**
 * Sets up event listeners for keyboard controls
 */
function setupEventListeners() {
    window.addEventListener("keydown", (e) => handleKeyEvent(e, true));
    window.addEventListener("keyup", (e) => handleKeyEvent(e, false));
}