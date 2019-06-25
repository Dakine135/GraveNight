const Player = require('./Player.js');
const Utilities = require('./Utilities.js');

exports.createStartState = ({
	debug = false
})=>{
	console.log("start State");
	return {
		tick: 0,
		time: new Date().getTime(),
		debug: debug,
		players: {},
		objects: {},
		actions: []
	};
}//creat Start state

exports.createNextState = (previousState)=>{
	if(previousState == null || previousState == undefined){
		Utilities.error('no previousState given in createNextState');
	}
	//copy previousState and process actions
	let newStateObj = {};
	newStateObj.tick = previousState.tick++;
	newStateObj.time = new Date().getTime();
	newStateObj.debug = previousState.debug;
	newStateObj.players = Object.assign({}, previousState.players);
	newStateObj.objects = Object.assign({}, previousState.objects);
	newStateObj.actions = [];
	processActions(newStateObj, previousState.actions);
	updatePlayersMutate(newStateObj);
	// updateObjectsMutate(newStateObj);
	return newStateObj;
} //createNextState


//maybe later be able to roll back to a previous state and continue from there
// exports.createStateFrom = ({
// 	tickNumber = Utilities.error('No tickNumber given in createStateFrom')
// })=>{

// }//create State From

function processActions(state, actions){
	//move threw actions backwards (first in first out)
	for(var i=0; i<actions.length; i++){
		//process action on state
		let action = actions[i];
		//console.log("process action:",action);
		let player = state.players[action.socketId];
		switch(action.type){
			case "playerMove":
				Player.setMovementMutate(player, action);
				break;
			case "playerRotate":
				Player.setAngleMutate(player, action);
				break;
			default:
				console.log("Unknown action");
		}
	}//for each action
} //processActions


exports.addPlayer = (state, info)=>{
	let player = Player.create(info);
	// console.log(player);
	state.players[player.socketId] = player;
}

exports.removePlayer = (state, info)=>{
	delete state.players[info.socketId];
}

exports.addAction = (state, action)=>{
	state.actions.push(action);
	// console.log(this.toString({verbose:true}));
}

function updatePlayersMutate(state){
	for(var id in state.players){
		Player.updateMutate(state.players[id]);
	}
}//update players
exports.updatePlayersMutate = updatePlayersMutate;

function updateObjectsMutate(){
	for(var id in state.objects){
		Objects.updateMutate(state.Objects[id]);
	}
}//update objects
exports.updateObjectsMutate = updateObjectsMutate;

function updateWithNewData(state, data){
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
		else if(property == 'objects'){
			for(var id in data.objects){
				// check if object is already in
			}
		}
		else{
			state[property] = data.property;
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
	newStateObj.players = {};
	for(var id in state.players){
		newStateObj.players[id] = Utilities.cloneObject(state.players[id]);
	}
	newStateObj.objects = {};
	for(var id in state.objects){
		newStateObj.objects[id] = Utilities.cloneObject(state.objects[id]);
	}
	return newStateObj;
}
exports.clone = clone;

exports.package = (state)=>{
	if(state == null) console.log("state null in state.package");
	if(state.debug) console.log("State in State.package",state);
	return {
		tick: state.tick,
		time: state.time,
		players: state.players,
		objects: state.objects
	}
}

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
		   `Objects:${Object.keys(state.objects).length}, `+
		   `Actions:${state.actions.length}`;
	}
	return `Tick:${state.tick}, `+
		   `Players:${Object.keys(state.players).length}, `+
		   `Objects:${Object.keys(state.objects).length}, `+
		   `Actions:${state.actions.length}`;
} //toString