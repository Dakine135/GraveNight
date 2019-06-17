class States{
	constructor({debug=false}){
		console.log("Create State Manager");
		this.debug = debug;
		this.nextState = null;
		this.state = null;
		this.previousState = null;
	}//constructor

	/*
	Currently takes entire state each time, ideally we would just take in delta and construct from previous State TODO.
	But also only take in what is in the vicinity of the client.

	We are keeping the nextState and only drawing the "last State" from the server, this way we can interpolate between frames. We can generate more frames than the server can send states.
	*/
	reciveServerState(data){
		if(this.debug) console.log("StateManager Receive Server Update",data);
		this.previousState = this.state;
		this.state = this.nextState;
		this.nextState = new State(this.data);
	}


} //States class


/*
==================================================================
*/

class State{
	constructor(state){
		
	}
	updateWithServerData(data){
		// this.players = {};
		// this.objects = {};
		// for(var id in data.players){
		// 	// check if player is already in
		// }
	}
}