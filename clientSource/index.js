import StatesManager from './js/StateManagerClient.js';
import Controls from './js/clientControls.js';
import Networking from './js/networking.js';
import Camera from './js/Camera.js';
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
var STATES;
var CONTROLS;
var NETWORK;
var CAMERA;
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
    p5Canvas.parent('P5-Canvas-Container'); //attach p5 Canvas to div in index.html
    CAMERA = new Camera(0,0, sk.windowWidth, sk.windowHeight);
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
      STATES:STATES
    });
    NETWORK.updateServerTimeDiffernce();
    CONTROLS = new Controls({
      debug:false, 
      NETWORK:NETWORK, 
      STATES:STATES, 
      CAMERA: CAMERA
    });
    sk.angleMode(sk.RADIANS);
    sk.rectMode(sk.CENTER);
    sk.frameRate(60); //default and max is 60
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

    let myPlayer = NETWORK.getMyPlayer();
    if(myPlayer != null) CAMERA.setGoal(myPlayer.x, myPlayer.y);
    CAMERA.update();

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

    //draw line between player and cursor
    if(myPlayer != null){
      let playerLocOnScreen = CAMERA.translate(myPlayer.x, myPlayer.y);
      sk.line(
        playerLocOnScreen.x, playerLocOnScreen.y, 
        mouse.x, mouse.y);
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
    sk.textSize(10);
    sk.textAlign(sk.CENTER);
    //location on screen
    sk.text(mouse.x+","+mouse.y,mouse.x, mouse.y-size);
    //location in world
    let mouseWorld = CONTROLS.translateScreenLocToWorld(mouse.x, mouse.y);
    sk.text(mouseWorld.x+","+mouseWorld.y,mouse.x, mouse.y+size);

    //square at 0,0
    let origin = CAMERA.translate(0,0);
    sk.rect(origin.x,origin.y,20,20);
    sk.text(0+","+0,origin.x, origin.y);
  }  //draw

} //P5
const P5 = new p5(sketch);