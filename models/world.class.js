class World {
    character;
    backgroundLayer = [];
    enemies = [new Chicken(), new Chicken(), new Chicken()];
    clouds = [new Cloud()];
    keyboard;
    canvas;
    ctx;
    camera_x = 0;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.character = new Character(this);
        this.generateBackground();
        this.draw();
        this.setWorld();
    }

    setWorld() {
        this.character.world = this;
    }

    generateBackground() {
        const numRepetitions = 10;
        for (let i = -2; i < numRepetitions; i++) {
            let xOffset = 1438 * i;
            this.backgroundLayer.push(new BackgroundObject('img/5_background/layers/air.png', xOffset, 0));
            this.backgroundLayer.push(new BackgroundObject('img/5_background/layers/3_third_layer/1.png', xOffset, 75));
            this.backgroundLayer.push(new BackgroundObject('img/5_background/layers/2_second_layer/1.png', xOffset, 75));
            this.backgroundLayer.push(new BackgroundObject('img/5_background/layers/1_first_layer/1.png', xOffset, 75));
            this.backgroundLayer.push(new BackgroundObject('img/5_background/layers/air.png', xOffset + 719, 0));
            this.backgroundLayer.push(new BackgroundObject('img/5_background/layers/3_third_layer/2.png', xOffset + 719, 75));
            this.backgroundLayer.push(new BackgroundObject('img/5_background/layers/2_second_layer/2.png', xOffset + 719, 75));
            this.backgroundLayer.push(new BackgroundObject('img/5_background/layers/1_first_layer/2.png', xOffset + 719, 75));
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.backgroundLayer);
        this.addObjectsToMap(this.enemies);
        this.addObjectsToMap(this.clouds);
        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0);
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.ctx.save();
            this.ctx.translate(mo.width, 0);
            this.ctx.scale(-1, 1);
            mo.x = mo.x * -1;
        }

        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);

        if (mo.otherDirection) {
            mo.x = mo.x * -1;
            this.ctx.restore();
        }
    }
}
