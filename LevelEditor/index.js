let canvas = document.getElementById("editor-layer");
let render = canvas.getContext("2d");
let width = window.screen.width;
let height = window.screen.height;
canvas.width = width;
canvas.height = height;
let gridSize = 200;
let cellSize = 50;
let buffer = 0;
let currentCellLoc = {
	x: 0,
	y: 0
}

let grid = [];
for(var i=0; i<gridSize; i++){
	grid[i] = [];
	for(var j=0; j<gridSize; j++){
		grid[i][j] = "white";
	}
};

let mouseHeld = false;
window.addEventListener("mousedown", click);
window.addEventListener("mouseup", release);
window.addEventListener("mousemove", drag);

function colorCell(x, y){
	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;
	console.log("x:" + x + " y:" + y);
	let locationX = Math.floor(x/cellSize);
	let locationY = Math.floor(y/cellSize);
	grid[locationX][locationY] = "blue";
	updateScreen();
}
function click(event)
{
  mouseHeld=true;
  colorCell(event.x, event.y);
}
function release(event){
	mouseHeld = false;
}
function drag(event){
	if(mouseHeld){
		colorCell(event.x, event.y);
	}
	else{
		var x = event.x;
		var y = event.y;
		x -= canvas.offsetLeft;
		y -= canvas.offsetTop;
		console.log("x:" + x + " y:" + y);
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

    
    for(var i=0; i<grid.length; i++){
    	for(var j=0; j<grid[i].length; j++){
    		render.fillStyle = grid[i][j];
    		render.fillRect(buffer+(i*cellSize), buffer+(j*cellSize), cellSize, cellSize);
    		render.strokeStyle = "black";
    		render.strokeRect(buffer+(i*cellSize), buffer+(j*cellSize), cellSize, cellSize);
    	}
    };

    render.fillStyle = "rgba(0, 0, 255, 0.3)";
    render.fillRect(buffer+currentCellLoc.x, buffer+currentCellLoc.y, cellSize, cellSize);

}

updateScreen();