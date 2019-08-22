const Utilities = require('./Utilities.js');
const Grid = require('./Grid.js');
const Block = require('./Block.js');

exports.create = ({
	width=1000,
	height=1000,
	gridSize=32,
	blockCount=0,
	saveTo=null
})=>{
	if(saveTo){
		saveTo.width = width,
		saveTo.height = height,
		saveTo.gridSize = gridSize,
		saveTo.blockCount = blockCount,
		saveTo.grid={}
	}
	return {
		width: width,
		height: height,
		gridSize: gridSize,
		blockCount:0,
		grid:{}
	}
}

function addStaticObject(world, info){
	let newObject = null;
	switch(info.type){
		case 'block':
			newObject = Block.create(info);
			break;
		default:
			console.log("Unknown static Object Type");
	}
	if(newObject != null){
		Grid.addObject(world.grid, newObject);
	}
}//addStaticObject
exports.addStaticObject = addStaticObject;

function addBlock(world, info){
		world.blockCount++;
		info.id = world.blockCount;
		info.type = 'block';
		addStaticObject(world, info);
}//add Block
exports.addBlock = addBlock;

function createBounderies(world){
	let topWorld = {x:0, y:-(world.height/2), width:world.width, height:world.gridSize};
    let bottomWorld = {x:0, y:(world.height/2), width:world.width, height:world.gridSize};
    let leftWorld = {x:-(world.width/2), y:0, width:world.gridSize, height:world.height};
    let rightWorld = {x:(world.width/2), y:0, width:world.gridSize, height:world.height};
    addBlock(world, topWorld);
    addBlock(world, bottomWorld);
    addBlock(world, leftWorld);
    addBlock(world, rightWorld);
}
exports.createBounderies = createBounderies;

function randomWorld(world){
	//avoid rendering block in spawn area around origin
	let spawnAreaStartX = -500;
	let spawnAreaStartY = -500;
	let spawnAreaEndX = 500;
	let spawnAreaEndY = 500;
    //add random blocks
    let startPointX = -((world.width/2)-(world.gridSize/2));
    let endPointX = (world.width/2)-(world.gridSize/2);
    let startPointY = -((world.height/2)-(world.gridSize/2));
    let endPointY = (world.height/2)-(world.gridSize/2);
    for(var x=startPointX; x<endPointX; x+=world.gridSize){
      for(var y=startPointY; y<endPointY; y+=world.gridSize){
        //for every gridSize px block
        if(spawnAreaStartY < y && y < spawnAreaEndY &&
           spawnAreaStartX < x && x < spawnAreaEndX) continue;
        let chance = Math.random();
        if(chance < 0.05){
          addBlock(world, {x:x, y:y, width:world.gridSize, height:world.gridSize});
        }
      }//loop through rows
    }//loop through columns
}//random Blocks
exports.randomWorld = randomWorld;

exports.getObjects = ({
	world=Utilities.error('getObjects needs world'),
	x=0,
	y=0,
	distance=500
})=>{
	// console.log("world in getObjects:", world);
	return Grid.getObjects({
		grid:world.grid,
		x:x,
		y:y,
		distance:distance
	})
}//getObjects
