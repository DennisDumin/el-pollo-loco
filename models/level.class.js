class Level {
    enemies;
    clouds;
    coins;
    backgroundLayer;
    levelEndX = 5500;
    bottles;

    constructor(bottles, enemies, coins, clouds, backgroundLayer) {
        this.bottles = bottles;
        this.enemies = enemies;
        this.coins = coins;
        this.clouds = clouds;
        this.backgroundLayer = backgroundLayer;
    }
}