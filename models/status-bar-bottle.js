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

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 10;
        this.y = 105;
        this.width = 240;
        this.height = 64;
        this.setPercentage(0);
    }

    setPercentage(percentage) {
        let mappedIndex = Math.floor((percentage / 100) * 5);
        let index = Math.min(5, Math.max(0, mappedIndex));
        this.img = this.imageCache[this.IMAGES[index]];
    }

    addBottles() {
        if (this.currentBottles < this.maxBottles) {
            this.currentBottles++;
            this.setPercentage(this.currentBottles * 10);
            return true;
        }
        return false;
    }

    removeBottle() {
        if (this.currentBottles > 0) {
            this.currentBottles--;
            this.setPercentage(this.currentBottles * 10);
            return true; 
        }
        return false;
    }
    
    isMaxReached() {
        return this.currentBottles >= this.maxBottles;
    }
}