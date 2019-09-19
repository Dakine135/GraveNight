const Hitbox = require('../../shared/Hitbox.js');
const Utilities = require('../../shared/Utilities.js');
const Grid = require('../../shared/Grid.js');
const World = require('../../shared/World.js');
const State = require('../../shared/State.js');
// import LineOfSightWorker from 'worker-loader!./lineOfSightWorker.js';
const LineOfSightWorker = require('./lineOfSight.worker.js');

module.exports = class lighting{
  constructor({
    debug=false,
    divId="lineOfSight-layer",
    width=0,
    height=0,
    renderDistance=null,
    CAMERA=null,
    HUD=null,
    CONTROLS=null
  }){
    this.width = width;
    this.height = height;
    this.renderDistance = renderDistance;
    if(this.renderDistance === null) this.renderDistance = Math.max(this.width, this.height)*0.6;
    this.CONTROLS = CONTROLS;
    this.CAMERA = CAMERA;
    this.HUD = HUD;
    //main canvas that exists in dom
    this.canvas = document.getElementById(divId);
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.render = this.canvas.getContext("2d");
    //main offscreen that compiles the lighting
    // this.offscreenCanvas = document.createElement('canvas');
    // this.offscreenCanvas.width = this.width;
    // this.offscreenCanvas.height = this.height;
    // this.offscreenRender = this.offscreenCanvas.getContext("2d");
    this.debug = debug;
    this.objectsInRange = {};
    this.myPlayer == null;

    console.log("Created lineOfSight-layer", this.width, this.height);
  }//constructor

  resize({
    width,
    height,
    renderDistance
  }){
    this.width = width;
    this.height = height;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    // this.offscreenCanvas.width = this.width;
    // this.offscreenCanvas.height = this.height;
    this.renderDistance = renderDistance;
  }

  update(){

  }//update

  draw(){

  }//draw