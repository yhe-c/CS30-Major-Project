// Hair My Screams 2.0
// Eesha He
// Monday, June 19, 2023

//////////////////////////////////////////////////////////////

//initiating global variables
let aBtn, bBtn, hBtn, pBtn, rBtn, reBtn, sBtn;
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
let resume_button, resume_button_hov;
let showNext = 0;
let start_bg_img;
let state = true;
let wards, ward_img;
let pause_screen;

//preload images and level data
function preload() {
  //BUTTONS - probably could've used and array for each button to half the clutter but I'm too tired
  about_button = loadImage("images/about_btn.png");
  about_button_hov = loadImage("images/about_btn_h.png");
  back_button_hov = loadImage("images/back_btn_h.png");
  back_button = loadImage("images/back_btn.png");
  home_button = loadImage("images/home_btn.png");
  home_button_hov = loadImage("images/home_btn_h.png");
  pause_button = loadImage("images/pause_btn.png");
  pause_button_hov = loadImage("images/pause_btn_h.png");
  restart_button = loadImage("images/restart_btn.png");
  restart_button_hov = loadImage("images/restart_btn_h.png");
  resume_button = loadImage("images/resume_btn.png");
  resume_button_hov = loadImage("images/resume_btn_h.png");
  start_button = loadImage("images/start_btn.png");
  start_button_hov = loadImage("images/start_btn_h.png");
  //END OF BUTTONS

  //OTHER IMAGES/DATA
  about_page = loadImage("images/about_page.png");
  character_img = loadImage("images/f1.png");
  enemy_img = loadImage("images/enemy0.png");
  gameEnd = loadImage("images/end.png");
  game_over = [loadImage("images/gameover1.png"), loadImage("images/gameover2.png"), loadImage("images/gameover3.png"), loadImage("images/gameover4.png"), loadImage("images/gameover5.png"), loadImage("images/gameover6.png")];
  levelData = [loadStrings("levels/lvl1.txt"), loadStrings("levels/lvl2.txt"), loadStrings("levels/lvl3.txt"), loadStrings("levels/lvl4.txt"), loadStrings("levels/lvl5.txt"), loadStrings("levels/lvl6.txt"), ];
  lvl_background = loadImage(`images/lvl_${nextLevel}_img.jpg`);
  next_lvl_img = loadImage("images/next_lvl.png");
  start_bg_img = loadImage("images/start_bg.png");
  ward_img = loadImage("images/ward.png");
  pause_screen = loadImage("images/pause_menu.png");
}

//setup canvas, groups, tiles, and sprites 
function setup() {
  noStroke();
  new Canvas(start_bg_img.w, start_bg_img.h + 45);
  world.gravity.y = 10;
  image(start_bg_img, 0, 0, width, height);

  //BUTTONS - could've made them a group but I'm too tired
  aBtn = new Sprite();  //about button
  imageMode = CENTER;
  aBtn.x = width/1.9;
  aBtn.y = height/1.5;
  aBtn.scale = 1.25;
  aBtn.collider = "s";

  bBtn = new Sprite();  //back button
  imageMode = CENTER;
  bBtn.x = 30;
  bBtn.y = 30;
  bBtn.collider = "s";
  bBtn.visible = false;

  // hBtn = new Sprite();  //home button
  // imageMode = CENTER;
  // hBtn.x = width/1.9;
  // hBtn.y = height/1.7;
  // hBtn.collider = "s";

  pBtn = new Sprite();  //pause button
  imageMode = CENTER;
  pBtn.x = 23;
  pBtn.y = 25;
  pBtn.collider = "s";
  pBtn.visible = false;

  // rBtn = new Sprite();  //restart button
  // imageMode = CENTER;
  // rBtn.x = width/1.9;
  // rBtn.y = height/1.7;
  // rBtn.collider = "s";

  // reBtn = new Sprite();  //resume button
  // imageMode = CENTER;
  // reBtn.x = width/2;
  // reBtn.y = height/1.7;
  // reBtn.collider = "s";

  sBtn = new Sprite();  //start button
  imageMode = CENTER;
  sBtn.x = width/1.9;
  sBtn.y = height/1.7;
  sBtn.scale = 1.25;
  sBtn.collider = "s";
  //END OF BUTTONS

  //TILES
  next_lvl = new Group();  //teleport to next level
  next_lvl.scale = 1.5;
  next_lvl.tile = "$";
  next_lvl.img = next_lvl_img;
  next_lvl.collider = "s";
  next_lvl.visible = false;

  platforms = new Group();  //platforms and walls group
  platforms.w = width/28;
  platforms.h = height/35;
  platforms.color = "black";
  platforms.tile = "=";
  platforms.collider = "s";
  platforms.visible = false;

  wards = new Group();  //wards group
  wards.w = 5;
  wards.h = 10;
  wards.tile = "!";
  wards.img = ward_img;
  wards.scale = 1/2;
  wards.collider = "s";
  wards.visible = false;

  lvl_data = levelData[0];  //loading first level
  new Tiles(
    lvl_data,
    0,
    0,
    platforms.w,
    platforms.h 
  );
  //END OF TILES

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
  enemies.visible = true;
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

function pauseMenu() {
  hBtn.img = home_button;
  reBtn.img = resume_button;
  rBtn.img = restart_button;
  redraw();
  if (hBtn.mouse.hovering()) {
    hBtn.img = home_button_hov;
  }
  if (hBtn.mouse.pressed()) {
    gameStatus = 0;
  }
  if (reBtn.mouse.hovering()) {
    reBtn.img = resume_button_hov;
  }
  if (reBtn.mouse.pressed()) {
    loop();
  }
  if (rBtn.mouse.hovering()) {
    rBtn.img = restart_button_hov;
  }
  if (rBtn.mouse.pressed()) {
    reloadLvl();
  }
}

//function that shows the start menu
function startMenu(){
  image(start_bg_img, 0, 0, width, height);
  pBtn.visible = false;
  wards.visible = false;
  platforms.visible = false;
  character.visible = false;
  nextLevel.visible = false;
  enemies.visible = false;
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

//main draw loop checking for game status
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
  else if (gameStatus === -0.5) { //game status for failure of completion of a level
    let bgNum = Math.floor(random(0, 5));
    image(game_over[bgNum], 0, 0, width, height);
    platforms.remove();
    wards.remove();
    enemies.remove();
    next_lvl.remove();
    character.visible = false;
  }
  else if (gameStatus === -1) { //game status for completion of the game
    image(gameEnd, 0, 0, width, height);
    platforms.remove();
    wards.remove();
    enemies.remove();
    next_lvl.remove();
    character.visible = false;
  }
  //translate(random(-1,1),random(-1,1)); //shaking effect
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
    pBtn.img = pause_button;
    pBtn.visible = true;
    platforms.visible = true;
    wards.visible = true;
    character.visible = true;
    if (pBtn.mouse.hovering()) {
      pBtn.img = pause_button_hov;
    }
    if (pBtn.mouse.pressed()) {
      // pauseMenu();
      image(pause_screen, width/4, height/2, width/3, height/7);
      noLoop();
    }
    if (showNext === 3) { //show teleport for the next level after collecting all 3 wards
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
    else { //add idle animation <- haha too tired
      character.ani = "idle";
      character.vel.x = 0;
    }
  }
}

function keyPressed() {
  if (keyCode === BACKSPACE) {
    reloadLvl();
    loop();
  }
  if (keyCode === ENTER) {
    loop();
  }
  if (keyCode === ESCAPE) {
    gameStatus = 0;
    loop();
  }
}

//function for failure of completion of the level
function gameOver() {
  platforms.remove();
  wards.remove();
  next_lvl.remove();
  enemies.remove();
  character.visible = false;
  enemySpawnTimer.pause();
}