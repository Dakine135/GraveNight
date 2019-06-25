
//NPM PACKAGES
var express = require('express');
var socket = require('socket.io');
var reload = require('reload');

//Our classes or files
let Engine = require('./server/ServerEngineMain.js');
let port = 3033;



//setup Server
var app = express();
var server = app.listen(port);
var io = socket(server);
app.use(express.static('./public'));
console.log(`GraveNight server running on port ${port}`);
let config = {
	ticRate: 20, 
	debugEngine: false,
  debugStateManager: false, 
	debugStates: false,
  verbose: true,
	io:io
};
var gameEngine = new Engine(config);
gameEngine.start();

//trying to be hacky about sockets not starting until bundle was created
let waitTime = 5000;
console.log(`Wait ${waitTime} then startSocketIO`);
setTimeout(startSocketIO,waitTime);

function startSocketIO(){
  console.log("start WebSockets");
  reload(app);
  io.sockets.on('connection', (socket)=>{
    //Client first connects
    console.log("a user connected: ", socket.id);
    //create a player
    gameEngine.addPlayer({socketId:socket.id});

    socket.emit('start',{socketId:socket.id});
    

    socket.on('clientAction', (data)=>{
      data['socketId'] = socket.id;
      // console.log('clientAction:', data);
      gameEngine.clientAction(data);
      // socket.broadcast.emit('drawing', data);
    });


   




    socket.on('disconnecting', () => {
          console.log("client disconnected: ", socket.id);
          gameEngine.removePlayer({socketId:socket.id});
    });

  });//new connection "per socket"
}

