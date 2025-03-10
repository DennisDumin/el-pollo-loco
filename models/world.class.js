class World {
    character;
    level = level1;
    keyboard;
    canvas;
    ctx;
    camera_x = 0;
    collectSound = new Audio('audio/bottle.mp3');
    statusBarHealth = new StatusBarHealth();
    statusBarCoin = new StatusBarCoin();
    statusBarBottle = new StatusBarBottle();
    statusBarEndboss = new StatusBarEndboss();
    throwableObjects = [];
    winSound = new Audio('audio/win.ogg');

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.collectSound.volume = 0.3;
        this.winSound.volume = 0.5;
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.character = new Character(this);
        this.draw();
        this.setWorld();
        this.statusBarEndboss.visible = false;
        this.run();
        this.endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
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
        this.gameLoop = setGameInterval(() => {
            this.checkCollisionWithCoin();
            this.checkThrowableObjects();
            this.checkCollisionWithBottle();
            this.checkEnemyCollisions();
            this.checkEndbossActivation();
        }, 1000 / 60);
    }

    checkEndbossActivation() {
        let endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        if (endboss && this.character.x > 3700 && !endboss.isActivated) {
            endboss.isActivated = true;
            endboss.startAlertSequence();
            this.statusBarEndboss.setPercentage(100);
            this.statusBarEndboss.visible = true;
            this.character.isFrozen = true;
        }
    }

    checkThrowableObjects() {
        let now = Date.now();
        let throwCooldown = 2000;
        if (this.character.isFrozen) {
            return;
        }

        if (this.keyboard.THROW && now - this.character.lastThrowTime >= throwCooldown) {
            if (this.character.bottlesCollected > 0) {
                let bottleX = this.character.otherDirection ? this.character.x - 20 : this.character.x + 100;
                let bottleDirection = this.character.otherDirection ? -1 : 1;
                let bottle = new ThrowableObject(bottleX, this.character.y + 10, bottleDirection);
                this.throwableObjects.push(bottle);
                this.character.lastThrowTime = now;
                this.character.bottlesCollected--;
                this.statusBarBottle.removeBottle();
            }
        }
    }

    checkCollisionWithBottle() {
        this.level.bottles.forEach((bottle) => {
            if (this.character.isColliding(bottle)) {
                this.handleBottlePickup(bottle);
            }
        });
    }

    checkCollisionWithCoin() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.handleCoinPickup(coin, index);
            }
        });
    }

    handleBottlePickup(bottle) {
        if (this.character.bottlesCollected < 10) {
            bottle.pickUpBottle();
            this.character.bottlesCollected++;
            this.statusBarBottle.addBottles(this.character.bottlesCollected);
        }
    }

    handleCoinPickup(coin, index) {
        coin.collect();
        this.level.coins.splice(index, 1);
        this.statusBarCoin.addCoins(1);
        if (this.statusBarCoin.currentCoins >= 5) {
            this.character.bottlesCollected++;
            this.statusBarBottle.addBottles();
            this.collectSound.play();
            this.statusBarCoin.currentCoins = 0;
            this.statusBarCoin.setPercentage(0);
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

                    if (enemy instanceof Endboss) {
                        this.character.hit();
                        this.statusBarHealth.setPercentage(this.character.energy);
                    } else {
                        this.character.hit();
                        this.statusBarHealth.setPercentage(this.character.energy);
                    }
                }
            });
        }
    }

    handleEndbossHit(bottle, bottleIndex, endboss) {
        if (!endboss.isDead && this.throwableObjects[bottleIndex] && !bottle.collisionDetected) {
            bottle.collisionDetected = true;
    
            if (Date.now() - endboss.lastHit > 500) {
                endboss.takeDamage(20);
                this.statusBarEndboss.setPercentage(endboss.energy);
                endboss.lastHit = Date.now();
            }
            bottle.stopMotion();
            bottle.playSplashAnimation(() => {
                let index = this.throwableObjects.indexOf(bottle);
                if (index > -1) {
                    this.throwableObjects.splice(index, 1);
                }
            });
            if (endboss.energy <= 0) {
                endboss.die();
            }
        }
    }

    checkJumpOnEnemy() {
        let enemiesToDefeat = [];
        this.level.enemies.forEach((enemy) => {
            if (!enemy.isDead && this.isJumpingOnEnemy(enemy)) {
                enemiesToDefeat.push(enemy);
            }
        });
        if (enemiesToDefeat.length > 0) {
            enemiesToDefeat.forEach(enemy => {
                enemy.hit();
                enemy.stopMotion();
            });
            this.character.speedY = 20;
        }
    }
    
    isJumpingOnEnemy(enemy) {
        let characterBottom = this.character.y + this.character.height;
        let enemyTop = enemy.y;
        let jumpThreshold = enemy instanceof ChickenTiny ? enemy.height * 0.4 : enemy.height * 0.6;
        return (
            this.character.speedY < 0 && 
            characterBottom >= enemyTop && 
            characterBottom <= enemyTop + jumpThreshold && 
            this.character.x + this.character.width >= enemy.x && 
            this.character.x <= enemy.x + enemy.width
        );
    }

    handleChickenHit(bottle, bottleIndex, chicken) {
        if (!chicken.isDead) {
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

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundLayer);
        this.addObjectsToMap(this.level.clouds);
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBarHealth);
        this.ctx.translate(this.camera_x, 0);
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBarCoin);
        this.ctx.translate(this.camera_x, 0);
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBarBottle);
        this.ctx.translate(this.camera_x, 0);
        if (this.statusBarEndboss.visible) {
            this.ctx.translate(-this.camera_x, 0);
            this.addToMap(this.statusBarEndboss);
            this.ctx.translate(this.camera_x, 0);
        }
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.bottles);
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

    showWinMenu() {
        levelMusic.pause();
        levelMusic.currentTime = 0; 
        this.winSound.play(); 
        let winScreen = document.createElement('div');
        winScreen.id = "win-menu";
        winScreen.innerHTML = `
            <img src="img/9_intro_outro_screens/win/win_1.png" alt="You Win!" class="win-image">
            <button onclick="restartGame()" class="win-button">New Game</button>
            <button onclick="goToMenu()" class="win-button">Menu</button>
        `;
    
        document.body.appendChild(winScreen);
    }

    freezeGame() {
        this.character.isFrozen = true;
        this.level.enemies.forEach(enemy => enemy.speed = 0);
        this.throwableObjects = [];
    }
    
}
