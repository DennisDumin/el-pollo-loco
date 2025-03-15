/**
 * Plays a pop sound effect
 */
function playPopSound() {
    audioManager.playSound('audio/pop.mp3');
}

/**
 * Starts the game with fade animation
 */
function startGame() {
    playPopSound();
    audioManager.playSound('audio/music.mp3', true, 0.3);
    fadeOutStartScreen();
    showMuteButton();
}

/**
 * Fades out the start screen and initializes the game
 */
function fadeOutStartScreen() {
    let startscreen = document.getElementById('startscreen');
    let canvas = document.getElementById('canvas');
    startscreen.classList.add('fade-out');
    setTimeout(() => {
        startscreen.style.display = 'none';
        showCanvas(canvas);
        init();
    }, 500);
}

/**
 * Shows the canvas with fade-in effect
 * @param {HTMLElement} canvas - The canvas element
 */
function showCanvas(canvas) {
    canvas.style.display = 'block';
    canvas.classList.add('fade-in');
}

/**
 * Opens the imprint modal
 */
function openImprint() {
    playPopSound();
    document.getElementById('imprintModal').style.display = 'flex';
}

/**
 * Closes the imprint modal
 */
function closeImprint() {
    playPopSound();
    document.getElementById('imprintModal').style.display = 'none';
}

/**
 * Opens the controls modal
 */
function openControls() {
    playPopSound();
    document.getElementById('controlsModal').style.display = 'flex';
}

/**
 * Closes the controls modal
 */
function closeControls() {
    playPopSound();
    document.getElementById('controlsModal').style.display = 'none';
}

/**
 * Handles clicks outside modals to close them
 * @param {Event} event - The click event
 */
function handleModalOutsideClick(event) {
    closeModalIfClickedOutside(event, 'imprintModal');
    closeModalIfClickedOutside(event, 'controlsModal');
}

/**
 * Closes the specified modal if clicked outside
 * @param {Event} event - The click event
 * @param {string} modalId - The ID of the modal to check
 */
function closeModalIfClickedOutside(event, modalId) {
    let modal = document.getElementById(modalId);
    if (event.target === modal) {
        modal.style.display = "none";
        playPopSound();
    }
}

window.onclick = handleModalOutsideClick;