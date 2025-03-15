class Coin extends MovableObject {
    IMAGES_COIN = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    floatingParams = {
        baseY: 0,
        direction: 1,
        range: 3,
        speed: 0.2
    };

    audioManager = AudioManager.getInstance();

    /**
     * Creates a new coin object
     * @param {number} x - The x position of the coin
     * @param {number} y - The y position of the coin
     */
    constructor(x, y) {
        super().loadImage(this.IMAGES_COIN[0]);
        this.loadImages(this.IMAGES_COIN);
        this.initPosition(x, y);
        this.initSize();
        this.setCollisionBox();
        this.startAnimations();
    }

    /**
     * Initializes the coin's position
     * @param {number} x - The x position of the coin
     * @param {number} y - The y position of the coin
     */
    initPosition(x, y) {
        this.x = x;
        this.y = y;
        this.floatingParams.baseY = y;
    }

    /**
     * Initializes the coin's size
     */
    initSize() {
        this.width = 100;
        this.height = 100;
    }

    /**
     * Sets the collision box for more precise hit detection
     */
    setCollisionBox() {
        this.offsetX = 34;
        this.offsetY = 35;
        this.offsetWidth = 31;
        this.offsetHeight = 30;
    }

    /**
     * Starts all coin animations
     */
    startAnimations() {
        this.startFloating();
        this.animate();
    }

    /**
     * Starts the floating animation of the coin
     */
    startFloating() {
        this.floatingInterval = setGameInterval(() => {
            this.updateFloatingPosition();
        }, 1000 / 60);
    }

    /**
     * Updates the coin's position during floating animation
     */
    updateFloatingPosition() {
        this.y += this.floatingParams.direction * this.floatingParams.speed;
        
        if (this.shouldReverseFloatingDirection()) {
            this.floatingParams.direction *= -1;
        }
    }

    /**
     * Checks if the floating direction should be reversed
     * @returns {boolean} True if direction should be reversed
     */
    shouldReverseFloatingDirection() {
        return this.y > this.floatingParams.baseY + this.floatingParams.range ||
               this.y < this.floatingParams.baseY - this.floatingParams.range;
    }
    
    /**
     * Sets up the coin's sprite animation
     */
    animate() {
        this.animationInterval = setGameInterval(() => {
            this.playAnimation(this.IMAGES_COIN);
        }, 100);
    }

    /**
     * Handles coin collection
     */
    collect() {
        this.playCollectionSound();
        this.removeFromGame();
    }

    /**
     * Plays the coin collection sound
     */
    playCollectionSound() {
        this.audioManager.playOverlappingSound('audio/coin.mov', 0.3);
    }

    /**
     * Removes the coin from the game world
     */
    removeFromGame() {
        setTimeout(() => {
            this.removeCoinFromLevel();
        }, 100);
    }

    /**
     * Removes the coin from the level's coin array
     */
    removeCoinFromLevel() {
        const index = world.level.coins.indexOf(this);
        if (index > -1) {
            world.level.coins.splice(index, 1);
        }
    }
}