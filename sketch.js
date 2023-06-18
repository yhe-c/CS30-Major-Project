// Hair My Screams 2.0
// Eesha He
// Monday, June 19, 2023
//////////////////////////////////////////////////////////////

//initiating global variables
let aBtn, bBtn, hBtn, pBtn, rBtn, reBtn, sBtn;
let about_page;
let about_button, back_button, start_button;
let about_button_hov, back_button_hov, start_button_hov;
let background_music;
let bgMusicVol;
let character, character_img, characterIdle, characterWalkAni;
let enemies, enemy_img, enemy_movement;
let enemySpawnTimer;
let game_end, game_over, gameOverMenu, game_over_screen;
let gameStatus = 0;
let lvl_background;
let lvlData, level_data;
let nextLvl, next_lvl_img;
let nextLevel = 1;
let pause_button, pause_button_hov, pauseMenu, pause_screen, paused;
let platforms;
let showNext = 0;
let selectBtnF, selectBtnM, selection_bg, select_character;
let soundJump, soundWard, soundOver;
let soundOn = true;
let start_bg_img;
let state = true;
let wards, ward_img;

//preload audio, images and level data
function preload() {
  //AUDIO
  background_music = loadSound("audio/zoldyck_theme.mp3");
  soundJump = loadSound("audio/jump_sfx.mp3");
  soundWard = loadSound("audio/ward_sfx.mp3");
  soundOver = loadSound("audio/gameover_sfx.mp4");

  //BUTTONS
  about_button = loadImage("images/about_btn.png");
  about_button_hov = loadImage("images/about_btn_h.png");
  back_button_hov = loadImage("images/back_btn_h.png");
  back_button = loadImage("images/back_btn.png");
  pause_button = loadImage("images/pause_btn.png");
  pause_button_hov = loadImage("images/pause_btn_h.png");
  select_character = [loadImage("images/select_f.png"), loadImage("images/select_f_h.png"), loadImage("images/select_m.png"), loadImage("images/select_m_h.png")];
  start_button = loadImage("images/start_btn.png");
  start_button_hov = loadImage("images/start_btn_h.png");

  //OTHER IMAGES/DATA
  about_page = loadImage("images/about_page.png");
  character_img = loadImage("images/f1.png");
  enemy_img = loadImage("images/enemy0.png");
  game_end = loadImage("images/end.png");
  game_over_screen = loadImage("images/game_over_menu.png");
  game_over = [loadImage("images/gameover1.png"), loadImage("images/gameover2.png"), loadImage("images/gameover3.png"), loadImage("images/gameover4.png"), loadImage("images/gameover5.png"), loadImage("images/gameover6.png")];
  level_data = [loadStrings("levels/lvl1.txt"), loadStrings("levels/lvl2.txt"), loadStrings("levels/lvl3.txt"), loadStrings("levels/lvl4.txt"), loadStrings("levels/lvl5.txt"), loadStrings("levels/lvl6.txt"), ];
  lvl_background = loadImage(`images/lvl_${nextLevel}_img.jpg`);
  next_lvl_img = loadImage("images/next_lvl.png");
  pause_screen = loadImage("images/pause_menu.png");
  selection_bg = loadImage("images/selection_bg.png");
  start_bg_img = loadImage("images/start_bg.png");
  ward_img = loadImage("images/ward.png");
}

//setup audio, canvas, groups, tiles, and sprites 
function setup() {
  //audio
  bgMusicVol = createSlider(0, 1, 0.25, 0.01);
  bgMusicVol.position(1055, 15);
  bgMusicVol.style("width", "100px");
  background_music.loop();
  soundJump.setVolume(0.01);
  soundWard.setVolume(0.25);
  soundOver.setVolume(0.2);
  //canvas
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

  selectBtnF = new Group(); //select female character button
  imageMode = CENTER;
  selectBtnF.x = width/4;
  selectBtnF.y = height/2;
  selectBtnF.collider = "s";
  selectBtnF.scale = 2;
  selectBtnF.remove();

  selectBtnM = new Group(); //select male character button
  imageMode = CENTER;
  selectBtnM.x = width/1.4;
  selectBtnM.y = height/2;
  selectBtnM.collider = "s";
  selectBtnM.scale = 2;
  selectBtnM.remove();
  
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
  nextLvl = new Group();  //teleport to next level
  nextLvl.scale = 1.5;
  nextLvl.tile = "$";
  nextLvl.img = next_lvl_img;
  nextLvl.collider = "s";
  nextLvl.visible = false;

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
  
  lvlData = level_data[0];  //loading first level
  new Tiles(
    lvlData,
    0,
    0,
    platforms.w,
    platforms.h 
  );
  
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
  
  //pause menu
  pauseMenu = new Group();
  pauseMenu.img = pause_screen;
  pauseMenu.x = width/2;
  pauseMenu.y = height/2;
  pauseMenu.scale = 2;
  pauseMenu.collider = "s";
  pauseMenu.remove();

  //game over menu
  gameOverMenu = new Group();
  gameOverMenu.img = game_over_screen;
  gameOverMenu.x = width/2;
  gameOverMenu.y = height/1.2;
  gameOverMenu.scale = 2;
  gameOverMenu.collider = "s";
  gameOverMenu.remove();
}

//function to collect the wards
function collect(character, ward) {
  soundWard.play();
  ward.remove();
  showNext++;
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

//function to update level when completed
function updateLvl() {
  if (nextLevel < 6) {
    lvlData = level_data[nextLevel];
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
  nextLvl.remove();
  platforms.remove();
  character.x = 35;
  character.y = 45;
  if (nextLevel === 4) { //for level 4 because the background is too dark
    platforms.color = "grey";
    new Tiles(
      lvlData,
      0,
      0,
      platforms.w,
      platforms.h
    );
  }
  else { //for every other level
    platforms.color = "black";
    new Tiles(
      lvlData,
      0,
      0,
      platforms.w,
      platforms.h
    );
  }
  nextLvl.visible = false;
  showNext = 0;
}

//function that shows the start menu
function startMenu(){
  image(start_bg_img, 0, 0, width, height);
  pBtn.visible = false;
  wards.visible = false;
  platforms.visible = false;
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
    gameStatus = 0.75;
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

function selectCharacter() {
  sBtn.remove();
  aBtn.remove();
  image(selection_bg, 0, 0, width, height);
  bBtn.img = back_button;
  new bBtn.Sprite();
  bBtn.visible = true;
  selectBtnF.img = select_character[0];
  new selectBtnF.Sprite();
  selectBtnM.img = select_character[2];
  new selectBtnM.Sprite();
  if (selectBtnF.mouse.hovering()) {
    selectBtnF.img = select_character[1];
  }
  if (selectBtnF.mouse.pressed()) {
    startIt("f");
  }
  if (selectBtnM.mouse.hovering()) {
    selectBtnM.img = select_character[3];
  }
  if (selectBtnM.mouse.pressed()) {
    startIt("m");
  }
  if (bBtn.mouse.hovering()) {
    bBtn.img = back_button_hov;
  }
  if (bBtn.mouse.pressed()) {
    selectBtnF.remove();
    selectBtnM.remove();
    bBtn.visible = false;
    sBtn.visible = true;
    aBtn.visible = true;
    gameStatus = 0;
  }
}

function startIt(char) {
  bBtn.remove();
  selectBtnF.remove();
  selectBtnM.remove();
  enemySpawnTimer.start();
  new pBtn.Sprite();
  character = new Sprite();
  character.img = character_img;
  character.collider = "d";
  character.friction = 0;
  character.rotationLock = true;
  character.overlaps(wards, collect);
  character.overlaps(enemies, game);
  character.overlaps(nextLvl, updateLvl);
  characterIdle = loadAni(`images/${char}1.png`);
  characterIdle.frameDelay = 10;
  character.addAni("idle", characterIdle);
  characterWalkAni = loadAni(`images/${char}1.png`, `images/${char}2.png`, `images/${char}3.png`);
  characterWalkAni.frameDelay = 5;
  character.addAni("walk", characterWalkAni);
  reloadLvl();
  gameStatus = 1;
  
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
      new pauseMenu.Sprite();
      paused = true;
      noLoop();
    }
    if (showNext === 3) { //show teleport for the next level after collecting all 3 wards
      nextLvl.visible = true;
    }
    if (kb.presses("up") || kb.presses("w")) { //jumping
      if (character.colliding(platforms)) {
        character.vel.y = -6.75;
        soundJump.play();
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

//main draw loop checking for game status
function draw() {
  if (soundOn) {
    soundJump.setVolume(0.01);
    soundWard.setVolume(0.25);
    soundOver.setVolume(0.2);
  }
  if (!soundOn) {
    soundJump.setVolume(0);
    soundWard.setVolume(0);
    soundOver.setVolume(0);
  }
  if (gameStatus === 0) { //game status for showing the start menu
    startMenu();
  }
  else if (gameStatus === 0.5) { //game status for showing the about page
    aboutPage();
  }
  else if (gameStatus === 0.75) {
    selectCharacter();
  }
  else if (gameStatus === 1) { //game status for starting the game
    clear();
    startGame();
  }
  else if (gameStatus === -0.5) { //game status for failure of completion of a level
    gameOver();
  }
  else if (gameStatus === -1) { //game status for completion of the game
    image(game_end, 0, 0, width, height);
    platforms.remove();
    wards.remove();
    enemies.remove();
    nextLvl.remove();
    pBtn.remove();
    character.visible = false;
  }
  let vol = bgMusicVol.value();
  background_music.setVolume(vol);
  //translate(random(-1,1),random(-1,1)); //shaking effect
}

function keyPressed() {
  if (keyCode === BACKSPACE) {
    if (paused) {
      pauseMenu.remove();
      paused = false;
      reloadLvl();
      loop();
    }
    else if (gameStatus === -0.5) {
      gameOverMenu.remove();
      gameStatus = 1;
      reloadLvl();
      loop();
    } 
  }
  if (keyCode === ENTER) {
    pauseMenu.remove();
    loop();
  }
  if (keyCode === ESCAPE) {
    if (paused) {
      character.visible = false;
      enemies.remove();
      pauseMenu.remove();
      paused = false;
      gameStatus = 0;
      loop();
    }
    else if (gameStatus === -0.5) {
      character.visible = false;
      enemies.remove();
      gameOverMenu.remove();
      gameStatus = 0;
      loop();
    } 
  }
  if (keyCode === SHIFT) {
    soundOn = !soundOn;
  }
}

function game() {
  gameStatus = -0.5;
}

//function for failure of completion of the level
function gameOver() {
  soundOver.play();
  let bgNum = Math.floor(random(0, 6));
  image(game_over[bgNum], 0, 0, width, height);
  new gameOverMenu.Sprite();
  wards.remove();
  enemies.remove();
  nextLvl.remove();
  platforms.remove();
  pBtn.visible = false;
  character.visible = false;
  enemySpawnTimer.pause();
  noLoop();
}