// Hair My Screams 2.0
// Eesha He
// Date
//
// Extra for Experts:
// ...

//initiating global variables
let lvl_background;
let character_img;
let character_idle;
let character_walk;
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
  
  character_idle = loadAni("images/f1.png");
  character_idle.frameDelay = 10;
  character.addAni("idle", character_idle);
  character_walk = loadAni("images/f1.png", "images/f2.png", "images/f3.png");
  character_walk.frameDelay = 8;
  character.addAni("walk", character_walk);
}

function draw() {
  clear();
  image(lvl_background, width/3, 0, width/2.75, height);
  if (kb.pressing("left")) {
    character.ani ="walk";
    character.mirror.x = true;
    character.vel.x = -2;
  }
  else if (kb.pressing("right")) {
    character.ani ="walk";
    character.mirror.x = false;
    character.vel.x = 2;
  }
  else if (kb.presses("up")) {
    character.vel.y = -3;
  }
  else {
    character.ani = "idle";
    character.vel.x = 0;
  }
}
