const Utilities = require('./Utilities.js');

// exports.createGrid = ({
// 	bucketSize=500
// })=>{
// 	return
// }

function getBucketIndex(x,y, bucketSize){
	return{
		x: (Math.floor(x/bucketSize) * bucketSize),
		y: (Math.floor(y/bucketSize) * bucketSize)
	}
}

function getBucket(grid, x,y, bucketSize){
	let bucketIndex = getBucketIndex(x, y, bucketSize);
	if(grid == null || grid[bucketIndex.x] == null) return {};
	if(grid[bucketIndex.x][bucketIndex.y] == null) return {};
	return grid[bucketIndex.x][bucketIndex.y];
}

exports.addObject = (grid, obj)=>{
	if(obj == null || obj.x == null || obj.y == null){
		Utilities.error('Grid addObject needs x and y properties');
	}

	if(grid == null) Utilities.error('Grid addObject needs a grid');
	//TODO needs to add obj to multiple buckets if it is contained in multiple
	//width and height not taken into account, only center point

	//TODO would also we great to support an angle or direction
	//grid buckets will be 100x100
	//floor objects location to nearest 100 to get index
	let bucketSize = 100;
	let bucketIndex = getBucketIndex(obj.x, obj.y, bucketSize);
	console.log("addObject to bucket:", bucketIndex.x, bucketIndex.y);
	if(grid[bucketIndex.x] == null) grid[bucketIndex.x] = {};
	if(grid[bucketIndex.x][bucketIndex.y] == null) grid[bucketIndex.x][bucketIndex.y] = {};
	grid[bucketIndex.x][bucketIndex.y][obj.id] = obj;
}//addObject

exports.getObjects = ({
	grid=Utilities.error('getObjects needs Grid'),
	x           = 0,
	y           = 0,
	distance    = 500,
	angle       = 0,
	fieldOfView = (Math.PI*2) //default full 360, aka all around
})=>{
	let bucketSize  = 100;
	let startIndexX = x - distance;
	let startIndexY = y - distance;
	let endIndexX   = x + distance;
	let endIndexY   = y + distance;
	let currentX    = startIndexX;
	let currentY    = startIndexY;
	let objectsInRange = {};
	while(currentX <= endIndexX){
		while(currentY <= endIndexY){
			let objectsFound = getBucket(grid, currentX, currentY, bucketSize);
			objectsInRange = {...objectsInRange, ...objectsFound};
			currentY += bucketSize;
		}
		currentY = startIndexY;
		currentX += bucketSize;
	}
	return objectsInRange;

}//getObjects