class StatesManager{
	constructor({debug=false}){
		console.log("Create State Manager");
		this.debug = debug;
		this.nextState = new State({tick:1});
		this.state = new State({tick:0});
	}//constructor

	/*
	Currently takes entire state each time, ideally we would just take in delta and construct from previous State TODO.
	But also only take in what is in the vicinity of the client.

	We are keeping the nextState and only drawing the "last State" from the server, this way we can interpolate between frames. We can generate more frames than the server can send states.
	*/
	reciveServerState(data){
		// if(this.debug) console.log("StateManager Server Update",data);
		// console.log("================================");
		// console.log("CurrentState:",this.state);
		// console.log("NextState:",this.nextState);
		// console.log("================================");
		if(this.nextState != null) this.state = this.nextState.clone();
		this.nextState.updateWithServerData(data);
	}

	

	draw(){
		let drawingState = this.getIntermediateState();
		if(drawingState == null) return;
		// console.log(drawingState.toString({verbose:true}));
		for(var id in drawingState.players){
			drawingState.players[id].draw();
		}
		for(var id in drawingState.objects){
			drawingState.objects[id].draw();
		}
	}//draw

	getIntermediateState(){
		//TODO interperlate between this.state and this.nextState
		//Needs to add timestamps to ticks
		return this.state;
	}


} //States class


/*
==================================================================
*/

class State{
	constructor({tick=0}){
		this.players = {};
		this.objects = {};
		this.tick=tick;
	}

	updateWithServerData(data){
		this.tick = data.tick;
		for(var id in data.players){
			let existingPlayer = this.players.id;
			// console.log("this.players:", this.players);
			// console.log("id:", id);
			// console.log("existingPlayer:", existingPlayer);
			
			let serverPlayer = data.players[id];
			// check if player is already in
			if(existingPlayer == null || existingPlayer == undefined){
				//create player
				this.players[id] = new Player(serverPlayer);
				// console.log("new Player:",this.players);
			} else {
				//update player
				console.log("updatePlayer");
				existingPlayer.update(serverPlayer);
			}
		}
		for(var id in data.objects){
			// check if object is already in
		}
	}

	clone(){
		let newClone = new State({tick:this.tick});
		for(var id in this.players){
			newClone.players[id] = this.players[id].clone();
		}
		for(var id in this.objects){
			newClone.objects[id] = this.objects[id].clone();
		}
		return newClone;
	}

	toString({verbose=false}){
		if(verbose){
			let playerNames = [];
			for(var id in this.players){
				console.log("toString Loop:",id,this.players);
			   		playerNames.push(this.players[id].name);
			   }
			return `Tick:${this.tick}, `+
			   `Players:${playerNames}, `+
			   `Objects:${Object.keys(this.objects).length}, `;
		}
		return `Tick:${this.tick}, `+
			   `Players:${Object.keys(this.players).length}, `+
			   `Objects:${Object.keys(this.objects).length}, `;
	}//toString
} //State class