function startGame() {
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
    document.getElementById('imprintModal').style.display = 'flex';
}

function closeImprint() {
    document.getElementById('imprintModal').style.display = 'none';
}

function openControls() {
    document.getElementById('controlsModal').style.display = 'flex';
}

function closeControls() {
    document.getElementById('controlsModal').style.display = 'none';
}

window.onclick = function (event) {
    let imprintModal = document.getElementById('imprintModal');
    let controlsModal = document.getElementById('controlsModal');
    if (event.target === imprintModal) {
        imprintModal.style.display = "none";
    }
    if (event.target === controlsModal) {
        controlsModal.style.display = "none";
    }
};