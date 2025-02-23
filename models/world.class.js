class World {
    character;
    level = level1;
    keyboard;
    canvas;
    ctx;
    camera_x = 0;
    statusBarHealth = new StatusBarHealth();
    statusBarCoin = new StatusBarCoin();
    statusBarBottle = new StatusBarBottle();
    throwableObjects = [];

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.character = new Character(this);
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Endboss) {
                enemy.world = this;
                enemy.character = this.character;
                enemy.animate();
            }
        });
    }

    run() {
        setInterval(() => {
            this.checkCollisionWithCoin();
            this.checkThrowableObjects();
            this.checkCollisionWithBottle();
            this.checkEnemyCollisions();
        }, 1000 / 60);
    }

    checkThrowableObjects() {
        let now = Date.now();
        let throwCooldown = 2000;

        if (this.keyboard.THROW && now - this.character.lastThrowTime >= throwCooldown) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 10);
            this.throwableObjects.push(bottle);
            this.character.lastThrowTime = now;
            this.character.idleTime = null;
        }
    }

    checkCollisionWithCoin() {
        this.level.coins.forEach((coin, index) => {
            if (coin instanceof Coin && this.character.isColliding(coin)) {
                console.log("✅ Charakter sammelt Coin!", coin);
                this.handleCoinPickup(coin, index);
            }
        });
    }

    checkCollisionWithBottle() {
        this.level.bottles.forEach((bottle, index) => {
            if (bottle instanceof Bottle && this.character.isColliding(bottle)) {
                console.log("✅ Charakter berührt Flasche!", bottle);
                this.handleBottlePickup(bottle, index);
            }
        });
    }

    handleBottlePickup(bottle, index) {
        if (bottle instanceof Bottle) {
            console.log("🥤 Flasche wird gesammelt: ", bottle);
            bottle.pickUpBottle();
            this.level.bottles.splice(index, 1);
            this.statusBarBottle.addBottles(1);
        } else {
            console.error("❌ Fehler: `bottle` ist kein Bottle-Objekt!", bottle);
        }
    }

    checkEnemyCollisions() {
        this.throwableObjects.forEach((bottle, bottleIndex) => {
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy)) {
                    if (enemy instanceof Endboss) {
                        this.handleEndbossHit(bottle, bottleIndex, enemy);
                    } else {
                        this.handleChickenHit(bottle, bottleIndex, enemy);
                    }
                }
            });
        });

        let jumpedOnEnemy = this.checkJumpOnEnemy();

        if (!jumpedOnEnemy) {
            this.level.enemies.forEach((enemy) => {
                if (!enemy.isDead && this.character.isColliding(enemy) && !this.character.isHurt() && !this.isJumpingOnEnemy(enemy)) {
                    console.log("💥 Charakter nimmt Schaden von einem Gegner!");
                    this.character.hit();
                    this.statusBarHealth.setPercentage(this.character.energy);
                }
            });
        }
    }

    handleCoinPickup(coin, index) {
        if (coin instanceof Coin) {
            console.log("🪙 Coin wird gesammelt: ", coin);
            coin.collect();
            this.level.coins.splice(index, 1);
            this.statusBarCoin.addCoins(1);
        } else {
            console.error("❌ Fehler: `coin` ist kein Coin-Objekt!", coin);
        }
    }

    checkJumpOnEnemy() {
        let jumpedOnEnemy = false;
        this.level.enemies.forEach((enemy) => {
            if (!enemy.isDead && this.isJumpingOnEnemy(enemy) && this.character.isColliding(enemy)) {
                if (enemy instanceof Chicken) {
                    console.log("🐔 Charakter springt auf Chicken!");
                    enemy.hit();
                    enemy.stopMotion();
                    this.character.speedY = 20;
                    jumpedOnEnemy = true;
                }
            }
        });
        return jumpedOnEnemy;
    }

    isJumpingOnEnemy(enemy) {
        return this.character.y + this.character.height >= enemy.y &&
            this.character.y + this.character.height <= enemy.y + enemy.height / 2 &&
            this.character.speedY < 0;
    }


    handleChickenHit(bottle, bottleIndex, chicken) {
        if (!chicken.isDead) {
            console.log("🔥 Flasche trifft Chicken!");
            chicken.hit();
            chicken.stopMotion();
            chicken.showDeathAnimation();

            this.throwableObjects[bottleIndex].stopMotion();
            this.throwableObjects[bottleIndex].playSplashAnimation();

            setTimeout(() => {
                this.throwableObjects.splice(bottleIndex, 1);
            }, 500);
        }
    }

    handleEndbossHit(bottle, bottleIndex, endboss) {
        if (!endboss.isDead) {
            console.log("💀 Flasche trifft Endboss!");
            endboss.takeDamage(20);
            this.throwableObjects[bottleIndex].stopMotion();
            this.throwableObjects[bottleIndex].playSplashAnimation();

            if (endboss.energy <= 0) {
                endboss.die();
            }

            setTimeout(() => {
                this.throwableObjects.splice(bottleIndex, 1);
            }, 500);
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundLayer);
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBarHealth);
        this.ctx.translate(this.camera_x, 0);
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBarCoin);
        this.ctx.translate(this.camera_x, 0);
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBarBottle);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0);
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        if (!objects || !Array.isArray(objects)) {
            console.warn('addObjectsToMap: objects is undefined or not an array', objects);
            return;
        }
    
        objects.forEach(o => {
            if (!o || !o.img || !o.img.src) {
                console.warn('Skipping invalid object in addObjectsToMap:', o);
                return;
            }
    
            try {
                this.addToMap(o);
            } catch (error) {
                console.warn('Error loading image:', error);
            }
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}
