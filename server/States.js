var Player = require('./Player.js');

module.exports = class States{
    constructor({debug=false}){
        this.states = {};
        this.currentState = null;
        this.debug = debug;
        if(this.debug) console.log('Creating State Manager');
    }

    createState(tickNumber){
    	let newState = new State(tickNumber, this.currentState);
    	this.currentState = newState;
    	this.states[tickNumber] = newState;
    	if(this.debug) console.log(newState.toStringCounts());
    }

    addPlayer(info){
    	if(this.debug) console.log(`Adding Player ${info}`);
    	this.currentState.addPlayer
    }

    removePlayer(info){
		if(this.debug) console.log(`Removing Player ${info}`);
    }
}

/*
======================================================================
*/

class State{
	constructor(tickNumber, previousState){
		if(previousState == null && tickNumber != 1){
			throw new Error('no previousState given in state constructor');
		}

		this.tick = tickNumber;

		//if first state
		if(previousState == null){
			console.log("start State");
			this.players = {};
			this.objects = {};
			this.actions = [];
		} else {
			//copy previousState and process actions
			this.players = Object.assign({}, previousState.players);
			this.objects = Object.assign({}, previousState.objects);
			this.actions = [];
			this.processActions(previousState.actions);
		}
	} //constructor

	processActions(){
		//move threw actions backwards (first in first out)
		for(var i=(this.actions.length-1); i>=0; i--){
			//process action on state

			//remove from actions
			this.actions.splice(i,1);
		}//for each action
	} //processActions

	toStringCounts(){
		return `Tick:${this.tick}, `+
			   `Players:${Object.keys(this.players).length}, `+
			   `Objects:${Object.keys(this.objects).length}, `+
			   `Actions:${this.actions.length}`;
	}
}