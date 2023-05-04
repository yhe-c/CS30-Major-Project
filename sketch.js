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
let character_img;
let character_ani;
let lvl_data;
let platforms;
let character;

//preload images and level data
function preload() {
  lvl_background = loadImage("images/lvl_1_img.jpg");
  character_img = loadImage("images/f1.png");
  lvl_data = loadStrings("levels/lvl1.txt");
}

function setup() {
  new Canvas(windowWidth, windowHeight);
  world.gravity.y = 10;

  platforms = new Group();
  platforms.w = 20;
  platforms.h = 20;
  platforms.color = "black";
  platforms.tile = "=";
  platforms.collider = "static";

  new Tiles(
    lvl_data,
    width/3,
    0,
    platforms.w + 1,
    platforms.h + 1
  );

  character = new Sprite();
  character.img = character_img;
  character.x = width/2.8;
  character.y = height/(height/45);
  character.collider = "d";
  
  character_ani = loadAni("images/f1.png", "images/f2.png", "images/f3.png");
  character_ani.frameDelay = 8;
}

function draw() {
  clear();
  image(lvl_background, width/3, 0, width/2.75, height);
}

function keyTyped() {
  if (key === "a") {
    character.velocity.x = -3;
  }
  else if (key === "d") {
    character.velocity.x = 3;
  }
  else if (key === "w") {
    character.velocity.y = -3;
  }
  else {
    character.vel.x = 0;
  }
}