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

    this.debug = debug;
    this.objectsInRange = {};
    this.myPlayer == null;

    this.lineOfSightWorker = new LineOfSightWorker();
    this.listOfPoints = [];
    this.workerCalculating == false;
    this.timeSinceLastUpdate = 0;
    this.offset = this.CAMERA;
    this.lineOfSightOrigin = {};

    this.lineOfSightWorker.onmessage = function(event){
      // console.log("return from worker:", event.data);
      this.listOfPoints = event.data.points;
      this.offset = event.data.offset;
      let originPTrans = this.CAMERA.translate(this.lineOfSightOrigin);
      let lineOfSight = this.getLineOfSightPath({
        listOfPoints:this.listOfPoints, 
        origin:      originPTrans, 
        distance:    this.renderDistance
      });
      this.lineOfSightPath = lineOfSight;
      this.workerCalculating = false;
    }.bind(this);

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
          renderDistance: this.renderDistance,
          camera:         this.CAMERA
        });
      }
    }

    

  }//update

  draw(state){
    // console.log("drawing lighting");
    
    this.render.globalCompositeOperation = "source-over";
    // this.offscreenRender.globalCompositeOperation = "source-over";
    
    //clear the canvas
    this.render.save();
    this.render.setTransform(1, 0, 0, 1, 0, 0);
    this.render.clearRect(0, 0, this.width, this.height);
    this.render.beginPath();
    this.render.restore();

    //fill black
    this.render.save();
    this.render.fillStyle = "black";
    this.render.fillRect(0,0,this.width,this.height);

    this.render.globalCompositeOperation = "xor";

    if(this.myPlayer != null){
      this.drawLineOfSightMask({
        x: this.lineOfSightOrigin.x, 
        y: this.lineOfSightOrigin.y,
        lineOfSight: this.lineOfSightPath,
        offset:    this.offset
      });
    }
    

   
    //white square for testing
    // this.render.fillStyle = "rgba(255, 255, 255)";
    // this.render.fillRect(this.width/4,this.height/4,this.width/2,this.height/2);
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
    let originPTrans = this.CAMERA.translate(origin);

    let offsetX = Math.round(offset.x - this.CAMERA.x);
    let offsetY = Math.round(offset.y - this.CAMERA.y);
    
    //draw full line-of-Sight
    if(lineOfSight){
      this.render.save();
      this.render.fillStyle = "white";
      this.render.translate(offsetX, offsetY);
      this.render.fill(lineOfSight);
      this.render.restore();
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