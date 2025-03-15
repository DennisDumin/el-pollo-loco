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
    audioManager = AudioManager.getInstance();
    gameWon = false;

    /**
     * Creates a new game world
     * @param {HTMLCanvasElement} canvas - The game canvas
     * @param {Object} keyboard - The keyboard input handler
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.character = new Character(this);
        this.draw();
        this.setWorld();
        this.statusBarEndboss.visible = false;
        this.run();
        this.endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
    }

    /**
     * Sets world references for character and enemies
     */
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

    /**
     * Starts the game loop with collision checks
     */
    run() {
        this.gameLoop = setGameInterval(() => {
            this.checkCollisionWithCoin();
            this.checkThrowableObjects();
            this.checkCollisionWithBottle();
            this.checkEnemyCollisions();
            this.checkEndbossActivation();
        }, 1000 / 60);
    }

    /**
     * Checks if the endboss should be activated based on character position
     */
    checkEndbossActivation() {
        let endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        if (endboss && this.character.x > 3700 && !endboss.isActivated) {
            endboss.isActivated = true;
            endboss.startAlertSequence();
            this.statusBarEndboss.setPercentage(100);
            this.statusBarEndboss.visible = true;
            this.character.stopWalkSound();
            this.character.isFrozen = true;
        }
    }

    /**
     * Checks if the player can throw a bottle and handles the throw
     */
    checkThrowableObjects() {
        const now = Date.now();
        const throwCooldown = 2000;
        if (this.character.isFrozen) {
            return;
        }
        if (this.canThrowBottle(now, throwCooldown)) {
            this.createAndThrowBottle(now);
        }
    }

    /**
     * Checks if conditions for throwing a bottle are met
     * @param {number} now - Current time in milliseconds
     * @param {number} cooldown - Cooldown time between throws
     * @returns {boolean} Whether the player can throw a bottle
     */
    canThrowBottle(now, cooldown) {
        return this.keyboard.THROW &&
            now - this.character.lastThrowTime >= cooldown &&
            this.character.bottlesCollected > 0;
    }

    /**
     * Creates and throws a bottle
     * @param {number} now - Current time in milliseconds
     */
    createAndThrowBottle(now) {
        const bottleX = this.character.otherDirection ?
            this.character.x - 20 : this.character.x + 100;
        const bottleDirection = this.character.otherDirection ? -1 : 1;
        const bottle = new ThrowableObject(bottleX, this.character.y + 10, bottleDirection);

        this.throwableObjects.push(bottle);
        this.updateBottleStatus(now);
    }

    /**
     * Updates bottle count and status after throwing
     * @param {number} now - Current time in milliseconds
     */
    updateBottleStatus(now) {
        this.character.lastThrowTime = now;
        this.character.bottlesCollected--;
        this.statusBarBottle.removeBottle();
    }

    /**
     * Checks if character collides with bottles in the level
     */
    checkCollisionWithBottle() {
        this.level.bottles.forEach((bottle) => {
            if (this.character.isColliding(bottle)) {
                this.handleBottlePickup(bottle);
            }
        });
    }

    /**
     * Checks if character collides with coins in the level
     */
    checkCollisionWithCoin() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.handleCoinPickup(coin, index);
            }
        });
    }

    /**
     * Handles the pickup of a bottle by the character
     * @param {Bottle} bottle - The bottle being picked up
     */
    handleBottlePickup(bottle) {
        if (this.character.bottlesCollected < 10) {
            bottle.pickUpBottle();
            this.character.bottlesCollected++;
            this.statusBarBottle.addBottles();
        }
    }

    /**
     * Handles the pickup of a coin by the character
     * @param {Coin} coin - The coin being picked up
     * @param {number} index - Index of the coin in the level array
     */
    handleCoinPickup(coin, index) {
        if (this.statusBarCoin.currentCoins >= 5 && this.statusBarBottle.isMaxReached()) {
            return;
        }
        coin.collect();
        this.level.coins.splice(index, 1);
        this.statusBarCoin.addCoins(1);
        if (this.statusBarCoin.currentCoins >= 5 && !this.statusBarBottle.isMaxReached()) {
            if (this.statusBarBottle.addBottles()) {
                this.character.bottlesCollected++;
                this.audioManager.playOverlappingSound('audio/bottle.mp3');
            }
            this.statusBarCoin.currentCoins = 0;
            this.statusBarCoin.setPercentage(0);
        }
    }

    /**
     * Checks all enemy collisions
     */
    checkEnemyCollisions() {
        this.checkBottleEnemyCollisions();
        const jumpedOnEnemy = this.checkJumpOnEnemy();

        if (!jumpedOnEnemy) {
            this.checkCharacterEnemyDamage();
        }
    }

    /**
     * Checks collisions between thrown bottles and enemies
     */
    checkBottleEnemyCollisions() {
        this.throwableObjects.forEach((bottle, bottleIndex) => {
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy)) {
                    this.handleEnemyBottleCollision(bottle, bottleIndex, enemy);
                }
            });
        });
    }

    /**
     * Handles collision between a bottle and an enemy
     * @param {ThrowableObject} bottle - The bottle that collided
     * @param {number} bottleIndex - Index of the bottle in array
     * @param {MovableObject} enemy - The enemy that was hit
     */
    handleEnemyBottleCollision(bottle, bottleIndex, enemy) {
        if (enemy instanceof Endboss) {
            this.handleEndbossHit(bottle, bottleIndex, enemy);
        } else {
            this.handleChickenHit(bottle, bottleIndex, enemy);
        }
    }

    /**
     * Checks if enemies damage the character
     */
    checkCharacterEnemyDamage() {
        this.level.enemies.forEach((enemy) => {
            if (this.canEnemyDamageCharacter(enemy)) {
                this.applyDamageToCharacter();
            }
        });
    }

    /**
     * Checks if an enemy can damage the character
     * @param {MovableObject} enemy - The enemy to check
     * @returns {boolean} Whether the enemy can damage the character
     */
    canEnemyDamageCharacter(enemy) {
        return !enemy.isDead &&
            this.character.isColliding(enemy) &&
            !this.character.isHurt() &&
            !this.isJumpingOnEnemy(enemy);
    }

    /**
     * Applies damage to the character
     */
    applyDamageToCharacter() {
        this.character.hit();
        this.statusBarHealth.setPercentage(this.character.energy);
    }

    /**
     * Handles the endboss being hit by a bottle
     * @param {ThrowableObject} bottle - The bottle that hit the endboss
     * @param {number} bottleIndex - Index of the bottle in array
     * @param {Endboss} endboss - The endboss that was hit
     */
    handleEndbossHit(bottle, bottleIndex, endboss) {
        if (!this.isValidEndbossHit(bottle, endboss)) {
            return;
        }

        bottle.collisionDetected = true;
        this.applyDamageToEndboss(endboss);
        this.handleBottleAfterHit(bottle);
    }

    /**
     * Checks if the endboss hit is valid
     * @param {ThrowableObject} bottle - The bottle
     * @param {Endboss} endboss - The endboss
     * @returns {boolean} Whether the hit is valid
     */
    isValidEndbossHit(bottle, endboss) {
        return !endboss.isDead &&
            this.throwableObjects.includes(bottle) &&
            !bottle.collisionDetected &&
            Date.now() - endboss.lastHit > 500;
    }

    /**
     * Applies damage to the endboss
     * @param {Endboss} endboss - The endboss to damage
     */
    applyDamageToEndboss(endboss) {
        endboss.takeDamage(20);
        this.statusBarEndboss.setPercentage(endboss.energy);
        endboss.lastHit = Date.now();

        if (endboss.energy <= 0) {
            endboss.die();
        }
    }

    /**
     * Handles the bottle after hitting the endboss
     * @param {ThrowableObject} bottle - The bottle that hit
     */
    handleBottleAfterHit(bottle) {
        bottle.stopMotion();
        bottle.playSplashAnimation(() => {
            this.removeBottleFromWorld(bottle);
        });
    }

    /**
     * Removes a bottle from the world
     * @param {ThrowableObject} bottle - The bottle to remove
     */
    removeBottleFromWorld(bottle) {
        const index = this.throwableObjects.indexOf(bottle);
        if (index > -1) {
            this.throwableObjects.splice(index, 1);
        }
    }

    /**
     * Checks if character is jumping on enemies
     * @returns {boolean} True if an enemy was jumped on
     */
    checkJumpOnEnemy() {
        const enemiesToDefeat = this.findEnemiesBeingJumpedOn();
        if (enemiesToDefeat.length > 0) {
            this.applyJumpEffects(enemiesToDefeat);
            return true;
        }
        return false;
    }

    /**
     * Finds enemies that are being jumped on by the character
     * @returns {Array} List of enemies being jumped on
     */
    findEnemiesBeingJumpedOn() {
        return this.level.enemies.filter(enemy =>
            !enemy.isDead && this.isJumpingOnEnemy(enemy)
        );
    }

    /**
     * Applies effects when jumping on enemies
     * @param {Array} enemies - The enemies being jumped on
     */
    applyJumpEffects(enemies) {
        const isTinyChicken = enemies.some(enemy => enemy instanceof ChickenTiny);
        this.character.speedY = isTinyChicken ? 20 : 20;

        enemies.forEach(enemy => {
            enemy.hit();
            enemy.stopMotion();
        });
    }

    /**
     * Checks if character is jumping on an enemy
     * @param {MovableObject} enemy - The enemy to check
     * @returns {boolean} True if character is jumping on the enemy
     */
    isJumpingOnEnemy(enemy) {
        let characterBottom = this.character.y + this.character.height;
        let enemyTop = enemy.y;
        let { jumpThreshold, extraTolerance } = this.getJumpParameters(enemy);
        return this.checkHorizontalOverlap(enemy, extraTolerance) &&
            this.checkVerticalCollision(characterBottom, enemyTop, jumpThreshold, extraTolerance);
    }

    /**
     * Gets jump parameters based on enemy type
     * @param {MovableObject} enemy - The enemy to check
     * @returns {Object} Jump threshold and tolerance values
     */
    getJumpParameters(enemy) {
        if (enemy instanceof ChickenTiny) {
            return { jumpThreshold: enemy.height * 0.7, extraTolerance: 5 };
        }
        return { jumpThreshold: enemy.height * 0.6, extraTolerance: 0 };
    }

    /**
     * Checks horizontal overlap between character and enemy
     * @param {MovableObject} enemy - The enemy to check
     * @param {number} extraTolerance - Additional tolerance for collision detection
     * @returns {boolean} True if there is horizontal overlap
     */
    checkHorizontalOverlap(enemy, extraTolerance) {
        return this.character.x + this.character.width >= enemy.x + extraTolerance &&
            this.character.x <= enemy.x + enemy.width - extraTolerance;
    }

    /**
     * Checks vertical collision conditions for jumping on an enemy
     * @param {number} characterBottom - Bottom y-position of character
     * @param {number} enemyTop - Top y-position of enemy
     * @param {number} jumpThreshold - Threshold for valid jump collision
     * @param {number} extraTolerance - Additional tolerance for collision detection
     * @returns {boolean} True if vertical collision conditions are met
     */
    checkVerticalCollision(characterBottom, enemyTop, jumpThreshold, extraTolerance) {
        return this.character.speedY < 0 &&
            characterBottom >= enemyTop - extraTolerance &&
            characterBottom <= enemyTop + jumpThreshold + extraTolerance;
    }

    /**
     * Handles chicken being hit by a bottle
     * @param {ThrowableObject} bottle - The bottle that hit the chicken
     * @param {number} bottleIndex - Index of the bottle in array
     * @param {MovableObject} chicken - The chicken that was hit
     */
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

    /**
     * Draws the game world
     */
    draw() {
        this.clearCanvas();
        this.drawBackgroundElements();
        this.drawStatusBars();
        this.drawGameElements();
        this.requestNextFrame();
    }

    /**
     * Clears the canvas
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws background elements
     */
    drawBackgroundElements() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundLayer);
        this.addObjectsToMap(this.level.clouds);
        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Draws all status bars
     */
    drawStatusBars() {
        this.drawHealthBar();
        this.drawCoinBar();
        this.drawBottleBar();
        this.drawEndbossBarIfVisible();
    }

    /**
     * Draws the health status bar
     */
    drawHealthBar() {
        this.addToMap(this.statusBarHealth);
        this.ctx.translate(this.camera_x, 0);
        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Draws the coin status bar
     */
    drawCoinBar() {
        this.addToMap(this.statusBarCoin);
        this.ctx.translate(this.camera_x, 0);
        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Draws the bottle status bar
     */
    drawBottleBar() {
        this.addToMap(this.statusBarBottle);
        this.ctx.translate(this.camera_x, 0);
    }

    /**
     * Draws the endboss status bar if visible
     */
    drawEndbossBarIfVisible() {
        if (this.statusBarEndboss.visible) {
            this.ctx.translate(-this.camera_x, 0);
            this.addToMap(this.statusBarEndboss);
            this.ctx.translate(this.camera_x, 0);
        }
    }

    /**
     * Draws game elements like enemies, items and character
     */
    drawGameElements() {
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Requests the next animation frame
     */
    requestNextFrame() {
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    /**
     * Adds multiple objects to the map
     * @param {Array} objects - Array of objects to add to the map
     */
    addObjectsToMap(objects) {
        if (!objects || !Array.isArray(objects)) {
            return;
        }
        objects.forEach(o => {
            if (!o || !o.img || !o.img.src) {
                return;
            }

            try {
                this.addToMap(o);
            } catch (error) {
            }
        });
    }

    /**
     * Adds a single object to the map
     * @param {Object} mo - The object to add to the map
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Flips an image horizontally for left-facing objects
     * @param {Object} mo - The object to flip
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores an image after flipping
     * @param {Object} mo - The flipped object
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    /**
     * Shows the win menu when the game is completed
     */
    showWinMenu() {
        this.audioManager.stopSound('audio/music.mp3');
        this.audioManager.playSound('audio/win.ogg', false, 0.5);
        this.gameWon = true;
        let winScreen = document.createElement('div');
        winScreen.id = "win-menu";
        winScreen.innerHTML = `
            <img src="img/9_intro_outro_screens/win/win_1.png" alt="You Win!" class="win-image">
            <button onclick="restartGame()" class="win-button">New Game</button>
            <button onclick="goToMenu()" class="win-button">Menu</button>
        `;
        document.body.appendChild(winScreen);
    }

    /**
     * Freezes the game state, stopping all movement
     */
    freezeGame() {
        this.character.isFrozen = true;
        this.level.enemies.forEach(enemy => enemy.speed = 0);
        this.throwableObjects = [];
    }
}