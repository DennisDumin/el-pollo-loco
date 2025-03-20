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
        this.setWorld();
        this.statusBarEndboss.visible = false;
        this.run();
        this.endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        
        // Start drawing with DrawableObject class
        DrawableObject.drawWorld(this);
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
            !this.character.isHurt();
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
     * Checks if the character is jumping on any enemy.
     * If so, it kills those enemies and returns true; otherwise false.
     * @returns {boolean} - True if the character jumped on one or more enemies, otherwise false.
     */
    checkJumpOnEnemy() {
        let jumpedOnEnemy = false;
        this.level.enemies.forEach((enemy) => {
            if (!enemy.isDead && this.character.isAboveGround() && this.character.speedY < 0 && this.character.isColliding(enemy)) {
                this.handleJumpOnEnemy(enemy);
                jumpedOnEnemy = true;
            }
        });
        if (jumpedOnEnemy) {
            this.character.speedY = 20;
        }
        return jumpedOnEnemy;
    }

    /**
     * Handles character jumping on an enemy to defeat it.
     * @param {Object} enemy - The enemy being jumped on.
     */
    handleJumpOnEnemy(enemy) {
        enemy.hit();
        this.character.currentImage = 0;
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