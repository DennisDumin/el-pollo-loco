class ChickenTiny extends MovableObject {

    y = 385;
    width = 35;
    height = 35;
    chickenDeath = new Audio('audio/bird.mov');
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
        this.x = 300 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.8;
        this.animate();
        this.offsetHeight = 50;
        this.offsetWidth = 40;
        this.offsetX = 1;
        this.offsetY = -3;
        this.isDead = false;
        this.chickenDeath.volume = 0.3;
    }

    animate() {
        this.moveInterval = setInterval(() => {
            if (!this.isDead) {
                this.moveLeft();
            }
        }, 1000 / 60);
        this.animationInterval = setInterval(() => {
            if (!this.isDead) {
                this.playAnimation(this.IMAGES_WALKING, 2);
            }
        }, 100);
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
        }, 1000); 
    }
    
    stopMotion() {
        clearInterval(this.moveInterval);
        clearInterval(this.animationInterval);
    }
    
    removeFromGame() {
        let index = world.level.enemies.indexOf(this);
        if (index > -1) {
            world.level.enemies.splice(index, 1);
        }
    }
}