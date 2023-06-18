// Hair My Screams 2.0
// Eesha He
// Monday, June 19, 2023
//////////////////////////////////////////////////////////////

//initiating global variables
let aBtn, bBtn, hBtn, pBtn, rBtn, reBtn, sBtn;
let ab_page, about_page;
let about_button, back_button, start_button;
let about_button_hov, back_button_hov, start_button_hov;
let background_music;
let character, character_img, character_idle, character_walk;
let enemies, enemy_img, enemy_movement;
let enemySpawnTimer;
let gameEnd, game_over, game_over_menu, game_over_screen;
let gameStatus = 0;
let lvl_background;
let lvl_data, levelData;
let musicSlider;
let next_lvl, next_lvl_img;
let nextLevel = 1;
let pause_button, pause_button_hov, pause_menu, pause_screen, paused;
let platforms;
let showNext = 0;
let start_bg_img;
let state = true;
let wards, ward_img;

//preload audio, images and level data
function preload() {
  //AUDIO
  background_music = loadSound("audio/zoldyck_theme.mp3");

  //BUTTONS - probably could've used and array for each button to half the clutter but I'm too tired
  about_button = loadImage("images/about_btn.png");
  about_button_hov = loadImage("images/about_btn_h.png");
  back_button_hov = loadImage("images/back_btn_h.png");
  back_button = loadImage("images/back_btn.png");
  pause_button = loadImage("images/pause_btn.png");
  pause_button_hov = loadImage("images/pause_btn_h.png");
  start_button = loadImage("images/start_btn.png");
  start_button_hov = loadImage("images/start_btn_h.png");
  //END OF BUTTONS

  //OTHER IMAGES/DATA
  about_page = loadImage("images/about_page.png");
  character_img = loadImage("images/f1.png");
  enemy_img = loadImage("images/enemy0.png");
  gameEnd = loadImage("images/end.png");
  game_over_screen = loadImage("images/game_over_menu.png");
  game_over = [loadImage("images/gameover1.png"), loadImage("images/gameover2.png"), loadImage("images/gameover3.png"), loadImage("images/gameover4.png"), loadImage("images/gameover5.png"), loadImage("images/gameover6.png")];
  levelData = [loadStrings("levels/lvl1.txt"), loadStrings("levels/lvl2.txt"), loadStrings("levels/lvl3.txt"), loadStrings("levels/lvl4.txt"), loadStrings("levels/lvl5.txt"), loadStrings("levels/lvl6.txt"), ];
  lvl_background = loadImage(`images/lvl_${nextLevel}_img.jpg`);
  next_lvl_img = loadImage("images/next_lvl.png");
  pause_screen = loadImage("images/pause_menu.png");
  start_bg_img = loadImage("images/start_bg.png");
  ward_img = loadImage("images/ward.png");
}

//setup canvas, groups, tiles, and sprites 
function setup() {
  background_music.loop();
  background_music.setVolume();
  musicSlider = createSlider(0, 1, 0.25, 0.01);
  musicSlider.position(1055, 15);
  musicSlider.style("width", "100px");
  new Canvas(start_bg_img.w, start_bg_img.h + 45);
  world.gravity.y = 10;
  image(start_bg_img, 0, 0, width, height);
  noStroke();
  
  //BUTTONS
  aBtn = new Group();  //about button
  imageMode = CENTER;
  aBtn.x = width/1.9;
  aBtn.y = height/1.5;
  aBtn.scale = 1.25;
  aBtn.collider = "s";
  aBtn.remove();
  
  bBtn = new Group();  //back button
  imageMode = CENTER;
  bBtn.x = 30;
  bBtn.y = 30;
  bBtn.collider = "s";
  bBtn.visible = false;
  
  pBtn = new Group();  //pause button
  imageMode = CENTER;
  pBtn.x = 25;
  pBtn.y = 25;
  pBtn.collider = "s";
  pBtn.remove();

  sBtn = new Group();  //start button
  imageMode = CENTER;
  sBtn.x = width/1.9;
  sBtn.y = height/1.7;
  sBtn.scale = 1.25;
  sBtn.collider = "s";
  sBtn.remove();
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

  //enemy group
  enemies = new Group();
  enemies.img = enemy_img;
  enemies.x = 40;
  enemies.y = 60;
  enemies.collider = "k"; 
  enemies.rotationLock = true; 
  enemies.addAni("images/enemy0.png", "images/enemy1.png", "images/enemy2.png", "images/enemy1.png");
  enemies.ani.frameDelay = 10;
  enemySpawnTimer = new Timer(10000 - 1000 * nextLevel);
  enemies.remove();

  //character sprite     
  character = new Sprite();
  character.img = character_img;
  character.collider = "d";
  character.friction = 0;
  character.rotationLock = true;
  character.overlaps(wards, collect);
  character.overlaps(enemies, game);
  character.overlaps(next_lvl, updateLvl);
  character_idle = loadAni("images/f1.png");
  character_idle.frameDelay = 10;
  character.addAni("idle", character_idle);
  character_walk = loadAni("images/f1.png", "images/f2.png", "images/f3.png");
  character_walk.frameDelay = 8;
  character.addAni("walk", character_walk);
  character.visible = false;
  
  //pause menu
  pause_menu = new Group();
  pause_menu.img = pause_screen;
  pause_menu.x = width/2;
  pause_menu.y = height/2;
  pause_menu.scale = 2;
  pause_menu.collider = "s";
  pause_menu.remove();

  //game over menu
  game_over_menu = new Group();
  game_over_menu.img = game_over_screen;
  game_over_menu.x = width/2;
  game_over_menu.y = height/1.2;
  game_over_menu.scale = 2;
  game_over_menu.collider = "s";
  game_over_menu.remove();
}

//function to spwan enemies
function spawnEnemy() {
  enemies.visible = true;
  new enemies.Sprite();
  for (let i = 0; i < enemies.length; i++) {
    enemySequence(i);
  }
}

//function for enemy movement sequencing
async function enemySequence(i) {
  let x = random(0, width);
  let y = random(0, height);
  await enemies[i].moveTo(x, y, nextLevel);
  await delay(10000 - 1000*nextLevel);
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
    reloadLvl();
  }
  else {
    gameStatus = -1;
  }
}

//function to load or reload a level as needed
function reloadLvl() {
  enemySpawnTimer;
  enemySpawnTimer = new Timer(10000 - 1000 * nextLevel);
  enemySpawnTimer.start();
  wards.remove();
  enemies.remove();
  next_lvl.remove();
  platforms.remove();
  character.x = 35;
  character.y = 45;
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
  pBtn.visible = false;
  wards.visible = false;
  platforms.visible = false;
  character.visible = false;
  nextLevel.visible = false;
  enemies.visible = false;
  aBtn.img = about_button;
  sBtn.img = start_button;
  new aBtn.Sprite();
  new sBtn.Sprite();
  if (sBtn.mouse.hovering()) {
    sBtn.img = start_button_hov;
  }
  if (sBtn.mouse.pressed()) {
    enemySpawnTimer.start();
    new pBtn.Sprite();
    reloadLvl();
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
    new bBtn.Sprite();
    aBtn.visible = false;
  }
}

//main draw loop checking for game status
function draw() {
  let vol = musicSlider.value();
  background_music.setVolume(vol);
  if (gameStatus === 0) { //game status for showing the start menu
    startMenu();
  }
  else if (gameStatus === 0.5) { //game status for showing the about page
    aboutPage();
  }
  else if (gameStatus === 1) { //game status for starting the game
    clear();
    startGame();
  }
  else if (gameStatus === -0.5) { //game status for failure of completion of a level
    gameOver();
  }
  else if (gameStatus === -1) { //game status for completion of the game
    image(gameEnd, 0, 0, width, height);
    platforms.remove();
    wards.remove();
    enemies.remove();
    next_lvl.remove();
    pBtn.remove();
    character.visible = false;
  }
  //translate(random(-1,1),random(-1,1)); //shaking effect
}

//function that starts and runs most of the game
function startGame() {
  image(lvl_background, 0, 0, width, height);
  if (enemySpawnTimer.expired()) { //spawns an enemy every x-amount of time
    spawnEnemy();
    enemySpawnTimer.start();
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
      new pause_menu.Sprite();
      paused = true;
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
    if (paused) {
      pause_menu.remove();
      paused = false;
      reloadLvl();
      loop();
    }
    else if (gameStatus === -0.5) {
      game_over_menu.remove();
      gameStatus = 1;
      reloadLvl();
      loop();
    } 
  }
  if (keyCode === ENTER) {
    pause_menu.remove();
    loop();
  }
  if (keyCode === ESCAPE) {
    if (paused) {
      enemies.remove();
      pause_menu.remove();
      paused = false;
      gameStatus = 0;
      loop();
    }
    else if (gameStatus === -0.5) {
      enemies.remove();
      game_over_menu.remove();
      gameStatus = 0;
      loop();
    } 
  }
}

function game() {
  gameStatus = -0.5;
}

//function for failure of completion of the level
function gameOver() {
  let bgNum = Math.floor(random(0, 6));
  image(game_over[bgNum], 0, 0, width, height);
  new game_over_menu.Sprite();
  wards.remove();
  enemies.remove();
  next_lvl.remove();
  platforms.remove();
  pBtn.visible = false;
  character.visible = false;
  enemySpawnTimer.pause();
  noLoop();
}