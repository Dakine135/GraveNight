var socket;
socket = io();

socket.on('serverGameState', processGameState);

function processGameState(data){
	console.log(data);
}