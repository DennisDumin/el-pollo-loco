let level1;

function initLevel() {
    level1 = new Level(

        [new Bottle(100),
        new Bottle(150),
        new Bottle(90),
        new Bottle(80),
        new Bottle(70),
        new Bottle(200),
        new Bottle(250),
        new Bottle(300),
        new Bottle(350),
        new Bottle(170)],

        [new Chicken(),
        new Chicken(),
        new Chicken(),
        new ChickenTiny(),
        new ChickenTiny(),
        new ChickenTiny(),
        new Endboss()],

        [
            new Coin(400, 180),
            new Coin(460, 150),
            new Coin(520, 180),
            new Coin(620, 150),
            new Coin(680, 240),
            new Coin(880, 150),
            new Coin(1000, 230),
            new Coin(1150, 200),
            new Coin(1225, 185),
            new Coin(1300, 170),
            new Coin(1700, 240),
            new Coin(1740, 220),
            new Coin(1780, 200),
            new Coin(1820, 180),
            new Coin(1860, 160),
            new Coin(1900, 180),
            new Coin(1940, 200),
            new Coin(1980, 220),
            new Coin(2020, 240),
            new Coin(2500, 220),
            new Coin(2600, 180),
            new Coin(2800, 250),
            new Coin(3000, 150)
        ],

        [
            new Cloud(-200, 1),
            new Cloud(100, 0),
            new Cloud(500, 1),
            new Cloud(900, 0),
            new Cloud(1300, 1),
            new Cloud(1500, 0),
            new Cloud(2000, 1),
            new Cloud(2400, 0),
            new Cloud(2600, 1),
            new Cloud(3000, 0),
            new Cloud(3500, 1),
            new Cloud(3800, 0),
            new Cloud(4200, 1)
        ],

        generateBackground()
    );
}

function generateBackground() {
    let backgroundLayer = [];
    const numRepetitions = 10;

    for (let i = -2; i < numRepetitions; i++) {
        let xOffset = 1438 * i;
        backgroundLayer.push(new BackgroundObject('img/5_background/layers/air.png', xOffset, 0));
        backgroundLayer.push(new BackgroundObject('img/5_background/layers/3_third_layer/1.png', xOffset, 75));
        backgroundLayer.push(new BackgroundObject('img/5_background/layers/2_second_layer/1.png', xOffset, 75));
        backgroundLayer.push(new BackgroundObject('img/5_background/layers/1_first_layer/1.png', xOffset, 75));
        backgroundLayer.push(new BackgroundObject('img/5_background/layers/air.png', xOffset + 719, 0));
        backgroundLayer.push(new BackgroundObject('img/5_background/layers/3_third_layer/2.png', xOffset + 719, 75));
        backgroundLayer.push(new BackgroundObject('img/5_background/layers/2_second_layer/2.png', xOffset + 719, 75));
        backgroundLayer.push(new BackgroundObject('img/5_background/layers/1_first_layer/2.png', xOffset + 719, 75));
    }

    return backgroundLayer;
}