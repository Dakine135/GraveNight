const Player = require('../../shared/Player.js');
const State = require('../../shared/State.js');
const Utilities = require('../../shared/Utilities.js');

module.exports = class StatesManager{
	constructor({
		debug=false, 
		debugState=false,
		stateInterpolation=true,
		clientSimulation=true,
		engine=null
	}){
		console.log("Create State Manager");
		this.debug = debug;
		this.debugState = debugState;
		this.stateInterpolation = stateInterpolation;
		this.clientSimulation = clientSimulation;
		this.state = State.createStartState({debug:this.debugState});
		this.frameState = this.state;
		this.serverState = State.createNextState(this.state);
		//set by server tick, then added as delta time progresses, not actual system time
		this.currentDeltaTime = 0;
		this.currentTimeInSimulation = 0;
		this.ENGINE = engine;

		//debugging client and server simulations differences
		this.serverUpdateCount = 0;

		//stats
		this.timeSinceLastServerUpdate = 0;
		this.serverUpdatesPerSecond = 10;
	}//constructor

	/*
	Currently takes entire state each time, ideally we would just take in delta and construct from previous State TODO.
	But also only take in what is in the vicinity of the client.

	We are keeping the serverState and only drawing the "last State" from the server, this way we can interpolate between frames. We can generate more frames than the server can send states.
	*/
	reciveServerState(data){
		if(this.debug) console.log("StateManager Server Update",data);
		// if(this.debug) console.log("================================");
		// if(this.debug) console.log("CurrentState:",this.state);
		// if(this.debug) console.log("NextState:",this.serverState);
		// if(this.debug) console.log("================================");

		// if(this.serverState != null) this.state = State.clone(this.serverState);
		// if(this.serverState != null) State.copyProperties(this.state, this.serverState);
		this.serverUpdateCount++;
		this.timeSinceLastServerUpdate = this.currentDeltaTime;
		this.currentDeltaTime = 0;
		//TODO need function to migrate properties from server state to main client state before overwriting with latest server
		State.updateWithNewData(this.serverState, data);
		//TODO need to make smooth corrections to client state where off to keep aligned with server
		if(this.serverState != null && this.serverUpdateCount < 3) State.copyProperties(this.state, this.serverState);
		this.state.time = this.serverState.time;
		// State.updateWithNewData(this.state, data);
		if(this.timeSinceLastServerUpdate > 0){
			this.serverUpdatesPerSecond = 
				((1000/this.timeSinceLastServerUpdate)*0.8) + 
				(this.serverUpdatesPerSecond*0.2);
			this.ENGINE.HUD.debugUpdate({
				serverUPS: Math.round(this.serverUpdatesPerSecond),
				serverDeltaUpdates: this.timeSinceLastServerUpdate
			});
		}
	}//reciveServerState

	update(deltaTime){
		this.currentTimeInSimulation = this.state.time + deltaTime;
		if(this.clientSimulation) State.simulateForClient(this.state, this.currentTimeInSimulation);
	}

	draw(deltaTime){
		let drawingState = this.getIntermediateState(deltaTime);

		if(drawingState == null) return;
		// console.log(drawingState.toString({verbose:true}));
		//TODO only draw players in range of you
		for(var id in drawingState.players){
			let player = drawingState.players[id];
			Player.draw(player, this.ENGINE.render, this.ENGINE.CAMERA);
		}

		//for debug when comparing server and client states
		if(this.serverState == null) return;
		for(var id in this.serverState.players){
			let player = this.serverState.players[id];
			player.name = "Server";
			Player.draw(player, this.ENGINE.render, this.ENGINE.CAMERA);
		}
		
	}//draw

	//TODO this should only interpolate others, and not your own player
	getIntermediateState(deltaTime){
		this.currentDeltaTime += deltaTime;
		if(!this.stateInterpolation){
			//trying to fix Cycle collector issues
			// let tempState = State.clone(this.state);
			// this.frameState = tempState;
			// return this.frameState;
			this.frameState = this.state;
			return this.frameState;
		}
		//interpolate between this.state and this.serverState
		let totalTimeBetweenStates = this.serverState.time - this.state.time;
		let percent = this.currentDeltaTime / totalTimeBetweenStates;
		// console.log("Percent:",percent);
		if(percent >= 1){
			this.frameState = this.serverState;
			return this.serverState;
		}
		else{
			this.frameState = State.InterpolateCreateNew(this.state, this.serverState, percent);
			return this.frameState;
		}
	}// getIntermediateState

	getPlayersInRange({ 
		x=0,
		y=0,
		distance=50
	}){
		return State.getPlayersInRange({
						state: this.frameState, x:x, y:y, distance: distance
					});
	}//getPlyaersInRange

	removePlayer(info){
		if(this.debug) console.log(`Removing Player ${info}`);
		State.removePlayer(this.state, info);
  }// remove Player

  //apply player actions immediately for smoothness
  //difficulty is in making the actions results line up with the server's result
  //otherwise it'll snap around.
  //TODO
  addAction(action){
  	if(this.debug) console.log("Adding action to tick", this.state.tick, action);
  	State.addAction(this.state, action);
  }

	getPlayer(Id){
		return this.state.players[Id];
	}


} //States class