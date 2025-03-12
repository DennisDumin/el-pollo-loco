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

    constructor() {
        super();
        this.idleTime = null;
    }

    applyGravity() {
        this.gravityInterval = setGameInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    hit() {
        if (this.energy === 0 || (Date.now() - this.lastHit) <= 500) return;

        this.energy = Math.max(0, this.energy - 20);
        this.lastHit = Date.now();
        this.hurtSoundPlayed = false;
    }

    isHurt() {
        return (Date.now() - this.lastHit) < 1000;
    }

    isDead() {
        return this.energy == 0 || this.isDeadFlag === true;
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return this.y < 370;
        } else {
            return this.y < 185;
        }
    }

    moveRight() {
        if (this.isFrozen) return;
        this.x += this.speed;
    }

    moveLeft() {
        if (this.isFrozen) return;
        this.x -= this.speed;
    }

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

    getHitbox() {
        return {
            x: this.x + this.offsetX,
            y: this.y + this.offsetY,
            width: this.offsetWidth,
            height: this.offsetHeight
        };
    }

    throw() {
        this.playThrowSound();
        this.idleTime = null;
        this.applyGravity(); 
        this.startBottleAnimation();
        this.moveInterval = setGameInterval(() => {
            this.x += this.speedX;
            this.y -= this.speedY;  
            this.speedY -= (this.acceleration - 2.5); 
            if (this.y >= 360) {
                this.handleGroundCollision();
            }
        }, 1000 / 60);
    }

    animateChicken() {
        this.moveInterval = setGameInterval(() => {
            if (!this.isDead) {
                this.moveLeft();
            }
        }, 1000 / 60);

        this.animationInterval = setGameInterval(() => {
            if (!this.isDead) {
                this.playAnimation(this.IMAGES_WALKING, 2);
            }
        }, 100);
    }

    stopMotion() {
        if (this.moveInterval) clearInterval(this.moveInterval);
        if (this.animationInterval) clearInterval(this.animationInterval);
        if (this.gravityInterval) clearInterval(this.gravityInterval);
        if (this.attackInterval) clearInterval(this.attackInterval);
        if (this.alertInterval) clearInterval(this.alertInterval);
        if (this.deathInterval) clearInterval(this.deathInterval);
        this.moveInterval = null;
        this.animationInterval = null;
        this.gravityInterval = null;
        this.attackInterval = null;
        this.alertInterval = null;
        this.deathInterval = null;
        this.speed = 0;
        this.isAttacking = false;
    }

    playThrowSound() {
        this.audioManager.playSound('audio/throw.mp3', false, 0.3);
    }
}