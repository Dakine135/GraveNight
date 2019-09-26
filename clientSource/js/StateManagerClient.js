import Player from '../../shared/Player.js';
// import Block from '../../shared/Block.js';
import State from '../../shared/State.js';
import Utilities from '../../shared/Utilities.js';

export default class StatesManager{
	constructor({
		debug=false, 
		debugState=false,
		stateInterpolation=true,
		clientSimulation=true,
		render=Utilities.error('client needs render'),
		CAMERA = Utilities.error('client needs CAMERA')
	}){
		console.log("Create State Manager");
		this.debug = debug;
		this.debugState = debugState;
		this.stateInterpolation = stateInterpolation;
		this.clientSimulation = clientSimulation;
		this.state = State.createStartState({debug:this.debugState});
		this.frameState = this.state;
		this.nextState = State.createNextState(this.state);
		//set by server tick, then added as delta time progresses, not actual system time
		this.currentDeltaTime = 0;
		this.render = render;
		this.CAMERA = CAMERA;

		//debugging client and server simulations differences
		this.serverUpdateCount = 0;

		//stats
		this.timeSinceLastServerUpdate = 0;
		this.serverUpdatesPerSecond = 10;
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

		// if(this.nextState != null) this.state = State.clone(this.nextState);
		// if(this.nextState != null) State.copyProperties(this.state, this.nextState);
		this.serverUpdateCount++;
		this.timeSinceLastServerUpdate = this.currentDeltaTime;
		this.currentDeltaTime = 0;
		State.updateWithNewData(this.nextState, data);
		if(this.nextState != null && this.serverUpdateCount < 3) State.copyProperties(this.state, this.nextState);
		// State.updateWithNewData(this.state, data);
		if(this.timeSinceLastServerUpdate > 0){
			this.serverUpdatesPerSecond = Math.round(
				((1000/this.timeSinceLastServerUpdate)*0.7) + 
				(this.serverUpdatesPerSecond*0.3)
			);
		}
	}//reciveServerState

	update(deltaTime){
		let currentTimeInSimulation = this.state.time + deltaTime;
		if(this.clientSimulation) State.simulateForClient(this.state, currentTimeInSimulation);
	}

	draw(deltaTime){
		let drawingState = this.getIntermediateState(deltaTime);

		if(drawingState == null) return;
		// console.log(drawingState.toString({verbose:true}));
		//TODO only draw players in range of you
		for(var id in drawingState.players){
			Player.draw(drawingState.players[id], this.render, this.CAMERA);
		}

		//for debug when comparing server and client states
		if(this.nextState == null) return;
		for(var id in this.nextState.players){
			let player = this.nextState.players[id];
			player.name = "Server";
			Player.draw(player, this.render, this.CAMERA);
		}
		
	}//draw

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
		//interpolate between this.state and this.nextState
		let totalTimeBetweenStates = this.nextState.time - this.state.time;
		let percent = this.currentDeltaTime / totalTimeBetweenStates;
		// console.log("Percent:",percent);
		if(percent >= 1){
			this.frameState = this.nextState;
			return this.nextState;
		}
		else{
			this.frameState = State.InterpolateCreateNew(this.state, this.nextState, percent);
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
    }

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