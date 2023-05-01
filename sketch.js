// Hair My Screams 2.0
// Eesha He
// Date
//
// Extra for Experts:
// ...

// class Player {
//   constructor() {
//     this.x;
//     this.y;
//     this.dx;
//     this.dy;
//     this.speed;
//     this.gravity = 0.5;
//   }
// }

// class Enemy {
//   constructor() {
//     this.x;
//     this.y;
//     this.dx;
//     this.dy;
//     this.speed;
//   }

//   collision() {

//   }
// }

//initiating global variables
let lvl_background;
let lvl_data;
let platforms;
let character;

//preload images and level data
function preload() {
  lvl_background = loadImage("images/lvl_1_img.jpg");
  lvl_data = loadStrings("levels/lvl1.txt");
}

function setup() {
  new Canvas(windowWidth, windowHeight);

  platforms = new Group();
  platforms.w = 20;
  platforms.h = 20;
  platforms.color = "black";
  platforms.tile = "=";

  new Tiles(
    lvl_data,
    width/3,
    0,
    platforms.w + 1,
    platforms.h + 1
  );
}

function draw() {
  clear();
  image(lvl_background, width/3, 0, width/2.75, height);
}
