import StatesManager from './js/StateManagerClient.js';
import Controls from './js/clientControls.js';
import Networking from './js/networking.js';
import Camera from './js/Camera.js';
import Lighting from './js/lighting.js';
import Hud from './js/hud.js';
import World from '../shared/World.js';
import Block from '../shared/Block.js';

console.log("index.js loaded in bundle");
var WIDTH = window.innerWidth;
var HIEGHT = window.innerHeight;
var STATES = {};
var CONTROLS = {};
var NETWORK = {};
var CAMERA = {};
var LIGHTING = {};
var HUD = {};
var WORLD = {};
var RENDERDISTANCE = 1000; //latter set by window size
var FRAMERATE = 60;
var DARKNESS = 0.95; //1 full dark, 0 full light
var BRIGHTNESS = 1;  //1 full white, 0 no light

let divId = "main-layer";
var canvas = document.getElementById(divId);
var render = canvas.getContext("2d");

var currentTime = new Date().getTime();
var lastFrame = currentTime;
var lastSecond = currentTime;
var frames = 0;

function setup(){
    console.log("Start Setup");
    console.log("Screen Size: ", WIDTH, HIEGHT);
    canvas.width  = WIDTH;
    canvas.height = HIEGHT;
    RENDERDISTANCE = Math.max(WIDTH, HIEGHT)*0.6;
    CAMERA = new Camera({
      x:0,y:0, 
      width:WIDTH, 
      height:HIEGHT,
      speed:0.1
    });
    STATES = new StatesManager({
      debug: false, 
      debugState: false,
      stateInterpolation: true,
      clientSimulation: false, //not really working atm
      render: render,
      CAMERA: CAMERA
    });
    NETWORK = new Networking({
      debug:  false, 
      STATES: STATES,
      WORLD:  WORLD
    });
    NETWORK.updateServerTimeDiffernce();
    CONTROLS = new Controls({
      debug:   true, 
      NETWORK: NETWORK, 
      STATES:  STATES, 
      CAMERA:  CAMERA
    });
    HUD = new Hud({
      width:    WIDTH, 
      height:   HIEGHT,
      CONTROLS: CONTROLS
    });
    LIGHTING = new Lighting({
      debug: true,
      width: WIDTH, 
      height: HIEGHT,
      renderDistance: RENDERDISTANCE,
      CONTROLS:   CONTROLS,
      CAMERA:     CAMERA,
      HUD:        HUD,
      darkness:   DARKNESS, //darkness level 0-1
      brightness: BRIGHTNESS
    });
    LIGHTING.createLightSource({intensity:500}); //defaults to 0,0
    console.log("End Setup");
}//SETUP

  // sk.windowResized = ()=>{
   //    //https://p5js.org/reference/#/p5/resizeCanvas
   //    //TODO make lighting and camera and GUI, and such resize with window as well
   //    sk.resizeCanvas(sk.windowWidth, sk.windowHeight);
   //    console.log("Resize: ",sk.windowWidth, sk.windowHeight);
   //    RENDERDISTANCE = Math.max(sk.windowWidth, sk.windowHeight);
   //  } //window Resized

function draw(){
  //background "wipes" the screen every frame
  //clear the canvas
  render.save();
  render.setTransform(1, 0, 0, 1, 0, 0);
  render.clearRect(0, 0, WIDTH, HIEGHT);
  render.beginPath();
  render.restore();
  currentTime = new Date().getTime();
  let deltaTime = currentTime - lastFrame;
  lastFrame = currentTime;
  frames++;

  let myPlayer = NETWORK.getMyPlayer();
  if(myPlayer != null) CAMERA.setGoal(myPlayer.x, myPlayer.y);
  CAMERA.update();

  //testing draw grass "sprite"


  //draw line between player and cursor
  if(myPlayer != null){
    let playerLocOnScreen = CAMERA.translate({x: myPlayer.x, y: myPlayer.y});
    // sk.line(
    //   playerLocOnScreen.x, playerLocOnScreen.y, 
    //   mouse.x, mouse.y
    //);
  }

  //square at 0,0
  let origin = CAMERA.translate({x:0, y:0});
  // sk.rect(origin.x-10,origin.y-10,20,20);
  // sk.text(0+","+0,origin.x, origin.y);

  //Main state, players
  STATES.draw(deltaTime);

  //World drawing
  let objectsToDraw = {};
  if(WORLD != null && WORLD.grid != null){
    objectsToDraw = World.getObjects({
      world:WORLD,
      x:CAMERA.x,
      y:CAMERA.y,
      distance: RENDERDISTANCE,
      angle: myPlayer.angle,
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
  LIGHTING.draw(STATES.frameState);
  

  //once a second
  if(currentTime % lastSecond >= 1000){
    // console.log(STATES.state);
    NETWORK.updateServerTimeDiffernce();
    HUD.debugUpdate({
      FrameRate: frames,
      ScreenSize: WIDTH+", "+HIEGHT,
      Ping: NETWORK.ping,
      ServerUPS: STATES.serverUpdatesPerSecond,
      timeDiffernce: NETWORK.timeDiffernce,
      objectsToDraw: Object.keys(objectsToDraw).length,
      RENDERDISTANCE: RENDERDISTANCE
    });
    lastSecond = currentTime;
    frames = 0;
  }

  HUD.draw();
  window.requestAnimationFrame(draw);
}//draw

setup();
draw();