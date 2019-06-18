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
		this.currentState.removePlayer(info);
    }

    addAction(action){
    	if(this.debug) console.log("Adding action to tick", this.currentState.tick, action);
    	this.currentState.addAction(action);
    }

    package({tickNumber=this.currentState.tick}){
    	return this.states[tickNumber].package();
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
		//need time stamps

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
			this.updatePlayers();
			this.updateObjects();
		}
	} //constructor

	addPlayer(info){
		let player = new Player(info);
		this.players[player.socketId] = player;
	}

	removePlayer(info){
		delete this.players[info.socketId];
	}

	addAction(action){
		this.actions.push(action);
		// console.log(this.toString({verbose:true}));
	}

	processActions(actions){
		//move threw actions backwards (first in first out)
		for(var i=0; i<actions.length; i++){
			//process action on state
			let action = actions[i];
			//console.log("process action:",action);
			switch(action.type){
				case "playerMove":
					let player = this.players[action.socketId];
					player.setMovement(action);
					break;
				default:
					console.log("Unknown action");
			}
		}//for each action
	} //processActions

	updatePlayers(){
		for(var id in this.players){
			this.players[id].update();
		}
	}//update players

	updateObjects(){

	}//update objects

	package(){
		return {
			tick: this.tick,
			players: this.players,
			objects: this.objects
		}
	}

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