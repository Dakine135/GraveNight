let canvas = document.getElementById("editor-layer");
let render = canvas.getContext("2d");
let width = window.screen.width;
let height = window.screen.height;
canvas.width = width;
canvas.height = height;
let gridSize = 200;
let cellSize = 20;
let buffer = 0;
let currentCellLoc = {
	x: 0,
	y: 0
}

let camera = {
	x: width/2,
	y: height/2
}

let grid = [];
for(var i=0; i<gridSize; i++){
	grid[i] = [];
	for(var j=0; j<gridSize; j++){
		if(i == 0 || i == (gridSize-1) ||
		   j == 0 || j == (gridSize-1)){
			grid[i][j] = "black";
		} 
		else grid[i][j] = "white";
	}
};

let mouseHeld = false;
window.addEventListener("mousedown", click);
window.addEventListener("mouseup", release);
window.addEventListener("mousemove", drag);
window.addEventListener("keydown", keyPressed);
window.addEventListener("keyup", keyReleased);

function colorCell(x, y){
	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;
	//console.log("x:" + x + " y:" + y);
	let locationX = Math.floor(x/cellSize);
	let locationY = Math.floor(y/cellSize);
	grid[locationX][locationY] = "blue";
	updateScreen();
}

function keyPressed(event){
	console.log(event.key);
	let increment = 10;
	switch(event.key){
		case "w":
			camera.y = camera.y+increment;
			break;
		case "a":
			camera.x = camera.x+increment;
			break;
		case "s":
			camera.y = camera.y-increment;
			break;
		case "d":
			camera.x = camera.x-increment;
			break;
		case "n":
			downloadPNG();
			break;
	}
	updateScreen();
}
function keyReleased(event){

}
function downloadPNG(){
	let name = window.prompt("Name your map", "name")
	//setup canvas
	let offscreenCanvas = document.createElement('canvas');
	offscreenCanvas.width = gridSize;
	offscreenCanvas.height = gridSize;
	let offscreenRender = offscreenCanvas.getContext("2d");

	//set each pixel of the canvas based off grid color
	for(var i=0; i<grid.length; i++){
    	for(var j=0; j<grid[i].length; j++){
    		offscreenRender.fillStyle = grid[i][j];
    		offscreenRender.fillRect(i, j, 1, 1);
    	}
    };

	//download canvas pixels as PNG
	let url = offscreenCanvas.toDataURL();
	let a = document.createElement('a');
	a.download = name;
	a.href = url;
	a.textContent = 'Download PNG';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	delete a;
}
function click(event)
{
  mouseHeld=true;
  let x = event.x-(camera.x-width/2);
  let y = event.y-(camera.y-height/2);
  colorCell(x, y);
}
function release(event){
	mouseHeld = false;
}
function drag(event){
	let x = event.x-(camera.x-width/2);
    let y = event.y-(camera.y-height/2);
	if(mouseHeld){
		colorCell(x, y);
	}
	else{
		x -= canvas.offsetLeft;
		y -= canvas.offsetTop;
		//console.log("x:" + x + " y:" + y);
		currentCellLoc.x = Math.floor(x/cellSize) * cellSize;
		currentCellLoc.y = Math.floor(y/cellSize) * cellSize;
		updateScreen();
	}
}

function updateScreen(){
	render.save();
    render.setTransform(1, 0, 0, 1, 0, 0);
    render.clearRect(0, 0, width, height);
    render.beginPath();
    render.restore();

    render.save();
    render.translate(
    	(camera.x-width/2),
    	(camera.y-height/2)
    );
    for(var i=0; i<grid.length; i++){
    	for(var j=0; j<grid[i].length; j++){
    		render.fillStyle = grid[i][j];
    		render.fillRect(buffer+(i*cellSize), buffer+(j*cellSize), cellSize, cellSize);
    		render.strokeStyle = "black";
    		render.strokeRect(buffer+(i*cellSize), buffer+(j*cellSize), cellSize, cellSize);
    	}
    };

    //draw cursor cell location
    render.fillStyle = "rgba(0, 0, 255, 0.3)";
    render.fillRect(buffer+currentCellLoc.x, buffer+currentCellLoc.y, cellSize, cellSize);
    render.restore();
}

updateScreen();