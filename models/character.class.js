class Character extends MovableObject {

    width = 120;
    height = 240;
    // y = 195;
    y = 80;
    speed = 10;
    walkSound = new Audio('audio/running.mp3');
    hurtSound = new Audio('audio/hurt.mp3');
    snoreSound = new Audio('audio/snore.mp3');

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png',
    ];

    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png',
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png',
    ];

    IMAGES_LONG_IDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png',
    ];
    world;

    constructor(world) {
        super().loadImage('img/2_character_pepe/1_idle/idle/I-1.png')
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.world = world;
        this.lastDamageTime = 0;
        this.applyGravity();
        this.animate();
        this.offsetHeight = 136;
        this.offsetWidth = 65;
        this.offsetX = 30;
        this.offsetY = 93;
        this.idleTime = null;
        this.walkSound.volume = 0.3;
        this.hurtSound.volume = 0.3;
        this.snoreSound.volume = 0.3;
        }

    animate() {
        setInterval(() => {
            if (this.world.keyboard.RIGHT && this.x < this.world.level.levelEndX) {
                this.moveRight();
                this.otherDirection = false;
                this.snoreSound.pause();
                this.idleTime = null
            }
            if (this.world.keyboard.LEFT && this.x > -200) {
                this.moveLeft();
                this.otherDirection = true;
                this.snoreSound.pause();
                this.idleTime = null;
            }
            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
                this.snoreSound.pause();
                this.idleTime = null
            }

            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD, 2);
            } else if (this.isHurt()) {
                this.hurtSound.play();
                this.idleTime = null
                this.snoreSound.pause();
                this.playAnimation(this.IMAGES_HURT, 2);
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING, 3);
            } else {
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING, 2);
                } else {
                    this.getIdleAnimation();
                }
            }
        }, 50);
    }

    jump() {
        this.speedY = 25;
    }

    isCollidingWithEnemy() {
        return this.world.level.enemies.some(enemy => this.isColliding(enemy));
    }

    getIdleAnimation() {
        let longIdleTime = 5000;
        if (!this.idleTime) {
            this.idleTime = Date.now()
        } else if (Date.now() - this.idleTime >= longIdleTime) {
            this.playAnimation(this.IMAGES_LONG_IDLE, 15)
            this.snoreSound.play();
            return
        }
        this.playAnimation(this.IMAGES_IDLE, 5)
    }

}