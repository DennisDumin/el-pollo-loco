class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 280;
    height = 150;
    width = 100;

    /**
     * Loads a single image
     * @param {string} path - Path to the image
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Loads multiple images into the cache
     * @param {Array} arr - Array of image paths
     */
    loadImages(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draws the object on the canvas
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Draws the entire game world
     * @param {World} world - The game world
     */
    static drawWorld(world) {
        DrawableObject.clearCanvas(world);
        DrawableObject.drawBackgroundElements(world);
        DrawableObject.drawStatusBars(world);
        DrawableObject.drawGameElements(world);
        DrawableObject.requestNextFrame(world);
    }

    /**
     * Clears the canvas
     * @param {World} world - The game world
     */
    static clearCanvas(world) {
        world.ctx.clearRect(0, 0, world.canvas.width, world.canvas.height);
    }

    /**
     * Draws the background elements
     * @param {World} world - The game world
     */
    static drawBackgroundElements(world) {
        world.ctx.translate(world.camera_x, 0);
        DrawableObject.addObjectsToMap(world.level.backgroundLayer, world);
        DrawableObject.addObjectsToMap(world.level.clouds, world);
        world.ctx.translate(-world.camera_x, 0);
    }

    /**
     * Draws all status bars
     * @param {World} world - The game world
     */
    static drawStatusBars(world) {
        DrawableObject.drawHealthBar(world);
        DrawableObject.drawCoinBar(world);
        DrawableObject.drawBottleBar(world);
        DrawableObject.drawEndbossBarIfVisible(world);
    }

    /**
     * Draws the health bar
     * @param {World} world - The game world
     */
    static drawHealthBar(world) {
        DrawableObject.addToMap(world.statusBarHealth, world);
        world.ctx.translate(world.camera_x, 0);
        world.ctx.translate(-world.camera_x, 0);
    }

    /**
     * Draws the coin bar
     * @param {World} world - The game world
     */
    static drawCoinBar(world) {
        DrawableObject.addToMap(world.statusBarCoin, world);
        world.ctx.translate(world.camera_x, 0);
        world.ctx.translate(-world.camera_x, 0);
    }

    /**
     * Draws the bottle bar
     * @param {World} world - The game world
     */
    static drawBottleBar(world) {
        DrawableObject.addToMap(world.statusBarBottle, world);
        world.ctx.translate(world.camera_x, 0);
    }

    /**
     * Draws the endboss status bar if visible
     * @param {World} world - The game world
     */
    static drawEndbossBarIfVisible(world) {
        if (world.statusBarEndboss.visible) {
            world.ctx.translate(-world.camera_x, 0);
            DrawableObject.addToMap(world.statusBarEndboss, world);
            world.ctx.translate(world.camera_x, 0);
        }
    }

    /**
     * Draws all game elements
     * @param {World} world - The game world
     */
    static drawGameElements(world) {
        DrawableObject.addObjectsToMap(world.level.enemies, world);
        DrawableObject.addObjectsToMap(world.level.bottles, world);
        DrawableObject.addObjectsToMap(world.level.coins, world);
        DrawableObject.addObjectsToMap(world.throwableObjects, world);
        DrawableObject.addToMap(world.character, world);
        world.ctx.translate(-world.camera_x, 0);
    }

    /**
     * Requests the next animation frame
     * @param {World} world - The game world
     */
    static requestNextFrame(world) {
        requestAnimationFrame(() => {
            DrawableObject.drawWorld(world);
        });
    }

    /**
     * Adds multiple objects to the map
     * @param {Array} objects - Array of objects
     * @param {World} world - The game world
     */
    static addObjectsToMap(objects, world) {
        if (!objects || !Array.isArray(objects)) {
            return;
        }
        objects.forEach(o => {
            if (!o || !o.img || !o.img.src) {
                return;
            }

            try {
                DrawableObject.addToMap(o, world);
            } catch (error) {
            }
        });
    }

    /**
     * Adds a single object to the map
     * @param {Object} mo - The object to add to the map
     * @param {World} world - The game world
     */
    static addToMap(mo, world) {
        if (mo.otherDirection) {
            DrawableObject.flipImage(mo, world);
        }
        mo.draw(world.ctx);
        if (mo.otherDirection) {
            DrawableObject.flipImageBack(mo, world);
        }
    }

    /**
     * Flips an image horizontally for left-facing objects
     * @param {Object} mo - The object to flip
     * @param {World} world - The game world
     */
    static flipImage(mo, world) {
        world.ctx.save();
        world.ctx.translate(mo.width, 0);
        world.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores an image after flipping
     * @param {Object} mo - The flipped object
     * @param {World} world - The game world
     */
    static flipImageBack(mo, world) {
        mo.x = mo.x * -1;
        world.ctx.restore();
    }
}