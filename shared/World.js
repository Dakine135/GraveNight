const Utilities = require('./Utilities.js');
const Grid = require('./Grid.js');
const Block = require('./Block.js');

exports.create = ({
	width=1000,
	height=1000,
	gridsize=50
})=>{
	return {
		width: width,
		height: height,
		gridsize: gridsize,
		blockCount:0,
		grid:[]
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
		// state.delta.push({change:"addStaticObject", obj:newObject});
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
	let topWorld = {x:0, y:-(world.height/2), width:world.width, height:world.gridsize};
    let bottomWorld = {x:0, y:(world.height/2), width:world.width, height:world.gridsize};
    let leftWorld = {x:-(world.width/2), y:0, width:world.gridsize, height:world.height};
    let rightWorld = {x:(world.width/2), y:0, width:world.gridsize, height:world.height};
    addBlock(world, topWorld);
    addBlock(world, bottomWorld);
    addBlock(world, leftWorld);
    addBlock(world, rightWorld);
}
exports.createBounderies = createBounderies;

function randomWorld(world){
	// createBounderies(world);

    //add random blocks
    let startPointX = -((world.width/2)-(world.gridsize/2));
    let endPointX = (world.width/2)-(world.gridsize/2);
    let startPointY = -((world.height/2)-(world.gridsize/2));
    let endPointY = (world.height/2)-(world.gridsize/2);
    for(var x=startPointX; x<endPointX; x+=world.gridsize){
      for(var y=startPointY; y<endPointY; y+=world.gridsize){
        //for every 50px block
        let chance = Math.random();
        if(chance < 0.01){ //1%
          addBlock(world, {x:x, y:y, width:world.gridsize, height:world.gridsize});
        }

      }
    }
}//random Blocks
exports.randomWorld = randomWorld;

