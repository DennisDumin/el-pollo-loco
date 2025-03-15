class Endboss extends MovableObject {
    height = 400;
    width = 350;
    y = 55;
    energy = 100;
    isDead = false;
    lastHit = 0;
    isHurt = false;
    isActivated = false;
    isAttacking = false;
    attackSpeed = 9;
    attackDistance = 275;
    attackJumpHeight = 25;
    audioManager = AudioManager.getInstance();
    recoveryTimeout = null;

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png',
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png',
    ];

    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 4000;
        this.speed = 16;
        this.animate();
        this.applyGravity();
        this.offsetHeight = 300;
        this.offsetWidth = 260;
        this.offsetX = 40;
        this.offsetY = 80;
    }

    /**
     * Applies gravity to the endboss
     */
    applyGravity() {
        this.gravityInterval = setGameInterval(() => {
            if (this.y < 55 || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
     * Sets up animation intervals for the endboss
     */
    animate() {
        this.animationInterval = setGameInterval(() => {
            if (this.isDead) return;
            this.chooseAnimation();
        }, 170);
    }

    /**
     * Chooses the appropriate animation based on boss state
     */
    chooseAnimation() {
        if (!this.isActivated) {
            this.playAnimation(this.IMAGES_ALERT, 2);
        } else if (this.isHurt) {
            this.playAnimation(this.IMAGES_HURT, 1);
        } else if (this.isAttacking) {
            this.playAnimation(this.IMAGES_ATTACK, 1);
        } else if (this.isActivated && !this.hasStartedMoving) {
            return;
        } else {
            this.animateWalking();
        }
    }

    /**
     * Handles walking animation and movement
     */
    animateWalking() {
        this.playAnimation(this.IMAGES_WALKING, 1);
        this.updateMoveDirection();
    }

    /**
     * Updates movement direction based on character position
     */
    updateMoveDirection() {
        if (this.world.character.x < this.x) {
            this.otherDirection = false;
            this.moveLeft();
        } else {
            this.otherDirection = true;
            this.moveRight();
        }
    }

    /**
     * Checks if the boss should be activated
     * @param {number} characterX - X position of the character
     */
    checkActivation(characterX) {
        if (characterX > 3700 && !this.isActivated) {
            this.isActivated = true;
            this.startAlertSequence();
        }
    }

    /**
     * Starts the boss alert sequence
     */
    startAlertSequence() {
        this.pauseLevelMusic();
        this.freezeCharacter();
        this.playFightAudio();
    }

    /**
     * Freezes the character during alert sequence
     */
    freezeCharacter() {
        this.world.character.isFrozen = true;
        if (world && world.character) {
            world.character.stopWalkSound();
            world.character.stopJumpSound();
        }
    }

    /**
     * Sets up and plays the fight audio
     */
    playFightAudio() {
        const fightAudio = this.audioManager.getAudio('audio/fight.wav');
        this.configureFightAudio(fightAudio);
        this.setupAlertAnimation(fightAudio);
        this.handleAudioPlayback(fightAudio);
    }

    /**
     * Configures fight audio properties
     * @param {HTMLAudioElement} fightAudio - The fight audio element
     */
    configureFightAudio(fightAudio) {
        fightAudio.loop = false;
        fightAudio.volume = 0.3;
        fightAudio.onended = () => {
            this.endAlertPhase();
        };
    }

    /**
     * Handles potential errors in audio playback
     * @param {HTMLAudioElement} fightAudio - The fight audio element
     */
    handleAudioPlayback(fightAudio) {
        const playPromise = fightAudio.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => {
                console.error("Error playing fight audio:", err);
                setTimeout(() => this.endAlertPhase(), 3000);
            });
        }
    }

    /**
     * Pauses the level background music
     */
    pauseLevelMusic() {
        const levelAudio = this.audioManager.getAudio('audio/music.mp3');
        levelAudio.pause();
    }

    /**
     * Sets up the alert animation to match audio duration
     * @param {HTMLAudioElement} fightAudio - The fight audio element
     */
    setupAlertAnimation(fightAudio) {
        if (this.alertInterval) clearInterval(this.alertInterval);

        const estimatedDuration = 6500;
        const totalFrames = this.IMAGES_ALERT.length;
        const frameTime = Math.floor(estimatedDuration / totalFrames);

        this.createAlertInterval(frameTime);
        this.adjustAnimationToAudioDuration(fightAudio, estimatedDuration, totalFrames);
    }

    /**
     * Creates the alert animation interval
     * @param {number} frameTime - Time between frames
     */
    createAlertInterval(frameTime) {
        let alertIndex = 0;
        this.alertInterval = setGameInterval(() => {
            if (alertIndex < this.IMAGES_ALERT.length) {
                this.img = this.imageCache[this.IMAGES_ALERT[alertIndex]];
                alertIndex++;
            }
        }, frameTime);
    }

    /**
     * Adjusts animation timing based on actual audio duration
     * @param {HTMLAudioElement} fightAudio - The fight audio element
     * @param {number} estimatedDuration - Estimated audio duration
     * @param {number} totalFrames - Total animation frames
     */
    adjustAnimationToAudioDuration(fightAudio, estimatedDuration, totalFrames) {
        fightAudio.addEventListener('loadedmetadata', () => {
            const actualDuration = fightAudio.duration * 1000;

            if (Math.abs(actualDuration - estimatedDuration) > 1000) {
                this.recreateAnimationWithNewTiming(actualDuration, totalFrames);
            }
        }, { once: true });
    }

    /**
     * Recreates animation with adjusted timing
     * @param {number} actualDuration - Actual audio duration
     * @param {number} totalFrames - Total animation frames
     */
    recreateAnimationWithNewTiming(actualDuration, totalFrames) {
        clearInterval(this.alertInterval);
        const adjustedFrameTime = Math.floor(actualDuration / totalFrames);

        let alertIndex = 0;
        this.alertInterval = setGameInterval(() => {
            if (alertIndex < this.IMAGES_ALERT.length) {
                this.img = this.imageCache[this.IMAGES_ALERT[alertIndex]];
                alertIndex++;
            }
        }, adjustedFrameTime);
    }

    /**
     * Ends the alert phase and transitions to movement
     */
    endAlertPhase() {
        if (this.alertInterval) {
            clearInterval(this.alertInterval);
        }
        this.resumeLevelMusic();
        this.world.character.isFrozen = false;
        this.hasStartedMoving = true;
        this.startAttackSequence();
    }

    /**
     * Resumes level background music
     */
    resumeLevelMusic() {
        const audioManager = AudioManager.getInstance();
        this.playBackgroundMusic(audioManager);
        this.updateActiveSounds(audioManager);
    }

    /**
     * Plays background music if not muted
     * @param {AudioManager} audioManager - The audio manager
     */
    playBackgroundMusic(audioManager) {
        if (!audioManager.isMuted) {
            const levelAudio = audioManager.getAudio('audio/music.mp3');
            levelAudio.loop = true;
            levelAudio.volume = 0.3;

            levelAudio.play().catch(err => {
                console.warn("Error resuming level music:", err);
            });
        }
    }

    /**
     * Updates active sounds tracking
     * @param {AudioManager} audioManager - The audio manager
     */
    updateActiveSounds(audioManager) {
        if (audioManager.activeSounds) {
            audioManager.activeSounds.add('audio/music.mp3');
        }
    }

    /**
     * Handles damage taken by the endboss
     * @param {number} amount - Amount of damage taken
     */
    takeDamage(amount) {
        if (!this.isActivated || this.isHurt || this.energy === 0) {
            return;
        }

        this.applyDamage(amount);
        this.enterHurtState();
        this.updateStatusBar();
        this.scheduleRecovery();
    }

    /**
     * Applies the damage to boss energy
     * @param {number} amount - Amount of damage
     */
    applyDamage(amount) {
        this.energy = Math.max(0, this.energy - amount);
        this.lastHit = Date.now();
    }

    /**
     * Sets the boss to hurt state
     */
    enterHurtState() {
        this.isHurt = true;
        this.isAttacking = false;
        this.speed = 0;
        clearInterval(this.animationInterval);
        clearInterval(this.attackInterval);
        this.playAnimation(this.IMAGES_HURT, 0.5);
    }

    /**
     * Updates the boss health status bar
     */
    updateStatusBar() {
        this.world.statusBarEndboss.setPercentage(this.energy);
    }

    /**
     * Schedules recovery from hurt state
     */
    scheduleRecovery() {
        this.recoveryTimeout = setTimeout(() => {
            if (this.world.character.isDead && this.world.character.isDead()) {
                return; 
            }
            this.isHurt = false;
            if (this.energy > 0) {
                this.startAttackSequence();
            } else {
                this.die();
            }
        }, 1000);
    }

    /**
     * Starts an attack sequence
     */
    startAttackSequence() {
        if (this.isDead || this.isAttacking || this.isHurt) return;

        this.prepareForAttack();
        this.setAttackDirection();
        this.executeAttack();
    }

    /**
     * Prepares the boss state for attack
     */
    prepareForAttack() {
        clearInterval(this.animationInterval);
        this.isAttacking = true;
        this.speed = 0;
        this.speedY = this.attackJumpHeight;
        this.speed = this.attackSpeed;
    }

    /**
     * Sets the attack direction based on character position
     */
    setAttackDirection() {
        if (this.world.character.x < this.x) {
            this.otherDirection = false;
        } else {
            this.otherDirection = true;
        }

        this.playAnimation(this.IMAGES_ATTACK, 2);
    }

    /**
     * Executes the attack movement
     */
    executeAttack() {
        let attackStartX = this.x;

        this.attackInterval = setGameInterval(() => {
            this.moveInAttackDirection();

            if (Math.abs(this.x - attackStartX) > this.attackDistance) {
                clearInterval(this.attackInterval);
                this.stopAttack();
            }
        }, 2000 / 60);
    }

    /**
     * Moves in the attack direction
     */
    moveInAttackDirection() {
        if (this.otherDirection) {
            this.x += this.speed;
        } else {
            this.x -= this.speed;
        }
    }

    /**
     * Stops the current attack
     */
    stopAttack() {
        this.isAttacking = false;
        this.speed = 15;
    }

    /**
     * Handles boss death
     */
    die() {
        if (this.isDead) return;

        this.setDeathState();
        this.stopCharacterSounds();
        this.stopAllMovement();
        this.playDeathAnimation();
        this.handleLevelWin();
    }

    /**
     * Sets the death state
     */
    setDeathState() {
        this.isDead = true;
        this.speed = 0;
    }

    /**
     * Stops all character sounds
     */
    stopCharacterSounds() {
        if (world && world.character) {
            world.character.stopWalkSound();
            world.character.stopJumpSound();
        }
    }

    /**
     * Stops all boss movement and intervals
     */
    stopAllMovement() {
        this.stopMotion();
        clearInterval(this.attackInterval);
        clearInterval(this.animationInterval);
    }

    /**
     * Plays the death animation
     */
    playDeathAnimation() {
        let deathIndex = 0;

        this.deathInterval = setGameInterval(() => {
            if (deathIndex < this.IMAGES_DEAD.length) {
                this.img = this.imageCache[this.IMAGES_DEAD[deathIndex]];
                deathIndex++;
            } else {
                clearInterval(this.deathInterval);
            }
        }, 200);
    }

    /**
     * Handles win state of the level
     */
    handleLevelWin() {
        this.world.freezeGame();
        setTimeout(() => {
            this.world.showWinMenu();
        }, 2000);
    }
}