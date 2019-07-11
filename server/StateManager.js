const Player = require('../shared/Player.js');
const State = require('../shared/State.js');
const Utilities = require('../shared/Utilities.js');

module.exports = class StateManager{
    constructor({debug=false, debugState=false, verbose=false, startTime=0}){
        this.states = {};
        this.blockCount = 0;
        let startState = State.createStartState({debug:debugState, startTime:startTime});
        this.currentState = startState;
        this.states[0] = startState;
        this.currentTime = 0;
        this.debug = debug;
        this.verbose = verbose;
        if(this.debug) console.log('Creating State Manager');
    }

    createNextState(tick, deltaTime){
        this.currentTime = this.currentTime + deltaTime;
        // console.log("currentTime:", this.currentTime);
    	if(tick != (this.currentState.tick + 1)) Utilities.error('tick out of sync somehow');
    	let newState = State.createNextState(this.currentState, this.currentTime);
    	this.currentState = newState;
    	this.states[tick] = newState;
        if(tick>100) delete this.states[tick-100]; //only store last 100 ticks for memory
    	if(this.debug) console.log(State.toString(newState, {verbose:this.verbose}));
    }

    addPlayer(info){
    	if(this.debug) console.log(`Adding Player ${JSON.stringify(info)}`);
    	State.addPlayer(this.currentState, info);
    }

    removePlayer(info){
		if(this.debug) console.log(`Removing Player ${info}`);
		State.removePlayer(this.currentState, info);
    }

    addAction(action){
    	if(this.debug) console.log("Adding action to tick", this.currentState.tick, action);
    	State.addAction(this.currentState, action);
    }

    updatePlayerNetworkData(data){
        if(this.debug) console.log(`updatePlayerNetworkData Player ${JSON.stringify(data)}`);
        State.updatePlayerNetworkData(this.currentState, data);
    }

    // addBlock(info){
    //     info.id = this.blockCount;
    //     info.type = 'block';
    //     State.addStaticObject(this.currentState, info);
    //     this.blockCount++;
    // }

    //TODO make it build state Delta instead of sending entire state everyTime
    //TODO also only send nearby objects instead of all, this would be per-client of course
    package({tick=this.currentState.tick, playerId=null, full=false}){
    	let state = this.states[tick];
        let previousState = this.states[tick-1];
    	if(this.debug) console.log("Package in StateManager tick:", tick, state);
    	return State.package({
            state:this.states[tick], 
            playerId:playerId, 
            previousState:previousState,
            full:full
        });
    }
}