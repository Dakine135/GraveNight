const Hitbox = require('../../shared/Hitbox.js');
const Utilities = require('../../shared/Utilities.js');
const Grid = require('../../shared/Grid.js');
const World = require('../../shared/World.js');
const State = require('../../shared/State.js');

module.exports = class lighting{
	constructor({
		debug=false,
		divId="lighting-layer",
		width=0,
		height=0,
		darkness=0.9,
		CAMERA=null,
		HUD=null,
		CONTROLS=null
	}){
		this.width = width;
		this.height = height;
		this.darkness=darkness;
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
		this.lightCalculationsLastFrame = 0;
		this.lightPoints = 0;
		this.orderPointsCreated = 0;
		this.precision = 20; //increment by when checking for light collision, lower is more intensive, but more accurate (should only be needed for small objects)
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

	update(){

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
        	let x = (player.x + player.width/2);
        	let y = (player.y + player.height/2);
        	let rotatedPoint = this.CAMERA.rotatePoint({
        		center:{x: player.x, y: player.y},
        		point:{x:x, y:y},
        		angle: player.angle
        	});
        	this.drawLightPoint({
        		x: player.x, 
        		y: player.y, 
        		intensity:(player.energy/2)
        	});
        	let brightness = 0.9;
        	if(this.debug) brightness = 0.5;
        	this.drawLightCone({
        		x: rotatedPoint.x, 
        		y: rotatedPoint.y,
        		angle: player.angle, //player.angle
        		intensity:(player.energy*2), 
        		state:state,
        		brightness: brightness
        	});
        }

        this.render.globalCompositeOperation = "xor";
        this.render.drawImage(this.offscreenCanvas, 0, 0);
	}//draw

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
		brightness = 0.9,
		state
	}){
		if(intensity<=0){
			return;
		}
		let originP = {
			x: Math.round(x),
			y: Math.round(y)
		} 
		let originPTrans = this.CAMERA.translate(originP);
		
		if(state == null || state.world == null) return;
		//TODO optimization, get objects needs to take direction into account
		let objectsInRange = State.getObjectsInRange({
			state: state, 
			x: originP.x, 
			y: originP.y, 
			distance: intensity
		});
		
		//setup variables for loop and such
		let widthOfCone    = Math.PI*0.5; //maybe scale on intensity somehow
		// let increment      = widthOfCone/this.precision;
		let increment      = 0.1;
		let blockedLimit   = 0; //this is to keep track and 
		                        //dont make points at corners that are behind other blocks
		let startAngle     = angle - (widthOfCone/2);
		let endAngle       = startAngle + widthOfCone;
		let startPoint     = this.CAMERA.rotatePoint({
								center: originP,
								point: {x: originP.x+intensity,
										y: originP.y},
								angle: startAngle
							});
		let middlePoint    = this.CAMERA.rotatePoint({
								center: originP,
								point: {x: originP.x+intensity,
										y: originP.y},
								angle: angle
							});
		let objectsGlowing = {};
		let listofPoints   = [];
		if(this.debug){
			this.HUD.update({
		        lightPoints: this.lightPoints,
		        ObjectsInRangeLighting: Object.keys(objectsInRange).length
		    });
		}
	    let lightCalculations = 0;
	    this.orderPointsCreated = 0;
	    listofPoints = this.getLightPoints({
	    	width:     widthOfCone,
	    	origin:    originP,
	    	point:     middlePoint,
	    	startPoint:startPoint,
	    	mainWidth: widthOfCone,
	    	increment: increment,
	    	intensity: intensity,
	    	objects:   objectsInRange
	    });
		// for(var i=0; i<=widthOfCone; i=i){
		// 	lightCalculations++;

		// 	//current point/angle we are checking
		// 	//like in individual light beam
		// 	let pRotated = this.CAMERA.rotatePoint({
		// 						center: originP,
		// 						point: startPoint,
		// 						angle: i
		// 					});

		// 	//check all objects in range for collision
		// 	let closestCollision = false;
		// 	let closestSegment = null;
		// 	let closestDist = Infinity;
		// 	//for object glow
		// 	let closestObj = null;
		// 	for(var id in objectsInRange){
		// 		let object = objectsInRange[id];
		// 		// let corners = Hitbox.getCorners(object);
		// 		// console.log("corners:",corners);
		// 		let collision = this.getIntersection(object.hitbox, {x1: originP.x,  y1: originP.y,
		// 													   x2: pRotated.x, y2: pRotated.y});
		// 		if(collision){
		// 			let dist = Utilities.dist(collision.point, originP);
		// 			if(closestDist > dist){
		// 				closestObj = object;
		// 				closestDist = dist;
		// 				closestCollision = collision.point;
		// 				closestSegment = collision.line;
		// 			}
		// 		}
		// 	}//for objects in range

		// 	if(closestCollision){
		// 		//calculate "lost" intensity
		// 		let lostIntensity = (intensity - closestDist);
		// 		if(objectsGlowing[closestObj.id] == null){
		// 			objectsGlowing[closestObj.id] = {
		// 				x: closestObj.x,
		// 				y: closestObj.y,
		// 				intensity: lostIntensity
		// 			};
		// 		} else {
		// 			objectsGlowing[closestObj.id].intensity += lostIntensity;
		// 			if(objectsGlowing[closestObj.id].intensity > intensity) objectsGlowing[closestObj.id].intensity = intensity;
		// 		}

		// 		//make points at the corners of the box
		// 		let point1 = {x: closestSegment.x1, y: closestSegment.y1};
		// 		let point2 = {x: closestSegment.x2, y: closestSegment.y2};
		// 		let angleCollisionToPoint1 = Utilities.calculateAngle({
		// 										point1:startPoint, 
		// 										point2: point1,
		// 										centerPoint:originP});
		// 		let angleCollisionToPoint2 = Utilities.calculateAngle({
		// 										point1:startPoint, 
		// 										point2: point2,
		// 									    centerPoint:originP});
		// 		if(angleCollisionToPoint1 < 0) 
		// 			angleCollisionToPoint1 = angleCollisionToPoint1 + Math.PI*2;
		// 		if(angleCollisionToPoint2 < 0 && angleCollisionToPoint2 < -5) 
		// 			angleCollisionToPoint2 = angleCollisionToPoint2 + Math.PI*2;

		// 		//add points at the corners if within cone
		// 		if(angleCollisionToPoint1 < widthOfCone &&
		// 		   angleCollisionToPoint1 > blockedLimit){
		// 			point1 = this.CAMERA.translate(point1);
		// 			point1.color = "green"; //for debug
		// 			point1.angle = angleCollisionToPoint1;
		// 			listofPoints.push(point1);
		// 		}
		// 		if(angleCollisionToPoint2 < widthOfCone &&
		// 		   angleCollisionToPoint2 > blockedLimit){
		// 			point2 = this.CAMERA.translate(point2);
		// 			point2.color = "green"; //for debug
		// 			point2.angle = angleCollisionToPoint2;
		// 			listofPoints.push(point2);
		// 		}
		// 		if(angleCollisionToPoint1 > angleCollisionToPoint2){
		// 			blockedLimit = angleCollisionToPoint1;
		// 		} else blockedLimit = angleCollisionToPoint2;
		// 		i=blockedLimit+0.01;

		// 		if(this.debug){
		// 			//draw actual collision point in red
		// 			let pRotatedAngle = Utilities.calculateAngle({
		// 											point1: startPoint, 
		// 											point2: pRotated,
		// 										    centerPoint:originP});
		// 			if(pRotatedAngle < 0) pRotatedAngle = pRotatedAngle + Math.PI*2;
		// 			pRotated = this.CAMERA.translate(closestCollision);
		// 			pRotated.color = "red";
		// 			pRotated.angle = pRotatedAngle;
		// 			listofPoints.push(pRotated);
		// 		}

		// 	}//closest collision if hit
		// 	else{
		// 		let pRotatedAngle = Utilities.calculateAngle({
		// 										point1: startPoint, 
		// 										point2: pRotated,
		// 									    centerPoint:originP});
		// 		if(pRotatedAngle < 0) pRotatedAngle = pRotatedAngle + Math.PI*2;
		// 		pRotated = this.CAMERA.translate(pRotated);
		// 		pRotated.color = "yellow";
		// 		pRotated.angle = pRotatedAngle;
		// 		listofPoints.push(pRotated);
		// 		if(i != widthOfCone && (i+increment) > widthOfCone) i = widthOfCone;
		// 		else i=i+increment;

		// 	}
		// 	// listofPoints.push(pRotated);
			
		// }//for every light beam
		// this.lightCalculationsLastFrame = lightCalculations;

		listofPoints.sort((a,b)=>{
			return a.angle-b.angle;
		});

		this.lightPoints = listofPoints.length;

		//draw cone mask with collision
		this.offscreenRender.save();
		this.offscreenRender.beginPath();
		this.offscreenRender.moveTo(originPTrans.x, originPTrans.y);
		let index = 0; //debug
		let lastPoint = originPTrans; //debug
		listofPoints.forEach((point)=>{
			this.offscreenRender.lineTo(point.x, point.y);
			//debug
			if(this.debug){
				this.render.strokeStyle = "white";
				this.render.beginPath();
				this.render.moveTo(lastPoint.x, lastPoint.y);
				this.render.lineTo(point.x, point.y);
				lastPoint = point;
				this.render.closePath();
				this.render.stroke();
				this.render.fillStyle = point.color;
				this.render.beginPath();
				this.render.arc(point.x, point.y, 10, 0, 2*Math.PI);
				this.render.closePath();
				this.render.fill();
				this.render.fillStyle = "blue";
				this.render.font = "12px Arial";
				this.render.textAlign = "center"; 
				this.render.fillText(index, point.x, point.y);
				this.render.fillStyle = "white";
				this.render.textAlign = "left";
				this.render.fillText(point.name+Math.round(point.angle*100)/100, point.x+12, point.y);
				this.render.fillStyle = "white";
				this.render.textAlign = "right";
				this.render.fillText(point.count, point.x-12, point.y);
				index++;
			}
		}); //for each point
		//debug
		if(this.debug){
			this.render.strokeStyle = "white";
			this.render.beginPath();
			this.render.moveTo(lastPoint.x, lastPoint.y);
			this.render.lineTo(originPTrans.x, originPTrans.y);
			this.render.closePath();
			this.render.stroke();
		}

		this.offscreenRender.closePath();
		// the fill color
		let gradient = this.offscreenRender.createRadialGradient(
			originPTrans.x, originPTrans.y, (intensity*0.2), 
			originPTrans.x, originPTrans.y, intensity);
    	// gradient.addColorStop(0,"rgba(255, 255, 255, 0)");
    	gradient.addColorStop(0,"rgba(255, 255, 255, "+brightness+")");
    	gradient.addColorStop(0.6,"rgba(255, 255, 255, "+brightness+")");
    	gradient.addColorStop(1,"rgba(255, 255, 255, 0)");
    	this.offscreenRender.fillStyle = gradient;
		this.offscreenRender.fill();
		this.offscreenRender.restore();

		//draw glowingObjects
		// console.log(Object.keys(objectsGlowing).length);
		for(var id in objectsGlowing){
			let objOnScreen = this.CAMERA.translate({x:objectsGlowing[id].x,
													 y:objectsGlowing[id].y});
			let alpha = Utilities.mapNum({
				input: objectsGlowing[id].intensity,
				start1: 0,
				end1: intensity,
				start2: 0,
				end2: 1
			});
			// if(objectsGlowing[id].intensity>50) console.log(objectsGlowing[id].intensity, "=>", alpha);
			this.offscreenRender.save();
			this.offscreenRender.fillStyle = "rgba(255, 255, 255, "+alpha+")";
			this.offscreenRender.fillRect(
				(objOnScreen.x - 25), 
				(objOnScreen.y - 25), 
				50,50);
			this.offscreenRender.restore();
			// this.drawLightPoint(objectsGlowing[id]);
		}// each glowing object

	}//drawLightCone

	getLightPoints({width, origin, point, startPoint, mainWidth, 
		increment, intensity, objects, progressCCW=0, progressCW=0}){
		
		// let middleP = this.CAMERA.rotatePoint({
		// 						center: origin,
		// 						point: point,
		// 						angle: width/2
		// 					});
		point.angle = this.calculateAngle({
								point1: point,
								point2: startPoint,
								centerPoint: origin,
								width: width
							});
		
		let pointsToReturn = [];
		//get point collision
		//check all objects in range for collision
		let closestCollision = false;
		let closestSegment = null;
		let closestDist = Infinity;
		//for object glow
		let closestObj = null;
		// for(var id in objects){
		// 	let object = objects[id];
		// 	let collision = this.getIntersection(object.hitbox, {x1: origin.x,  y1: origin.y,
		// 												         x2: point.x,   y2: point.y});
		// 	if(collision){
		// 		let dist = Utilities.dist(collision.point, origin);
		// 		if(closestDist > dist){
		// 			closestObj = object;
		// 			closestDist = dist;
		// 			closestCollision = collision.point;
		// 			closestSegment = collision.line;
		// 		}
		// 	}
		// }//for objects in range

		if(false){ //closestCollision
			//calculate "lost" intensity
			// let lostIntensity = (intensity - closestDist);
			// if(objectsGlowing[closestObj.id] == null){
			// 	objectsGlowing[closestObj.id] = {
			// 		x: closestObj.x,
			// 		y: closestObj.y,
			// 		intensity: lostIntensity
			// 	};
			// } else {
			// 	objectsGlowing[closestObj.id].intensity += lostIntensity;
			// 	if(objectsGlowing[closestObj.id].intensity > intensity) objectsGlowing[closestObj.id].intensity = intensity;
			// }

			//make points at the corners of the box
			// let point1 = {x: closestSegment.x1, y: closestSegment.y1};
			// let point2 = {x: closestSegment.x2, y: closestSegment.y2};
			// let angleCollisionToPoint1 = Utilities.calculateAngle({
			// 								point1:startPoint, 
			// 								point2: point1,
			// 								centerPoint:originP});
			// let angleCollisionToPoint2 = Utilities.calculateAngle({
			// 								point1:startPoint, 
			// 								point2: point2,
			// 							    centerPoint:originP});
			// if(angleCollisionToPoint1 < 0) 
			// 	angleCollisionToPoint1 = angleCollisionToPoint1 + Math.PI*2;
			// if(angleCollisionToPoint2 < 0 && angleCollisionToPoint2 < -5) 
			// 	angleCollisionToPoint2 = angleCollisionToPoint2 + Math.PI*2;

			// //add points at the corners if within cone
			// if(angleCollisionToPoint1 < widthOfCone &&
			//    angleCollisionToPoint1 > blockedLimit){
			// 	point1 = this.CAMERA.translate(point1);
			// 	point1.color = "green"; //for debug
			// 	point1.angle = angleCollisionToPoint1;
			// 	listofPoints.push(point1);
			// }
			// if(angleCollisionToPoint2 < widthOfCone &&
			//    angleCollisionToPoint2 > blockedLimit){
			// 	point2 = this.CAMERA.translate(point2);
			// 	point2.color = "green"; //for debug
			// 	point2.angle = angleCollisionToPoint2;
			// 	listofPoints.push(point2);
			// }
			// if(angleCollisionToPoint1 > angleCollisionToPoint2){
			// 	blockedLimit = angleCollisionToPoint1;
			// } else blockedLimit = angleCollisionToPoint2;
			// i=blockedLimit+0.01;

			// if(this.debug){
			// 	//draw actual collision point in red
			// 	let pRotatedAngle = Utilities.calculateAngle({
			// 									point1: startPoint, 
			// 									point2: pRotated,
			// 								    centerPoint:origin});
			// 	if(pRotatedAngle < 0) pRotatedAngle = pRotatedAngle + Math.PI*2;
			// 	pRotated = this.CAMERA.translate(closestCollision);
			// 	pRotated.color = "red";
			// 	pRotated.angle = pRotatedAngle;
			// 	listofPoints.push(pRotated);
			// }

		}//closest collision if hit
		else{ //point just goes out to max length (intensity)
			let pointsCW = [];
			let pointsCCW = [];
			if(width > increment*3){
				let nextCWpoint = this.CAMERA.rotatePoint({
								center: origin,
								point:  point,
								angle:  increment
							});
				nextCWpoint.angle = this.calculateAngle({
								point1: nextCWpoint,
								point2: startPoint,
								centerPoint: origin,
								width: width
							});
				pointsCW  = this.getLightPoints({
						    	width:     ((width - point.angle) - increment),
						    	origin:    origin,
						    	point:     nextCWpoint,
						    	startPoint:startPoint,
						    	increment: increment,
						    	intensity: intensity,
						    	objects:   objects
						    });
				// let nextCCWpoint = this.CAMERA.rotatePoint({
				// 				center: origin,
				// 				point:  point,
				// 				angle:  increment
				// 			});
				// pointsCCW = this.getLightPoints({
				// 		    	width:     ((width - point.angle) - increment),
				// 		    	origin:    origin,
				// 		    	point:     nextCCWpoint,
				// 		    	startPoint:startPoint,
				// 		    	increment: increment,
				// 		    	intensity: intensity,
				// 		    	objects:   objects
				// 		    });
			} else {
				// let edgePointCCW = this.getViewPoint({
				// 					point: point, 
				// 					color: "yellow",
				// 					name: "L",
				// 					startPoint: startPoint, 
				// 					origin: origin,
				// 					width: width
				// 				});
				// let nextCWpoint = this.CAMERA.rotatePoint({
				// 					center: origin,
				// 					point: point,
				// 					angle: width
				// 				});
				// let edgePointCW = this.getViewPoint({
				// 					point: nextCWpoint, 
				// 					color: "yellow",
				// 					name: "R", 
				// 					startPoint: startPoint, 
				// 					origin: origin,
				// 					width: width
				// 				});
				// pointsCW = [edgePointCCW, edgePointCW];
				
			}
			
			let middleViewPoint = this.getViewPoint({
				point: point, 
				color: "yellow",
				name: "M",
				startPoint: startPoint, 
				origin: origin,
				width: width
			});


			pointsToReturn = pointsCW.concat(pointsCCW);
			pointsToReturn.push(middleViewPoint);
			return pointsToReturn;
		}
		// listofPoints.push(pRotated);
	}

	getViewPoint({point, color, name, startPoint, origin, width}){
		let pAngle = this.calculateAngle({
										point1: point, 
										point2: startPoint,
									    centerPoint:origin,
									    width: width});
		//translate to point for display
		let viewPoint = this.CAMERA.translate(point);
		viewPoint.color = color;
		viewPoint.angle = pAngle;
		viewPoint.name = name;
		viewPoint.count = this.orderPointsCreated;
		this.orderPointsCreated++;
		return viewPoint;
	}

	calculateAngle({point1, point2, centerPoint, width}){
		let pAngle = Utilities.calculateAngle({
										point1: point1, 
										point2: point2,
									    centerPoint:centerPoint});
		if(pAngle < 0) pAngle = pAngle + Math.PI*2;
		if(pAngle > width) pAngle = Math.PI*2 - pAngle;
		//Could cause an issue when cone is wider than PI aka 180, maybe?
		return pAngle;
	}

	getIntersection(corners, line){
		// console.log("corners:",corners);
		let boxLineTop = {x1:corners.topLeft.x, y1:corners.topLeft.y, 
						x2:corners.topRight.x, y2:corners.topRight.y};
		let boxLineRight = {x1:corners.topRight.x, y1:corners.topRight.y, 
						x2:corners.bottomRight.x, y2:corners.bottomRight.y};
		let boxLineBottom = {x1:corners.bottomRight.x, y1:corners.bottomRight.y, 
						x2:corners.bottomLeft.x, y2:corners.bottomLeft.y};
		let boxLineLeft = {x1:corners.bottomLeft.x, y1:corners.bottomLeft.y, 
						x2:corners.topLeft.x, y2:corners.topLeft.y};
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

}//lighting class