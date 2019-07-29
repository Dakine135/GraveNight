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
		this.objectsGlowing = {};
		this.lightCalculationsLastFrame = 0;
		this.lightPoints = 0;
		this.orderPointsCreated = 0;
		this.precision = 0.1;
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

	update(deltaTime){
		for(var id in this.objectsGlowing){
			let object = this.objectsGlowing[id];
			let pointsPerSecond = 50;
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
		//TODO technically this is applied per frame and will be effected by frame rate
		intensity = intensity/10;
		if(this.objectsGlowing[obj.id] == null){
			this.objectsGlowing[obj.id] = {
				x: obj.x,
				y: obj.y,
				intensity: intensity
			};
		} else {
			this.objectsGlowing[obj.id].intensity += intensity;
			if(this.objectsGlowing[obj.id].intensity > 1000) 
				this.objectsGlowing[obj.id].intensity = 1000;
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
		brightness = 0.9,
		state
	}){
		if(intensity<=0){
			return;
		}
		let origin = {
			x: Math.round(x),
			y: Math.round(y)
		} 
		let originPTrans = this.CAMERA.translate(origin);
		
		if(state == null || state.world == null) return;
		//TODO optimization, get objects needs to take direction into account
		let objectsInRange = State.getObjectsInRange({
			state: state, 
			x: origin.x, 
			y: origin.y, 
			distance: intensity
		});
		
		//setup variables for loop and such
		let widthOfCone    = Math.PI*0.6; //maybe scale on intensity somehow
		let startAngle     = angle - (widthOfCone/2);
		let endAngle       = startAngle + widthOfCone;
		let startPoint     = this.CAMERA.rotatePoint({
								center: origin,
								point: {x: origin.x+intensity,
										y: origin.y},
								angle: startAngle
							});
		let listofPoints   = [];
		if(this.debug){
			this.HUD.debugUpdate({
		        lightPoints: this.lightPoints,
		        ObjectsInRangeLighting: Object.keys(objectsInRange).length
		    });
		}
	    let lightCalculations = 0;
	    this.orderPointsCreated = 0;


		for(var i=0; i<=widthOfCone; i=i){
			lightCalculations++;

			//current point/angle we are checking
			//like in individual light beam
			let pRotated = this.CAMERA.rotatePoint({
								center: origin,
								point: startPoint,
								angle: i
							});

			//get point collision
			let collision = this.getCollision({
				objects: objectsInRange, 
				origin:  origin, 
				point:   pRotated, 
				mainStartPoint: startPoint, 
				width: widthOfCone
			});

			if(collision.collision){
				let collisionPoints = [];

				//cascade down CW until you get a miss or hit the end of the cone
				let collidingCW = true;
				let nextCWAngle = collision.cwPoint.angle+0.01;
				if(nextCWAngle > widthOfCone) collidingCW = false;
				let limit = 0;
				while(collidingCW && limit<50){
					limit++;
					if(limit >= 50) console.log("loop limit reached CW:", nextCWAngle);
					let nextPoint = this.CAMERA.rotatePoint({
								center: origin,
								point: startPoint,
								angle: nextCWAngle
							});
					//get point collision
					let collisionCW = this.getCollision({
						objects: objectsInRange, 
						origin:  origin, 
						point:   nextPoint, 
						mainStartPoint: startPoint, 
						width: widthOfCone
					});
					if(collisionCW.collision){
						//calculate "lost" intensity
						let lostIntensity = (intensity - collisionCW.dist);
						this.addGowingObject({obj: collisionCW.object, intensity: lostIntensity});

						let viewCollisionPointCW = this.getViewPoint({
							point: collisionCW.collisionPoint, 
							color: "green",
							name: "H",
							startPoint: startPoint, 
							origin: origin,
							width: widthOfCone
						});
						collisionPoints.push(viewCollisionPointCW);
						let viewPointCollisionBox1 = this.getViewPoint({
							point: collisionCW.cwPoint, 
							color: "green",
							name: "CW",
							startPoint: startPoint, 
							origin: origin,
							width: widthOfCone
						});
						collisionPoints.push(viewPointCollisionBox1);
						nextCWAngle = collisionCW.cwPoint.angle+0.01;
						if(nextCWAngle > widthOfCone) collidingCW = false;
					}// next angle has a collision
					else{
						collidingCW = false;
						nextCWAngle = nextCWAngle + this.precision;
						let viewPointCW = this.getViewPoint({
							point: collisionCW.point, 
							color: "yellow",
							name: "M",
							startPoint: startPoint, 
							origin: origin,
							width: widthOfCone
						});
						collisionPoints.push(viewPointCW);
					}//end collision and loop
				}//CW side of collision while loop
				i=nextCWAngle;
				

				//cascade down CCW until you get a miss or hit the end of the cone
				let collidingCCW = true;
				let nextCCWAngle = collision.ccwPoint.angle-0.01;
				if(nextCCWAngle <= 0) collidingCCW = false;
				limit = 0;
				while(collidingCCW && limit<50){
					limit++;
					if(limit >= 50) console.log("loop limit reached CCW:", nextCCWAngle);
					let nextPoint = this.CAMERA.rotatePoint({
								center: origin,
								point: startPoint,
								angle: nextCCWAngle
							});
					//get point collision
					let collisionCCW = this.getCollision({
						objects: objectsInRange, 
						origin:  origin, 
						point:   nextPoint, 
						mainStartPoint: startPoint, 
						width: widthOfCone
					});
					if(collisionCCW.collision){
						//calculate "lost" intensity
						let lostIntensity = (intensity - collisionCCW.dist);
						this.addGowingObject({obj: collisionCCW.object, intensity: lostIntensity});
			
						let viewCollisionPointCW = this.getViewPoint({
							point: collisionCCW.collisionPoint, 
							color: "green",
							name: "H",
							startPoint: startPoint, 
							origin: origin,
							width: widthOfCone
						});
						collisionPoints.push(viewCollisionPointCW);
						let viewPointCollisionBox1 = this.getViewPoint({
							point: collisionCCW.ccwPoint, 
							color: "green",
							name: "CCW",
							startPoint: startPoint, 
							origin: origin,
							width: widthOfCone
						});
						collisionPoints.push(viewPointCollisionBox1);
						nextCCWAngle = collisionCCW.ccwPoint.angle-0.01;
						if(nextCCWAngle <= 0) collidingCCW = false;
					}// next angle has a collision
					else{
						collidingCCW = false;
						let viewPointCCW = this.getViewPoint({
							point: collisionCCW.point, 
							color: "yellow",
							name: "M",
							startPoint: startPoint, 
							origin: origin,
							width: widthOfCone
						});
						collisionPoints.push(viewPointCCW);
					}//end collision and loop
				}//CW side of collision while loop


				//calculate "lost" intensity
				let lostIntensity = (intensity - collision.dist);
				this.addGowingObject({obj: collision.object, intensity: lostIntensity});


				//add points at the corners if within cone
				if(collision.cwPoint.angle <= widthOfCone){
					let viewPointCollisionBox1 = this.getViewPoint({
						point: collision.cwPoint, 
						color: "green",
						name: "CW",
						startPoint: startPoint, 
						origin: origin,
						width: widthOfCone
					});
					collisionPoints.push(viewPointCollisionBox1);
				}
				if(collision.ccwPoint.angle >= 0 && collision.collisionPoint.angle > 0){
					let viewPointCollisionBox2 = this.getViewPoint({
						point: collision.ccwPoint, 
						color: "green",
						name: "CCW",
						startPoint: startPoint, 
						origin: origin,
						width: widthOfCone
					});
					collisionPoints.push(viewPointCollisionBox2);
				}


				if(this.debug){
					//draw actual collision point in red
					let viewPointCollisionPoint = this.getViewPoint({
						point: collision.collisionPoint, 
						color: "red",
						name: "H",
						startPoint: startPoint, 
						origin: origin,
						width: widthOfCone
					});
					collisionPoints.push(viewPointCollisionPoint);
				}
				listofPoints = listofPoints.concat(collisionPoints);

			}//closest collision if hit
			else{
				let viewPoint = this.getViewPoint({
					point: pRotated, 
					color: "yellow",
					name: "M",
					startPoint: startPoint, 
					origin: origin,
					width: widthOfCone
				});
				listofPoints.push(viewPoint);
				if(i != widthOfCone && (i+this.precision) > widthOfCone) i = widthOfCone;
				else i=i+this.precision;

			}
			
		}//for every light beam
		this.lightCalculationsLastFrame = lightCalculations;

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
				this.render.save();
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
				this.render.restore();
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

	}//drawLightCone

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
		// if(pAngle > Math.PI) pAngle = Math.PI - pAngle;
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

	getCollision({objects, origin, point, mainStartPoint, width}){
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

		if(closestCollision){
			//make points at the corners of the box
			let point1 = {x: closestSegment.x1, y: closestSegment.y1};
			let point2 = {x: closestSegment.x2, y: closestSegment.y2};
			let angleCollisionToPoint1 = this.calculateAngle({
											point1: point1, 
											point2: mainStartPoint,
											centerPoint:origin,
											width: width});
			let angleCollisionToPoint2 = this.calculateAngle({
											point1: point2, 
											point2: mainStartPoint,
										    centerPoint:origin,
										    width: width});
			let angleCollision = this.calculateAngle({
											point1: closestCollision, 
											point2: mainStartPoint,
										    centerPoint:origin,
										    width: width});

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
				collisionPoint: closestCollision,
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