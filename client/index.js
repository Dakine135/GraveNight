var socket;
socket = io();

function setup() {
  createCanvas(1000, 800);
  noStroke();
}

socket.on('drawing', (data)=>{
	console.log(data);
	fill(random(255),random(255),random(255));
	ellipse(data.x, data.y, 10, 10);
});


function draw() {
  if(mouseIsPressed){
     fill(0); 
     ellipse(mouseX, mouseY, 10, 10);
     socket.emit('draw',{x:mouseX, y:mouseY});
  }
   // else{
   //  fill(220); 
   // }
  
}  