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
    audioManager = AudioManager.getInstance();

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
        this.x = 4000;
        this.speed = 16;
        this.animate();
        this.applyGravity();
        this.offsetHeight = 300;
        this.offsetWidth = 260;
        this.offsetX = 40;
        this.offsetY = 80;
    }

    applyGravity() {
        this.gravityInterval = setGameInterval(() => {
            if (this.y < 55 || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    animate() {
        this.animationInterval = setGameInterval(() => {
            if (this.isDead) return;
            if (!this.isActivated) {
                this.playAnimation(this.IMAGES_ALERT, 2);
            } else if (this.isHurt) {
                this.playAnimation(this.IMAGES_HURT, 1);
            } else if (this.isAttacking) {
                this.playAnimation(this.IMAGES_ATTACK, 1);
            } else if (this.isActivated && !this.hasStartedMoving) {
                return;
            } else {
                this.playAnimation(this.IMAGES_WALKING, 1);
                if (this.world.character.x < this.x) {
                    this.otherDirection = false;
                    this.moveLeft();
                } else {
                    this.otherDirection = true;
                    this.moveRight();
                }
            }
        }, 170);
    }

    checkActivation(characterX) {
        if (characterX > 3700 && !this.isActivated) {
            this.isActivated = true;
            this.audioManager.stopSound('audio/music.mp3');
            this.audioManager.playSound('audio/fight.wav', false, 0.3).then(() => {
                this.audioManager.playSound('audio/music.mp3', true, 0.3);
            });
        }
    }

    startAlertSequence() {
        this.pauseLevelMusic();
        this.world.character.isFrozen = true;
        const fightAudio = this.prepareAlertAudio();
        this.setupAlertAnimation(fightAudio);
        this.setupAudioEndHandling(fightAudio);
        this.playFightAudio(fightAudio);
    }
    
    pauseLevelMusic() {
        const levelAudio = this.audioManager.getAudio('audio/music.mp3');
        levelAudio.pause();
    }
    
    prepareAlertAudio() {
        const fightAudio = new Audio('audio/fight.wav');
        fightAudio.volume = 0.3;
        fightAudio.currentTime = 0;
        return fightAudio;
    }
    
    setupAlertAnimation(fightAudio) {
        if (this.alertInterval) clearInterval(this.alertInterval);
        this.startStandardAnimation();
        this.setupAnimationTiming(fightAudio);
    }
    
    startStandardAnimation() {
        const estimatedDuration = 6500;
        const totalFrames = this.IMAGES_ALERT.length;
        const frameTime = Math.floor(estimatedDuration / totalFrames);
        
        this.startAnimationSequence(frameTime);
    }
    
    startAnimationSequence(frameTime) {
        let alertIndex = 0;
        this.alertInterval = setGameInterval(() => {
            if (alertIndex < this.IMAGES_ALERT.length) {
                this.img = this.imageCache[this.IMAGES_ALERT[alertIndex]];
                alertIndex++;
            }
        }, frameTime);
    }
    
    setupAnimationTiming(fightAudio) {
        fightAudio.addEventListener('loadedmetadata', () => {
            this.adjustAnimationTiming(fightAudio.duration * 1000);
        }, {once: true});
    }
    
    adjustAnimationTiming(actualDuration) {
        const estimatedDuration = 6500;
        if (Math.abs(actualDuration - estimatedDuration) > 1000) {
            this.restartAnimation(actualDuration);
        }
    }
    
    restartAnimation(duration) {
        clearInterval(this.alertInterval);
        const frameTime = Math.floor(duration / this.IMAGES_ALERT.length);
        this.startAnimationSequence(frameTime);
    }
    
    setupAudioEndHandling(fightAudio) {
        fightAudio.onended = () => {
            this.endAlertPhase();
        };
    }
    
    endAlertPhase() {
        clearInterval(this.alertInterval);
        this.resumeLevelMusic();
        this.world.character.isFrozen = false;
        this.hasStartedMoving = true;
        this.startAttackSequence();
    }
    
    resumeLevelMusic() {
        const levelAudio = this.audioManager.getAudio('audio/music.mp3');
        levelAudio.play().catch(err => {
            console.warn("Error resuming level music:", err);
            this.audioManager.playSound('audio/music.mp3', true, 0.3);
        });
    }
    
    playFightAudio(fightAudio) {
        const playPromise = fightAudio.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(err => {
                console.error("Error playing fight audio:", err);
                this.endAlertPhase();
            });
        }
    }

    takeDamage(amount) {
                if(this.isHurt || this.energy === 0) return;
            this.energy = Math.max(0, this.energy - amount);
            this.lastHit = Date.now();
            this.isHurt = true;
            this.isAttacking = false;
            this.speed = 0;
            clearInterval(this.animationInterval);
            this.world.statusBarEndboss.setPercentage(this.energy);
            clearInterval(this.attackInterval);
            this.playAnimation(this.IMAGES_HURT, 0.5);
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
            if(this.isDead || this.isAttacking || this.isHurt) return;
        clearInterval(this.animationInterval);
        this.isAttacking = true;
        this.speed = 0;
        this.speedY = this.attackJumpHeight;
        this.speed = this.attackSpeed;
        if (this.world.character.x < this.x) {
            this.otherDirection = false;
        } else {
            this.otherDirection = true;
        }
        this.playAnimation(this.IMAGES_ATTACK, 2);
        let attackStartX = this.x;
        this.attackInterval = setGameInterval(() => {
            if (this.otherDirection) {
                this.x += this.speed;
            } else {
                this.x -= this.speed;
            }
            if (Math.abs(this.x - attackStartX) > this.attackDistance) {
                clearInterval(this.attackInterval);
                this.stopAttack();
            }
        }, 2000 / 60);
    }

    stopAttack() {
        this.isAttacking = false;
        this.speed = 12;
    }

    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.speed = 0;
        this.stopMotion();
        clearInterval(this.attackInterval);
        clearInterval(this.animationInterval);
        let deathIndex = 0;
        this.deathInterval = setGameInterval(() => {
            if (deathIndex < this.IMAGES_DEAD.length) {
                this.img = this.imageCache[this.IMAGES_DEAD[deathIndex]];
                deathIndex++;
            } else {
                clearInterval(this.deathInterval);
            }
        }, 400);
        this.world.freezeGame();
        setTimeout(() => {
            this.world.showWinMenu();
        }, 2000);
    }
}