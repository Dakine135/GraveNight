class Networking{
	constructor({debug=false}){
		console.log("Create Networking");
		this.debug = debug;
		this.socket = io();
		this.mySocketId = null;

		this.socket.on('start', this.clientConnects.bind(this));
		this.socket.on('serverGameState', this.processGameState.bind(this));

	}//constructor

	clientConnects(data){
		//create local player with socket Id
		this.mySocketId = data.socketId;
	} //clientConnects

	processGameState(data){
		if(this.debug) console.log("Networking:",data);
		STATES.reciveServerState(data);
	} //processGameState

	sendClientAction(data){
		this.socket.emit('clientAction', data);
	}

}//NETWORKING


