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
  character.y = height/(height/42);
  character.collider = "d";
}

function draw() {
  if (kb.pressing("left")) {
    character.move(5, "left", 3);
  }
  else if (kb.pressing("right")) {
    character.move(5, "right", 3);
  }
  else if (kb.pressing("up")) {
    character.move(5, "up", 3);
  }
  else {
    character.vel.x = 0;
  }
  clear();
  image(lvl_background, width/3, 0, width/2.75, height);
}
