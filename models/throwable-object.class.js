class ThrowableObject extends MovableObject {

    breakSound = new Audio('audio/glass.mp3');

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

    constructor(x, y) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png')
        this.loadImages(this.IMAGES_ROTATE);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.throw();
        this.height = 70;
        this.width = 70;
        this.offsetHeight = 55;
        this.offsetWidth = 50;
        this.offsetX = 10;
        this.offsetY = 5;
        this.breakSound.volume = 0.3;
    }

    throw() {
        this.applyGravity();
        this.startBottleAnimation();
        this.speedY = 10;

        this.moveInterval = setInterval(() => {
            this.x += 20;
            if (this.y >= 0) {
                this.handleGroundCollision();
            }
        }, 1000 / 25);
    }

    startBottleAnimation() {
        this.rotationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_ROTATE, 4)
        }, 1000 / 60)
    }

    handleGroundCollision() {
        if (this.y >= 386) {
            console.log("💥 Flasche trifft auf den Boden!");
            this.speedY = 0;
            this.speedX = 0;
            this.playBreakSound();
            this.playSplashAnimation();
        }
    }

    handleEnemyCollision() {
        this.world.level.enemies.forEach((enemy) => {
            if (this.isColliding(enemy)) {
                console.log("🔥 Flasche trifft Gegner:", enemy);
                this.y = this.y;
                this.speedY = 0;
                this.speedX = 0;
                this.playSplashAnimation();
            }
        });
    }

    playBreakSound() {
        this.breakSound.play();
    }

    stopMotion() {
        clearInterval(this.moveInterval);
        clearInterval(this.rotationInterval);
    }

    playSplashAnimation() {
        this.stopMotion();
        this.speedY = 0;
        this.speedX = 0;
        this.currentImage = 0
        const splashInterval = setInterval(() => {
            if (this.currentImage < this.IMAGES_SPLASH.length) {
                this.img = this.imageCache[this.IMAGES_SPLASH[this.currentImage]]
                this.currentImage++
            } else {
                clearInterval(splashInterval)
            }
        }, 100)
    }

    removeFromGame() {
        let index = world.throwableObjects.indexOf(this);
        if (index > -1) {
            world.throwableObjects.splice(index, 1);
        }
    }
}