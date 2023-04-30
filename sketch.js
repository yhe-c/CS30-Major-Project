// Hair My Screams 2.0
// Eesha He
// Date
//
// Extra for Experts:
// ...

class Player {
  constructor() {
    this.x;
    this.y;
    this.dx;
    this.dy;
    this.speed;
    this.gravity = 0.5;
  }
}

class Enemy {
  constructor() {
    this.x;
    this.y;
    this.dx;
    this.dy;
    this.speed;
  }

  collision() {

  }
}

let lvl_background;
let lvl_data;
let platforms;

function preload() {
  lvl_background = loadImage("images/lvl_1_img.jpg");
  lvl_data = loadStrings("levels/lvl1.txt");
}

let bricks;
function setup() {
  new Canvas(windowWidth, windowHeight);

  bricks = new Group();
  bricks.w = 50;
  bricks.h = 10;
  bricks.tile = 1;

  new Tiles(
    [lvl_data],
    width/3,
    height/5,
    bricks.w,
    bricks.h
  );
}

function draw() {
  clear();
  // background(220);
  // image(lvl_background, width/3, 0, width/2.75, height);
}
