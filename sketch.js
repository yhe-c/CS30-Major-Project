// Hair My Screams 2.0
// Eesha He
// Date
//
// Extra for Experts:
// ...

let lvl_background;

function preload() {
  lvl_background = loadImage("images/lvl_1_img.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  image(lvl_background, width/3, 0, width/2.75, height);
}
