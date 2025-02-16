class MovableObject extends DrawableObject {
    speed = 0.15;
    speedY = 0;
    acceleration = 2.5;
    otherDirection = false;
    offsetX = 0;
    offsetY = 0;
    offsetWidth = 0;
    offsetHeight = 0;
    energy = 100;
    lastHit = 0;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    hit() {
        this.energy = Math.max(0, this.energy - 10);
        this.lastHit = Date.now();
    }

    isHurt() {
        return (Date.now() - this.lastHit) / 1000 < 1;
    }

    isDead() {
        return this.energy == 0;
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 185
        }
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    jump() {
        this.speedY = 25;
    }

    isColliding(mo) {
        const { x, y, width, height } = this.getHitbox();
        const { x: otherX, y: otherY, width: otherWidth, height: otherHeight } = mo.getHitbox();

        return (
            x + width >= otherX &&
            x <= otherX + otherWidth &&
            y + height >= otherY &&
            y <= otherY + otherHeight
        );
    }

    getHitbox() {
        return {
            x: this.x + this.offsetX,
            y: this.y + this.offsetY,
            width: this.offsetWidth,
            height: this.offsetHeight
        };
    }
}