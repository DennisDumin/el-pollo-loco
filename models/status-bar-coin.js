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
    
    constructor() {
        super();
    
        this.loadImages(this.IMAGES);
        this.x = 10;
        this.y = 50;
        this.width = 240;
        this.height= 64;
        this.updateCoinBar();
    };

    updateCoinBar() {
        if (this.currentCoins >= 0 && this.currentCoins < this.IMAGES.length) {
            let path = this.IMAGES[this.currentCoins];
            this.img = this.imageCache[path];
            if (this.currentCoins === this.IMAGES.length - 1) {
                setTimeout(() => {
                    this.currentCoins = 0;
                    this.updateCoinBar();
                }, 1); 
            };
        };
    };

    addCoin() {
        if (this.currentCoins < this.IMAGES.length - 1) {
            this.currentCoins++;
            this.updateCoinBar();
        } else {
            this.currentCoins = this.IMAGES.length - 1;
            this.updateCoinBar();
        };
    };
};