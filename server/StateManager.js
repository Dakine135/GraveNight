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

    createNextState(tick, currentTime){
        this.currentTime = currentTime;
    	if(tick != (this.currentState.tick + 1)) Utilities.error('tick out of sync somehow');
    	let newState = State.createNextState(this.currentState, this.currentTime);
    	this.currentState = newState;
    	this.states[tick] = newState;
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

    addBlock(info){
        info.id = this.blockCount;
        State.addBlock(this.currentState, info);
        this.blockCount++;
    }

    //TODO make it build state Delta instead of sending entire state everyTime
    package({tick=this.currentState.tick}){
    	let state = this.states[tick];
    	if(this.debug) console.log("Package in StateManager tick:", tick, state);
    	return State.package(this.states[tick]);
    }
}