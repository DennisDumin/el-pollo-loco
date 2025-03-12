class AudioManager {
    static instance;
    audioElements = {};
    pendingPlayPromises = {};
    
    static getInstance() {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }
    
    getAudio(src, volume = 0.3) {
        if (this.audioElements[src]) {
            const audio = this.audioElements[src];
            audio.volume = volume;
            return audio;
        }
        return this.createNewAudio(src, volume);
    }
    
    createNewAudio(src, volume) {
        try {
            const audio = new Audio(src);
            audio.volume = volume;
            audio.preload = 'auto';
            
            audio.addEventListener('error', (e) => {
                console.error(`Error loading audio source: ${src}`, e);
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
        } catch (error) {
        }
    }

    playSound(src, loop = false, volume = 0.3) {
        const audio = this.getAudio(src, volume);
        audio.loop = loop;
        
        if (!audio.paused && !audio.ended) {
            return Promise.resolve();
        }
        
        return this.executeSafePlay(audio, src);
    }
    
    executeSafePlay(audio, src) {
        try {
            audio.pause();
            return this.playWithDelay(audio, src);
        } catch (error) {
            console.error(`Error playing audio ${src}:`, error);
            return Promise.resolve();
        }
    }
    
    playWithDelay(audio, src) {
        return new Promise(resolve => {
            setTimeout(() => {
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
    }
}