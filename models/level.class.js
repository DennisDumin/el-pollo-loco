class Level {
    enemies;
    clouds;
    backgroundLayer;
    levelEndX = 5500;

    constructor(enemies, clouds, backgroundLayer) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundLayer = backgroundLayer;
    }

}