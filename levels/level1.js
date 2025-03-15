let level1;

/**
 * Initializes the game level with all elements
 */
function initLevel() {
    level1 = new Level(
        createBottles(),
        createEnemies(),
        createCoins(),
        createClouds(),
        generateBackground()
    );
}

/**
 * Creates bottle objects for the level
 * @returns {Array} Array of bottle objects
 */
function createBottles() {
    return [
        new Bottle(250, 1), new Bottle(330, 0), new Bottle(450, 1),
        new Bottle(750, 0), new Bottle(830, 1), new Bottle(950, 0),
        new Bottle(1350, 1), new Bottle(1860, 0), new Bottle(1830, 1),
        new Bottle(2300, 0), new Bottle(2500, 1), new Bottle(3000, 0)
    ];
}

/**
 * Creates enemy objects for the level
 * @returns {Array} Array of enemy objects
 */
function createEnemies() {
    return [
        ...createRegularChickens(),
        ...createTinyChickens(),
        new Endboss()
    ];
}

/**
 * Creates regular chicken enemies
 * @returns {Array} Array of regular chickens
 */
function createRegularChickens() {
    return Array(11).fill().map(() => new Chicken());
}

/**
 * Creates tiny chicken enemies
 * @returns {Array} Array of tiny chickens
 */
function createTinyChickens() {
    return Array(7).fill().map(() => new ChickenTiny());
}

/**
 * Creates coin objects for the level
 * @returns {Array} Array of coin objects
 */
function createCoins() {
    return [
        new Coin(400, 180), new Coin(460, 150), new Coin(520, 180),
        new Coin(620, 150), new Coin(680, 240), new Coin(880, 150),
        new Coin(1000, 230), new Coin(1150, 200), new Coin(1225, 185),
        new Coin(1300, 170), new Coin(1700, 240), new Coin(1740, 220),
        new Coin(1780, 200), new Coin(1820, 180), new Coin(1860, 160),
        new Coin(1900, 180), new Coin(1940, 200), new Coin(1980, 220),
        new Coin(2020, 240), new Coin(2500, 220), new Coin(2600, 180),
        new Coin(2800, 250), new Coin(3000, 150)
    ];
}

/**
 * Creates cloud objects for the level
 * @returns {Array} Array of cloud objects
 */
function createClouds() {
    return [
        new Cloud(-200, 1), new Cloud(100, 0), new Cloud(500, 1),
        new Cloud(900, 0), new Cloud(1300, 1), new Cloud(1500, 0),
        new Cloud(2000, 1), new Cloud(2400, 0), new Cloud(2600, 1),
        new Cloud(3000, 0), new Cloud(3500, 1), new Cloud(3800, 0),
        new Cloud(4200, 1)
    ];
}

/**
 * Generates the background layers for the level
 * @returns {Array} Array of background objects
 */
function generateBackground() {
    let backgroundLayer = [];
    const numRepetitions = 10;
    
    for (let i = -2; i < numRepetitions; i++) {
        addBackgroundSetForPosition(backgroundLayer, i);
    }
    
    return backgroundLayer;
}

/**
 * Adds a set of background objects for a specific position
 * @param {Array} backgroundLayer - The array to add background objects to
 * @param {number} i - The position index
 */
function addBackgroundSetForPosition(backgroundLayer, i) {
    let xOffset = 1438 * i;
    addFirstHalfBackground(backgroundLayer, xOffset);
    addSecondHalfBackground(backgroundLayer, xOffset + 719);
}

/**
 * Adds the first half of background objects at the specified offset
 * @param {Array} backgroundLayer - The array to add background objects to
 * @param {number} xOffset - The x position offset
 */
function addFirstHalfBackground(backgroundLayer, xOffset) {
    backgroundLayer.push(new BackgroundObject('img/5_background/layers/air.png', xOffset, 0));
    backgroundLayer.push(new BackgroundObject('img/5_background/layers/3_third_layer/1.png', xOffset, 75));
    backgroundLayer.push(new BackgroundObject('img/5_background/layers/2_second_layer/1.png', xOffset, 75));
    backgroundLayer.push(new BackgroundObject('img/5_background/layers/1_first_layer/1.png', xOffset, 75));
}

/**
 * Adds the second half of background objects at the specified offset
 * @param {Array} backgroundLayer - The array to add background objects to
 * @param {number} xOffset - The x position offset
 */
function addSecondHalfBackground(backgroundLayer, xOffset) {
    backgroundLayer.push(new BackgroundObject('img/5_background/layers/air.png', xOffset, 0));
    backgroundLayer.push(new BackgroundObject('img/5_background/layers/3_third_layer/2.png', xOffset, 75));
    backgroundLayer.push(new BackgroundObject('img/5_background/layers/2_second_layer/2.png', xOffset, 75));
    backgroundLayer.push(new BackgroundObject('img/5_background/layers/1_first_layer/2.png', xOffset, 75));
}