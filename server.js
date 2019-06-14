
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
app.use(express.static('./client'));
reload(app);
console.log(`GraveNight server running on port ${port}`);
let config = {ticRate: 500, debugEngine: false, debugStates: true};
var gameEngine = new Engine(config);
gameEngine.start();


io.sockets.on('connection', newConnection);
function newConnection(socket){
  //Client first connects
  console.log("a user connected: ", socket.id);
  //create a player
  

  // socket.on('draw', (data)=>{
  // 	console.log('draw:', data);
  // 	socket.broadcast.emit('drawing', data);
  // });


 




  socket.on('disconnecting', () => {
        console.log("client disconnected: ", socket.id);
  });

}//new connection "per socket"