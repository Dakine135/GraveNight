import StatesManager from './js/StateManagerClient.js';
import Controls from './js/clientControls.js';
import Networking from './js/networking.js';
import Camera from './js/Camera.js';
import Lighting from './js/lighting.js';
import Hud from './js/hud.js';
import World from '../shared/World.js';
import Block from '../shared/Block.js';
// import Player from '../shared/player.js';
import * as p5 from './js/p5.min.js';

// function template({var1="1",var2="2"}){
//   return `${var1}, ${var2} = sdglfdk`;
// }
// let test1 = template({var1:"string1", var2:54563});
// let test2 = template({var1:"string2", var2:{test:"testing"}});
// console.log("test1:", test1);
// console.log("test2:", test2);

// console.log(CAMERA);


console.log("index.js loaded in bundle");
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
var BRIGHTNESS = 0.95;  //1 full white, 0 no light
var p5Canvas;

var currentTime = new Date().getTime();
var lastFrame = currentTime;
var lastSecond = currentTime;
var frames = 0;
let sketch = (sk)=>{
  //runs once at load
  sk.setup = ()=>{
    console.log("Start P5 Setup");
    console.log("Screen Size: ", sk.windowWidth, sk.windowHeight);
    p5Canvas = sk.createCanvas(sk.windowWidth, sk.windowHeight); //full screen
    RENDERDISTANCE = Math.max(sk.windowWidth, sk.windowHeight)*0.6;
    p5Canvas.parent('P5-Canvas-Container'); //attach p5 Canvas to div in index.html
    CAMERA = new Camera({
      x:0,y:0, 
      width:sk.windowWidth, 
      height:sk.windowHeight,
      speed:0.1
    });
    STATES = new StatesManager({
      debug:false, 
      debugState:false,
      stateInterpolation: true,
      clientSimulation: false, //not really working atm
      sk:sk,
      CAMERA: CAMERA
    });
    NETWORK = new Networking({
      debug:false, 
      STATES:STATES,
      WORLD: WORLD
    });
    NETWORK.updateServerTimeDiffernce();
    CONTROLS = new Controls({
      debug:false, 
      NETWORK:NETWORK, 
      STATES:STATES, 
      CAMERA: CAMERA
    });
    HUD = new Hud({
      width: sk.windowWidth, 
      height: sk.windowHeight,
      CONTROLS: CONTROLS
    });
    LIGHTING = new Lighting({
      debug: true,
      width: sk.windowWidth, 
      height: sk.windowHeight,
      CONTROLS: CONTROLS,
      CAMERA: CAMERA,
      HUD: HUD,
      darkness: DARKNESS, //darkness level 0-1
      brightness: BRIGHTNESS
    });
    LIGHTING.createLightSource({}); //defaults to 0,0
    // LIGHTING.createLightSource({x:500,y:500, size:300});
    sk.angleMode(sk.RADIANS);
    // sk.rectMode(sk.CENTER);
    sk.frameRate(FRAMERATE); //default and max is 60
    console.log("End P5 Setup");
  } //setup

  sk.windowResized = ()=>{
    //https://p5js.org/reference/#/p5/resizeCanvas
    //TODO make lighting and camera and GUI, and such resize with window as well
    sk.resizeCanvas(sk.windowWidth, sk.windowHeight);
    console.log("Resize: ",sk.windowWidth, sk.windowHeight);
    RENDERDISTANCE = Math.max(sk.windowWidth, sk.windowHeight);
  } //window Resized

  sk.keyPressed = ()=>{
    CONTROLS.keyPressed(sk.keyCode, sk.key);
  }

  sk.keyReleased = ()=>{
    CONTROLS.keyReleased(sk.keyCode, sk.key);
  }

  sk.mouseMoved = ()=>{
    CONTROLS.mouseMoved(sk.mouseX, sk.mouseY, sk);
    HUD.update({mouseX: sk.mouseX, mouseY: sk.mouseY});
  }

  //runs every frame of animation
  sk.draw = ()=>{
    sk.background(200); //background "wipes" the screen every frame
    let mouse = {x:sk.round(sk.mouseX), y:sk.round(sk.mouseY)};
    currentTime = new Date().getTime();
    let deltaTime = currentTime - lastFrame;
    lastFrame = currentTime;
    frames++;

    let myPlayer = NETWORK.getMyPlayer();
    if(myPlayer != null) CAMERA.setGoal(myPlayer.x, myPlayer.y);
    CAMERA.update();

    //draw line between player and cursor
    if(myPlayer != null){
      let playerLocOnScreen = CAMERA.translate({x: myPlayer.x, y: myPlayer.y});
      sk.line(
        playerLocOnScreen.x, playerLocOnScreen.y, 
        mouse.x, mouse.y);
    }

    //square at 0,0
    let origin = CAMERA.translate({x:0, y:0});
    sk.rect(origin.x-10,origin.y-10,20,20);
    sk.text(0+","+0,origin.x, origin.y);

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
            Block.draw(object, sk, CAMERA);
            break;
          default:
            console.log("Object not recognized to Draw");
        }
      }
    }//if World has been received from Server

    //Lighting Stuff
    LIGHTING.update(deltaTime, objectsToDraw);
    LIGHTING.draw(STATES.frameState);
    

    //once a second
    if(currentTime % lastSecond >= 1000){
      // console.log(STATES.state);
      NETWORK.updateServerTimeDiffernce();
      HUD.debugUpdate({
        FrameRate: frames,
        ScreenSize: sk.windowWidth+", "+sk.windowHeight,
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

    
  }  //draw

} //P5
const P5 = new p5(sketch);