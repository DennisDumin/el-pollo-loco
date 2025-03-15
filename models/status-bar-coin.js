class StatusBarCoin extends DrawableObject {
    IMAGES = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
    ];

    currentCoins = 0;

    /**
     * Creates a new coin status bar
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.initializePosition();
        this.setPercentage(0);
    }

    /**
     * Initializes position and size
     */
    initializePosition() {
        this.x = 10;
        this.y = 50;
        this.width = 240;
        this.height = 64;
    }

    /**
     * Sets the percentage display
     * @param {number} percentage - Value between 0 and 100
     */
    setPercentage(percentage) {
        let index = Math.min(this.IMAGES.length - 1, Math.floor((percentage / 100) * (this.IMAGES.length - 1)));
        this.img = this.imageCache[this.IMAGES[index]];
    }

    /**
     * Adds a coin and updates display
     */
    addCoins() {
        this.currentCoins = Math.min(this.currentCoins + 1, 5);
        this.setPercentage(this.currentCoins * 20); 
    }
}