var socket;
//socket = io();

let incrementer = 0;
let objects = [];

class Box{
  constructor(x,y,size){
    this.x = x;
    this.y = y;
    this.size = size;
  }
  rand(){
    this.x = Math.floor(random(windowWidth-this.size));
    this.y = Math.floor(random(windowHeight-this.size));
  }
  draw(){
    rect (this.x, this.y, this.size, this.size);
  }
  collide(box){
    
  }

}

let rec = new Box(100,100,50);
objects.push(rec);

let rec2 = new Box(500,500,50);
objects.push(rec2);

let player = {
  x: 50,
  y: 50,
  size: 50,
  speed: 10,
  move: function(x,y){
    this.x += (x * this.speed);
    this.y += (y * this.speed);
  },
  draw: function(){
    rect (this.x, this.y, this.size, this.size);
  }
}
objects.push(player);
console.log(objects);


//runs once at load
function setup() {
  createCanvas(windowWidth, windowHeight); //fun screen
  noStroke();
}

function windowResized() {
  //https://p5js.org/reference/#/p5/resizeCanvas
  resizeCanvas(windowWidth, windowHeight);
}

//listens to server when it sends a drawing event (another person is drawing)
// socket.on('drawing', (data)=>{
// 	console.log(data);
// 	fill(random(255),random(255),random(255));
// 	ellipse(data.x, data.y, 10, 10);
// });


//runs every frame of animation
function draw() {
   background(200); //background "wipes" the screen every frame
  let mouse = {x:round(mouseX), y:round(mouseY)};
  // if(mouseIsPressed){
  //    fill(0); 
  //    ellipse(mouse.x, mouse.y, 10, 10);
  //    // socket.emit('draw',mouse);
  // }

  objects.forEach((item)=>{
    item.draw();
  });
  
  
  incrementer++;
  if(incrementer % 75 == 0) {
    rec.rand();
    rec2.rand();
  }

  if (keyIsDown(65)) {
    player.move(-1,0);
  }

  if (keyIsDown(68)) {
    player.move(1,0);
  }

  if (keyIsDown(87)) {
    player.move(0,-1);
  }

  if (keyIsDown(83)) {
    player.move(0,1);
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


  //draw crosshair
  let size = 10;
  stroke(100);
  line(mouse.x-size, mouse.y, mouse.x+size, mouse.y);
  line(mouse.x, mouse.y-size, mouse.x, mouse.y+size);
}  