class Chicken extends MovableObject {

    y = 350;
    width = 75;
    height = 75;
    chickenDeath = new Audio('audio/chick.mov');
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGE_DEAD = 'img/3_enemies_chicken/chicken_normal/2_dead/dead.png';

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage(this.IMAGE_DEAD);
        this.x = 400 + Math.random() * 3000;
        this.speed = 0.15 + Math.random() * 0.8;
        this.animateChicken();
        this.offsetHeight = 65;
        this.offsetWidth = 65;
        this.offsetX = 5;
        this.offsetY = 5;
        this.isDead = false;
        this.chickenDeath.volume = 0.3;
    }

    hit() {
        if (!this.isDead) {
            console.log("🐔 Chicken wurde getroffen und stirbt!");
            this.isDead = true;
            this.stopMotion();
            this.chickenDeath.play();
            this.showDeathAnimation();
        }
    }
    
    showDeathAnimation() {
        console.log("🐔 Chicken zeigt Todesanimation!");
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