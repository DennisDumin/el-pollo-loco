class Chicken extends MovableObject {
    y = 350;
    width = 75;
    height = 75;
    audioManager = AudioManager.getInstance();
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGE_DEAD = 'img/3_enemies_chicken/chicken_normal/2_dead/dead.png';

    /**
     * Creates a new normal chicken enemy
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
        this.speed = 0.15 + Math.random() * 0.8;
        this.animateChicken();
        this.isDead = false;
    }

    /**
     * Sets collision detection offsets
     */
    setCollisionOffsets() {
        this.offsetHeight = 65;
        this.offsetWidth = 65;
        this.offsetX = 5;
        this.offsetY = 5;
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
        this.audioManager.playSound('audio/chick.mov', false, 0.3);
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