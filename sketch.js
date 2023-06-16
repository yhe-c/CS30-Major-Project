// Hair My Screams 2.0
// Eesha He
// Monday, June 19, 2023

//////////////////////////////

//initiating global variables
let aBtn, bBtn, hBtn, pBtn, rBtn, sBtn;
let ab_page, about_page;
let about_button, back_button, start_button;
let about_button_hov, back_button_hov, start_button_hov;
let character, character_img, character_idle, character_walk;
let enemies, enemy_img, enemy_movement;
let enemySpawnTimer;
let gameEnd, game_over;
let gameStatus = 0;
let home_button, home_button_hov;
let lvl_background;
let lvl_data, levelData;
let next_lvl, next_lvl_img;
let nextLevel = 1;
let pause_button, pause_button_hov;
let platforms;
let restart_button, restart_button_hov;
let showNext = 0;
let start_bg_img;
let state = true;
let wards, ward_img;


//preload images and level data
function preload() {
  about_button = loadImage("images/about_btn.png");
  about_button_hov = loadImage("images/about_btn_h.png");
  about_page = loadImage("images/about_page.png");
  back_button = loadImage("images/back_btn.png");
  back_button_hov = loadImage("images/back_btn_h.png");
  character_img = loadImage("images/f1.png");
  enemy_img = loadImage("images/enemy0.png");
  gameEnd = loadImage("images/end.png");
  game_over = [loadImage("images/gameover1.png"), loadImage("images/gameover2.png"), loadImage("images/gameover3.png"), loadImage("images/gameover4.png"), loadImage("images/gameover5.png"), loadImage("images/gameover6.png")];
  home_button = loadImage("images/home_btn.png");
  home_button_hov = loadImage("images/home_btn_h.png");
  levelData = [loadStrings("levels/lvl1.txt"), loadStrings("levels/lvl2.txt"), loadStrings("levels/lvl3.txt"), loadStrings("levels/lvl4.txt"), loadStrings("levels/lvl5.txt"), loadStrings("levels/lvl6.txt"), ];
  lvl_background = loadImage(`images/lvl_${nextLevel}_img.jpg`);
  next_lvl_img = loadImage("images/next_lvl.png");
  pause_button = loadImage("images/pause_btn.png");
  pause_button_hov = loadImage("images/pause_btn_h.png");
  restart_button = loadImage("images/restart_btn.png");
  restart_button_hov = loadImage("images/restart_btn_h.png");
  start_bg_img = loadImage("images/start_bg.png");
  start_button = loadImage("images/start_btn.png");
  start_button_hov = loadImage("images/start_btn_h.png");
  ward_img = loadImage("images/ward.png");
}

//setup groups and other sprites 
function setup() {
  noStroke();
  new Canvas(start_bg_img.w, start_bg_img.h + 45);
  world.gravity.y = 10;
  image(start_bg_img, 0, 0, width, height);

  //about button
  aBtn = new Sprite();
  imageMode = CENTER;
  aBtn.x = width/1.9;
  aBtn.y = height/1.5;
  aBtn.scale = 1.25;
  aBtn.collider = "s";

  //back button
  bBtn = new Sprite();
  imageMode = CENTER;
  bBtn.x = 30;
  bBtn.y = 30;
  bBtn.collider = "s";
  bBtn.visible = false;

  //start button
  sBtn = new Sprite();
  imageMode = CENTER;
  sBtn.x = width/1.9;
  sBtn.y = height/1.7;
  sBtn.scale = 1.25;
  sBtn.collider = "s";
  
  //teleport to next level
  next_lvl = new Group();
  next_lvl.scale = 1.5;
  next_lvl.tile = "$";
  next_lvl.img = next_lvl_img;
  next_lvl.collider = "s";
  next_lvl.visible = false;

  //platforms and walls group
  platforms = new Group();
  platforms.w = width/28;
  platforms.h = height/35;
  platforms.color = "black";
  platforms.tile = "=";
  platforms.collider = "s";
  platforms.visible = false;

  //wards group
  wards = new Group();
  wards.w = 5;
  wards.h = 10;
  wards.tile = "!";
  wards.img = ward_img;
  wards.scale = 1/2;
  wards.collider = "s";
  wards.visible = false;

  //loading first level
  lvl_data = levelData[0];
  new Tiles(
    lvl_data,
    0,
    0,
    platforms.w,
    platforms.h 
  );

  //character sprite     
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

  //enemy group
  enemies = new Group();
  enemies.img = enemy_img;
  enemies.x = random(0, width);
  enemies.y = random(0, height);
  enemies.collider = "k";  
  enemies.addAni("images/enemy0.png", "images/enemy1.png", "images/enemy2.png", "images/enemy1.png");
  enemies.ani.frameDelay = 10;
  enemySpawnTimer = new Timer(10000 - 1000 * nextLevel);
}

//function to spwan enemies
function spawnEnemy() {
  new enemies.Sprite();
  enemySequence();
}

//function for enemy movement sequencing
async function enemySequence() {
  let x = random(0, width);
  let y = random(0, height);
  await enemies.moveTo(x, y, nextLevel);
  enemySequence();
}

//function to collect the wards
function collect(character, ward) {
  ward.remove();
  showNext++;
}

//function to update level when completed
function updateLvl() {
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

//function to load or reload a level as needed
function reloadLvl() {
  enemySpawnTimer;
  enemySpawnTimer = new Timer(10000 - 1000 * nextLevel);
  enemySpawnTimer.start();
  character.x = 30;
  character.y = 40;
  wards.remove();
  // enemies.remove();
  next_lvl.remove();
  platforms.remove();
  if (nextLevel === 4) { //for level 4 because the background is too dark
    platforms.color = "grey";
    new Tiles(
      lvl_data,
      0,
      0,
      platforms.w,
      platforms.h
    );
  }
  else { //for every other level
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

//function that shows the about page
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

//function that shows the start menu
function startMenu(){
  image(start_bg_img, 0, 0, width, height);
  sBtn.img = start_button;
  aBtn.img = about_button;
  if (sBtn.mouse.hovering()) {
    sBtn.img = start_button_hov;
  }
  if (sBtn.mouse.pressed()) {
    enemySpawnTimer.start();
    gameStatus = 1;
    sBtn.remove();
    aBtn.remove();
    bBtn.remove();
    spawnEnemy();
  }
  if (aBtn.mouse.hovering()) {
    aBtn.img = about_button_hov;
  }
  if (aBtn.mouse.pressed()) {
    gameStatus = 0.5;
    aBtn.visible = false;
  }
}

//main drawr loop checking for game status
function draw() {
  if (gameStatus === 0) { //game status for showing the start menu
    startMenu();
  }
  else if (gameStatus === 0.5) { //game status for showing the about page
    aboutPage();
  }
  else if (gameStatus === 1) { //game status for starting the game
    clear();
    startGame(gameStatus);
  }
  else if (gameStatus === -0.5) { //game status for reloading/retrying a level
    reloadLvl();
  }
  else if (gameStatus === -1) { //game status for completion of the game
    image(gameEnd, 0, 0, width, height);
    platforms.remove();
    wards.remove();
    enemies.remove();
    next_lvl.remove();
    character.visible = false;
  }
  else if (gameStatus === -2) {
    let bgNum = Math.floor(random(0, 5));
    image(game_over[bgNum], 0, 0, width, height);
    platforms.remove();
    wards.remove();
    enemies.remove();
    next_lvl.remove();
    character.visible = false;
  }
  //translate(random(-1,1),random(-1,1));
}

//function that starts and runs most of the game
function startGame(gameStatus) {
  image(lvl_background, 0, 0, width, height);
  // if (enemySpawnTimer.expired()) { //spawns an enemy every x-amount of time
  //   spawnEnemy();
  //   enemySpawnTimer.start();
  // }
  if (character.collides(enemies)) { //collision with an enemy
    gameStatus = -2;
  }
  if (gameStatus === 1) {
    platforms.visible = true;
    wards.visible = true;
    character.visible = true;
    if (showNext === 3) { //show teleport to the next level after collecting all 3 wards
      next_lvl.visible = true;
    }
    if (kb.presses("up") || kb.presses("w")) { //jumping
      if (character.colliding(platforms)) {
        character.vel.y = -6.75;
      }
    }
    if (kb.pressing("left") || kb.presses("a")) { //left
      character.ani = "walk";
      character.mirror.x = true;
      character.vel.x = -5;
    }
    else if (kb.pressing("right") || kb.presses("d")) { //right
      character.ani = "walk";
      character.mirror.x = false;
      character.vel.x = 5;
    }
    else { //add idle
      character.ani = "idle";
      character.vel.x = 0;
    }
  }
}

//function for when the level isn't complete
function gameOver() {
  platforms.remove();
  wards.remove();
  next_lvl.remove();
  enemies.remove();
  character.visible = false;
  enemySpawnTimer.pause();
}