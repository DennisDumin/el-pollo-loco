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
        let index = Math.min(this.IMAGES.length - 1, Math.floor((percentage / 100) * (this.IMAGES.length - 1)));
        this.img = this.imageCache[this.IMAGES[index]];
    }

    addBottles() {
        this.currentBottles = Math.min(this.currentBottles + 1, 5);
        this.setPercentage(this.currentBottles * 20);
    }

    removeBottle() {
        this.currentBottles = Math.max(this.currentBottles - 1, 0);
        this.setPercentage(this.currentBottles * 20); 
    }
}