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

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage(this.IMAGE_DEAD);
        this.x = 700 + Math.random() * 3500;
        this.speed = 0.15 + Math.random() * 1.0;
        this.animateChicken();
        this.offsetHeight = 50;
        this.offsetWidth = 40;
        this.offsetX = 1;
        this.offsetY = -3;
        this.isDead = false;
    }

    hit() {
        if (!this.isDead) {
            this.isDead = true;
            this.stopMotion();
            this.audioManager.playSound('audio/bird.mov', false, 0.3);
            this.showDeathAnimation();
        }
    }
    
    showDeathAnimation() {
        this.loadImage(this.IMAGE_DEAD);
        setTimeout(() => {
            this.removeFromGame();
        }, 500); 
    }
    
    removeFromGame() {
        let index = world.level.enemies.indexOf(this);
        if (index > -1) {
            world.level.enemies.splice(index, 1);
        }
    }
}