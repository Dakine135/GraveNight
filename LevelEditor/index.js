let canvas = document.getElementById("editor-layer");
let render = canvas.getContext("2d");
let width = window.screen.width;
let height = window.screen.height;
canvas.width = width;
canvas.height = height;
let gridSize = 100;
let cellSize = 50;
//WORLD GRID SIZE
let worldGridSize = 32;
let maxCellSize = 150;
let buffer = 0;
let selectedColor = "blue"

//setup offscreen canvas
let offscreenCanvas = document.createElement('canvas');
offscreenCanvas.width = gridSize;
offscreenCanvas.height = gridSize;
let offscreenRender = offscreenCanvas.getContext("2d");



let currentCellLoc = {
	x: 0,
	y: 0
}

let camera = {
	x: width/2,
	y: height/2
}

let grid = [];
let centerStartX = (gridSize*worldGridSize)/2 - 500;
let centerEndX = (gridSize*worldGridSize)/2 + 500;
let centerStartY = (gridSize*worldGridSize)/2 - 500;
let centerEndY = (gridSize*worldGridSize)/2 + 500;
for(var i=0; i<gridSize; i++){
	grid[i] = [];
	for(var j=0; j<gridSize; j++){
		if(i == 0 || i == (gridSize-1) ||
		   j == 0 || j == (gridSize-1)){
		   	//console.log("im working");
			grid[i][j] = "black";
		} 
		let currentX = i*worldGridSize;
		let currentY = j*worldGridSize;
		if(centerStartX < currentX && currentX < centerEndX &&
		   centerStartY < currentY && currentY < centerEndY){
			grid[i][j] = "yellow";
		}
		else grid[i][j] = "white";
	}
}

let mouseHeld = false;
window.addEventListener("mousedown", click);
window.addEventListener("mouseup", release);
window.addEventListener("mousemove", drag);
window.addEventListener("keydown", keyPressed);
window.addEventListener('wheel', scrollEvent);
	
function scrollEvent(event){
	console.log(event);
	if(event.deltaY < 0){
		// console.log("scroll Down");
		cellSize += 1;
	} 
	else {
		// console.log("scroll up");
		cellSize -= 1;
	}
	if(cellSize <= 0){
		cellSize = 1;
	}
	else if(cellSize > maxCellSize){
		cellSize = maxCellSize;
	}
	console.log(cellSize);
	updateScreen();
}

function goToColor(x,y){
	let currCell = getCellAtLocation(x,y);
	if(prevCellLoc.x != currCell.x || prevCellLoc.y != currCell.y){
		prevCellLoc = getCellAtLocation(x,y);
		// switch(selectedColor){
		// 	case "blue":
		// 		colorCell(x, y);
		// 		break;
		// 	case "red":
		// 		colorCell(x,y);
		// 		break;
		//}
		colorCell(x,y);
	}
}

function colorCell(x, y){
	let location = getCellAtLocation(x,y);
	if(grid[location.x][location.y] == selectedColor){
		grid[location.x][location.y] = "white";
	}
	else{
		grid[location.x][location.y] = selectedColor;
	}
	// grid[location.x][location.y] = selectedColor;	
	updateScreen();
}
function getCellAtLocation(x,y){
	let locationX = Math.floor(x/cellSize);
	let locationY = Math.floor(y/cellSize);
	if(locationX > gridSize-1){
		locationX = gridSize-1;
	}
	else if(locationX < 0){
		locationX = 0;
	}
	if(locationY > gridSize-1){
		locationY = gridSize-1;
	}
	else if(locationY < 0){
		locationY = 0;
	}
	return {x:locationX, y:locationY};
}

function keyPressed(event){
	// console.log(event.key);
	let increment = 10;
	let currCamX = camera.x;
	let currCamY = camera.y;
	switch(event.key){
		case "w":
			camera.y = camera.y-increment;
			break;
		case "a":
			camera.x = camera.x-increment;
			break;
		case "s":
			camera.y = camera.y+increment;
			break;
		case "d":
			camera.x = camera.x+increment;
			break;
		case "n":
			downloadPNG();
			break;
	}
	if(camera.x-width/2 < 0 || 
		camera.y-height/2 < 0 || 
		camera.x+width/2 > gridSize*cellSize || 
		camera.y+height/2 > gridSize*cellSize){
		camera.x = currCamX;
		camera.y = currCamY;
	}
	updateScreen();
}
function downloadPNG(){
	let name = window.prompt("Name your map", "name")

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

function updateMiniMap(){
	//set each pixel of the canvas based off grid color
	for(var i=0; i<grid.length; i++){
    	for(var j=0; j<grid[i].length; j++){
    		offscreenRender.fillStyle = grid[i][j];
    		offscreenRender.fillRect(i, j, 1, 1);
    	}
    };
}

function click(event)
{
	mouseHeld=true;
	let canvasX = event.x - canvas.offsetLeft;
	let canvasY = event.y - canvas.offsetTop;
	let x = canvasX+(camera.x-width/2);
	let y = canvasY+(camera.y-height/2);
	prevCellLoc = getCellAtLocation(x,y);
	if(prevCellLoc.x == 0 && prevCellLoc.y == 0){
		selectedColor = "blue";
	}
	else if(prevCellLoc.x == 1 && prevCellLoc.y == 0){
		selectedColor = "red";
	}
	colorCell(x, y);
}
function release(event){
	mouseHeld = false;
}
let prevCellLoc = {
	x: 0,
	y: 0
}
function drag(event){
	let canvasX = event.x - canvas.offsetLeft;
	let canvasY = event.y - canvas.offsetTop;
	let x = canvasX+(camera.x-width/2);
    let y = canvasY+(camera.y-height/2);
	if(mouseHeld){
		goToColor(x, y);
	}
	else{
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
    let startX = (camera.x - width /2);
    let startY = (camera.y - height/2);
    let endX   = (camera.x + width /2);
    let endY   = (camera.y + height/2);
    let viewStart = getCellAtLocation(startX, startY);
    let viewEnd = getCellAtLocation(endX, endY);
    render.save();
    render.translate(
    	-startX,
    	-startY
    );
    // console.log(viewStart.x, viewStart.y);
    for(var i=viewStart.x; i<viewEnd.x+1; i++){
    	for(var j=viewStart.y; j<viewEnd.y+1; j++){
    		//console.log(grid[i][j]);
    		offscreenRender.fillStyle = grid[i][j];
    		offscreenRender.fillRect(i, j, 1, 1);
    		render.fillStyle = grid[i][j];
    		render.fillRect(buffer+(i*cellSize), buffer+(j*cellSize), cellSize, cellSize);
    		render.lineWidth = 1;
    		render.strokeStyle = "black";
    		render.strokeRect(buffer+(i*cellSize), buffer+(j*cellSize), cellSize, cellSize);
    	}
    };

    //draw cursor cell location
    render.fillStyle = "rgba(0, 0, 255, 0.3)";
    render.fillRect(buffer+currentCellLoc.x, buffer+currentCellLoc.y, cellSize, cellSize);
    render.restore();

    //minimap
    render.lineWidth = 10;
	render.strokeStyle = "green";
	render.strokeRect(width-gridSize-10, 0, gridSize+10, gridSize
		+10);
    render.drawImage(offscreenCanvas, width-gridSize-5, 5);
}

updateMiniMap();
updateScreen();