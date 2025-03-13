class AudioManager {
    static instance;
    audioElements = {};
    pendingPlayPromises = {};
    isMuted = false;
    activeSounds = new Set();
    
    static getInstance() {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
            AudioManager.instance.initMuteState();
        }
        return AudioManager.instance;
    }
    
    initMuteState() {
        const savedMuteState = localStorage.getItem('isMuted');
        if (savedMuteState !== null) {
            this.isMuted = savedMuteState === 'true';
            setTimeout(() => {
                this.updateMuteUI();
                Object.values(this.audioElements).forEach(audio => {
                    audio.muted = this.isMuted;
                });
            }, 100);
        }
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('isMuted', this.isMuted);
        this.updateMuteUI();
        
        Object.values(this.audioElements).forEach(audio => {
            audio.muted = this.isMuted;
        });
    }
    
    updateMuteUI() {
        const muteIcon = document.getElementById('mute-icon');
        if (muteIcon) {
            muteIcon.src = this.isMuted ? 'img/menu/volume-muted.png' : 'img/menu/volume.png';
        }
    }
    
    stopAllSounds() {
        Object.keys(this.audioElements).forEach(src => {
            this.stopSound(src);
        });
        this.activeSounds.clear();
    }
    
    getAudio(src, volume = 0.3) {
        if (this.audioElements[src]) {
            const audio = this.audioElements[src];
            audio.volume = volume;
            audio.muted = this.isMuted;
            return audio;
        }
        return this.createNewAudio(src, volume);
    }
    
    createNewAudio(src, volume) {
        try {
            const audio = new Audio(src);
            audio.volume = volume;
            audio.muted = this.isMuted;
            audio.preload = 'auto';
            audio.addEventListener('ended', () => {
                this.activeSounds.delete(src);
            });
            
            audio.addEventListener('error', (e) => {
                console.error(`Error loading audio source: ${src}`, e);
                this.activeSounds.delete(src);
            });
            
            this.audioElements[src] = audio;
            return audio;
        } catch (error) {
            console.error(`Failed to create audio for ${src}:`, error);
            return document.createElement('audio');
        }
    }
    
    async stopSound(src) {
        if (!this.audioElements[src]) return;
        
        const audio = this.audioElements[src];
        
        try {
            if (this.pendingPlayPromises[src]) {
                await this.pendingPlayPromises[src];
            }
            audio.pause();
            audio.currentTime = 0;
            this.activeSounds.delete(src);
        } catch (error) {
        }
    }

    playSound(src, loop = false, volume = 0.3) {
        if (this.isMuted) {
            return Promise.resolve();
        }
        const audio = this.getAudio(src, volume);
        audio.loop = loop;
        this.activeSounds.add(src);
        if (!audio.paused && !audio.ended) {
            audio.pause();
            audio.currentTime = 0;
        }
        
        return this.executeSafePlay(audio, src);
    }
    
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
    
    clearAll() {
        Object.values(this.audioElements).forEach(audio => {
            audio.pause();
            audio.src = '';
        });
        this.audioElements = {};
        this.pendingPlayPromises = {};
        this.activeSounds.clear();
    }
    
    isSoundMuted() {
        return this.isMuted;
    }
    
    monitorExternalSound(audio) {
        audio.muted = this.isMuted;
        return audio;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const audioManager = AudioManager.getInstance();
    audioManager.updateMuteUI();
});

function toggleGameAudio() {
    AudioManager.getInstance().toggleMute();
}