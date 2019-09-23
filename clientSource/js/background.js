const Utilities = require('../../shared/Utilities.js');
const Grid = require('../../shared/Grid.js');
const World = require('../../shared/World.js');

module.exports = class lighting{
  constructor({
    debug=false,
    divId="background-layer",
    width=0,
    height=0,
    gridSize = 32,
    CAMERA=null
  }){
    this.width = width;
    this.height = height;
    this.gridSize = gridSize;
    this.canvas = document.getElementById(divId);
    this.render = this.canvas.getContext("2d");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    // this.offscreenCanvas = document.createElement('canvas');
    // this.offscreenRender = this.offscreenCanvas.getContext("2d");
    // this.offscreenCanvas.width = this.width;
    // this.offscreenCanvas.height = this.height;
    
    
    this.debug = debug;
    this.CAMERA = CAMERA;
    this.WORLD = null;

    this.worldLoaded = false;
    this.imageLoaded = false;
    this.backgroundGenerated = false;
    this.spriteGrid = [];

    //assets
    this.grassSpriteSheet = new Image();
    this.grassSpriteSheet.src = '../assets/grassTiles64.png';
    this.grassSpriteSheet.onload = ()=>{
      this.imageLoaded = true;
      this.generateSpriteGrid();
    }

   
    

    console.log("Created background-layer",this.width, this.height);
  }//constructor

  updateWithWorldData(WORLD){
    this.worldLoaded = true;
    this.WORLD = WORLD;
    // this.offscreenCanvas.width  = this.WORLD.width;
    // this.offscreenCanvas.height = this.WORLD.height;
    this.generateSpriteGrid();
  }

  generateSpriteGrid(){
    if(!this.worldLoaded || !this.imageLoaded || this.backgroundGenerated) return;
    this.backgroundGenerated = true;
    let numOfColumns = this.WORLD.width/this.WORLD.gridSize;
    let numOfRows = this.WORLD.height/this.WORLD.gridSize;
    for(  let column=0; column<numOfColumns;  column++){
      for(let row   =0; row   <numOfRows;     row++){
        if(this.spriteGrid[column] === undefined) this.spriteGrid[column] = [];
        if(this.spriteGrid[column][row] === undefined) this.spriteGrid[column][row] = {};
        let tileTypeRan = Math.random()*1000;
        if(tileTypeRan >= 800) this.spriteGrid[column][row].x = 2;
        else this.spriteGrid[column][row].x = 0;
        this.spriteGrid[column][row].y = 0;
      }
    }
  }//generateBackGroundImage

  resize({
    width,
    height
  }){
    this.width = width;
    this.height = height;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  update(){

  }

  draw(){
    if(!this.worldLoaded || !this.imageLoaded || !this.backgroundGenerated) return;
    // let cameraOffset = {
    //   x: Math.floor(this.CAMERA.x % this.WORLD.gridSize),
    //   y: Math.floor(this.CAMERA.y % this.WORLD.gridSize)
    // }
    let cameraOffset = {
      x: this.CAMERA.x,
      y: this.CAMERA.y
    }
    let spriteSheetSize = 64;
    let x = 0;
    let y = 0;
    for(let offsetX=-cameraOffset.x; offsetX<this.width;  offsetX+=this.WORLD.gridSize){
      y = 0;
      for(let offsetY=-cameraOffset.y; offsetY<this.height; offsetY+=this.WORLD.gridSize){
        let imageOffset = this.spriteGrid[x][y];
        this.render.drawImage(
          this.grassSpriteSheet, 
          (imageOffset.x * spriteSheetSize), 
          (imageOffset.y * spriteSheetSize), 
          spriteSheetSize, spriteSheetSize,
          offsetX, offsetY, 
          this.gridSize, this.gridSize
        );
        y++;
      }//height
      x++;
    }//width
  }//draw

}//background class