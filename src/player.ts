import * as PIXI from "pixi.js";

export class Player extends PIXI.Sprite {
  private yspeed: number = 0;
  private jumping: boolean = false;
  private ducking: boolean = false;
  private gameScreen: PIXI.Rectangle;
  private duckingTexture: PIXI.Texture;
  private standingTexture: PIXI.Texture;
  private standingHitbox: PIXI.Rectangle;
  private duckingHitbox: PIXI.Rectangle;
  private groundHeight: number;

  constructor(
    texture: PIXI.Texture,
    gameScreen: PIXI.Rectangle,
    dTexture: PIXI.Texture,
    groundHeight: number
  ) {
    super(texture);
    this.groundHeight = groundHeight;
    this.standingTexture = texture;
    this.duckingTexture = dTexture;
    this.gameScreen = gameScreen;

    window.addEventListener("keydown", (e: KeyboardEvent) => this.onKeyDown(e));
    window.addEventListener("keyup", (e: KeyboardEvent) => this.onKeyUp(e));

    this.standingHitbox = new PIXI.Rectangle(
      this.x,
      this.y,
      this.width,
      this.height
    );

    this.duckingHitbox = new PIXI.Rectangle(this.x, this.y, this.width, 49);

    // HITBOX TESTING
    // let greenBox = new PIXI.Graphics();
    // greenBox.lineStyle(2, 0x33ff33, 1);
    // greenBox.drawRect(
    //   this.duckingHitbox.x,
    //   this.duckingHitbox.y,
    //   this.duckingHitbox.width,
    //   this.duckingHitbox.height
    // );
    // this.addChild(greenBox);

    //this.scale.set(2, 3);
    this.x = this.width;
    this.y = this.gameScreen.height - this.height - this.groundHeight;
  }

  public update() {
    // Jump height
    if (this.y < 200) {
      this.yspeed += 1;
    }

    // Jump status clear and grounding

    if (
      (this.y > this.gameScreen.height - this.height - this.groundHeight &&
        this.jumping == true) ||
      (this.y > this.gameScreen.height - this.height - this.groundHeight &&
        this.ducking == true)
    ) {
      this.yspeed = 0;
      this.y = this.gameScreen.height - this.height - this.groundHeight;
      this.jumping = false;
    }

    // grounding when ducking
    if (
      this.y + this.height > this.gameScreen.height - this.groundHeight ||
      this.ducking == true
    ) {
      this.y = this.gameScreen.height - this.height - this.groundHeight;
    }

    this.y += this.yspeed;
  }

  private jump() {
    if (this.jumping == false) {
      this.yspeed -= 8;
      this.jumping = true;
    }
  }

  private duck() {
    this.ducking = true;
    this.texture = this.duckingTexture;
  }

  private onKeyDown(e: KeyboardEvent): void {
    switch (e.key.toUpperCase()) {
      case "W":
      case "ARROWUP":
        this.jump();
        break;
      case "S":
      case "ARROWDOWN":
        this.duck();
        break;
    }
  }

  private onKeyUp(e: KeyboardEvent): void {
    switch (e.key.toUpperCase()) {
      case "S":
      case "ARROWDOWN":
        this.texture = this.standingTexture;
        this.ducking = false;
        break;
    }
  }

  getBounds(): PIXI.Rectangle {
    if (this.ducking == true) {
      //   //console.log(new PIXI.Rectangle(this.x , this.y , this.duckingHitbox.width,this.duckingHitbox.height))
      return new PIXI.Rectangle(
        this.x + this.duckingHitbox.x,
        this.y + this.duckingHitbox.y,
        this.duckingHitbox.width,
        this.duckingHitbox.height
      );
    } else {
      //console.log( new PIXI.Rectangle(this.x, this.y , this.standingHitbox.width,this.standingHitbox.height))
      return new PIXI.Rectangle(
        this.x + this.standingHitbox.x,
        this.y + this.standingHitbox.y,
        this.standingHitbox.width,
        this.standingHitbox.height
      );
    }
  }
}
