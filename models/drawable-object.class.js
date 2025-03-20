class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 280;
    height = 150;
    width = 100;

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

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof ChickenTiny || this instanceof Endboss || this instanceof ThrowableObject || this instanceof Bottle) {
            const { x, y, width, height } = this.getHitbox();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'red';
            ctx.rect(x, y, width, height);
            ctx.stroke();
        }
    }
}