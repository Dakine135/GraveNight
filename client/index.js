var socket;
socket = io();

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
  if(mouseIsPressed){
     fill(0); 
     ellipse(mouse.x, mouse.y, 10, 10);
     // socket.emit('draw',mouse);
  }

  //draw crosshair
  let size = 10;
  stroke(100);
  line(mouse.x-size, mouse.y, mouse.x+size, mouse.y);
  line(mouse.x, mouse.y-size, mouse.x, mouse.y+size);
}  