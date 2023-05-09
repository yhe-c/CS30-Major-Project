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
let ward_img;
let ward;

//preload images and level data
function preload() {
  lvl_background = loadImage("images/lvl_1_img.jpg");
  character_img = loadImage("images/f1.png");
  lvl_data = loadStrings("levels/lvl1.txt");
  ward_img = loadImage("images/ward.png");
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

  ward = new Group();
  ward.w = 5;
  ward.h = 10;
  ward.tile = "!";
  ward.img = ward_img;
  ward.scale = 1/2;
  push();
  rotate(250);
  pop();
  ward.collider = "s";

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
  character.friction = 0;
  character.rotationLock = true;
  character.overlaps(ward, collect);
  
  character_idle = loadAni("images/f1.png");
  character_idle.frameDelay = 10;
  character.addAni("idle", character_idle);
  character_walk = loadAni("images/f1.png", "images/f2.png", "images/f3.png");
  character_walk.frameDelay = 8;
  character.addAni("walk", character_walk);
}

function collect() {
  ward.remove();
}

function draw() {
  clear();
  image(lvl_background, width/3, 0, width/2.75, height);
  if (kb.presses("up")) {
    character.vel.y = -5;
  }
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
  else {
    character.ani = "idle";
    character.vel.x = 0;
  }
  //translate(random(-1,1),random(-1,1));
}