class StatusBarEndboss extends DrawableObject {
    IMAGES = [
        'img/7_statusbars/2_statusbar_endboss/orange0.png',
        'img/7_statusbars/2_statusbar_endboss/orange20.png',
        'img/7_statusbars/2_statusbar_endboss/blue40.png',
        'img/7_statusbars/2_statusbar_endboss/blue60.png',
        'img/7_statusbars/2_statusbar_endboss/green80.png',
        'img/7_statusbars/2_statusbar_endboss/green100.png'
    ];

    percentage = 100;

    /**
     * Creates a new endboss status bar
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.initializePosition();
        this.setPercentage(100);
    }

    /**
     * Initializes position and size
     */
    initializePosition() {
        this.x = 450;
        this.y = 2;
        this.width = 240;
        this.height = 64;
    }

    /**
     * Sets the percentage display
     * @param {number} percentage - Value between 0 and 100
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
  * Resolves the image index based on percentage
  * @returns {number} Image index
  */
    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        }
        return this.resolveImageIndex();
    }

    /**
     * Gets image index by percentage ranges
     * @returns {number} Image index
     */
    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage > 79) {
            return 4;
        } else if (this.percentage > 59) {
            return 3;
        } else if (this.percentage > 39) {
            return 2;
        } else if (this.percentage > 19) {
            return 1;
        } else if (this.percentage > 0) {
            return 1;
        } else {
            return 0;
        }
    }
}