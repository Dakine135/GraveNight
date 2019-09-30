import StatesManager from './js/StateManagerClient.js';
import Controls from './js/clientControls.js';
import Networking from './js/networking.js';
import Camera from './js/Camera.js';
import Lighting from './js/lighting.js';
import LineOfSight from './js/lineOfSight.js';
import Hud from './js/hud.js';
import Background from './js/background.js';
import World from '../shared/World.js';
import Block from '../shared/Block.js';

// import Engine from './js/clientEngine.js';

console.log("index.js loaded in bundle");
var STATES = {};
var CONTROLS = {};
var NETWORK = {};
var CAMERA = {};
var LIGHTING = {};
var LINEOFSIGHT = {};
var HUD = {};
var BACKGROUND = {};
var WORLD = {};
var RENDERDISTANCE = 1000; //latter set by window size
var FRAMERATE = 60;
var DARKNESS = 1; //1 full dark, 0 full light
var BRIGHTNESS = 1;  //1 full white, 0 no light
var WORLDGRIDSIZE = 32;

//main layer with players and walls
let divId = "main-layer";
var canvas = document.getElementById(divId);
var render = canvas.getContext("2d");

var currentTime = new Date().getTime();
var lastFrame = currentTime;
var lastSecond = currentTime;
var lastFrames = 60;
var frames = 0;

let scale = 80;
var WIDTH = 16*scale;
var HEIGHT = 9*scale;
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var scaleX = screenWidth / WIDTH;
var scaleY = screenHeight / HEIGHT;
// var scaleToFit = Math.min(scaleX, scaleY);
// var scaleToCover = Math.max(scaleX, scaleY);
stage.style.transformOrigin = '0 0'; //scale from top left
// stage.style.transform = 'scale(' + scaleToFit + ')';
stage.style.transform = 'scale('+scaleX+','+scaleY+')';



function setup(){
    console.log("Start Setup");
    console.log("Screen Size: ", WIDTH, HEIGHT);
    console.log("Game Size: ", WIDTH, HEIGHT);
    canvas.width  = WIDTH;
    canvas.height = HEIGHT;
    RENDERDISTANCE = Math.ceil(Math.max(WIDTH, HEIGHT)*0.6);
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
      stateInterpolation: false,
      clientSimulation:   true, //not really working atm
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
    LINEOFSIGHT = new LineOfSight({
      debug:  false,
      width:  WIDTH, 
      height: HEIGHT,
      renderDistance: RENDERDISTANCE,
      CAMERA:     CAMERA,
      HUD:        HUD,
    });
    BACKGROUND = new Background({
      debug:  false,
      width:  WIDTH, 
      height: HEIGHT,
      CAMERA: CAMERA,
      HUD:    HUD
    });
    console.log("End Setup");
}//SETUP

window.addEventListener('resize', windowResized);
function windowResized(){
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
  scaleX = screenWidth / WIDTH;
  scaleY = screenHeight / HEIGHT;
  // scaleToFit = Math.min(scaleX, scaleY);
  // scaleToCover = Math.max(scaleX, scaleY);
  stage.style.transformOrigin = '0 0'; //scale from top left
  // stage.style.transform = 'scale(' + scaleToFit + ')';
  stage.style.transform = 'scale('+scaleX+','+scaleY+')';
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
  let timeAfterCamera = new Date().getTime();
  let deltaCamera = timeAfterCamera - currentTime;

  BACKGROUND.draw();
  let timeAfterBackground = new Date().getTime();
  let deltaBackground = timeAfterBackground - timeAfterCamera;

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
  let timeAfterStateUpdate = new Date().getTime();
  let deltaStateUpdate = timeAfterStateUpdate - timeAfterBackground;

  STATES.draw(deltaTime);
  let timeAfterStateDraw = new Date().getTime();
  let deltaStateDraw = timeAfterStateDraw - timeAfterStateUpdate;

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
    if(!BACKGROUND.backgroundGenerated) BACKGROUND.updateWithWorldData(WORLD);
  }//if World has been received from Server
  let timeAfterWorldDraw = new Date().getTime();
  let deltaWorldDraw = timeAfterWorldDraw - timeAfterStateDraw;


  let playersInRange = {};
  if(myPlayer != null){
    playersInRange = STATES.getPlayersInRange({
      x: myPlayer.x,
      y: myPlayer.y,
      distance: RENDERDISTANCE
    });
  }

  //Line of sight Stuff
  // LINEOFSIGHT.update(deltaTime, objectsToDraw, myPlayer, playersInRange);
  let timeAfterSightUpdate = new Date().getTime();
  let deltaSightUpdate = timeAfterSightUpdate - timeAfterWorldDraw;

  // LINEOFSIGHT.draw(STATES.frameState);
  let timeAfterSightDraw = new Date().getTime();
  let deltaSightDraw = timeAfterSightDraw - timeAfterSightUpdate;

  //Lighting Stuff
  // LIGHTING.update(deltaTime, objectsToDraw, myPlayer, playersInRange);
  let timeAfterLightUpdate = new Date().getTime();
  let deltaLightUpdate = timeAfterLightUpdate - timeAfterSightDraw;

  // LIGHTING.draw(STATES.frameState);
  let timeAfterLightDraw = new Date().getTime();
  let deltaLightDraw = timeAfterLightDraw - timeAfterLightUpdate;
  

  //once a second
  if(currentTime % lastSecond >= 1000){
    // console.log(STATES.state);
    NETWORK.updateServerTimeDiffernce();
    HUD.debugUpdate({
      FrameRate: Math.round((lastFrames*0.8) + (frames*0.2)),
      ScreenSize: WIDTH+", "+HEIGHT,
      WindowSize: screenWidth+", "+screenHeight,
      Ping: NETWORK.ping,
      // ServerUPS: STATES.serverUpdatesPerSecond,
      timeDiffernce: NETWORK.timeDiffernce,
      objectsToDraw: Object.keys(objectsToDraw).length,
      RENDERDISTANCE: RENDERDISTANCE,
      CAMERA: CAMERA.x+", "+CAMERA.y,
      deltaTime: deltaTime,
      timeCamera:      
        (Math.round((deltaCamera / deltaTime) * 100)) + "%",
      timeBackground:  
        (Math.round((deltaBackground / deltaTime) * 100)) + "%",
      timeStateUpdate: 
        (Math.round((deltaStateUpdate / deltaTime) * 100)) + "%",
      timeStateDraw:   
        (Math.round((deltaStateDraw / deltaTime) * 100)) + "%",
      timeWorldDraw:   
        (Math.round((deltaWorldDraw / deltaTime) * 100)) + "%", 
      timeSightUpdate: 
        (Math.round((deltaSightUpdate / deltaTime) * 100)) + "%",
      timeSightDraw:   
        (Math.round((deltaSightDraw / deltaTime) * 100)) + "%",
      timeLightUpdate: 
        (Math.round((deltaLightUpdate / deltaTime) * 100)) + "%",
      timeLightDraw:   
        (Math.round((deltaLightDraw / deltaTime) * 100)) + "%"
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