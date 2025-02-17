class Level {
    enemies;
    clouds;
    coins;
    backgroundLayer;
    levelEndX = 5500;

    constructor(enemies, coins, clouds, backgroundLayer) {
        this.enemies = enemies;
        this.coins = coins;
        this.clouds = clouds;
        this.backgroundLayer = backgroundLayer;
    }

}