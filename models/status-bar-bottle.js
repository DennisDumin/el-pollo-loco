class StatusBarBottle extends DrawableObject {
    IMAGES = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png'
    ];

    currentBottles = 0;
    maxBottles = 10;

    /**
     * Creates a new bottle status bar
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
        this.y = 105;
        this.width = 240;
        this.height = 64;
    }

    /**
     * Sets percentage of bottle status
     * @param {number} percentage - Percentage value (0-100)
     */
    setPercentage(percentage) {
        let mappedIndex = Math.floor((percentage / 100) * 5);
        let index = Math.min(5, Math.max(0, mappedIndex));
        this.img = this.imageCache[this.IMAGES[index]];
    }

    /**
     * Adds a bottle to the counter
     * @returns {boolean} True if bottle was added
     */
    addBottles() {
        if (this.currentBottles < this.maxBottles) {
            this.currentBottles++;
            this.setPercentage(this.currentBottles * 10);
            return true;
        }
        return false;
    }

    /**
     * Removes a bottle from the counter
     * @returns {boolean} True if bottle was removed
     */
    removeBottle() {
        if (this.currentBottles > 0) {
            this.currentBottles--;
            this.setPercentage(this.currentBottles * 10);
            return true; 
        }
        return false;
    }
    
    /**
     * Checks if max bottle count is reached
     * @returns {boolean} True if max bottles reached
     */
    isMaxReached() {
        return this.currentBottles >= this.maxBottles;
    }
}