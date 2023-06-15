// Hair My Screams 2.0
// Eesha He
// Monday, June 19, 2023

//////////////////////////////

//initiating global variables

//enemy class?
// class Enemy {
//   constructor(x, y, dx) {
//     this.x = x;
//     this.y = y;
//     this.dx = dx;
//     this.gravity = 0.75;   
//   }
//   display() {
//     this.img = enemy_img;
//   }
//   update() {
//     let state = true;
//     this.x += this.dx;
//     this.y += this.gravity;
//     if (this.x < 2 * (width/28) || this.x > width - (2 * (width/28))) {
//       this.mirror.x = !state;
//     }
//   }
// }

let sBtn;
let aBtn;
let bBtn;
let gameStatus = 0;
let lvl_background;
let start_bg_img;
let ab_page;
let about_page;
let game_over;
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
let gameEnd;

let character;
let character_img;
let character_idle;
let character_walk;
let lvl_data;
let levelData;
let enemySpawnTimer;
let enemies = [];
let enemy_img;
let enemy_movement;
let platforms;
let wards;
let ward_img;


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
  gameEnd = loadImage("images/end.png");
  
  lvl_background = loadImage(`images/lvl_${nextLevel}_img.jpg`);
  levelData = [loadStrings("levels/lvl1.txt"), loadStrings("levels/lvl2.txt"), loadStrings("levels/lvl3.txt"), loadStrings("levels/lvl4.txt"), loadStrings("levels/lvl5.txt"), loadStrings("levels/lvl6.txt"), ];
  game_over = [loadImage("images/gameover1.png"), loadImage("images/gameover2.png"), loadImage("images/gameover3.png"), loadImage("images/gameover4.png"), loadImage("images/gameover5.png"), loadImage("images/gameover6.png")];
  character_img = loadImage("images/f1.png");
  enemy_img = loadImage("images/enemy0.png");
  ward_img = loadImage("images/ward.png");
}

function setup() {
  noStroke();
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
  platforms.w = width/28;
  platforms.h = height/35;
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
      
  lvl_data = levelData[0];
  new Tiles(
    lvl_data,
    0,
    0,
    platforms.w,
    platforms.h 
  );
        
  character = new Sprite();
  character.img = character_img;
  character.x = 30;
  character.y = 40;
  character.collider = "d";
  character.friction = 0;
  character.rotationLock = true;
  character.overlaps(wards, collect);
  // character.overlaps(enemies, gameOver);
  character.overlaps(next_lvl, updateLvl);
  character_idle = loadAni("images/f1.png");
  character_idle.frameDelay = 10;
  character.addAni("idle", character_idle);
  character_walk = loadAni("images/f1.png", "images/f2.png", "images/f3.png");
  character_walk.frameDelay = 8;
  character.addAni("walk", character_walk);
  character.visible = false;

  enemies = new Group();
  enemies.img = enemy_img;
  enemies.x = 30;
  enemies.y = 45;
  enemies.mirror.x = false;
  enemies.collider = "d"; 
  enemies.rotationLock = true;  
  enemy_movement = loadAni("images/enemy0.png", "images/enemy1.png", "images/enemy2.png", "images/enemy1.png");
  enemy_movement.frameDelay = 10;
  enemies.addAni("walk", enemy_movement);
  enemies.moveTowards(character);
}

function spawnEnemy() {
  enemySpawnTimer = new Timer(10000 - 1000 * nextLevel);
  enemySpawnTimer.start();
  if (enemySpawnTimer.expired()) {
    new enemies.Sprite();
    enemySpawnTimer.start();
  }
  // enemies.vel.x = 10 * nextLevel;
}
// async function enemySequence() {
//   await enemy.move(10 * nextLevel);
//   enemySequence();
// }

function collect(character, ward) {
  ward.remove();
  showNext++;
}

function updateLvl() {
  enemySpawnTimer;
  enemySpawnTimer = new Timer(10000 - 1000 * nextLevel);
  next_lvl.remove();
  if (nextLevel < 6) {
    lvl_data = levelData[nextLevel];
    nextLevel++;
    lvl_background = loadImage(`images/lvl_${nextLevel}_img.jpg`);
  }
  else {
    gameStatus = -1;
  }
  reloadLvl();
}

function reloadLvl() {
  character.x = 30;
  character.y = 40;
  wards.remove();
  platforms.remove();
  if (nextLevel === 4) {
    platforms.color = "grey";
    new Tiles(
      lvl_data,
      0,
      0,
      platforms.w,
      platforms.h
    );
  }
  else {
    platforms.color = "black";
    new Tiles(
      lvl_data,
      0,
      0,
      platforms.w,
      platforms.h
    );
  }
  next_lvl.visible = false;
  showNext = 0;
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
  else if (gameStatus === -0.5) {
    reloadLvl();
  }
  else if (gameStatus === -1) {
    image(gameEnd, 0, 0, width, height);
    platforms.remove();
    wards.remove();
    next_lvl.remove();
    character.visible = false;
  }
  //translate(random(-1,1),random(-1,1));
}

function startGame(gameStatus) {
  image(lvl_background, 0, 0, width, height);
  if (gameStatus === 1) {
    spawnEnemy();
    platforms.visible = true;
    wards.visible = true;
    character.visible = true;
    if (showNext === 3) {
      next_lvl.visible = true;
    }
    if (kb.presses("up") || kb.presses("w")) {
      if (character.colliding(platforms)) {
        character.vel.y = -6.75;
      }
    }
    if (kb.pressing("left") || kb.presses("a")) {
      character.ani = "walk";
      character.mirror.x = true;
      character.vel.x = -5;
    }
    else if (kb.pressing("right") || kb.presses("d")) {
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

function gameOver() {
  let bgNum = random(1, 6);
  image(game_over[bgNum], 0, 0, width, height);
}