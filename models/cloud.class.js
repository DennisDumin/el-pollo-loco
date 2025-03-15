class Cloud extends MovableObject {
    y = 50;
    width = 400;
    height = 250;

    IMAGES_CLOUDS = [
        'img/5_background/layers/4_clouds/1.png',
        'img/5_background/layers/4_clouds/2.png'
    ];

    /**
     * Creates a new cloud object
     * @param {number} x - The x position of the cloud
     * @param {number} imageIndex - Index of the cloud image to use
     */
    constructor(x, imageIndex) {
        super().loadImage(this.IMAGES_CLOUDS[imageIndex]);
        this.x = x;
        this.animate();
    }

    /**
     * Sets up cloud movement animation
     */
    animate() {
        this.cloudMoveInterval = setGameInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }
}