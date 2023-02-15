import * as PIXI from "pixi.js";

export class Obstacle extends PIXI.Sprite {
  private xSpeed: number = 1;
  private gameScreen: PIXI.Rectangle;
  private hitbox: PIXI.Rectangle;

  constructor(
    texture: PIXI.Texture,
    type: number,
    groundHeight: number,
    gameScreen: PIXI.Rectangle,
    modifier: number
  ) {
    super(texture);

    if (type == 0) {
      // ball Hitbox

      this.hitbox = new PIXI.Rectangle(this.x, this.y, 31, 30);
      //this.scale.set(2);
      this.y = 250 + Math.random() * 10;

      this.xSpeed = 5 * modifier;
    } else if (type == 1) {
      // wall hitbox
      this.hitbox = new PIXI.Rectangle(this.x, this.y, 40, 44);
      //this.scale.set(2);
      this.y = gameScreen.height - groundHeight - this.height - 70;
      this.xSpeed = 3 * modifier;
    } else if (type == 2) {
      // lava hitbox
      this.hitbox = new PIXI.Rectangle(this.x, this.y, 61, 16);
      //this.scale.set();
      this.y = gameScreen.height - groundHeight - this.height - 40;
      this.xSpeed = 3 * modifier;
    }
    this.gameScreen = gameScreen;
    this.x = gameScreen.width;
    this.y += 100;

    // HITBOX TESTING
    // let greenBox = new PIXI.Graphics();
    // greenBox.lineStyle(2, 0x33ff33, 1);
    // greenBox.drawRect(
    //   this.hitbox.x,
    //   this.hitbox.y,
    //   this.hitbox.width,
    //   this.hitbox.height
    // );
    // this.addChild(greenBox);
  }

  public update(): void {
    //console.log(this.y)
    //console.log(this.getBounds())
    this.x -= this.xSpeed;
  }

  public getBounds(): PIXI.Rectangle {
    // console.log(new PIXI.Rectangle(this.x , this.y , this.hitbox.width, this.hitbox.height))
    return new PIXI.Rectangle(
      this.x + this.hitbox.x,
      this.y + this.hitbox.y,
      this.hitbox.width,
      this.hitbox.height
    );
  }
}
