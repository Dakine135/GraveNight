
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
	ticRate: 100, //delay between ticks  16.667 is 60 a second
	debugEngine: false,
  debugStateManager: false, 
	debugStates: false,
  verbose: true,
	io:io
};
var gameEngine = new Engine(config);
// gameEngine.createWorld({
  
// });

//trying to be hacky about sockets not starting until bundle was created
let waitTime = 6000;
console.log(`Wait ${waitTime} then startSocketIO`);
setTimeout(startSocketIO, waitTime);

function startSocketIO(){
  console.log("start WebSockets");
  reload(app);
  gameEngine.start();
  io.sockets.on('connection', (socket)=>{
    //Client first connects
    console.log("a user connected: ", socket.id);
    //create a player
    gameEngine.addPlayer({socketId:socket.id});
    gameEngine.sendWorld({socketId:socket.id});
    gameEngine.sendFullState({socketId:socket.id});

    socket.emit('start',{socketId:socket.id});
    

    socket.on('clientAction', (data)=>{
      data['socketId'] = socket.id;
      // console.log('clientAction:', data);
      gameEngine.clientAction(data);
      // socket.broadcast.emit('drawing', data);
    });

    socket.on('sendPing', ping);
        function ping(){
            var serverTime = new Date().getTime();
            //console.log("Server Time: ", serverTime);
            socket.emit('pong', serverTime);
        }

    socket.on('disconnecting', () => {
          console.log("client disconnected: ", socket.id);
          gameEngine.removePlayer({socketId:socket.id});
    });

  });//new connection "per socket"
}

