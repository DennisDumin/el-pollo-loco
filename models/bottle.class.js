class Bottle extends MovableObject {

    y = 355;
    
    IMAGES = [
      'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
      'img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
    ];
  
    constructor(x, imageIndex) {
      super();
      this.loadImage(this.IMAGES[imageIndex]);
      this.x = x;
      this.height = 70;
      this.width = 70;
      this.offsetHeight = 55;
      this.offsetWidth = 50;
      this.offsetX = 10;
      this.offsetY = 5;
    }

    pickUpBottle() {
      this.playBottleCollectSound();
      this.removeFromGame();
    }
  
    playBottleCollectSound() {
        AudioManager.getInstance().playSound('audio/bottle.mp3', false, 0.3);
    }
  
    removeFromGame() {
      const index = world.level.bottles.indexOf(this);
      if (index > -1) {
        world.level.bottles.splice(index, 1);
      }
    }
  }