const Player = require('../shared/Player.js');
const State = require('../shared/State.js');
const Utilities = require('../shared/Utilities.js');

module.exports = class StateManager{
    constructor({debug=false, debugState=false, verbose=false}){
        this.states = {};
        let startState = State.createStartState({debug:debugState});
        this.currentState = startState;
        this.states[0] = startState;
        this.debug = debug;
        this.verbose = verbose;
        if(this.debug) console.log('Creating State Manager');
    }

    createNextState(tick){
    	if(tick != (this.currentState.tick + 1)) Utilities.error('tick out of sync somehow');
    	let newState = State.createNextState(this.currentState);
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

    package({tick=this.currentState.tick}){
    	let state = this.states[tick];
    	if(this.debug) console.log("Package in StateManager tick:", tick, state);
    	return State.package(this.states[tick]);
    }
}