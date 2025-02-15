class MovableObject {
    x = 120;
    y = 280;
    img;
    height = 150;
    width = 100;
    imageCache = {};
    currentImage = 0;
    speed = 0.15;
    speedY = 0;
    acceleration = 2.5;
    otherDirection = false;
    offsetX = 0;
    offsetY = 0;
    offsetWidth = 0;
    offsetHeight = 0;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
            const { x, y, width, height } = this.getHitbox(); 
    
            ctx.beginPath();
            ctx.lineWidth = 2; 
            ctx.strokeStyle = 'red'; 
            ctx.rect(x, y, width, height); 
            ctx.stroke();
        }
    }

    isAboveGround() {
        return this.y < 185
    }

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    playAnimation(images) {
        let i = this.currentImage % this.IMAGES_WALKING.length;
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