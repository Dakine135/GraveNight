const Utilities = require('./Utilities.js');

// exports.createGrid = ()=>{

// }

exports.addObject = (grid, obj)=>{
	if(obj == null || obj.x == null || obj.y == null){
		Utilities.error('Grid addObject needs x and y properties');
	}

	if(grid == null) Utilities.error('Grid addObject needs a grid');
	//grid buckets will be 100x100
	//floor objects location to nearest 100 to get index
	let bucketSize = 100;
	let indexX = Math.floor(obj.x/bucketSize) * bucketSize;
	let indexY = Math.floor(obj.y/bucketSize) * bucketSize;
	console.log("addObject to bucket:", indexX, indexY);
	if(grid[indexX] == null) grid[indexX] = [];
	if(grid[indexX][indexY] == null) grid[indexX][indexY] = [];
	grid[indexX][indexY].push(obj);
}