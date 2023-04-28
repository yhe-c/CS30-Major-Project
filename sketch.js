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

function preload() {
  lvl_background = loadImage("images/lvl_1_img.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  image(lvl_background, width/3, 0, width/2.75, height);
}