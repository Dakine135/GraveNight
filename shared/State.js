const Player = require('./Player.js');
const Block = require('./Block.js');
const Hitbox = require('./Hitbox.js');
const Utilities = require('./Utilities.js');
const Grid = require('./Grid.js');
const World = require('./World.js');
//const Objects = require('./Objects.js'); //Doesnt exist yet

exports.createStartState = ({
	debug = false,
	startTime = 0,
	world = null
})=>{
	console.log("start State");
	return {
		tick: 0,
		time: startTime,
		debug: debug,
		players: {},
		world: world,
		actions: []
	};
}//create Start state

exports.createNextState = (previousState, currentTime)=>{
	if(previousState == null || previousState == undefined){
		Utilities.error('no previousState given in createNextState');
	}
	//copy previousState and process actions
	let newStateObj = {};
	newStateObj.tick = previousState.tick + 1;
	newStateObj.time = currentTime;
	newStateObj.debug = previousState.debug;
	newStateObj.world = previousState.world; //intentionally a reference
	newStateObj.players = Object.assign({}, previousState.players);
	newStateObj.actions = [];
	// newStateObj.delta = [];
	processActions(newStateObj, previousState);
	updatePlayersMutate(newStateObj, newStateObj.time);
	return newStateObj;
} //createNextState


//maybe later be able to roll back to a previous state and continue from there
// exports.createStateFrom = ({
// 	tickNumber = Utilities.error('No tickNumber given in createStateFrom')
// })=>{

// }//create State From

function processActions(state, previousState){
	let actions = previousState.actions;
	//move threw actions backwards (first in first out)
	var startTime = previousState.time;
	for(var i=0; i<actions.length; i++){
		//process action on state
		let action = actions[i];
		let player = state.players[action.socketId];
		if(player == null) {
			console.log("No Player",action.socketId); 
			return;
		}
		//compensate for ping and time difference
		//TODO should roll back to previous state and re-simulate the ticks to full incorporate the change at the time the client did the action from their perspective.
	
		// console.log("process action:",action.time);
		switch(action.type){
			case "playerMove":
				Player.setMovementDirectionMutate(player, action);
				break;
			case "playerCursor":
				// console.log("BEFORE player.cursor:",player.cursorX, player.cursorY);
				Player.setCursorMutate(player, action);
				// console.log("AFTER player.cursor:",player.cursorX, player.cursorY);
				break;
			default:
				console.log("Unknown action");
		}
	}//for each action
} //processActions
exports.processActions = processActions;

exports.simulateForClient = (state, currentTime)=>{
	// console.log("simulateForClient", state.actions.length);
	processActions(state, state);
	state.actions = [];
	updatePlayersMutate(state, currentTime);
	updateObjectsMutate(state, currentTime);
}


exports.addPlayer = (state, info)=>{
	let player = Player.create(info);
	// console.log(player);
	state.players[player.socketId] = player;
}

exports.removePlayer = (state, info)=>{
	delete state.players[info.socketId];
	// state.delta.push({change:"removePlayer",playerId:info.socketId});
}

exports.addAction = (state, action)=>{
	// console.log("addAction", action);
	if(action == null) Utilities.error("action null in addAction");
	if(action.type == null) Utilities.error("action needs type addAction");
	state.actions.push(action);
	// console.log(State.toString(state,{verbose:true}));
}

function updatePlayersMutate(state, currentTime){
	for(var id in state.players){
		let player = state.players[id];
		let playerMoved = Player.updateCreateNew(player, currentTime);
		if(player.x != playerMoved.x || player.y != playerMoved.y){
			// console.log("============Update Player==========");
			//do collision check on temp playerMoved
			let colliding = getColliding(state, playerMoved);
			if(colliding){
				// console.log("colliding with: ", colliding);
				playerMoved.x = player.x;
				playerMoved.y = player.y;
			}
			// console.log("====================================");
		}
		//apply change to main player in state
		state.players[id] = playerMoved;
	}
}//update players
exports.updatePlayersMutate = updatePlayersMutate;

// function updateObjectsMutate(state, currentTime){
// 	for(var id in state.objects){
// 		Objects.updateMutate(state.Objects[id], currentTime);
// 	}
// }//update objects
// exports.updateObjectsMutate = updateObjectsMutate;

function updatePlayerNetworkData(state, data){
	let player = state.players[data.socketId];
	player.ping = data.ping;
	player.timeDiffernce = data.timeDiffernce;
}
exports.updatePlayerNetworkData = updatePlayerNetworkData;

function getObjectsInRange({
		state=null, 
		x=0,
		y=0,
		distance=50
	}){
	// console.log(state);
	//get objects in World
	let objectsInRange = World.getObjects({
		world: state.world, 
		x: x, 
		y: y, 
		distance: distance
	});
	//get other players in Range
	// for(var id in state.players){
	// 	let player = state.players[id];
	// 	//skip over if yourself
	// 	if(player.x == x && player.y == y) continue;
	// 	//check distance and add if in range.
	// }
	return objectsInRange;
}
exports.getObjectsInRange = getObjectsInRange;

/*
 	Return what you are colliding with or null
*/
function getColliding(state, obj){
	let objectsInRange = getObjectsInRange({
		state:state, 
		x: obj.x,
		y: obj.y,
		distance: 50
	});
	// console.log("objectsInRange get colliding:", objectsInRange);
	let colliding = null;
	for(var id in objectsInRange){
		let otherObj = objectsInRange[id];
		let collisionBool = Hitbox.colliding(obj, otherObj);
		if(collisionBool){
			colliding=otherObj;
		} 
	}
	return colliding;
}
exports.getColliding = getColliding;

function updateWithNewData(state, data){
	// console.log("data:",data);
	for(var property in data){
		if(property == 'players'){
			for(var id in data.players){
				let existingPlayer = state.players[id];
				let serverPlayer = data.players[id];
				// check if player is already in
				if(existingPlayer == null || existingPlayer == undefined){
					//create player
					state.players[id] = Player.create(serverPlayer);
					if(state.debug) console.log("new Player:",state.players);
				} else {
					//update player
					if(state.debug) console.log("updatePlayer");
					Player.updateFromPlayerMutate(existingPlayer, serverPlayer);
				}
			}//for each player in data
		}
		// else if(property == 'delta'){
		// 	for(var id in data.delta){
		// 		console.log(delta[id]);
		// 	}
		// }
		else{
			state[property] = data[property];
		}
	}//for every key on data
}
exports.updateWithNewData = updateWithNewData;

function clone(state){
	let newStateObj = {};
	newStateObj.tick = state.tick;
	newStateObj.time = state.time;
	newStateObj.debug = state.debug;
	newStateObj.actions = [];
	newStateObj.world = state.world //intentionally a reference
	state.actions.forEach((action)=>{
		newStateObj.actions.push(Utilities.cloneObject(action));
	});
	newStateObj.players = {};
	for(var id in state.players){
		newStateObj.players[id] = Utilities.cloneObject(state.players[id]);
	}
	newStateObj.blocks = {};
	for(var id in state.blocks){
		newStateObj.blocks[id] = Utilities.cloneObject(state.blocks[id]);
	}
	// newStateObj.objects = {};
	// for(var id in state.objects){
	// 	newStateObj.objects[id] = Utilities.cloneObject(state.objects[id]);
	// }
	return newStateObj;
}
exports.clone = clone;

exports.InterpolateCreateNew = (startState, endState, percent)=>{
	let newStateObj = {};
	let differnceInTick = endState.tick - startState.tick;
	newStateObj.tick = startState.tick + (differnceInTick*percent);
	let differnceInTime = endState.time - startState.time;
	newStateObj.time = startState.time + (differnceInTime*percent);
	newStateObj.debug = startState.debug;
	newStateObj.actions = [];
	newStateObj.players = {};
	newStateObj.world = startState.world; //intentionally a reference
	for(var id in startState.players){
		let intermediatePlayer = Utilities.cloneObject(startState.players[id]);
		if(endState.players[id] != null){
			//calculate the difference in location between the states
			let playerEnd = endState.players[id];
			let diffX = intermediatePlayer.x - playerEnd.x;
			intermediatePlayer.x = intermediatePlayer.x - (diffX * percent);
			let diffY = intermediatePlayer.y - playerEnd.y;
			intermediatePlayer.y = intermediatePlayer.y - (diffY * percent);

			//TODO check for but when rotated through Math.PI
			let diffAngle = intermediatePlayer.angle - playerEnd.angle;
			intermediatePlayer.angle = intermediatePlayer.angle - (diffAngle * percent);
		}
		
		newStateObj.players[id] = intermediatePlayer;
	}
	// newStateObj.objects = {};
	// for(var id in startState.objects){
	// 	newStateObj.objects[id] = Utilities.cloneObject(startState.objects[id]);
	// 	//TODO intermediate objects
	// }
	return newStateObj;
}

exports.package = ({
		state=Utilities.error("package needs state"),
		previousState=null, 
		playerId=null,
		full=false
	})=>{
	let tempPackage = null;
	if(full || (previousState == null && playerId == null)){
		//send entire thing
		tempPackage = {
			type:'full',
			tick: state.tick,
			time: state.time,
			players: state.players,
			//staticObjects: state.staticObjects
		}
	}
	else if(playerId == null){
		//send delta, but all changes
		tempPackage = {
			type:'delta',
			tick: state.tick,
			time: state.time,
			players: state.players,
			//staticObjects: state.staticObjects
		}
	}
	else{
		//send only delta in range of player
		//TODO make only in range of player
		tempPackage = {
			type:'deltaRange',
			tick: state.tick,
			time: state.time,
			players: state.players,
			myPlayer: state.players[playerId],
			// delta: state.delta,
			//staticObjects: state.staticObjects
		}
	}
	if(state.debug) console.log("State in State.package",state);
	return tempPackage;
}//package

exports.toString = (state,{verbose=false})=>{
	if(state == null){
		console.log("state null in state.toString");
		return "State Null";
	}
	if(verbose){
		let playerNames = [];
		for(var id in state.players){
		   		playerNames.push(state.players[id].name);
		   }
		return `Tick:${state.tick}, `+
		   `Time:${state.time}, `+
		   `Players:${playerNames}, `+
		   // `Objects:${Object.keys(state.objects).length}, `+
		   `Actions:${state.actions.length}`;
	}
	return `Tick:${state.tick}, `+
		   `Players:${Object.keys(state.players).length}, `+
		   // `Objects:${Object.keys(state.objects).length}, `+
		   `Actions:${state.actions.length}`;
} //toString