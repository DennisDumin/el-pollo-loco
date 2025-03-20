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
    this.offsetHeight = 45;
    this.offsetWidth = 25;
    this.offsetX = 25;
    this.offsetY = 15;
  }

  /**
 * Handles the pickup of a bottle
 */
  pickUpBottle() {
    this.playBottleSound();
    this.removeBottleFromLevel();
  }

  /**
  * Plays the bottle pickup sound
  */
  playBottleSound() {
    AudioManager.getInstance().playOverlappingSound('audio/bottle.mp3', 0.3);
  }

  /**
  * Removes the bottle from the level
  */
  removeBottleFromLevel() {
    const index = world.level.bottles.indexOf(this);
    if (index > -1) {
      world.level.bottles.splice(index, 1);
    }
  }
}
