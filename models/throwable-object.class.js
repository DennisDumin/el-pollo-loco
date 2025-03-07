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

    constructor(x, y, direction) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png')
        this.loadImages(this.IMAGES_ROTATE);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.throw();
        this.direction = direction;
        this.speedX = 10 * this.direction; 
        this.speedY = 10;
        this.height = 70;
        this.width = 70;
        this.offsetHeight = 55;
        this.offsetWidth = 50;
        this.offsetX = 10;
        this.offsetY = 5;
        this.breakSound.volume = 0.3;
    }

    startBottleAnimation() {
        this.rotationInterval = setGameInterval(() => {
            this.playAnimation(this.IMAGES_ROTATE, 4);
        }, 1000 / 60);
    }

    handleGroundCollision() {
        if (this.y >= 370) {
            this.speedY = 0;
            this.speedX = 0;
            this.playSplashAnimation();
        }
    }

    handleEnemyCollision() {
        this.world.level.enemies.forEach((enemy) => {
            if (this.isColliding(enemy)) {
                this.playSplashAnimation();
    
                if (enemy instanceof Endboss) {
                    enemy.takeDamage(20);
                    this.world.statusBarEndboss.setPercentage(enemy.energy);
                
                } else {
                    enemy.hit();
                }
            }
        });
    }

    playBreakSound() {
        this.breakSound.play();
    }

    stopMotion() {
        clearInterval(this.moveInterval);
        clearInterval(this.rotationInterval);
        clearInterval(this.splashInterval); 
    }

    playSplashAnimation() {
        this.playBreakSound();
        this.stopMotion();
        this.speedY = 0;
        this.speedX = 0;
        this.currentImage = 0;
        this.collisionDetected = true;
        this.splashInterval = setGameInterval(() => {
            if (this.currentImage < this.IMAGES_SPLASH.length) {
                this.img = this.imageCache[this.IMAGES_SPLASH[this.currentImage]];
                this.currentImage++;
            } else {
                clearInterval(this.splashInterval);
                this.removeFromGame();
            }
        }, 100);
    }
    
    removeFromGame() {
        let index = world.throwableObjects.indexOf(this);
        if (index > -1) {
            world.throwableObjects.splice(index, 1);
        }
    }
}