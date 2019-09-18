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
		divId="lighting-layer",
		width=0,
		height=0,
		renderDistance=null,
		darkness=0.9,
		brightness=0.9,
		CAMERA=null,
		HUD=null,
		CONTROLS=null
	}){
		this.width = width;
		this.height = height;
		this.renderDistance = renderDistance;
		if(this.renderDistance === null) this.renderDistance = Math.max(this.width, this.height)*0.6;
		this.darkness=darkness;
		this.brightness=brightness;
		if(debug){
			this.darkness = darkness*0.8;
			this.brightness = brightness*0.8;
		}
		this.CONTROLS = CONTROLS;
		this.CAMERA = CAMERA;
		this.HUD = HUD;
		//main canvas that exists in dom
		this.canvas = document.getElementById(divId);
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.render = this.canvas.getContext("2d");
		//main offscreen that compiles the lighting
		this.offscreenCanvas = document.createElement('canvas');
		this.offscreenCanvas.width = this.width;
		this.offscreenCanvas.height = this.height;
		this.offscreenRender = this.offscreenCanvas.getContext("2d");
		//canvas for light point calculations
		this.flashlightGlowCanvas = document.createElement('canvas');
		this.flashlightGlowCanvas.width = this.width;
		this.flashlightGlowCanvas.height = this.height;
		this.flashlightGlowRender = this.flashlightGlowCanvas.getContext("2d");
		//canvas for light point calculations
		this.flashlightGlowCanvas = document.createElement('canvas');
		this.flashlightGlowCanvas.width = this.width;
		this.flashlightGlowCanvas.height = this.height;
		this.flashlightGlowRender = this.flashlightGlowCanvas.getContext("2d");
		//canvas for light cone calculations
		this.flashlightConeCanvas = document.createElement('canvas');
		this.flashlightConeCanvas.width = this.width;
		this.flashlightConeCanvas.height = this.height;
		this.flashlightConeRender = this.flashlightConeCanvas.getContext("2d");
		this.debug = debug;
		this.lightSources = {};
		this.objectsInRange = {};
		this.myPlayer == null;

		//contains cached info about how to draw each players light
		this.playersToDraw = {};


		console.log("Created lighting-layer",this.width, this.height);
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
		this.offscreenCanvas.width = this.width;
		this.offscreenCanvas.height = this.height;
		this.flashlightGlowCanvas.width = this.width;
		this.flashlightGlowCanvas.height = this.height;
		this.flashlightConeCanvas.width = this.width;
		this.flashlightConeCanvas.height = this.height;
		this.renderDistance = renderDistance;
	}

	createLightSource({
		id=0,
		x=0,
		y=0,
		intensity=100
	}){
		this.lightSources[id] = {
			id:id,
			x:x,
			y:y,
			intensity:intensity
		}
	}//create light source

	update(deltaTime, objectsToDraw, myPlayer, playersInRange){
		this.objectsInRange = objectsToDraw;
		if(this.debug){
			this.HUD.debugUpdate({
		        ObjectsInRangeLighting: Object.keys(this.objectsInRange).length
		    });
		}
		if(myPlayer != null){
			this.myPlayer = myPlayer;
		}



		for(var id in playersInRange){
			let player = playersInRange[id];
			if(this.playersToDraw[id] == null){
				//create entry
				let newPlayerInRange = {};
				newPlayerInRange.lineOfSightOrigin = {x: player.x, y: player.y};
				let x = (player.x + player.width *0.5 + 5);
	    	let y = (player.y + player.height*0.5);
	    	newPlayerInRange.lineOfSightFlashlightOrigin = this.CAMERA.rotatePoint({
	    		center:newPlayerInRange.lineOfSightOrigin,
	    		point:{x: x, y: y},
	    		angle: player.angle
	    	});
				newPlayerInRange.lineOfSightWorker = new LineOfSightWorker();
				newPlayerInRange.listOfPoints = [];
				newPlayerInRange.workerCalculating == false;
				newPlayerInRange.timeSinceLastUpdate = 0;
				newPlayerInRange.offset = this.CAMERA;
				let that = this;
				newPlayerInRange.lineOfSightWorker.onmessage = function(event){
					// console.log("return from worker:", event.data);
					newPlayerInRange.listOfPoints = event.data.points;
					newPlayerInRange.offset = event.data.offset;
					let originPTrans = that.CAMERA.translate(newPlayerInRange.lineOfSightFlashlightOrigin);
					let lineOfSight = that.getLineOfSightPath({
						listOfPoints:newPlayerInRange.listOfPoints, 
						origin:      originPTrans, 
						distance:    that.renderDistance
					});
					newPlayerInRange.lineOfSightPath = lineOfSight;
					newPlayerInRange.workerCalculating = false;
				}.bind(newPlayerInRange);
				this.playersToDraw[id] = newPlayerInRange;
			}//create new player in range entry for lighting
			else{
				//update entry
				let playerLightEntry = this.playersToDraw[id];
				playerLightEntry.lineOfSightOrigin = {x: player.x, y: player.y};
				let x = (player.x + player.width *0.5 + 5);
		    	let y = (player.y + player.height*0.5);
		    	playerLightEntry.lineOfSightFlashlightOrigin = this.CAMERA.rotatePoint({
		    		center:playerLightEntry.lineOfSightOrigin,
		    		point:{x: x, y: y},
		    		angle: player.angle
		    	});
			}//update existing

			let playerLightEntry = this.playersToDraw[id];

			//TODO each line of sight needs its own objects in range
			//update the lineOfSight
			playerLightEntry.timeSinceLastUpdate += deltaTime;
			if(!playerLightEntry.workerCalculating && playerLightEntry.timeSinceLastUpdate > 16){
				playerLightEntry.timeSinceLastUpdate = 0;
				playerLightEntry.workerCalculating = true;
				playerLightEntry.lineOfSightWorker.postMessage({
					objectsInRange: this.objectsInRange,
					origin:         playerLightEntry.lineOfSightFlashlightOrigin,
					renderDistance: this.renderDistance,
					camera:         this.CAMERA
				});
			}//if worker is not still busy with the last calculation
		}//for each player in range

	}//update

	draw(state){
		// console.log("drawing lighting");
		
		this.render.globalCompositeOperation = "source-over";
		this.offscreenRender.globalCompositeOperation = "source-over";
		this.flashlightGlowRender.globalCompositeOperation = "source-over";
		this.flashlightConeRender.globalCompositeOperation = "source-over";
		
		//clear the canvas
   	this.render.save();
    this.render.setTransform(1, 0, 0, 1, 0, 0);
    this.render.clearRect(0, 0, this.width, this.height);
    this.render.beginPath();
    this.render.restore();

    //fill black
    this.render.save();
    this.render.fillStyle = "rgba(0, 0, 0,"+ this.darkness +")";
    this.render.fillRect(0,0,this.width,this.height);
    this.render.restore();

    //clear the canvas
   	this.offscreenRender.save();
    this.offscreenRender.setTransform(1, 0, 0, 1, 0, 0);
    this.offscreenRender.clearRect(0, 0, this.width, this.height);
    this.offscreenRender.beginPath();
    this.offscreenRender.restore();

    //clear the canvas
   	this.flashlightGlowRender.save();
    this.flashlightGlowRender.setTransform(1, 0, 0, 1, 0, 0);
    this.flashlightGlowRender.clearRect(0, 0, this.width, this.height);
    this.flashlightGlowRender.beginPath();
    this.flashlightGlowRender.restore();

    //clear the canvas
   	this.flashlightConeRender.save();
    this.flashlightConeRender.setTransform(1, 0, 0, 1, 0, 0);
    this.flashlightConeRender.clearRect(0, 0, this.width, this.height);
    this.flashlightConeRender.beginPath();
    this.flashlightConeRender.restore();

    //draw light sources
    for(var id in this.lightSources){
    	let light = this.lightSources[id];
    	this.drawLightPoint({
    		x:light.x, 
    		y:light.y, 
    		intensity:light.intensity
    	});
    }// for every light source

    for(var id in this.playersToDraw){
    	let playerToDraw = this.playersToDraw[id];
    	let playerInState = state.players[id];
    	
    	if (playerToDraw.lineOfSightPath) {
    		// let width = Math.PI/2;
    		// let intensityFlashLight = 300;
    		// let intensityGlow = 300;
    		let width = Utilities.mapNum({
    			input: playerInState.flashlightFocus,
    			start1: 0, 
    			end1: 1,
    			start2: Math.PI*0.1,
    			end2: Math.PI
    		});
    		let intensityFlashLight = Utilities.mapNum({
    			input: (1 - playerInState.flashlightFocus),
    			start1: 0, 
    			end1: 1,
    			start2: playerInState.energy,
    			end2:  playerInState.energy*2
    		});
    		let intensityGlow = Utilities.mapNum({
    			input: (1 - playerInState.flashlightFocus),
    			start1: 0, 
    			end1: 1,
    			start2: playerInState.energy,
    			end2:  playerInState.energy*0.1
    		});
    		this.drawLightCone({
      		x: playerToDraw.lineOfSightFlashlightOrigin.x, 
      		y: playerToDraw.lineOfSightFlashlightOrigin.y,
      		angle: playerInState.angle, //player.angle
      		intensity:intensityFlashLight,
      		width: width,
      		lineOfSight: playerToDraw.lineOfSightPath,
      		offset:    playerToDraw.offset
      	});

      	this.drawLightPoint({
      		x: playerToDraw.lineOfSightFlashlightOrigin.x, 
      		y: playerToDraw.lineOfSightFlashlightOrigin.y,
      		intensity:intensityGlow,
      		lineOfSight: playerToDraw.lineOfSightPath,
      		offset:    playerToDraw.offset
      	});

    	}//only if line of sight path is ready
  
    }// every player in playersToDraw Lighting
    

    this.render.globalCompositeOperation = "xor";
    this.render.drawImage(this.offscreenCanvas, 0, 0);
	}//draw

	addGowingObject({
		intensity,
		obj
	}){
		if(obj == null) return;
		//TODO technically this is applied per frame and will be effected by frame rate
		intensity = intensity/20;
		if(this.objectsGlowing[obj.id] == null){
			this.objectsGlowing[obj.id] = {
				x: obj.x,
				y: obj.y,
				intensity: intensity,
				alreadyHit: true
			};
		} else {
			if(!this.objectsGlowing[obj.id].alreadyHit){
				this.objectsGlowing[obj.id].alreadyHit = true;
				this.objectsGlowing[obj.id].intensity += intensity;
				if(this.objectsGlowing[obj.id].intensity > 1000) 
					this.objectsGlowing[obj.id].intensity = 1000;
			}
		}
	}//add glowing objects

	drawLightPoint({
		x, 
		y, 
		intensity,
		brightness = this.brightness,
		darkness   = this.darkness,
		lineOfSight = null,
		offset = {x:0, y:0}
	}){
		// console.log("lightdraw:",intensity);
		if(intensity<=0){
			return;
		}
		let origin = {
			x: Math.round(x),
			y: Math.round(y)
		}
		let originPTrans = this.CAMERA.translate(origin);

		let offsetX = Math.round(offset.x - this.CAMERA.x);
		let offsetY = Math.round(offset.y - this.CAMERA.y);
		
		//draw full line-of-Sight
		if(lineOfSight){
			this.flashlightGlowRender.save();
			this.flashlightGlowRender.fillStyle = "white";
			this.flashlightGlowRender.translate(offsetX, offsetY);
			this.flashlightGlowRender.fill(lineOfSight);
			this.flashlightGlowRender.restore();
		}
		//glow gradient
		let gradientRest = this.flashlightGlowRender.createRadialGradient(
			originPTrans.x, originPTrans.y, (intensity*0.2), 
			originPTrans.x, originPTrans.y, intensity
		);
	  	gradientRest.addColorStop(0,"rgba(255, 255, 255, "+brightness+")");
	  	gradientRest.addColorStop(0.9,"rgba(255, 255, 255, "+(brightness*0.3)+")");
	  	gradientRest.addColorStop(1,"rgba(255, 255, 255, 0)");
	  	//only keep what over-laps
		if(lineOfSight) this.flashlightGlowRender.globalCompositeOperation = "source-in";
		this.flashlightGlowRender.arc(originPTrans.x, originPTrans.y, intensity, 
			0, Math.PI*2);
		this.flashlightGlowRender.fillStyle = gradientRest;
		this.flashlightGlowRender.fill();

		//apply glow canvas to main lighting offscreen canvas
    this.offscreenRender.drawImage(this.flashlightGlowCanvas, 0, 0);

	}//draw light point

	/*
	*/
	drawLightCone({
		x, 
		y,
		angle,
		width = Math.PI*0.5,
		intensity,
		brightness = this.brightness,
		darkness   = this.darkness,
		lineOfSight,
		offset
	}){
		if(intensity<=0){
			return;
		}
		let origin = {
			x: Math.round(x),
			y: Math.round(y)
		}

		let originPTrans = this.CAMERA.translate(origin);

		let startAngle     = angle - (width/2);
		if(startAngle < 0) startAngle = startAngle + Math.PI*2;
		let endAngle       = startAngle + width;
		if(endAngle > Math.PI*2) endAngle = endAngle - Math.PI*2;
		let startPoint     = this.CAMERA.rotatePoint({
					center: origin,
					point: {x: origin.x+intensity, y: origin.y},
					angle: startAngle
				});
		let endPoint     	= this.CAMERA.rotatePoint({
					center: origin,
					point: {x: origin.x+intensity, y: origin.y},
					angle: endAngle
				});

		let viewPointStart = this.getViewPoint({
			point: startPoint,
			color: "yellow",
			name: "Start",
			origin: origin
		});

		let viewPointEnd = this.getViewPoint({
			point: endPoint,
			color: "yellow",
			name: "End",
			origin: origin
		});

		let offsetX = Math.round(offset.x - this.CAMERA.x);
		let offsetY = Math.round(offset.y - this.CAMERA.y);

		//draw full line-of-Sight
		this.flashlightConeRender.save();
		this.flashlightConeRender.fillStyle = "white";
		// let cameraTranslate = this.CAMERA.translate({});
		this.flashlightConeRender.translate(offsetX, offsetY);
		if(this.debug){
			this.render.save();
			this.render.translate(offsetX, offsetY);
			this.render.strokeStyle = "white";
			this.render.stroke(lineOfSight);
			this.render.restore();
		}
		this.flashlightConeRender.fill(lineOfSight);
		this.flashlightConeRender.restore();
		//cone gradient
		let gradient = this.flashlightConeRender.createRadialGradient(
			originPTrans.x, originPTrans.y, (intensity*0.2), 
			originPTrans.x, originPTrans.y, intensity
		);
	  	gradient.addColorStop(0,"rgba(255, 255, 255, "+brightness+")");
	  	gradient.addColorStop(0.9,"rgba(255, 255, 255, "+(brightness*0.3)+")");
	  	gradient.addColorStop(1,"rgba(255, 255, 255, 0)");
	  	//only keep what over-laps
		this.flashlightConeRender.globalCompositeOperation = "source-in";
		this.flashlightConeRender.beginPath();
		this.flashlightConeRender.moveTo(viewPointEnd.x, viewPointEnd.y);
		this.flashlightConeRender.lineTo(originPTrans.x, originPTrans.y);
		this.flashlightConeRender.lineTo(viewPointStart.x, viewPointStart.y);
		this.flashlightConeRender.arc(originPTrans.x, originPTrans.y, intensity, 
				viewPointStart.angle, viewPointEnd.angle);
		this.flashlightConeRender.fillStyle = gradient;
		this.flashlightConeRender.fill();

		//apply cone canvas to main lighting offscreen canvas
	    this.offscreenRender.drawImage(this.flashlightConeCanvas, 0, 0);

	}//drawLightCone

	getViewPoint({point, edge=false, color="yellow", name="No Name", origin}){
		let pAngle = this.calculateAngle({
										point1: point,
									    centerPoint:origin});
		//translate to point for display
		let viewPoint = this.CAMERA.translate(point);
		viewPoint.edge = edge;
		viewPoint.color = color;
		viewPoint.angle = pAngle;
		viewPoint.name = name;
		return viewPoint;
	}

	calculateAngle({point1, point2=null, centerPoint}){
		if(point2==null) point2 = {x: centerPoint.x+10, y:centerPoint.y};
		let pAngle = Utilities.calculateAngle({
										point1: point1, 
										point2: point2,
									    centerPoint:centerPoint});
		// if(pAngle < 0) pAngle = pAngle + Math.PI*2;
		if(pAngle < 0) pAngle = Math.abs(pAngle);
		// if(pAngle > Math.PI) pAngle = Math.PI - pAngle;
		// if(pAngle > width) pAngle = Math.PI*2 - pAngle;
		//Could cause an issue when cone is wider than PI aka 180, maybe?
		return pAngle;
	}

	/*
	Returns canvas path of the line of sight polygon, relative to canvas, not world
	*/
	getLineOfSightPath({listOfPoints, origin, distance}){
		listOfPoints.sort((a,b)=>{
			return a.angle-b.angle;
		});

		// console.log(listOfPoints.length);
		if(this.debug){
			this.HUD.debugUpdate({
	      numberOfPoints: listOfPoints.length,
	    });
		}
		

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

}//lighting class