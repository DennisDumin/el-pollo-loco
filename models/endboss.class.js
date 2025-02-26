class Endboss extends MovableObject {
    height = 400;
    width = 350;
    y = 55;
    energy = 100;
    isDead = false;
    lastHit = 0;

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.x = 350;
        this.animate();
        this.offsetHeight = 300;
        this.offsetWidth = 260;
        this.offsetX = 40;
        this.offsetY = 80;
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_ALERT, 2);
        }, 170);
    }
    takeDamage(amount) {
        let now = Date.now();
    
        if (!this.isDead && now - this.lastHit > 500) {  
            this.energy = Math.max(0, this.energy - amount);
            this.lastHit = now;
    
            console.log(`🔥 Endboss getroffen! Verbleibende HP: ${this.energy}`);
    
            if (this.energy === 0) {
                this.die();
            }
        } else {
            console.log("🛡️ Endboss hat noch Cooldown, kein weiterer Schaden!");
        }
    }

    die() {
        console.log("☠️ Der Endboss ist besiegt!");
        this.isDead = true;
        this.playDeathAnimation();
    }

    playDeathAnimation() {
        console.log("💀 Endboss stirbt und verschwindet...");
    }
}
