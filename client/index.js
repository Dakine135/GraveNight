var STATES;
var CONTROLS;
var NETWORK;


//runs once at load
function setup() {
  console.log("Start P5 Setup");
  createCanvas(windowWidth, windowHeight); //fun screen
  STATES = new States({debug:true});
  NETWORK = new Networking({debug:false});
  CONTROLS = new Controls({debug:false});
  console.log("End P5 Setup");
}

function windowResized() {
  //https://p5js.org/reference/#/p5/resizeCanvas
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed(){
  CONTROLS.keyPressed(keyCode, key);
}

function keyReleased(){
  CONTROLS.keyReleased(keyCode, key);
}


//runs every frame of animation
function draw() {
   background(200); //background "wipes" the screen every frame
  let mouse = {x:round(mouseX), y:round(mouseY)};


  //draw cross-hair
  let size = 10;
  stroke(100);
  line(mouse.x-size, mouse.y, mouse.x+size, mouse.y);
  line(mouse.x, mouse.y-size, mouse.x, mouse.y+size);
}  

var collideRectRect = function (box1, box2) {
  let x = box1.x;
  let y = box1.y; 
  let w = box1.size;
  let h = box1.size;
  let x2 = box2.x;
  let y2 = box2.y; 
  let w2 = box2.size;
  let h2 = box2.size;
  //2d
  //add in a thing to detect rectMode CENTER
  if (x + w >= x2 &&    // r1 right edge past r2 left
      x <= x2 + w2 &&    // r1 left edge past r2 right
      y + h >= y2 &&    // r1 top edge past r2 bottom
      y <= y2 + h2) {    // r1 bottom edge past r2 top
        return true;
  }
  return false;
};