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
    engine=null
  }){
    this.ENGINE = engine;
    //main canvas that exists in dom
    this.canvas = document.getElementById(divId);
    this.canvas.width = this.ENGINE.width;
    this.canvas.height = this.ENGINE.height;
    this.render = this.canvas.getContext("2d");

    this.debug = debug;
    this.objectsInRange = {};
    this.myPlayer == null;

    this.lineOfSightWorker = new LineOfSightWorker();
    this.listOfPoints = [];
    this.workerCalculating == false;
    this.timeSinceLastUpdate = 0;
    this.offset = this.ENGINE.CAMERA;
    this.lineOfSightOrigin = {};

    this.lineOfSightWorker.onmessage = function(event){
      // console.log("return from worker:", event.data);
      this.listOfPoints = event.data.points;
      this.offset = event.data.offset;
      let originPTrans = this.ENGINE.CAMERA.translate(this.lineOfSightOrigin);
      let lineOfSight = this.getLineOfSightPath({
        listOfPoints:this.listOfPoints, 
        origin:      originPTrans, 
        distance:    this.ENGINE.renderDistance
      });
      this.lineOfSightPath = lineOfSight;
      this.workerCalculating = false;
    }.bind(this);

    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = this.ENGINE.width;
    this.offscreenCanvas.height = this.ENGINE.height;
    this.offscreenRender = this.offscreenCanvas.getContext("2d");

    console.log("Created lineOfSight-layer", this.ENGINE.width, this.ENGINE.height);
  }//constructor

  resize({
    width,
    height,
    renderDistance
  }){
    this.ENGINE.width = width;
    this.ENGINE.height = height;
    this.canvas.width = this.ENGINE.width;
    this.canvas.height = this.ENGINE.height;
    this.offscreenCanvas.width = this.ENGINE.width;
    this.offscreenCanvas.height = this.ENGINE.height;
    this.ENGINE.renderDistance = renderDistance;
  }

 update(deltaTime, objectsToDraw, myPlayer, playersInRange){
    this.objectsInRange = objectsToDraw;
    if(myPlayer != null){
      this.myPlayer = myPlayer;
      this.lineOfSightOrigin.x = myPlayer.x;
      this.lineOfSightOrigin.y = myPlayer.y;

      //update the lineOfSight
      this.timeSinceLastUpdate += deltaTime;
      if(!this.workerCalculating && this.timeSinceLastUpdate > 16){
        this.timeSinceLastUpdate = 0;
        this.workerCalculating = true;
        this.lineOfSightWorker.postMessage({
          objectsInRange: this.objectsInRange,
          origin:         this.lineOfSightOrigin,
          renderDistance: this.ENGINE.renderDistance,
          camera:         {x: this.ENGINE.CAMERA.x,
                           y: this.ENGINE.CAMERA.y,
                           width: this.ENGINE.width,
                           height: this.ENGINE.height
                          }
        });
      }
    }

    

  }//update

  draw(state){
    // console.log("drawing lighting");
    
    this.render.globalCompositeOperation = "source-over";
    this.offscreenRender.globalCompositeOperation = "source-over";
    
    //clear the canvas
    this.render.save();
    this.render.setTransform(1, 0, 0, 1, 0, 0);
    this.render.clearRect(0, 0, this.ENGINE.width, this.ENGINE.height);
    this.render.beginPath();
    this.render.restore();

    // //fill black
    this.render.save();
    this.render.fillStyle = "black";
    this.render.fillRect(0,0,this.ENGINE.width,this.ENGINE.height);

    //fill black
    this.offscreenRender.save();
    this.offscreenRender.fillStyle = "black";
    this.offscreenRender.fillRect(0,0,this.ENGINE.width,this.ENGINE.height);

     //clear the canvas
    this.offscreenRender.save();
    this.offscreenRender.setTransform(1, 0, 0, 1, 0, 0);
    this.offscreenRender.clearRect(0, 0, this.ENGINE.width, this.ENGINE.height);
    this.offscreenRender.beginPath();
    this.offscreenRender.restore();

    this.render.globalCompositeOperation = "destination-out";

    if(this.myPlayer != null){
      this.drawLineOfSightMask({
        x: this.lineOfSightOrigin.x, 
        y: this.lineOfSightOrigin.y,
        lineOfSight: this.lineOfSightPath,
        offset:    this.offset
      });
    }
    
   
    // this.render.shadowBlur = 100;
    // this.render.shadowColor = "white";
    this.render.drawImage(this.offscreenCanvas, 0, 0);
    this.render.restore();
  }//draw

  drawLineOfSightMask({
    x, 
    y, 
    lineOfSight = null,
    offset = {x:0, y:0}
  }){
    
    let origin = {
      x: Math.round(x),
      y: Math.round(y)
    }
    let originPTrans = this.ENGINE.CAMERA.translate(origin);

    let offsetX = Math.round(offset.x - this.ENGINE.CAMERA.x);
    let offsetY = Math.round(offset.y - this.ENGINE.CAMERA.y);
    
    //draw full line-of-Sight
    if(lineOfSight){
      this.offscreenRender.save();
      this.offscreenRender.fillStyle = "white";
      this.offscreenRender.strokeStyle = "white";
      this.offscreenRender.lineWidth = Math.floor(this.ENGINE.gridSize*0.8);
      this.offscreenRender.translate(offsetX, offsetY);
      this.offscreenRender.fill(lineOfSight);
      this.offscreenRender.stroke(lineOfSight);
      this.offscreenRender.restore();
    } else return

    if(this.debug){
      this.render.save();
      this.render.translate(offsetX, offsetY);
      this.render.strokeStyle = "red";
      this.render.stroke(lineOfSight);
      this.render.restore();
    }

  }//drawLineOfSightMask

  /*
  Returns canvas path of the line of sight polygon, relative to canvas, not world
  */
  getLineOfSightPath({listOfPoints, origin, distance}){
    listOfPoints.sort((a,b)=>{
      return a.angle-b.angle;
    });

    // create Path of line-of-sight
    let lineOfSight = new Path2D();
    let index = 0; //debug
    let lastPoint = listOfPoints[0];
    
    //run through all points
    listOfPoints.forEach((point)=>{
      
      //main draw from point to point
      if(lastPoint.edge && point.edge){
        //curve instead of line
        lineOfSight.arc(origin.x, origin.y, distance, lastPoint.angle, point.angle);
      } else{
        lineOfSight.lineTo(point.x, point.y);
      }

      lastPoint = point;
    }); //for each point

    if(listOfPoints.length === 0){
      lineOfSight.arc(origin.x, origin.y, distance, 0, Math.PI*2);
    } else {
      //complete path from first and last point
      if(lastPoint.edge && listOfPoints[0].edge){
        //curve instead of line
        lineOfSight.arc(origin.x, origin.y, distance, lastPoint.angle, listOfPoints[0].angle);
      } else{
        lineOfSight.moveTo(lastPoint.x, lastPoint.y);
        lineOfSight.lineTo(listOfPoints[0].x, listOfPoints[0].y);
      }
    }
    return lineOfSight;
  }//getLineOfSightPath

}//lineOfSight class