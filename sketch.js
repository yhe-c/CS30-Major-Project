// Hair My Screams 2.0
// Eesha He
// Monday, June 19, 2023

//////////////////////////////

//initiating global variables
let sBtn;
let aBtn;
let bBtn;
let gameStatus = 0;
let lvl_background;
let start_bg_img;
let ab_page;
let about_page;
let start_button;
let about_button;
let back_button;
let start_button_hov;
let about_button_hov;
let back_button_hov;

let showNext = 0;
let next_lvl;
let next_lvl_img;
let nextLevel = 1;

let character;
let character_img;
let character_idle;
let character_walk;
let lvl_data;
let enemy;
let enemy_img;
let enemy_movement;
let platforms;
let wards;
let ward_img;

//enemy class?

//preload images and level data
function preload() {
  start_bg_img = loadImage("images/start_bg.png");
  start_button = loadImage("images/start_btn.png");
  start_button_hov = loadImage("images/start_btn_h.png");
  about_button = loadImage("images/about_btn.png");
  about_button_hov = loadImage("images/about_btn_h.png");
  back_button = loadImage("images/back_btn.png");
  back_button_hov = loadImage("images/back_btn_h.png");
  about_page = loadImage("images/about_page.png");
  next_lvl_img = loadImage("images/next_lvl.png");
  
  lvl_background = loadImage(`images/lvl_${nextLevel}_img.jpg`);
  lvl_data = loadStrings(`levels/lvl${nextLevel}.txt`);

  character_img = loadImage("images/f1.png");
  enemy_img = loadImage("images/enemy0.png");
  ward_img = loadImage("images/ward.png");
}

function setup() {
  new Canvas(start_bg_img.w, start_bg_img.h + 45);
  world.gravity.y = 10;
  image(start_bg_img, 0, 0, width, height);

  sBtn = new Sprite();
  imageMode = CENTER;
  sBtn.x = width/1.9;
  sBtn.y = height/1.7;
  sBtn.scale = 1.25;
  sBtn.collider = "s";

  aBtn = new Sprite();
  imageMode = CENTER;
  aBtn.x = width/1.9;
  aBtn.y = height/1.5;
  aBtn.scale = 1.25;
  aBtn.collider = "s";

  bBtn = new Sprite();
  imageMode = CENTER;
  bBtn.x = 30;
  bBtn.y = 30;
  bBtn.collider = "s";
  bBtn.visible = false;


  platforms = new Group();
  platforms.w = width/29.5;
  platforms.h = height/37;
  platforms.color = "black";
  platforms.tile = "=";
  platforms.collider = "s";
  platforms.visible = false;

  next_lvl = new Group();
  next_lvl.scale = 1.5;
  next_lvl.tile = "$";
  next_lvl.img = next_lvl_img;
  next_lvl.collider = "s";
  next_lvl.visible = false;
        
  wards = new Group();
  wards.w = 5;
  wards.h = 10;
  wards.tile = "!";
  wards.img = ward_img;
  wards.scale = 1/2;
  wards.collider = "s";
  wards.visible = false;
        
  new Tiles(
    lvl_data,
    0,
    0,
    platforms.w + 1,
    platforms.h + 1
  );
        
  character = new Sprite();
  character.img = character_img;
  character.x = 30;
  character.y = 40;
  character.collider = "d";
  character.friction = 0;
  character.rotationLock = true;
  character.overlaps(wards, collect);
  character.overlaps(next_lvl, updateLvl);
  character_idle = loadAni("images/f1.png");
  character_idle.frameDelay = 10;
  character.addAni("idle", character_idle);
  character_walk = loadAni("images/f1.png", "images/f2.png", "images/f3.png");
  character_walk.frameDelay = 8;
  character.addAni("walk", character_walk);
  character.visible = false;
        
  // enemy = new Sprite();
  // enemy.img = enemy_img;
  // enemy.x = width/1.75;
  // enemy.y = height/3;
  // enemy.collider = "d";
  // enemy.rotationLock = true;
  // enemy_movement = loadAni("images/enemy0.png", "images/enemy1.png", "images/enemy2.png", "images/enemy1.png");
  // enemy_movement.frameDelay = 10;
  // enemy.addAni("walk", enemy_movement);
  // enemySequence();
}

function collect(character, ward) {
  ward.remove();
  showNext++;
}

function updateLvl() {
  next_lvl.remove();
  if (nextLevel < 6) {
    nextLevel++;
    lvl_background = loadImage(`images/lvl_${nextLevel}_img.jpg`);
    lvl_data;
    lvl_data = loadStrings(`levels/lvl${nextLevel}.txt`);
  }
  character.x = 30;
  character.y = 40;
  new Tiles(
    lvl_data,
    0,
    0,
    platforms.w + 1,
    platforms.h + 1
  );
}

function aboutPage() {
  image(about_page, 0, 0, width, height);
  bBtn.img = back_button;
  bBtn.visible = true;
  sBtn.visible = false;
  if (bBtn.mouse.hovering()) {
    bBtn.img = back_button_hov;
  }
  if (bBtn.mouse.pressed()) {
    bBtn.visible = false;
    sBtn.visible = true;
    aBtn.visible = true;
    gameStatus = 0;
  }
}

function startMenu(){
  image(start_bg_img, 0, 0, width, height);
  sBtn.img = start_button;
  aBtn.img = about_button;
  if (sBtn.mouse.hovering()) {
    sBtn.img = start_button_hov;
  }
  if (sBtn.mouse.pressed()) {
    gameStatus = 1;
    sBtn.remove();
    aBtn.remove();
    bBtn.remove();
  }
  if (aBtn.mouse.hovering()) {
    aBtn.img = about_button_hov;
  }
  if (aBtn.mouse.pressed()) {
    gameStatus = 0.5;
    aBtn.visible = false;
  }
}

function draw() {
  if (gameStatus === 0) {
    startMenu();
  }
  else if (gameStatus === 0.5) {
    aboutPage();
  }
  else if (gameStatus === 1) {
    clear();
    startGame(gameStatus);
  }
  //translate(random(-1,1),random(-1,1));
}

function startGame(gameStatus) {
  image(lvl_background, 0, 0, width, height);
  if (gameStatus === 1) {
    platforms.visible = true;
    wards.visible = true;
    character.visible = true;
    if (showNext === 3) {
      next_lvl.visible = true;
    }
    if (kb.presses("up")) {
      character.vel.y = -6.25;
    }
    if (kb.pressing("left")) {
      character.ani = "walk";
      character.mirror.x = true;
      character.vel.x = -5;
    }
    else if (kb.pressing("right")) {
      character.ani = "walk";
      character.mirror.x = false;
      character.vel.x = 5;
    }
    else {
      character.ani = "idle";
      character.vel.x = 0;
    }
  }
}