class ThrowableObject extends MovableObject {

    IMAGES_ROTATE = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    /**
     * Creates a new throwable bottle object
     * @param {number} x - Initial x position
     * @param {number} y - Initial y position
     * @param {number} direction - Direction of throw (1 for right, -1 for left)
     */
    constructor(x, y, direction) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_ROTATE);
        this.loadImages(this.IMAGES_SPLASH);
        this.initializePosition(x, y, direction);
        this.initializePhysics(direction);
        this.setCollisionBox();
    }

    /**
     * Initializes the position and throwing action
     * @param {number} x - Initial x position
     * @param {number} y - Initial y position
     * @param {number} direction - Direction of throw
     */
    initializePosition(x, y, direction) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.throw();
    }

    /**
     * Initializes physics properties
     * @param {number} direction - Direction of throw
     */
    initializePhysics(direction) {
        this.speedX = 10 * direction;
        this.speedY = 10;
        this.height = 70;
        this.width = 70;
    }

    /**
     * Sets the collision box dimensions
     */
    setCollisionBox() {
        this.offsetHeight = 55;
        this.offsetWidth = 50;
        this.offsetX = 10;
        this.offsetY = 5;
    }

    /**
     * Starts the bottle rotation animation
     */
    startBottleAnimation() {
        this.rotationInterval = setGameInterval(() => {
            this.playAnimation(this.IMAGES_ROTATE, 4);
        }, 1000 / 60);
    }

    /**
     * Handles collision with the ground
     */
    handleGroundCollision() {
        if (this.y >= 370) {
            this.speedY = 0;
            this.speedX = 0;
            this.playSplashAnimation();
        }
    }

    /**
     * Handles collision with enemies
     */
    handleEnemyCollision() {
        this.world.level.enemies.forEach((enemy) => {
            if (this.isColliding(enemy)) {
                this.playSplashAnimation();
                this.processDamageToEnemy(enemy);
            }
        });
    }

    /**
     * Processes damage to the enemy
     * @param {MovableObject} enemy - The enemy that was hit
     */
    processDamageToEnemy(enemy) {
        if (enemy instanceof Endboss) {
            enemy.takeDamage(20);
            this.world.statusBarEndboss.setPercentage(enemy.energy);
        } else {
            enemy.hit();
        }
    }

    /**
     * Plays the bottle break sound effect
     */
    playBreakSound() {
        this.audioManager.playSound('audio/glass.mp3', false, 0.3);
    }

    /**
     * Stops all motion and animation intervals
     */
    stopMotion() {
        clearInterval(this.moveInterval);
        clearInterval(this.rotationInterval);
        clearInterval(this.splashInterval); 
    }

    /**
     * Plays the splash animation
     * @param {Function} callback - Optional callback after animation completes
     */
    playSplashAnimation(callback) {
        this.playBreakSound();
        this.stopMotion();
        this.initializeSplashState();
        this.startSplashAnimation(callback);
    }

    /**
     * Initializes the state for splash animation
     */
    initializeSplashState() {
        this.speedY = 0;
        this.speedX = 0;
        this.currentImage = 0;
        this.collisionDetected = true;
    }

    /**
     * Starts the splash animation sequence
     * @param {Function} callback - Optional callback after animation completes
     */
    startSplashAnimation(callback) {
        this.splashInterval = setGameInterval(() => {
            if (this.currentImage < this.IMAGES_SPLASH.length) {
                this.img = this.imageCache[this.IMAGES_SPLASH[this.currentImage]];
                this.currentImage++;
            } else {
                this.finishSplashAnimation(callback);
            }
        }, 100);
    }

    /**
     * Finishes the splash animation
     * @param {Function} callback - Optional callback to execute
     */
    finishSplashAnimation(callback) {
        clearInterval(this.splashInterval);
        this.removeFromGame();
        if (callback) callback();
    }
    
    /**
     * Removes this object from the game world
     */
    removeFromGame() {
        let index = world.throwableObjects.indexOf(this);
        if (index > -1) {
            world.throwableObjects.splice(index, 1);
        }
    }
}