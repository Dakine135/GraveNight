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
    	if(this.debug) console.log(newState.toString({verbose:true}));
    }

    addPlayer(info){
    	if(this.debug) console.log(`Adding Player ${JSON.stringify(info)}`);
    	this.currentState.addPlayer(info);
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
		if(previousState == null && tickNumber != 0){
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

	addPlayer(info){
		let player = new Player(info);
		this.players[player.socketId] = player;
	}

	processActions(){
		//move threw actions backwards (first in first out)
		for(var i=(this.actions.length-1); i>=0; i--){
			//process action on state

			//remove from actions
			this.actions.splice(i,1);
		}//for each action
	} //processActions

	toString({verbose=false}){
		if(verbose){
			let playerNames = [];
			for(var id in this.players){
			   		playerNames.push(this.players[id].name);
			   }
			return `Tick:${this.tick}, `+
			   `Players:${playerNames}, `+
			   `Objects:${Object.keys(this.objects).length}, `+
			   `Actions:${this.actions.length}`;
		}
		return `Tick:${this.tick}, `+
			   `Players:${Object.keys(this.players).length}, `+
			   `Objects:${Object.keys(this.objects).length}, `+
			   `Actions:${this.actions.length}`;
	}
}