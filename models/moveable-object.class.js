class MovableObject extends DrawableObject {
    speed = 0.15;
    speedY = 0;
    acceleration = 2.5;
    otherDirection = false;
    offsetX = 0;
    offsetY = 0;
    offsetWidth = 0;
    offsetHeight = 0;
    energy = 100;
    lastHit = 0;
    idleTime = null;
    audioManager = AudioManager.getInstance();

    /**
     * Creates a new movable object
     */
    constructor() {
        super();
        this.idleTime = null;
    }

    /**
     * Applies gravity to the object
     */
    applyGravity() {
        this.gravityInterval = setGameInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
     * Handles object being hit
     */
    hit() {
        if (this.energy === 0 || (Date.now() - this.lastHit) <= 500) return;

        this.energy = Math.max(0, this.energy - 20);
        this.lastHit = Date.now();
        this.hurtSoundPlayed = false;
    }

    /**
     * Checks if object is in hurt state
     * @returns {boolean} True if object is hurt
     */
    isHurt() {
        return (Date.now() - this.lastHit) < 1000;
    }

    /**
     * Checks if object is dead
     * @returns {boolean} True if object is dead
     */
    isDead() {
        return this.energy == 0 || this.isDeadFlag === true;
    }

    /**
     * Checks if object is above ground
     * @returns {boolean} True if object is above ground
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return this.y < 370;
        } else {
            return this.y < 185;
        }
    }

    /**
     * Moves object to the right
     */
    moveRight() {
        if (this.isFrozen) return;
        this.x += this.speed;
    }

    /**
     * Moves object to the left
     */
    moveLeft() {
        if (this.isFrozen) return;
        this.x -= this.speed;
    }

    /**
     * Plays animation sequence
     * @param {Array} images - Array of image paths
     * @param {number} frameDelay - Delay between frames
     */
    playAnimation(images, frameDelay = 10) {
        if (!this.animationFrameCounter) {
            this.animationFrameCounter = 0;
        }

        if (this.animationFrameCounter % frameDelay === 0) {
            let i = this.currentImage % images.length;
            let path = images[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }

        this.animationFrameCounter++;
    }

    /**
     * Checks collision with another movable object
     * @param {MovableObject} mo - The object to check collision with
     * @returns {boolean} True if objects are colliding
     */
    isColliding(mo) {
        const { x, y, width, height } = this.getHitbox();
        const { x: otherX, y: otherY, width: otherWidth, height: otherHeight } = mo.getHitbox();

        return (
            x + width >= otherX &&
            x <= otherX + otherWidth &&
            y + height >= otherY &&
            y <= otherY + otherHeight
        );
    }

    /**
     * Gets object hitbox for collision detection
     * @returns {Object} Hitbox coordinates and dimensions
     */
    getHitbox() {
        return {
            x: this.x + this.offsetX,
            y: this.y + this.offsetY,
            width: this.offsetWidth,
            height: this.offsetHeight
        };
    }

    /**
     * Throws an object
     */
    throw() {
        this.playThrowSound();
        this.idleTime = null;
        this.applyGravity(); 
        this.startBottleAnimation();
        this.setupThrowMotion();
    }

    /**
     * Sets up throw motion physics
     */
    setupThrowMotion() {
        this.moveInterval = setGameInterval(() => {
            this.x += this.speedX;
            this.y -= this.speedY;  
            this.speedY -= (this.acceleration - 2.5); 
            
            if (this.y >= 360) {
                this.handleGroundCollision();
            }
        }, 1000 / 60);
    }

    /**
     * Animates chicken movement
     */
    animateChicken() {
        this.setupChickenMovement();
        this.setupChickenAnimation();
    }

    /**
     * Sets up chicken movement interval
     */
    setupChickenMovement() {
        this.moveInterval = setGameInterval(() => {
            if (!this.isDead) {
                this.moveLeft();
            }
        }, 1000 / 60);
    }

    /**
     * Sets up chicken animation interval
     */
    setupChickenAnimation() {
        this.animationInterval = setGameInterval(() => {
            if (!this.isDead) {
                this.playAnimation(this.IMAGES_WALKING, 2);
            }
        }, 100);
    }

    /**
     * Stops all motion and animations
     */
    stopMotion() {
        this.clearAllIntervals();
        this.resetIntervalReferences();
        this.resetMotionState();
    }

    /**
     * Clears all active intervals
     */
    clearAllIntervals() {
        if (this.moveInterval) clearInterval(this.moveInterval);
        if (this.animationInterval) clearInterval(this.animationInterval);
        if (this.gravityInterval) clearInterval(this.gravityInterval);
        if (this.attackInterval) clearInterval(this.attackInterval);
        if (this.alertInterval) clearInterval(this.alertInterval);
        if (this.deathInterval) clearInterval(this.deathInterval);
    }

    /**
     * Resets all interval references
     */
    resetIntervalReferences() {
        this.moveInterval = null;
        this.animationInterval = null;
        this.gravityInterval = null;
        this.attackInterval = null;
        this.alertInterval = null;
        this.deathInterval = null;
    }

    /**
     * Resets motion state properties
     */
    resetMotionState() {
        this.speed = 0;
        this.isAttacking = false;
    }

    /**
     * Plays throw sound effect
     */
    playThrowSound() {
        this.audioManager.playSound('audio/throw.mp3', false, 0.3);
    }
}