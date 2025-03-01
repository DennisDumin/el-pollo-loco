class Endboss extends MovableObject {
    height = 400;
    width = 350;
    y = 55;
    energy = 100;
    isDead = false;
    lastHit = 0;
    isHurt = false;
    isActivated = false;
    isAttacking = false;
    attackSpeed = 9;
    attackDistance = 275;
    attackJumpHeight = 25;
    alarmSound = new Audio('audio/fight.wav');

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png',
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png',
    ];

    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 1800;
        this.alarmSound.volume = 0.3;
        this.speed = 2;
        this.animate();
        this.applyGravity();
        this.offsetHeight = 300;
        this.offsetWidth = 260;
        this.offsetX = 40;
        this.offsetY = 80;
    }

    applyGravity() {
        setInterval(() => {
            if (this.y < 55 || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    animate() {
        setInterval(() => {
            if (this.isDead) return;

            if (!this.isActivated) {
                this.playAnimation(this.IMAGES_ALERT, 2);
            } else if (this.isHurt) {
                this.playAnimation(this.IMAGES_HURT, 2);
            } else if (this.isAttacking) {
                this.playAnimation(this.IMAGES_ATTACK, 2);
            } else if (this.isActivated && !this.hasStartedMoving) {
                return;
            } else {
                this.playAnimation(this.IMAGES_WALKING, 2);
                if (this.world.character.x < this.x) {
                    this.otherDirection = false; // 🔄 Schaut nach links
                    this.moveLeft();
                } else {
                    this.otherDirection = true; // 🔄 Schaut nach rechts
                    this.moveRight();
                }
            }
        }, 170);
    }

    checkActivation(characterX) {
        if (characterX > 1400 && !this.isActivated) {
            console.log("🚨 Endboss ist alarmiert!");
            this.isActivated = true;
            levelMusic.pause();
            this.alarmSound.play();
            this.alarmSound.onended = () => {
                console.log("🎵 Level-Musik wird fortgesetzt...");
                levelMusic.play();
            };
        }
    }

    startAlertSequence() {
        levelMusic.pause();
        this.alarmSound.play();
        this.world.character.isFrozen = true;
        let alertIndex = 0;
        let alertInterval = setInterval(() => {
            if (alertIndex < this.IMAGES_ALERT.length) {
                this.img = this.imageCache[this.IMAGES_ALERT[alertIndex]];
                alertIndex++;
            } else {
                clearInterval(alertInterval);
            }
        }, 400);

        this.alarmSound.onended = () => {
            console.log("🎵 Level-Musik wird fortgesetzt...");
            levelMusic.play();
            this.world.character.isFrozen = false;
            this.hasStartedMoving = true;
            this.startAttackSequence();
        };
    }

    takeDamage(amount) {
        if (this.isHurt || this.energy === 0) return;
        this.energy = Math.max(0, this.energy - amount);
        this.lastHit = Date.now();
        this.isHurt = true;
        this.isAttacking = false;
        this.speed = 0;
        this.world.statusBarEndboss.setPercentage(this.energy);
        this.playAnimation(this.IMAGES_HURT, 1);
        setTimeout(() => {
            this.isHurt = false;
            if (this.energy > 0) {
                this.startAttackSequence();
            } else {
                this.die();
            }
        }, 1000);
    }

    startAttackSequence() {
        if (this.isDead || this.isAttacking) return;
        this.isAttacking = true;
        this.speed = 0; 
        this.speedY = this.attackJumpHeight; 
        this.speed = this.attackSpeed; 
        if (this.world.character.x < this.x) {
            this.otherDirection = false;
        } else {
            this.otherDirection = true;
        }
        this.playAnimation(this.IMAGES_ATTACK, 1);
        let attackStartX = this.x;
        let attackInterval = setInterval(() => {
            if (this.otherDirection) {
                this.x += this.speed; 
            } else {
                this.x -= this.speed;
            }
    
            if (Math.abs(this.x - attackStartX) > this.attackDistance) {
                clearInterval(attackInterval);
                this.stopAttack();
            }
        }, 2000 / 60);
    }

    stopAttack() {
        console.log("⏹️ Endboss beendet Angriff.");
        this.isAttacking = false;
        this.speed = 2;
        this.playAnimation(this.IMAGES_WALKING, 2);
    }

    die() {
        if (this.isDead) return; 
        console.log("☠️ Der Endboss ist besiegt!");
        this.isDead = true;
        this.speed = 0; 
        let deathIndex = 0;
        let deathInterval = setInterval(() => {
            if (deathIndex < this.IMAGES_DEAD.length) {
                this.img = this.imageCache[this.IMAGES_DEAD[deathIndex]]; 
                deathIndex++;
            } else {
                clearInterval(deathInterval); 
            }
        }, 400);
        this.world.freezeGame(); 
        setTimeout(() => {
            this.world.showWinMenu(); 
        }, 2000);
    }
}