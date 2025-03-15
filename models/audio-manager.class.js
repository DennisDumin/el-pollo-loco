class AudioManager {
    static instance;
    audioElements = {};
    pendingPlayPromises = {};
    isMuted = false;
    activeSounds = new Set();

    /**
     * Gets the singleton instance of AudioManager
     * @returns {AudioManager} The audio manager instance
     */
    static getInstance() {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
            AudioManager.instance.initMuteState();
        }
        return AudioManager.instance;
    }

    /**
     * Initializes the mute state from localStorage
     */
    initMuteState() {
        const savedMuteState = localStorage.getItem('isMuted');
        if (savedMuteState !== null) {
            this.isMuted = savedMuteState === 'true';
            this.applyMuteStateWithDelay();
        }
    }

    /**
     * Applies the mute state with a slight delay to ensure UI is ready
     */
    applyMuteStateWithDelay() {
        setTimeout(() => {
            this.updateMuteUI();
            this.applyMuteToAllAudio();
        }, 100);
    }

    /**
     * Applies mute state to all audio elements
     */
    applyMuteToAllAudio() {
        Object.values(this.audioElements).forEach(audio => {
            audio.muted = this.isMuted;
        });
    }

    /**
     * Toggles the mute state
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('isMuted', this.isMuted);
        this.updateMuteUI();
        this.applyMuteToAllAudio();
    }

    /**
     * Updates the mute UI
     */
    updateMuteUI() {
        updateMuteButtonIcon();
    }

    /**
     * Stops all active sounds
     */
    stopAllSounds() {
        Object.keys(this.audioElements).forEach(src => {
            this.stopSound(src);
        });
        this.activeSounds.clear();
    }

    /**
     * Gets an audio element for the specified source
     * @param {string} src - The audio source path
     * @param {number} volume - The volume level (0-1)
     * @returns {HTMLAudioElement} The audio element
     */
    getAudio(src, volume = 0.3) {
        if (this.audioElements[src]) {
            return this.prepareExistingAudio(src, volume);
        }
        return this.createNewAudio(src, volume);
    }

    /**
     * Prepares an existing audio element for playback
     * @param {string} src - The audio source path
     * @param {number} volume - The volume level (0-1)
     * @returns {HTMLAudioElement} The prepared audio element
     */
    prepareExistingAudio(src, volume) {
        const audio = this.audioElements[src];
        audio.volume = volume;
        audio.muted = this.isMuted;
        return audio;
    }

    /**
     * Creates a new audio element
     * @param {string} src - The audio source path
     * @param {number} volume - The volume level (0-1)
     * @returns {HTMLAudioElement} The new audio element
     */
    createNewAudio(src, volume) {
        try {
            const audio = new Audio(src);
            this.configureAudio(audio, src, volume);
            return audio;
        } catch (error) {
            console.error(`Failed to create audio for ${src}:`, error);
            return document.createElement('audio');
        }
    }

    /**
     * Configures an audio element with appropriate settings
     * @param {HTMLAudioElement} audio - The audio element to configure
     * @param {string} src - The audio source path
     * @param {number} volume - The volume level (0-1)
     */
    configureAudio(audio, src, volume) {
        audio.volume = volume;
        audio.muted = this.isMuted;
        audio.preload = 'auto';
        this.setupAudioEventListeners(audio, src);
        this.audioElements[src] = audio;
    }

    /**
     * Sets up event listeners for an audio element
     * @param {HTMLAudioElement} audio - The audio element
     * @param {string} src - The audio source path
     */
    setupAudioEventListeners(audio, src) {
        audio.addEventListener('ended', () => {
            this.activeSounds.delete(src);
        });

        audio.addEventListener('error', (e) => {
            console.error(`Error loading audio source: ${src}`, e);
            this.activeSounds.delete(src);
        });
    }

    /**
     * Stops a sound
     * @param {string} src - The audio source path
     * @returns {Promise} A promise that resolves when the sound is stopped
     */
    async stopSound(src) {
        if (!this.audioElements[src]) return;
        const audio = this.audioElements[src];

        try {
            await this.waitForPendingPromise(src);
            this.resetAudio(audio, src);
        } catch (error) {
        }
    }

    /**
     * Waits for any pending play promise
     * @param {string} src - The audio source path
     */
    async waitForPendingPromise(src) {
        if (this.pendingPlayPromises[src]) {
            await this.pendingPlayPromises[src];
        }
    }

    /**
     * Resets an audio element
     * @param {HTMLAudioElement} audio - The audio element
     * @param {string} src - The audio source path
     */
    resetAudio(audio, src) {
        audio.pause();
        audio.currentTime = 0;
        this.activeSounds.delete(src);
    }

    /**
     * Plays a sound
     * @param {string} src - The audio source path
     * @param {boolean} loop - Whether to loop the sound
     * @param {number} volume - The volume level (0-1)
     * @returns {Promise} A promise that resolves when playback starts
     */
    playSound(src, loop = false, volume = 0.3) {
        if (this.isMuted) {
            return Promise.resolve();
        }

        const audio = this.getAudio(src, volume);
        audio.loop = loop;
        this.activeSounds.add(src);

        this.resetIfPlaying(audio);
        return this.executeSafePlay(audio, src);
    }

    /**
     * Resets the audio if it's currently playing
     * @param {HTMLAudioElement} audio - The audio element
     */
    resetIfPlaying(audio) {
        if (!audio.paused && !audio.ended) {
            audio.pause();
            audio.currentTime = 0;
        }
    }

    /**
     * Executes a safe play operation
     * @param {HTMLAudioElement} audio - The audio element
     * @param {string} src - The audio source path
     * @returns {Promise} A promise that resolves when playback starts
     */
    executeSafePlay(audio, src) {
        try {
            audio.pause();
            return this.playWithDelay(audio, src);
        } catch (error) {
            console.error(`Error playing audio ${src}:`, error);
            this.activeSounds.delete(src);
            return Promise.resolve();
        }
    }

    /**
     * Plays audio with a slight delay to prevent browser issues
     * @param {HTMLAudioElement} audio - The audio element
     * @param {string} src - The audio source path
     * @returns {Promise} A promise that resolves when playback starts
     */
    playWithDelay(audio, src) {
        return new Promise(resolve => {
            setTimeout(() => {
                if (this.isMuted) {
                    this.activeSounds.delete(src);
                    resolve();
                    return;
                }

                this.handlePlayPromise(audio.play(), src).then(resolve);
            }, 10);
        });
    }

    /**
     * Handles the promise returned by audio.play()
     * @param {Promise} playPromise - The play promise
     * @param {string} src - The audio source path
     * @returns {Promise} A promise that resolves when playback starts
     */
    handlePlayPromise(playPromise, src) {
        if (playPromise === undefined) {
            return Promise.resolve();
        }

        this.pendingPlayPromises[src] = playPromise;

        return playPromise
            .then(() => {
                delete this.pendingPlayPromises[src];
                return Promise.resolve();
            })
            .catch(this.handlePlayError(src));
    }

    /**
     * Creates an error handler for play promises
     * @param {string} src - The audio source path
     * @returns {function} Error handler function
     */
    handlePlayError(src) {
        return error => {
            delete this.pendingPlayPromises[src];
            this.activeSounds.delete(src);

            if (error.name !== 'AbortError') {
                console.warn(`Audio play failed for ${src}:`, error);
            }

            return Promise.resolve();
        };
    }

    /**
     * Clears all audio resources
     */
    clearAll() {
        Object.values(this.audioElements).forEach(audio => {
            audio.pause();
            audio.src = '';
        });

        this.audioElements = {};
        this.pendingPlayPromises = {};
        this.activeSounds.clear();
    }

    /**
     * Checks if sound is muted
     * @returns {boolean} True if muted, false otherwise
     */
    isSoundMuted() {
        return this.isMuted;
    }

    /**
     * Monitors an external audio element to apply mute settings
     * @param {HTMLAudioElement} audio - The audio element to monitor
     * @returns {HTMLAudioElement} The monitored audio element
     */
    monitorExternalSound(audio) {
        audio.muted = this.isMuted;
        return audio;
    }

    /**
     * Plays a sound that can overlap with other instances
     * @param {string} src - The audio source path
     * @param {number} volume - The volume level (0-1)
     * @returns {Promise} A promise that resolves when playback starts
     */
    playOverlappingSound(src, volume = 0.3) {
        const audio = new Audio(src);
        audio.volume = volume;
        audio.muted = this.isMuted;
        return audio.play();
    }

    /**
     * Checks if a sound is currently playing
     * @param {string} sound - The sound source path
     * @returns {boolean} True if playing, false otherwise
     */
    isPlaying(sound) {
        const audio = this.audioElements[sound];
        return audio && !audio.paused;
    }
}

/**
 * Initialize AudioManager when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function () {
    const audioManager = AudioManager.getInstance();
    audioManager.updateMuteUI();
});

/**
 * Toggles game audio and restarts music if unmuting
 */
function toggleGameAudio() {
    const wasMuted = audioManager.isMuted;
    audioManager.toggleMute();
    updateMuteButtonIcon();

    if (wasMuted && !audioManager.isMuted) {
        restartBackgroundMusic();
    }
}

/**
 * Restarts background music
 */
function restartBackgroundMusic() {
    audioManager.stopSound('audio/music.mp3');
    audioManager.playSound('audio/music.mp3', true, 0.3);
}