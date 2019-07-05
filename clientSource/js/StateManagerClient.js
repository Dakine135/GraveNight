import Player from '../../shared/Player.js';
import Block from '../../shared/Block.js';
import State from '../../shared/State.js';
import Utilities from '../../shared/Utilities.js';

export default class StatesManager{
	constructor({
		debug=false, 
		debugState=false,
		stateInterpolation=true,
		clientSimulation=true,
		sk=Utilities.error('client needs render'),
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
		this.sk = sk;
		this.CAMERA = CAMERA;

		//temp
		this.doLimited = 0;
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
		this.currentDeltaTime = 0;
		if(this.doLimited <= 10){
			State.updateWithNewData(this.nextState, data);
			// this.doLimited++;
		}
		
	}//reciveServerState

	draw(deltaTime){
		let currentTimeInSimulation = this.state.time + this.currentDeltaTime;
		if(this.clientSimulation) State.simulateForClient(this.state, currentTimeInSimulation);
		let drawingState = this.getIntermediateState(deltaTime);

		if(drawingState == null) return;
		// console.log(drawingState.toString({verbose:true}));
		for(var id in drawingState.players){
			Player.draw(drawingState.players[id], this.sk, this.CAMERA);
		}
		for(var id in drawingState.blocks){
			Block.draw(drawingState.blocks[id], this.sk, this.CAMERA);
		}
		
	}//draw

	getIntermediateState(deltaTime){
		this.currentDeltaTime += deltaTime;
		if(!this.stateInterpolation){
			let tempState = State.clone(this.state);
			this.frameState = tempState;
			return tempState;
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
		
	}

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