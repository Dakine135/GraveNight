import Player from '../../shared/Player.js';
import State from '../../shared/State.js';
import Utilities from '../../shared/Utilities.js';

export default class StatesManager{
	constructor({
		debug=false, 
		debugState=false,
		sk=Utilities.error('client needs render')
	}){
		console.log("Create State Manager");
		this.debug = debug;
		this.debugState = debugState;
		this.state = State.createStartState({debug:this.debugState});
		this.nextState = State.createNextState(this.state);
		this.sk = sk;
	}//constructor

	/*
	Currently takes entire state each time, ideally we would just take in delta and construct from previous State TODO.
	But also only take in what is in the vicinity of the client.

	We are keeping the nextState and only drawing the "last State" from the server, this way we can interpolate between frames. We can generate more frames than the server can send states.
	*/
	reciveServerState(data){
		if(this.debug) console.log("StateManager Server Update",data);
		// if(this.debug) console.log("================================");
		// if(this.debug) console.log("CurrentState:",this.state);
		// if(this.debug) console.log("NextState:",this.nextState);
		// if(this.debug) console.log("================================");
		if(this.nextState != null) this.state = State.clone(this.nextState);
		State.updateWithNewData(this.nextState, data);
	}

	

	draw(){
		let drawingState = this.getIntermediateState();
		if(drawingState == null) return;
		// console.log(drawingState.toString({verbose:true}));
		for(var id in drawingState.players){
			Player.draw(drawingState.players[id], this.sk);
		}
		for(var id in drawingState.objects){
			// drawingState.objects[id].draw(this.sk);
		}
	}//draw

	getIntermediateState(){
		//TODO interperlate between this.state and this.nextState
		//Needs to add timestamps to ticks
		return this.state;
	}

	getPlayer(Id){
		return this.state.players[Id];
	}


} //States class


/*
==================================================================
*/

// class State{
// 	constructor({tick=0, debug=false}){
// 		this.players = {};
// 		this.objects = {};
// 		this.tick=tick;
// 		this.debug = debug;
// 	}

// 	updateWithServerData(data){
// 		this.tick = data.tick;
// 		for(var id in data.players){
// 			let existingPlayer = this.players[id];
// 			// console.log("id:", id);
// 			// console.log("this.players:", this.players);
// 			// console.log("existingPlayer:", existingPlayer);
			
// 			let serverPlayer = data.players[id];
// 			// check if player is already in
// 			if(existingPlayer == null || existingPlayer == undefined){
// 				//create player
// 				this.players[id] = Player.create(serverPlayer);
// 				if(this.debug) console.log("new Player:",this.players);
// 			} else {
// 				//update player
// 				if(this.debug) console.log("updatePlayer");
// 				Player.updateFromPlayerMutate(existingPlayer, serverPlayer);
// 			}
// 		}
// 		for(var id in data.objects){
// 			// check if object is already in
// 		}
// 	}

// 	clone(){
// 		let newClone = new State({tick:this.tick});
// 		for(var id in this.players){
// 			newClone.players[id] = Utilities.cloneObject(this.players[id]);
// 		}
// 		for(var id in this.objects){
// 			newClone.objects[id] = Utilities.cloneObject(this.objects[id]);
// 		}
// 		return newClone;
// 	}

// 	toString({verbose=false}){
// 		if(verbose){
// 			let playerNames = [];
// 			for(var id in this.players){
// 				console.log("toString Loop:",id,this.players);
// 			   		playerNames.push(this.players[id].name);
// 			   }
// 			return `Tick:${this.tick}, `+
// 			   `Players:${playerNames}, `+
// 			   `Objects:${Object.keys(this.objects).length}, `;
// 		}
// 		return `Tick:${this.tick}, `+
// 			   `Players:${Object.keys(this.players).length}, `+
// 			   `Objects:${Object.keys(this.objects).length}, `;
// 	}//toString
// } //State class