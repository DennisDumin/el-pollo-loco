class Character extends MovableObject {
    width = 120;
    height = 240;
    y = 195;
    speed = 6;
    bottlesCollected = 0;
    isFrozen = false;
    isWalkingSoundPlaying = false;
    snoreSoundPlaying = false;

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png',
    ];

    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png',
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png',
    ];

    IMAGES_LONG_IDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png',
    ];
    world;
    audioManager = AudioManager.getInstance();

    constructor(world) {
        super().loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.world = world;
        this.hasTriggeredDeath = false;
        this.lastThrowTime = 0;
        this.lastDamageTime = 0;
        this.applyGravity();
        this.animate();
        this.offsetHeight = 136;
        this.offsetWidth = 65;
        this.offsetX = 30;
        this.offsetY = 93;
    }

    /**
   * Sets up animation and movement intervals
   */
    animate() {
        this.movementInterval = setGameInterval(() => {
            this.updateMovement();
            this.updateCamera();
        }, 1000 / 60);

        this.animationInterval = setGameInterval(() => {
            this.updateAnimation();
        }, 50);
    }

    /**
     * Updates character movement based on keyboard input
     */
    updateMovement() {
        if (this.isFrozen || this.world.gameWon) {
            return;
        }

        let isMoving = this.handleHorizontalMovement();
        this.handleJumping();
        this.updateWalkSound(isMoving);
    }

    /**
     * Handles horizontal movement based on keyboard input
     * @returns {boolean} True if character is moving horizontally
     */
    handleHorizontalMovement() {
        let isMoving = false;

        if (this.canMoveRight()) {
            this.moveRight();
            this.otherDirection = false;
            this.resetIdleState();
            isMoving = true;
        }

        if (this.canMoveLeft()) {
            this.moveLeft();
            this.otherDirection = true;
            this.resetIdleState();
            isMoving = true;
        }

        return isMoving;
    }

    /**
     * Checks if character can move right
     * @returns {boolean} True if can move right
     */
    canMoveRight() {
        return this.world.keyboard.RIGHT && this.x < this.world.level.levelEndX;
    }

    /**
     * Checks if character can move left
     * @returns {boolean} True if can move left
     */
    canMoveLeft() {
        return this.world.keyboard.LEFT && this.x > -200;
    }

    /**
     * Handles jumping input
     */
    handleJumping() {
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
            this.resetIdleState();
        }
    }

    /**
     * Updates walk sound based on movement state
     * @param {boolean} isMoving - Whether character is moving horizontally
     */
    updateWalkSound(isMoving) {
        if (isMoving && !this.isAboveGround()) {
            this.playWalkSound();
        } else {
            this.stopWalkSound();
        }
    }

    /**
     * Updates character animation based on current state
     */
    updateAnimation() {
        if (this.isDead()) {
            this.handleDeathAnimation();
        } else if (this.isHurt()) {
            this.handleHurtAnimation();
        } else if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMPING, 3);
        } else {
            this.handleGroundAnimation();
        }
    }

    /**
     * Handles death animation trigger if not already triggered
     */
    handleDeathAnimation() {
        if (!this.hasTriggeredDeath) {
            this.die();
            this.hasTriggeredDeath = true;
        }
    }

    /**
     * Handles animation when character is on ground
     */
    handleGroundAnimation() {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING, 2);
        } else {
            this.getIdleAnimation();
        }
    }

    /**
     * Handles hurt animation and sound
     */
    handleHurtAnimation() {
        if (!this.hurtSoundPlayed) {
            this.audioManager.playSound('audio/hurt.mp3');
            this.hurtSoundPlayed = true;
        }
        this.resetIdleState();
        this.playAnimation(this.IMAGES_HURT, 2);
    }

    /**
     * Updates camera position based on character position
     */
    updateCamera() {
        this.world.camera_x = -this.x + 100;
    }

    /**
     * Stops all character movement and animation
     */
    stopCharacter() {
        clearInterval(this.movementInterval);
        clearInterval(this.animationInterval);
        this.stopWalkSound();
    }

    /**
     * Makes character jump if conditions allow
     */
    jump() {
        if (this.isFrozen || this.isAboveGround()) return;
        this.playJumpSound();
        this.speedY = 25;
    }

    /**
     * Checks if character is colliding with an enemy
     * @returns {boolean} True if colliding with enemy
     */
    isCollidingWithEnemy() {
        return this.world.level.enemies.some(enemy => this.isColliding(enemy));
    }

    /**
     * Handles idle animation based on idle time
     */
    getIdleAnimation() {
        let longIdleTime = 5000;
        if (!this.idleTime) {
            this.idleTime = Date.now();
        }
        else if (this.shouldShowLongIdle(longIdleTime)) {
            this.playLongIdleWithSound();
            return;
        } else {
            // Normale Idle-Animation abspielen
            this.playAnimation(this.IMAGES_IDLE, 5);
        }
    }

    /**
     * Plays long idle animation with snore sound
     */
    playLongIdleWithSound() {
        this.playAnimation(this.IMAGES_LONG_IDLE, 15);
        if (!this.snoreSoundPlaying) {
            this.audioManager.stopSound('audio/snore.mp3');
            setTimeout(() => {
                this.audioManager.playSound('audio/snore.mp3', true, 0.3);
                this.snoreSoundPlaying = true;
            }, 50);
        }
    }

    /**
     * Resets idle state and stops idle sounds
     */
    resetIdleState() {
        if (this.snoreSoundPlaying) {
            this.audioManager.stopSound('audio/snore.mp3');
            this.snoreSoundPlaying = false;
        }
        this.idleTime = null;
    }

    /**
     * Checks if should show long idle animation
     * @param {number} longIdleTime - Time threshold for long idle
     * @returns {boolean} True if should show long idle animation
     */
    shouldShowLongIdle(longIdleTime) {
        return Date.now() - this.idleTime >= longIdleTime &&
            !this.isFrozen &&
            !this.world.gameWon;
    }

    /**
     * Plays walking sound if not already playing
     */
    playWalkSound() {
        if (!this.isWalkingSoundPlaying) {
            this.audioManager.playSound('audio/running.mp3', true, 0.3)
                .then(() => {
                    this.isWalkingSoundPlaying = true;
                })
                .catch(error => {
                    console.warn(` Walk sound play failed:`, error);
                });
        }
    }

    /**
     * Stops walking sound if playing
     */
    stopWalkSound() {
        if (this.isWalkingSoundPlaying) {
            this.audioManager.stopSound('audio/running.mp3');
            this.isWalkingSoundPlaying = false;
        }
    }

    /**
     * Plays jump sound
     */
    playJumpSound() {
        this.audioManager.playSound('audio/jump.mp3')
            .then(() => {
                this.isSoundLoaded = true;
            })
            .catch(error => {
                console.warn(` Jump sound play failed:`, error);
            });
    }

    /**
     * Stops jump sound
     */
    stopJumpSound() {
        this.audioManager.stopSound('audio/jump.mp3');
    }

    /**
     * Handles character death
     */
    die() {
        this.playDeathAnimationOnce();
        this.isDeadFlag = true;
        this.stopCharacterSounds();
        this.stopGameEntities();
        this.playDeathSound();
        this.isFrozen = true;
        this.showLoseMenuAfterDelay();
        if (this.world && this.world.endboss) {
            this.world.endboss.stopMotion();
        }
    }

    /**
     * Stops character sounds
     */
    stopCharacterSounds() {
        this.stopWalkSound();
        this.stopJumpSound();
        this.audioManager.stopSound('audio/snore.mp3');
        this.audioManager.stopSound('audio/music.mp3');
    }

    /**
     * Stops all game entities
     */
    stopGameEntities() {
        if (this.world && this.world.endboss) {
            this.world.endboss.stopMotion();
        }
        this.stopAllEnemies();
    }

    /**
     * Stops all enemies
     */
    stopAllEnemies() {
        if (this.world && this.world.level && this.world.level.enemies) {
            this.world.level.enemies.forEach(enemy => {
                if (enemy.stopMotion) {
                    enemy.stopMotion();
                }
            });
        }
    }

    /**
     * Plays death sound
     */
    playDeathSound() {
        this.audioManager.playSound('audio/kikiriki.mp3', false, 0.3);
    }

    /**
     * Shows lose menu after delay
     */
    showLoseMenuAfterDelay() {
        setTimeout(() => {
            this.world.gameIsPaused = true;
            document.getElementById('lose-menu').style.display = 'block';
        }, 1500);
    }

    /**
     * Plays death animation once
     */
    playDeathAnimationOnce() {
        if (!this.deathAnimationStarted) {
            this.deathAnimationStarted = true;
            this.currentDeathImage = 0;
            this.startDeathAnimationInterval();
        }
    }

    /**
     * Starts death animation interval
     */
    startDeathAnimationInterval() {
        this.deathInterval = setGameInterval(() => {
            this.updateDeathFrame();
        }, 200);
    }

    /**
     * Updates death animation frame
     */
    updateDeathFrame() {
        if (this.currentDeathImage < this.IMAGES_DEAD.length) {
            let path = this.IMAGES_DEAD[this.currentDeathImage];
            this.img = this.imageCache[path];
            this.currentDeathImage++;
        } else {
            clearInterval(this.deathInterval);
        }
    }
}
