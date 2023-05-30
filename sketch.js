// Hair My Screams 2.0
// Eesha He
// Monday, June 19, 2023

//////////////////////////////

//initiating global variables
let button;
let gameStatus = 0;
let lvl_background;
let start_bg_img;
let start_button;
let start_button_hov;

//preload images and level data
function preload() {
  start_bg_img = loadImage("images/start_bg.png");
  start_button = loadImage("images/start_btn.png");
  start_button_hov = loadImage("images/start_btn_h.png");
  lvl_background = loadImage("images/lvl_1_img.jpg");
}

function setup() {
  new Canvas(start_bg_img.w, start_bg_img.h + 45);
  image(start_bg_img, 0, 0, width, height);

  button = new Sprite();
  imageMode = CENTER;
  button.x = width/1.9;
  button.y = height/1.7;
  button.collider = "s";
}

function startMenu(){
  image(start_bg_img, 0, 0);
  button.img = start_button;
  button.scale = 1.25;
  if (button.mouse.hovering()) {
    button.img = start_button_hov;
  }
  if (button.mouse.pressing()) {
    button.img = start_button_hov;
  }
  if (button.mouse.pressed()) {
    gameStatus = 1;
  }
}

function draw() {
  if (gameStatus === 0) {
    startMenu();
  }
  else if (gameStatus === 1) {
    clear();
    image(lvl_background, 0, 0, width, height);
    startGame(gameStatus);
  }
  //translate(random(-1,1),random(-1,1));
}