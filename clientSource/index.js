import StatesManager from './js/StateManagerClient.js';
import Controls from './js/clientControls.js';
import Networking from './js/networking.js';
// import Player from '../shared/player.js';
import * as p5 from './js/p5.min.js';

console.log("index.js loaded in bundle");
var STATES;
var CONTROLS;
var NETWORK;

var currentTime = new Date().getTime();
var lastFrame = currentTime;
var lastSecond = currentTime;
var frames = 0;
let sketch = (sk)=>{
  //runs once at load
  sk.setup = ()=>{
    console.log("Start P5 Setup");
    console.log("Screen Size: ", sk.windowWidth, sk.windowHeight);
    sk.createCanvas(sk.windowWidth, sk.windowHeight); //full screen
    STATES = new StatesManager({
      debug:false, 
      debugState:false,
      stateInterpolation: true,
      clientSimulation: false,
      sk:sk
    });
    NETWORK = new Networking({debug:false, STATES:STATES});
    NETWORK.updateServerTimeDiffernce();
    CONTROLS = new Controls({debug:false, NETWORK:NETWORK, STATES:STATES});
    sk.angleMode(sk.RADIANS);
    sk.rectMode(sk.CENTER);
    sk.frameRate(20); //default and max is 60
    console.log("End P5 Setup");
  } //setup

  sk.windowResized = ()=>{
    //https://p5js.org/reference/#/p5/resizeCanvas
    sk.resizeCanvas(sk.windowWidth, sk.windowHeight);
    console.log("Resize: ",sk.windowWidth, sk.windowHeight);
  } //window Resized

  sk.keyPressed = ()=>{
    CONTROLS.keyPressed(sk.keyCode, sk.key);
  }

  sk.keyReleased = ()=>{
    CONTROLS.keyReleased(sk.keyCode, sk.key);
  }

  sk.mouseMoved = ()=>{
    CONTROLS.mouseMoved(sk.mouseX, sk.mouseY, sk);
  }

  //runs every frame of animation
  sk.draw = ()=>{
    sk.background(200); //background "wipes" the screen every frame
    let mouse = {x:sk.round(sk.mouseX), y:sk.round(sk.mouseY)};
    currentTime = new Date().getTime();
    let deltaTime = currentTime - lastFrame;
    lastFrame = currentTime;
    frames++;

    STATES.draw(deltaTime);

    //once a second
    if(currentTime % lastSecond >= 1000){
      // console.log("=============");
      // console.log("Once a second");
      NETWORK.updateServerTimeDiffernce();
      // console.log("timeDiffernce:",NETWORK.timeDiffernce);
      // console.log("Ping:",NETWORK.ping);
      // console.log("FrameRate:",frames);
      lastSecond = currentTime;
      frames = 0;
      // console.log("=============");
    }

    //draw cross-hair
    let size = 10;
    if(CONTROLS.rightClickPressed){
      sk.ellipse(mouse.x, mouse.y, size*2, size*2);
    }
    if(CONTROLS.leftClickPressed){
      sk.ellipse(mouse.x, mouse.y, size/2, size/2);
    }
    
    sk.stroke(100);
    sk.line(mouse.x-size, mouse.y, mouse.x+size, mouse.y);
    sk.line(mouse.x, mouse.y-size, mouse.x, mouse.y+size);
  }  //draw

} //P5
const P5 = new p5(sketch);