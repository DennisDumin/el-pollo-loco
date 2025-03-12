function playPopSound() {
    audioManager.playSound('audio/pop.mp3');
}

function startGame() {
    playPopSound();
    audioManager.playSound('audio/music.mp3', true, 0.3);
    let startscreen = document.getElementById('startscreen');
    let canvas = document.getElementById('canvas');
    startscreen.classList.add('fade-out');
    setTimeout(() => {
        startscreen.style.display = 'none';
        canvas.style.display = 'block';
        canvas.classList.add('fade-in');
        init();
    }, 500);
}

function openImprint() {
    playPopSound();
    document.getElementById('imprintModal').style.display = 'flex';
}

function closeImprint() {
    playPopSound();
    document.getElementById('imprintModal').style.display = 'none';
}

function openControls() {
    playPopSound();
    document.getElementById('controlsModal').style.display = 'flex';
}

function closeControls() {
    playPopSound();
    document.getElementById('controlsModal').style.display = 'none';
}

window.onclick = function (event) {
    let imprintModal = document.getElementById('imprintModal');
    let controlsModal = document.getElementById('controlsModal');
    if (event.target === imprintModal) {
        imprintModal.style.display = "none";
        playPopSound();
    }
    if (event.target === controlsModal) {
        controlsModal.style.display = "none";
        playPopSound();
    }
};