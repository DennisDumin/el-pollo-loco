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

    constructor(x, y) {
        super().loadImage(this.IMAGES_COIN[0]);
        this.loadImages(this.IMAGES_COIN);
        this.x = x;
        this.y = y;
        this.floatingParams.baseY = y;
        this.width = 100;
        this.height = 100;
        this.setCollisionBox();
        this.startFloating();
        this.animate();
    }

    setCollisionBox() {
        this.offsetX = 34;
        this.offsetY = 35;
        this.offsetWidth = 31;
        this.offsetHeight = 30;
    }

    startFloating() {
        this.floatingInterval = setGameInterval(() => {
            this.y += this.floatingParams.direction * this.floatingParams.speed;
            if (
                this.y > this.floatingParams.baseY + this.floatingParams.range ||
                this.y < this.floatingParams.baseY - this.floatingParams.range
            ) {
                this.floatingParams.direction *= -1;
            }
        }, 1000 / 60);
    }
    
    animate() {
        this.animationInterval = setGameInterval(() => {
            this.playAnimation(this.IMAGES_COIN);
        }, 100);
    }

    collect() {
        this.playCollectionSound();
        this.removeFromGame();
    }

    playCollectionSound() {
        this.audioManager.playOverlappingSound('audio/coin.mov', 0.3);
    }

    removeFromGame() {
        setTimeout(() => {
            const index = world.level.coins.indexOf(this);
            if (index > -1) {
                world.level.coins.splice(index, 1);
            }
        }, 100);
    }
}