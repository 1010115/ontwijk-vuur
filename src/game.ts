import * as PIXI from "pixi.js";
import playerImage from "./img/player.png";
import duckingImage from "./img/player-ducking.png";
import bgImage from "./img/bg.png";
import groundImage from "./img/ground.png";
import fireWallImage from "./img/fire-wall.png";
import lavaImage from "./img/lava.png";
import fireBallImage from "./img/fireball.png";
import { Player } from "./player";
import { Obstacle } from "./obstacle";
import { Ticker } from "pixi.js";

export class Game {
  private pixi: PIXI.Application;
  private loader: PIXI.Loader;
  private player: Player;
  private obstacle: Obstacle;
  private obstacles: Obstacle[] = [];
  private obstacleTextures: PIXI.Texture[] = [];
  private backGround: PIXI.TilingSprite;
  public ground: PIXI.TilingSprite;
  private timer: number = 0;
  private obstacleTimer: number = 0;
  private difficulty: number = 90;
  private modifier: number = 1;
  private style: PIXI.TextStyle;
  private endText: PIXI.Text;
  private scoreText: PIXI.Text;
  private score: number = 0;

  constructor() {
    //  Make canvas
    this.pixi = new PIXI.Application({ width: 960, height: 540 });
    document.body.appendChild(this.pixi.view);

    // Load textures
    this.loader = new PIXI.Loader();
    this.loader
      .add("playerTexture", playerImage)
      .add("duckingTexture", duckingImage)
      .add("bgTexture", bgImage)
      .add("fireBallTexture", fireBallImage)
      .add("fireWallTexture", fireWallImage)
      .add("lavaTexture", lavaImage)
      .add("groundTexture", groundImage)
      .load(() => this.loadCompleted());
  }

  private loadCompleted() {
    // Create background
    this.backGround = new PIXI.TilingSprite(
      this.loader.resources["bgTexture"].texture!,
      this.pixi.screen.width,
      this.pixi.screen.height
    );
    this.pixi.stage.addChild(this.backGround);

    // Create ground
    this.ground = new PIXI.TilingSprite(
      this.loader.resources["groundTexture"].texture!,
      this.pixi.screen.width,
      100
    );
    this.ground.y = this.pixi.screen.height - this.ground.height;
    this.pixi.stage.addChild(this.ground);

    // Create player
    this.player = new Player(
      this.loader.resources["playerTexture"].texture!,
      this.pixi.screen,
      this.loader.resources["duckingTexture"].texture!,
      this.ground.height
    );
    this.pixi.stage.addChild(this.player);

    this.obstacleTextures.push(
      this.loader.resources["fireBallTexture"].texture!,
      this.loader.resources["fireWallTexture"].texture!,
      this.loader.resources["lavaTexture"].texture!
    );

     this.style = new PIXI.TextStyle({
      dropShadow: true,
      fill: [
          "#df0101",
          "#cf7e20",
          "#fff700"
      ],
      fillGradientStops: [
          0
      ],
      fontFamily: "Comic Sans MS",
      fontSize: 36,
      fontWeight: "bolder",
      stroke: "white",
      strokeThickness: 1
  });  

    this.scoreText = new PIXI.Text(this.score ,this.style)
    this.scoreText.x = 10
    this.pixi.stage.addChild(this.scoreText)

    this.pixi.ticker.maxFPS = 60
    this.pixi.ticker.add((delta) => this.update(delta));
  }

  private update(delta: number) {
    this.timer += delta;
    this.obstacleTimer += delta;

    if (this.timer > 120) {
      this.difficulty--;
      this.modifier += 0.05;
      this.score ++
      this.scoreText.text = this.score
      this.timer = 0;
    }

    if (this.obstacleTimer > this.difficulty) {
      this.makeObstacle(this.modifier);
      this.obstacleTimer = 0;
    }

    this.player.update();

    for (let obstacle of this.obstacles) {
      obstacle.update();

      if (this.collision(this.player, obstacle)) {
        
        this.endText = new PIXI.Text('Game Over\nPlay Again?', this.style);
        this.endText.x = this.pixi.screen.width / 2 - this.endText.width + 75
        this.endText.y = this.pixi.screen.height /2 - this.endText.height
        this.endText.interactive = true
        this.endText.buttonMode = true
        this.endText.on('pointerdown', ()=> this.restartGame())
        this.pixi.stage.addChild(this.endText)
        this.pixi.ticker.stop()

      }

      if (obstacle.x < -60) {
        this.deleteObstacle(obstacle);
      }
    }
  }

  collision(sprite1: PIXI.Sprite, sprite2: PIXI.Sprite): boolean {
    const bounds1 = sprite1.getBounds();
    const bounds2 = sprite2.getBounds();

    return (
      bounds1.x < bounds2.x + bounds2.width &&
      bounds1.x + bounds1.width > bounds2.x &&
      bounds1.y < bounds2.y + bounds2.height &&
      bounds1.y + bounds1.height > bounds2.y
    );
  }

  makeObstacle(modifier: number): void {
    let type = Math.floor(Math.random() * 3);

    this.obstacle = new Obstacle(
      this.obstacleTextures[type],
      type,
      this.ground.height,
      this.pixi.screen,
      modifier
    );
    this.pixi.stage.addChild(this.obstacle);
    this.obstacles.push(this.obstacle);
  }

  private deleteObstacle(obstacle: Obstacle) : void{
    this.obstacles = this.obstacles.filter((o) => o != obstacle);
    obstacle.destroy();
  }

  private restartGame(){
    this.difficulty = 90
    this.modifier = 1
    this.score = 0
    this.scoreText.text = this.score
    this.endText.destroy()
    for(let obstacle of this.obstacles)
      this.deleteObstacle(obstacle)
      this.pixi.ticker.start()

  }
}

  
new Game();
