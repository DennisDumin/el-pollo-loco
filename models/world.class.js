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
    statusBarEndboss = new StatusBarEndboss();
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
            if (this.character.bottlesCollected > 0) {
                let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 10);
                this.throwableObjects.push(bottle);
                this.character.lastThrowTime = now;
                this.character.idleTime = null;
                this.character.bottlesCollected--;
                this.statusBarBottle.removeBottle();
            }
        };
    }


    checkCollisionWithBottle() {
        console.log("🔍 checkCollisionWithBottle() läuft...");
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                console.log("✅ Charakter berührt Flasche!", bottle);
                this.handleBottlePickup(bottle, index);
            }
        });
    }

    checkCollisionWithCoin() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                console.log("✅ Charakter sammelt Coin!", coin);
                this.handleCoinPickup(coin, index);
            }
        });
    }

    handleBottlePickup(bottle, index) {
        bottle.pickUpBottle();
        this.level.bottles.splice(index, 1);
        this.character.bottlesCollected++;
        this.statusBarBottle.addBottles(this.character.bottlesCollected);
    }

    handleCoinPickup(coin, index) {
        coin.collect();
        this.level.coins.splice(index, 1);
        this.statusBarCoin.addCoins(1);
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
                    
                    if (enemy instanceof Endboss) {
                        console.log("⚔️ Charakter berührt den Endboss!");
                        this.character.hit(); 
                        this.statusBarHealth.setPercentage(this.character.energy);
                    } else {
                        console.log("💥 Charakter nimmt Schaden von einem Gegner!");
                        this.character.hit();
                        this.statusBarHealth.setPercentage(this.character.energy);
                    }
                }
            });
        }
    }

    handleEndbossHit(bottle, bottleIndex, endboss) {
        if (!endboss.isDead && this.throwableObjects[bottleIndex] && !bottle.collisionDetected) {  
            console.log("💀 Flasche trifft Endboss!");
            bottle.collisionDetected = true;  
            if (Date.now() - endboss.lastHit > 500) {
                endboss.takeDamage(20);
                this.statusBarEndboss.setPercentage(endboss.energy);
                endboss.lastHit = Date.now(); 
            } else {
                console.log("🛡️ Endboss hat noch Cooldown, kein weiterer Schaden!");
            }
    
            this.throwableObjects[bottleIndex].stopMotion();
            this.throwableObjects[bottleIndex].playSplashAnimation();
            
            setTimeout(() => {
                this.throwableObjects.splice(bottleIndex, 1);
                console.log("🧴 Flasche entfernt nach Treffer!");
            }, 100);
            
            if (endboss.energy <= 0) {
                endboss.die();
                console.log("🎉 Endboss wurde besiegt!");
            }
        }
    }

    checkJumpOnEnemy() {
        let jumpedOnEnemy = false;
        this.level.enemies.forEach((enemy) => {
            if (!enemy.isDead && this.isJumpingOnEnemy(enemy) && this.character.isColliding(enemy)) {
                if (enemy instanceof Chicken || enemy instanceof ChickenTiny) {
                    console.log(`🐔 Charakter springt auf ${enemy instanceof ChickenTiny ? "Tiny Chicken" : "Chicken"}!`);
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
        this.addToMap(this.statusBarEndboss);
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
