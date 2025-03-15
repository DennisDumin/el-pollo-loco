class ChickenTiny extends MovableObject {
    y = 385;
    width = 35;
    height = 35;
    audioManager = AudioManager.getInstance();
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGE_DEAD = 'img/3_enemies_chicken/chicken_small/2_dead/dead.png';

    /**
     * Creates a new tiny chicken enemy
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadAllImages();
        this.initChicken();
        this.setCollisionOffsets();
    }

    /**
     * Loads all chicken images
     */
    loadAllImages() {
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage(this.IMAGE_DEAD);
    }

    /**
     * Initializes chicken properties
     */
    initChicken() {
        this.x = 700 + Math.random() * 3500;
        this.speed = 0.15 + Math.random() * 1.0;
        this.animateChicken();
        this.isDead = false;
    }

    /**
     * Sets collision detection offsets
     */
    setCollisionOffsets() {
        this.offsetHeight = 50;
        this.offsetWidth = 40;
        this.offsetX = 1;
        this.offsetY = -3;
    }

    /**
     * Handles chicken being hit
     */
    hit() {
        if (!this.isDead) {
            this.isDead = true;
            this.stopMotion();
            this.playDeathSound();
            this.showDeathAnimation();
        }
    }
    
    /**
     * Plays chicken death sound
     */
    playDeathSound() {
        this.audioManager.playSound('audio/bird.mov', false, 0.3);
    }
    
    /**
     * Shows death animation and schedules removal
     */
    showDeathAnimation() {
        this.loadImage(this.IMAGE_DEAD);
        setTimeout(() => {
            this.removeFromGame();
        }, 500); 
    }
    
    /**
     * Removes chicken from game world
     */
    removeFromGame() {
        let index = world.level.enemies.indexOf(this);
        if (index > -1) {
            world.level.enemies.splice(index, 1);
        }
    }
}