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
		//set by server tick, then added as delta time progresses, not actual system time
		this.currentTime = 0;
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
		this.currentTime = this.state.time;
		State.updateWithNewData(this.nextState, data);
	}

	

	draw(deltaTime){
		let drawingState = this.getIntermediateState(deltaTime);
		if(drawingState == null) return;
		// console.log(drawingState.toString({verbose:true}));
		for(var id in drawingState.players){
			Player.draw(drawingState.players[id], this.sk);
		}
		for(var id in drawingState.objects){
			// drawingState.objects[id].draw(this.sk);
		}
		State.processActions(this.state, this.state);
		this.state.actions = [];
	}//draw

	getIntermediateState(deltaTime){
		//interpolate between this.state and this.nextState
		this.currentTime += deltaTime;
		let totalTimeBetweenStates = this.nextState.time - this.state.time;
		let timeElapsedSinceCurrentState = this.currentTime - this.state.time;
		let percent = timeElapsedSinceCurrentState / totalTimeBetweenStates;
		// console.log("Percent:",percent);
		if(percent >= 1) return this.nextState;
		else{
			return State.InterpolateCreateNew(this.state, this.nextState, percent);
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
    	if(this.debug) console.log("Adding action to tick", this.currentState.tick, action);
    	State.addAction(this.state, action);
    }

	getPlayer(Id){
		return this.state.players[Id];
	}


} //States class