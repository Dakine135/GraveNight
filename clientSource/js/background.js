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
    CAMERA=null,
    HUD = null
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
    this.HUD = HUD;
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
    //go through and set inital grass
    for(  let column=0; column<numOfColumns;  column++){
      for(let row   =0; row   <numOfRows;     row++){
        if(this.spriteGrid[column] === undefined) this.spriteGrid[column] = [];
        if(this.spriteGrid[column][row] === undefined) this.spriteGrid[column][row] = {};
        if(this.spriteGrid[column][row].lock === true) continue;
        let tileTypeRan = Math.random()*1000;
        if(tileTypeRan >= 900){
          //full grass with leaf
          let leafRotation = Math.random();
          if(leafRotation < 0.25)
          this.setSprite({column:  column, row: row,
                        spriteX: 5,      spriteY: 0, rotate: Math.PI});
          else if(leafRotation < 0.5)
          this.setSprite({column:  column, row: row,
                        spriteX: 5,      spriteY: 0, rotate: Math.PI/2});
          else if(leafRotation < 0.75)
          this.setSprite({column:  column, row: row,
                        spriteX: 5,      spriteY: 0, rotate: -Math.PI/2});
          else
          this.setSprite({column:  column, row: row,
                          spriteX: 5,      spriteY: 0});
        }
        else{
           //full grass
           this.setSprite({column:  column, row: row,
                          spriteX: 0,      spriteY: 0});
        }
      }//for rows
    }//for columns

    //go through in 3x3 chuncks and replace sections with sprites that go together
    let chunkSize = 3; //square
    for(  let column=0; column<(numOfColumns - chunkSize); column += chunkSize){
      for(let row   =0; row   <(numOfRows    - chunkSize); row    += chunkSize){
        if(this.checkGridGroupLock(column, row, chunkSize)) continue;
        let tileTypeRan = Math.random()*1000;
        if(tileTypeRan >= 900){ //grass circle patch
          //top row
          if(Math.random() <= 0.5)
          this.setSprite({column:  column,   row: row, lock: true,
                          spriteX: 3,        spriteY: 2});
          this.setSprite({column:  column+1, row: row, lock: true,
                          spriteX: 4,        spriteY: 2, rotate: Math.PI/2});
          if(Math.random() <= 0.5)
          this.setSprite({column:  column+2, row: row, lock: true,
                          spriteX: 2,        spriteY: 2});
          //middle row
          this.setSprite({column:  column,   row: row+1, lock: true,
                          spriteX: 4,        spriteY: 2});
          let middleType = Math.random();
          if(middleType < 0.25)
          this.setSprite({column:  column+1, row: row+1, lock: true,
                          spriteX: 3,        spriteY: 0});
          else if(middleType < 0.40)
          this.setSprite({column:  column+1, row: row+1, lock: true,
                          spriteX: 4,        spriteY: 0});
          else
          this.setSprite({column:  column+1, row: row+1, lock: true,
                          spriteX: 2,        spriteY: 0});
          this.setSprite({column:  column+2, row: row+1, lock: true,
                          spriteX: 4,        spriteY: 2, rotate: Math.PI});
          //bottom row
          if(Math.random() <= 0.5)
          this.setSprite({column:  column,   row: row+2, lock: true,
                          spriteX: 2,        spriteY: 2, rotate: Math.PI});
          this.setSprite({column:  column+1, row: row+2, lock: true,
                          spriteX: 4,        spriteY: 2, rotate: -Math.PI/2});
          if(Math.random() <= 0.5)
          this.setSprite({column:  column+2, row: row+2, lock: true,
                          spriteX: 3,        spriteY: 2, rotate: Math.PI});
        }
        else if(tileTypeRan >= 800){
          //top
          this.setSprite({column:  column+1, row: row, lock: true,
                          spriteX: 3,        spriteY: 1, rotate: Math.PI/2});
          //middle row
          this.setSprite({column:  column,   row: row+1, lock: true,
                          spriteX: 3,        spriteY: 1});
          this.setSprite({column:  column+1, row: row+1, lock: true,
                        spriteX: 4,        spriteY: 1});
          this.setSprite({column:  column+2, row: row+1, lock: true,
                          spriteX: 3,        spriteY: 1, rotate: Math.PI});
          //bottom row
          this.setSprite({column:  column+1, row: row+2, lock: true,
                          spriteX: 3,        spriteY: 1, rotate: -Math.PI/2});
        }
        else{
          //don't do anything for chunk
        }
      }//for rows
    }//for columns
  }//generateBackGroundImage

  //returns true if any cell in group is locked, otherwise false
  checkGridGroupLock(column, row, size){
    // console.log(column, row, size);
    let maxX = column + size;
    let maxY = row    + size;
    for(  let x=column; x<maxX;  x++){
      for(let y=row;    y<maxY;  y++){
        if(this.spriteGrid[x][y].lock) return true;
      }
    }
    return false;
  }//checkGridGroupLock

  setSprite({column, row, spriteX=0, spriteY=0, rotate=0, lock=false}){
    this.spriteGrid[column][row].x = spriteX;
    this.spriteGrid[column][row].y = spriteY;
    this.spriteGrid[column][row].rotate = rotate;
    this.spriteGrid[column][row].lock = lock;
  }//setSprite

  resize({
    width,
    height
  }){
    this.width = width;
    this.height = height;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  //input world cords and get sprite offset that should be used.
  getImageOffset(x, y, debug){
    // console.log("get sprite offset at world:", x, y);
    let halfWidth    = this.spriteGrid.length/2;
    let halfHeight   = this.spriteGrid[0].length/2;
    let spriteSheetX = Math.floor((x/this.WORLD.gridSize) + halfWidth);
    let spriteSheetY = Math.floor((y/this.WORLD.gridSize) + halfHeight);
    if(spriteSheetX < 0 || spriteSheetX >= this.spriteGrid.length){
      spriteSheetX = 0;
    }
    if(spriteSheetY < 0 || spriteSheetY >= this.spriteGrid[0].length){
      spriteSheetY = 0;
    }
    let imageOffset  = this.spriteGrid[spriteSheetX][spriteSheetY];
    // console.log(`${x}=>${spriteSheetX},${y}=>${spriteSheetY}: ${imageOffset}`);
    // console.log(spriteSheetX, spriteSheetY, this.spriteGrid.length);
    // console.log(imageOffset);
    if(debug) return {x:spriteSheetX, y:spriteSheetY};
    return imageOffset;
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
    if(this.debug){
      let x = cameraOffset.x;
      let y = cameraOffset.y;
      let imageOffset = this.getImageOffset(x, y, true);
      this.HUD.debugUpdate({
        imageOffset: `${x}=>${imageOffset.x},${y}=>${imageOffset.y}`
      });
    }
    let spriteSheetSize = 64;
    let x = 0;
    let y = 0;
    for(  let offsetX=-this.WORLD.gridSize-(this.CAMERA.x%this.WORLD.gridSize); 
          offsetX<this.width;  offsetX+=this.WORLD.gridSize){
      y = 0;
      for(let offsetY=-this.WORLD.gridSize-(this.CAMERA.y%this.WORLD.gridSize); 
          offsetY<this.height; offsetY+=this.WORLD.gridSize){
        let worldLocX = this.CAMERA.x + (offsetX);
        let worldLocY = this.CAMERA.y + (offsetY);
        let imageOffset = this.getImageOffset(worldLocX, worldLocY);
        this.render.save();
        this.render.translate(offsetX+(this.WORLD.gridSize/2), offsetY+(this.WORLD.gridSize/2));
        this.render.rotate(imageOffset.rotate);
        this.render.translate(-(this.WORLD.gridSize/2), -(this.WORLD.gridSize/2));
        this.render.drawImage(
          this.grassSpriteSheet,            //image source
          (imageOffset.x * spriteSheetSize),//cord x to clip source
          (imageOffset.y * spriteSheetSize),//cord y to clip source
          spriteSheetSize, spriteSheetSize, //width and height of source
          0, 0,                 //cord x and y to paste on canvas
          this.gridSize, this.gridSize      //size of paste (can stretch or reduce image)
        );
        this.render.restore();
        y++;
      }//height
      x++;
    }//width
  }//draw

}//background class