let level1;

function initLevel() {
    level1 = new Level(
        [
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Endboss()
        ],
        [
            new Coin(250, 150),
            new Coin(400, 50),
            new Coin(450, 100)
        ],
        [
            new Cloud()
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