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
			this.darkness = darkness*0.7;
			this.brightness = brightness*0.6;
		}
		this.CONTROLS = CONTROLS;
		this.CAMERA = CAMERA;
		this.HUD = HUD;
		this.canvas = document.getElementById(divId);
		this.render = this.canvas.getContext("2d");
		this.offscreenCanvas = document.createElement('canvas');
		this.offscreenCanvas.width = this.width;
		this.offscreenCanvas.height = this.height;
		this.offscreenRender = this.offscreenCanvas.getContext("2d");
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.debug = debug;
		this.lightSources = {};
		this.objectsGlowing = {};
		this.lightCalculationsLastFrame = 0;
		this.orderPointsCreated = 0;
		// this.precision = 0.1;
		this.objectsInRange = {};
		this.lineOfSightWorker = new LineOfSightWorker();
		console.log("Created lighting-layer",this.width, this.height);
	}//constructor

	resize(){

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

	update(deltaTime, objectsToDraw){
		this.objectsInRange = objectsToDraw;

		for(var id in this.objectsGlowing){
			let object = this.objectsGlowing[id];
			object.alreadyHit = false;
			let pointsPerSecond = 200;
			let loss = pointsPerSecond * (deltaTime/1000);
			object.intensity -= loss;
			if(object.intensity <= 0) delete this.objectsGlowing[id];
		}
		if(this.debug){
			this.HUD.debugUpdate({
		        glowingObjects: Object.keys(this.objectsGlowing).length
		    });
		}
	}//update

	draw(state){
		// console.log("drawing lighting");
		
		this.render.globalCompositeOperation = "source-over";
		this.offscreenRender.globalCompositeOperation = "source-over";
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

        //draw light sources
        for(var id in this.lightSources){
        	let light = this.lightSources[id];
        	this.drawLightPoint({x:light.x, y:light.y, intensity:light.intensity});
        	
        }

        //draw Player lights
        for(var id in state.players){
        	let player = state.players[id];
        	let x = (player.x + player.width *0.5);
        	let y = (player.y + player.height*0.5);
        	let rotatedPoint = this.CAMERA.rotatePoint({
        		center:{x: player.x, y: player.y},
        		point:{x:x, y:y},
        		angle: player.angle
        	});
        	// this.drawLightPoint({
        	// 	x: player.x, 
        	// 	y: player.y, 
        	// 	intensity:(player.energy/2)
        	// });
        	this.drawLightCone({
        		x: rotatedPoint.x, 
        		y: rotatedPoint.y,
        		angle: player.angle, //player.angle
        		intensity:(player.energy*2), 
        		state:state,
        		brightness: this.brightness
        	});
        }

        //draw glowingObjects
		// console.log(Object.keys(this.objectsGlowing).length);
		for(var id in this.objectsGlowing){
			let objOnScreen = this.CAMERA.translate({x:this.objectsGlowing[id].x,
													 y:this.objectsGlowing[id].y});
			let alpha = Utilities.mapNum({
				input: this.objectsGlowing[id].intensity,
				start1: 0,
				end1: 1000,
				start2: 0,
				end2: 1
			});
			// if(this.objectsGlowing[id].intensity>50) console.log(this.objectsGlowing[id].intensity, "=>", alpha);
			this.offscreenRender.save();
			this.offscreenRender.fillStyle = "rgba(255, 255, 255, "+alpha+")";
			this.offscreenRender.fillRect(
				(objOnScreen.x - 25), 
				(objOnScreen.y - 25), 
				50,50);
			if(this.debug){
				this.render.fillStyle = "white";
				this.render.font = "18px Arial";
				this.render.textAlign = "center";
				let text = Math.round(this.objectsGlowing[id].intensity);
				this.render.fillText(text, objOnScreen.x, objOnScreen.y+50);
			}
			this.offscreenRender.restore();
			// this.drawLightPoint(this.objectsGlowing[id]);
		}// each glowing object

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
		intensity
	}){
		// console.log("lightdraw:",intensity);
		if(intensity<=0){
			return;
		}
		let originP = {
			x: Math.round(x),
			y: Math.round(y)
		}
		intensity = Math.floor(intensity);
		let originPTrans = this.CAMERA.translate(originP);

		this.offscreenRender.save();
		this.offscreenRender.beginPath();
    	let gradient = this.offscreenRender.createRadialGradient(
    		originPTrans.x, originPTrans.y, 0, 
    		originPTrans.x, originPTrans.y, intensity);
    	gradient.addColorStop(0,  "rgba(255, 255, 255, 1)");
    	gradient.addColorStop(0.4,"rgba(255, 255, 255, 0.9)");
    	// gradient.addColorStop(0.7,"rgba(255, 255, 255, 0.5)");
    	gradient.addColorStop(1,  "rgba(255, 255, 255, 0)");
    	this.offscreenRender.fillStyle = gradient;
    	this.offscreenRender.arc(originPTrans.x, originPTrans.y, intensity, 0, Math.PI*2);
    	this.offscreenRender.closePath();
    	this.offscreenRender.fill();
    	this.offscreenRender.restore();
	}//draw light point

	/*
	*/
	drawLightCone({
		x, 
		y,
		angle,
		intensity,
		brightness = this.brightness,
		darkness   = this.darkness,
		state
	}){
		if(intensity<=0){
			return;
		}
		let origin = {
			x: Math.round(x),
			y: Math.round(y)
		}

		// let lineOfSightDistance = (Math.max(this.width, this.height)*0.6);
		// let lineOfSightDistance = intensity;

		let originPTrans = this.CAMERA.translate(origin);

		let widthOfCone    = Math.PI*0.7; //maybe scale on intensity somehow
		let startAngle     = angle - (widthOfCone/2);
		if(startAngle < 0) startAngle = startAngle + Math.PI*2;
		let endAngle       = startAngle + widthOfCone;
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

		if(this.debug){
			this.HUD.debugUpdate({
		        startAngle: startAngle,
		        endAngle: endAngle
		    });
		}
		
		if(state == null || state.world == null) return;
		//TODO optimization, get objects needs to take direction into account
		// this.objectsInRange = State.getObjectsInRange({
		// 	state: state, 
		// 	x: origin.x, 
		// 	y: origin.y, 
		// 	distance: lineOfSightDistance
		// });

		this.orderPointsCreated = 0;

		let listOfPoints = [];
		
		
		// for(var id in this.objectsInRange){
		// 	let object = this.objectsInRange[id];
		// 	let points = Hitbox.getVisualPoints({
		// 		obj:         object.hitbox,
		// 		viewPoint:   origin,
		// 		getPointsAfterEdge: true
		// 	});

		// 	points.forEach(function(point){

		// 		let pointToCheck = point;
		// 		if(point.extend){
		// 			pointToCheck = Utilities.extendEndPoint({
		// 				startPoint: origin, 
		// 				endPoint: point, 
		// 				length: this.renderDistance
		// 			});
		// 		}
				
		// 		let collision = this.getCollision({
		// 			objects: this.objectsInRange, 
		// 			origin:  origin, 
		// 			point:   pointToCheck
		// 		});

		// 		//calculate "lost" intensity
		// 		// let lostIntensity = (intensity - collision.dist);
		// 		// this.addGowingObject({obj: collision.object, intensity: lostIntensity});

		// 		let viewPoint = this.getViewPoint({
		// 			point: collision.point, 
		// 			edge:  !collision.collision,
		// 			color: (collision.collision ? "green" : "yellow"),
		// 			name: "P",
		// 			origin: origin
		// 		});
		// 		listOfPoints.push(viewPoint);
	
		// 	}.bind(this));
		// } //for objects in range

		if(this.debug){
			this.HUD.debugUpdate({
		        lightPoints: listOfPoints.length,
		        ObjectsInRangeLighting: Object.keys(this.objectsInRange).length
		    });
		}




		this.lineOfSightWorker.postMessage({
			objectsInRange: this.objectsInRange,
			origin:         origin,
			renderDistance: this.renderDistance
		});

		this.lineOfSightWorker.onmessage = function(event){
			// console.log("return from worker:", event.data);
		}





		let lineOfSight = this.getLineOfSightPath({
			listOfPoints:listOfPoints, 
			origin:      originPTrans, 
			distance:    this.renderDistance,
			coneStart:   startAngle,
			coneEnd:     endAngle
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

		//setup flashlight temp canvas
		let flashlightConeCanvas = document.createElement('canvas');
		flashlightConeCanvas.width = this.width;
		flashlightConeCanvas.height = this.height;
		let flashlightConeRender = flashlightConeCanvas.getContext("2d");
		//draw full line-of-Sight
		flashlightConeRender.fillStyle = "white";
		flashlightConeRender.fill(lineOfSight);
		//cone gradient
		let gradient = this.offscreenRender.createRadialGradient(
			originPTrans.x, originPTrans.y, (intensity*0.2), 
			originPTrans.x, originPTrans.y, intensity);
    	gradient.addColorStop(0,"rgba(255, 255, 255, "+brightness+")");
    	gradient.addColorStop(0.6,"rgba(255, 255, 255, "+brightness+")");
    	gradient.addColorStop(1,"rgba(255, 255, 255, 0)");
    	//only keep what over-laps
		flashlightConeRender.globalCompositeOperation = "source-in";
		flashlightConeRender.beginPath();
		flashlightConeRender.moveTo(viewPointEnd.x, viewPointEnd.y);
		flashlightConeRender.lineTo(originPTrans.x, originPTrans.y);
		flashlightConeRender.lineTo(viewPointStart.x, viewPointStart.y);
		flashlightConeRender.arc(originPTrans.x, originPTrans.y, intensity, 
			viewPointStart.angle, viewPointEnd.angle);
		flashlightConeRender.fillStyle = gradient;
		flashlightConeRender.fill();

		//apply cone canvas to main lighting offscreen canvas
        this.offscreenRender.drawImage(flashlightConeCanvas, 0, 0);


        //setup flashlight glow temp canvas
		let flashlightGlowCanvas = document.createElement('canvas');
		flashlightGlowCanvas.width = this.width;
		flashlightGlowCanvas.height = this.height;
		let flashlightGlowRender = flashlightGlowCanvas.getContext("2d");
		//draw full line-of-Sight
		flashlightGlowRender.fillStyle = "white";
		flashlightGlowRender.fill(lineOfSight);
		//glow gradient
		let restIntensity = intensity*0.5;
		let gradientRest = this.offscreenRender.createRadialGradient(
			originPTrans.x, originPTrans.y, (restIntensity*0.2), 
			originPTrans.x, originPTrans.y, restIntensity);
    	gradientRest.addColorStop(0,"rgba(255, 255, 255, "+brightness+")");
    	gradientRest.addColorStop(0.5,"rgba(255, 255, 255, "+brightness+")");
    	gradientRest.addColorStop(1,"rgba(255, 255, 255, 0)");
    	//only keep what over-laps
		flashlightGlowRender.globalCompositeOperation = "source-in";
		flashlightGlowRender.arc(originPTrans.x, originPTrans.y, intensity, 
			0, Math.PI*2);
		flashlightGlowRender.fillStyle = gradientRest;
		flashlightGlowRender.fill();

		//apply glow canvas to main lighting offscreen canvas
        this.offscreenRender.drawImage(flashlightGlowCanvas, 0, 0);

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
		viewPoint.count = this.orderPointsCreated;
		this.orderPointsCreated++;
		return viewPoint;
	}

	/*
	Returns canvas path of the line of sight polygon, relative to canvas, not world
	*/
	getLineOfSightPath({listOfPoints, origin, intensity, distance, coneStart, coneEnd}){
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

			//debug
			if(this.debug){
				this.render.save();
				this.render.fillStyle = point.color;
				// this.render.fillStyle = (pointInCone ? "green" : "red");
				// if(point.name === "Start" || point.name === "End") this.render.fillStyle = "yellow";
				this.render.beginPath();
				this.render.arc(point.x, point.y, 10, 0, 2*Math.PI);
				this.render.closePath();
				this.render.fill();
				this.render.fillStyle = "blue";
				this.render.font = "12px Arial";
				this.render.textAlign = "center"; 
				this.render.fillText(index, point.x, point.y);
				if(true){ //point.color == 'yellow'
					this.render.fillStyle = "white";
					this.render.textAlign = "left";
					this.render.fillText(point.name+Math.round(point.angle*100)/100, point.x+12, point.y);
				}
				this.render.fillStyle = "white";
				this.render.textAlign = "right";
				this.render.fillText(point.count, point.x-12, point.y);
				this.render.restore();
				index++;
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

		

		if(this.debug){
			this.render.strokeStyle = "white";
			this.render.stroke(lineOfSight);
		}
		return lineOfSight;
	}//getLineOfSightPath

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

	getIntersection(corners, line){
		// console.log("corners:",corners);
		let boxLineTop    = {x1:corners.topLeft.x,     y1:corners.topLeft.y, 
						     x2:corners.topRight.x,    y2:corners.topRight.y};
		let boxLineRight  = {x1:corners.topRight.x,    y1:corners.topRight.y, 
						     x2:corners.bottomRight.x, y2:corners.bottomRight.y};
		let boxLineBottom = {x1:corners.bottomRight.x, y1:corners.bottomRight.y, 
						     x2:corners.bottomLeft.x,  y2:corners.bottomLeft.y};
		let boxLineLeft   = {x1:corners.bottomLeft.x,  y1:corners.bottomLeft.y, 
						     x2:corners.topLeft.x,     y2:corners.topLeft.y};
		let intersection = false;
		let intersectingSegment = null;
		let closestDist = Infinity;
		let top = Hitbox.collideLineLine(line, boxLineTop);
		if(top){
			intersection = top;
			intersectingSegment = boxLineTop;
			closestDist = Utilities.dist(top, {x:line.x1, y:line.y1});
		}
		let right = Hitbox.collideLineLine(line, boxLineRight);
		if(right){
			let dist = Utilities.dist(right, {x:line.x1, y:line.y1});
			if(dist < closestDist){
				intersection = right;
				intersectingSegment = boxLineRight;
				closestDist = dist;
			}
		}
		let bottom = Hitbox.collideLineLine(line, boxLineBottom);
		if(bottom){
			let dist = Utilities.dist(bottom, {x:line.x1, y:line.y1});
			if(dist < closestDist){
				intersection = bottom;
				intersectingSegment = boxLineBottom;
				closestDist = dist;
			}
		}
		let left = Hitbox.collideLineLine(line, boxLineLeft);
		if(left){
			let dist = Utilities.dist(left, {x:line.x1, y:line.y1});
			if(dist < closestDist){
				intersection = left;
				intersectingSegment = boxLineLeft;
				closestDist = dist;
			}
		}
		return {point: intersection, line: intersectingSegment};
	}//get intersection

	getCollision({objects, origin, point, mainStartPoint, width, distance=Infinity}){
		//check all objects in range for collision
		let closestCollision = false;
		let closestSegment = null;
		let closestDist = Infinity;
		//for object glow
		let closestObj = null;
		for(var id in objects){
			let object = objects[id];
			let collision = this.getIntersection(object.hitbox, {x1: origin.x,  y1: origin.y,
														         x2: point.x,   y2: point.y});
			if(collision){
				let dist = Utilities.dist(collision.point, origin);
				if(closestDist > dist){
					closestObj = object;
					closestDist = dist;
					closestCollision = collision.point;
					closestSegment = collision.line;
				}
			}
		}//for objects in range

		if(closestCollision && closestDist < distance){
			//make points at the corners of the box
			let point1 = {x: closestSegment.x1, y: closestSegment.y1};
			let point2 = {x: closestSegment.x2, y: closestSegment.y2};
			let angleCollisionToPoint1 = this.calculateAngle({
											point1: point1,
											centerPoint:origin});
			let angleCollisionToPoint2 = this.calculateAngle({
											point1: point2,
										    centerPoint:origin});
			let angleCollision = this.calculateAngle({
											point1: closestCollision,
										    centerPoint:origin});

			let cwPoint;
			let ccwPoint;
			if(angleCollisionToPoint1 > angleCollisionToPoint2){
				cwPoint  = point1;
				cwPoint.angle = angleCollisionToPoint1;
				ccwPoint = point2;
				ccwPoint.angle = angleCollisionToPoint2;
			} else {
				cwPoint  = point2;
				cwPoint.angle = angleCollisionToPoint2;
				ccwPoint = point1;
				ccwPoint.angle = angleCollisionToPoint1;
			}

			closestCollision.angle = angleCollision;

			//make sure box edges are not out of range
			// if(cwPoint.angle  >= endPointAngle || cwPoint.angle  <= startPointAngle){
			// 	cwPoint = null;
			// }
			// if(ccwPoint.angle >= endPointAngle || ccwPoint.angle <= startPointAngle){
			// 	ccwPoint = null;
			// }

			return {
				collision: true,
				point: closestCollision,
				dist: closestDist,
				cwPoint: cwPoint,
				ccwPoint: ccwPoint,
				object: closestObj
			}
		}//closest Collision
		else {
			return {
				collision: false,
				point: point
			}
		}
	}//getCollision

}//lighting class