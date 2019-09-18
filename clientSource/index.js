import StatesManager from './js/StateManagerClient.js';
import Controls from './js/clientControls.js';
import Networking from './js/networking.js';
import Camera from './js/Camera.js';
import Lighting from './js/lighting.js';
import Hud from './js/hud.js';
import Background from './js/background.js';
import World from '../shared/World.js';
import Block from '../shared/Block.js';

console.log("index.js loaded in bundle");
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var STATES = {};
var CONTROLS = {};
var NETWORK = {};
var CAMERA = {};
var LIGHTING = {};
var HUD = {};
var BACKGROUND = {};
var WORLD = {};
var RENDERDISTANCE = 1000; //latter set by window size
var FRAMERATE = 60;
var DARKNESS = 0.98; //1 full dark, 0 full light
var BRIGHTNESS = 1;  //1 full white, 0 no light
var WORLDGRIDSIZE = 32;

//main layer with players and walls
let divId = "main-layer";
var canvas = document.getElementById(divId);
var render = canvas.getContext("2d");

var currentTime = new Date().getTime();
var lastFrame = currentTime;
var lastSecond = currentTime;
var lastFrames = 0;
var frames = 0;

function setup(){
    console.log("Start Setup");
    console.log("Screen Size: ", WIDTH, HEIGHT);
    canvas.width  = WIDTH;
    canvas.height = HEIGHT;
    RENDERDISTANCE = Math.max(WIDTH, HEIGHT)*0.6;
    CAMERA = new Camera({
      debug: false,
      x:0,y:0, 
      width:WIDTH, 
      height:HEIGHT,
      speed:0.1
    });
    STATES = new StatesManager({
      debug:              false, 
      debugState:         false,
      stateInterpolation: true,
      clientSimulation:   false, //not really working atm
      render:             render,
      CAMERA:             CAMERA
    });
    NETWORK = new Networking({
      debug:  false, 
      STATES: STATES,
      WORLD:  WORLD,
      HUD:    HUD
    });
    NETWORK.updateServerTimeDiffernce();
    CONTROLS = new Controls({
      debug:   false, 
      NETWORK: NETWORK, 
      STATES:  STATES, 
      CAMERA:  CAMERA
    });
    HUD = new Hud({
      width:    WIDTH, 
      height:   HEIGHT,
      CONTROLS: CONTROLS
    });
    NETWORK.HUD = HUD;
    LIGHTING = new Lighting({
      debug:  false,
      width:  WIDTH, 
      height: HEIGHT,
      renderDistance: RENDERDISTANCE,
      CONTROLS:   CONTROLS,
      CAMERA:     CAMERA,
      HUD:        HUD,
      darkness:   DARKNESS, //darkness level 0-1
      brightness: BRIGHTNESS
    });
    LIGHTING.createLightSource({intensity:500}); //defaults to 0,0
    BACKGROUND = new Background({
      debug: false,
      width: WIDTH, 
      height: HEIGHT,
      CAMERA: CAMERA
    });
    console.log("End Setup");
}//SETUP

window.addEventListener('resize', windowResized);
function windowResized(){
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  console.log("Resize: ", WIDTH, HEIGHT);
  canvas.width  = WIDTH;
  canvas.height = HEIGHT;
  RENDERDISTANCE = Math.max(WIDTH, HEIGHT);
  LIGHTING.resize({width: WIDTH, height: HEIGHT, renderDistance: RENDERDISTANCE});
  HUD.resize({width: WIDTH, height: HEIGHT});
  CAMERA.resize({width: WIDTH, height: HEIGHT});
  BACKGROUND.resize({width: WIDTH, height: HEIGHT});
} //window Resized

function draw(){
  //background "wipes" the screen every frame
  //clear the canvas
  render.save();
  render.setTransform(1, 0, 0, 1, 0, 0);
  render.clearRect(0, 0, WIDTH, HEIGHT);
  render.beginPath();
  render.restore();

  currentTime = new Date().getTime();
  let deltaTime = currentTime - lastFrame;
  lastFrame = currentTime;
  frames++;

  let myPlayer = NETWORK.getMyPlayer();
  if(myPlayer != null) CAMERA.setGoal(myPlayer.x, myPlayer.y);
  CAMERA.update();

  // BACKGROUND.draw();

  //draw line between player and cursor
  if(myPlayer != null){
    let playerLocOnScreen = CAMERA.translate({x: myPlayer.x, y: myPlayer.y});
  }

  //square at 0,0
  let origin = CAMERA.translate({x:0, y:0});
  render.save();
  render.strokeStyle = "black";
  render.strokeRect(origin.x-10, origin.y-10, 20, 20);
  // render.font = "px Arial";
  render.textAlign = "center";
  render.fillText(0+","+0, origin.x, origin.y);
  render.restore();
  

  //Main state, players
  STATES.update(deltaTime);
  STATES.draw(deltaTime);

  //World drawing
  let objectsToDraw = {};
  if(WORLD != null && WORLD.grid != null){
    objectsToDraw = World.getObjects({
      world:WORLD,
      x:CAMERA.x,
      y:CAMERA.y,
      distance: RENDERDISTANCE,
      //angle: myPlayer.angle,
      fieldOfView: Math.PI/2 //90 degrees
    });
    // console.log("objectsToDraw:",objectsToDraw);
    for(var id in objectsToDraw){
      let object = objectsToDraw[id];
      switch(object.type){
        case "block":
          Block.draw(object, render, CAMERA);
          break;
        default:
          console.log("Object not recognized to Draw");
      }
    }
    BACKGROUND.updateWithWorldData(WORLD);

  }//if World has been received from Server

  let playersInRange = {};
  if(myPlayer != null){
    playersInRange = STATES.getPlayersInRange({
      x: myPlayer.x,
      y: myPlayer.y,
      distance: RENDERDISTANCE
    });
  }

  //Lighting Stuff
  LIGHTING.update(deltaTime, objectsToDraw, myPlayer, playersInRange);
  LIGHTING.draw(STATES.frameState.players);
  

  //once a second
  if(currentTime % lastSecond >= 1000){
    // console.log(STATES.state);
    NETWORK.updateServerTimeDiffernce();
    HUD.debugUpdate({
      FrameRate: Math.round((lastFrames*0.8) + (frames*0.2)),
      ScreenSize: WIDTH+", "+HEIGHT,
      Ping: NETWORK.ping,
      ServerUPS: STATES.serverUpdatesPerSecond,
      timeDiffernce: NETWORK.timeDiffernce,
      objectsToDraw: Object.keys(objectsToDraw).length,
      RENDERDISTANCE: RENDERDISTANCE,
      CAMERA: CAMERA.x+", "+CAMERA.y
    });
    lastSecond = currentTime;
    lastFrames = frames;
    frames = 0;
  }

  HUD.draw();
  window.requestAnimationFrame(draw);
}//draw

setup();
draw();