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
		this.precision = 25; //increment by when checking for light collision, lower is more intensive, but more accurate (should only be needed for small objects)
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
        	this.drawLightCone({
        		x: rotatedPoint.x, 
        		y: rotatedPoint.y,
        		angle: player.angle, //player.angle
        		intensity:(player.energy*2), 
        		state:state
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
		// console.log("search from: ", worldX, worldY);
		// console.log("Number of Objects in Range:",
		// 	Math.floor(originP.x), 
		// 	Math.floor(originP.y),
		// 	Object.keys(objectsInRange).length
		// );
		
		let widthOfCone    = Math.PI*0.3; //maybe scale on intensity somehow
		let increment      = widthOfCone/this.precision;
		let startAngle     = angle - (widthOfCone/2);
		let endAngle       = startAngle + widthOfCone;
		let startPoint     = this.CAMERA.rotatePoint({
								center: originP,
								point: {x: originP.x+intensity,
										y: originP.y},
								angle: startAngle
							});
		let objectsGlowing = {};
		let listofPoints   = [];
		this.HUD.update({
	        lightCalculationsPerFrame: this.lightCalculationsLastFrame,
	        // startAngle: Math.round(startAngle*100)/100,
	        // endAngle: Math.round(endAngle*100)/100,
	        // startPoint: `${Math.round(startPoint.x)},${Math.round(startPoint.y)}`,
	        // endPoint:   `${Math.round(endPoint.x)},${Math.round(endPoint.y)}`,
	        // increment: increment
	    });
	    let lightCalculations = 0;
		for(var i=0; i<=widthOfCone; i=i+increment){
			lightCalculations++;

			let pRotated = this.CAMERA.rotatePoint({
								center: originP,
								point: startPoint,
								angle: i
							});

			// let pointTest = this.CAMERA.translate(pRotated);
			// this.render.save();
			// this.render.beginPath();
			// this.render.moveTo(originPTrans.x, originPTrans.y);
			// this.render.lineTo(pointTest.x, pointTest.y);
			// this.render.stroke();
			// this.render.restore();

			let closestCollision = false;
			let closestSegment = null;
			let closestDist = Infinity;
			//for object glow
			let closestObj = null;
			for(var id in objectsInRange){
				let object = objectsInRange[id];
				let corners = Hitbox.getCorners(object);
				// console.log("corners:",corners);
				let collision = this.getIntersection(corners, {x1: originP.x, y1: originP.y,
																x2: pRotated.x, y2: pRotated.y});
				if(collision){
					let dist = Hitbox.dist(collision.point, originP);
					if(closestDist > dist){
						closestObj = corners;
						closestDist = dist;
						closestCollision = collision.point;
						closestSegment = collision.line;
					}
				}
			}//for objects in range

			if(closestCollision){
				//calculate "lost" intensity
				let lostIntensity = (intensity - closestDist);
				if(objectsGlowing[closestObj.id] == null){
					objectsGlowing[closestObj.id] = {
						x: closestObj.x,
						y: closestObj.y,
						intensity: lostIntensity
					};
				} else {
					objectsGlowing[closestObj.id].intensity += lostIntensity;
					if(objectsGlowing[closestObj.id].intensity > intensity) objectsGlowing[closestObj.id].intensity = intensity;
				}

				//make points at the corners of the box
				let point1 = {x: closestSegment.x1, y: closestSegment.y1};
				let point2 = {x: closestSegment.x2, y: closestSegment.y2};
				listofPoints.push(this.CAMERA.translate(point1));
				listofPoints.push(this.CAMERA.translate(point2));
				// pRotated = closestCollision;
				// listofPoints.push(this.CAMERA.translate(pRotated));
			} else {
				listofPoints.push(this.CAMERA.translate(pRotated));
			}
			
			
			
		}//for every light beam
		this.lightCalculationsLastFrame = lightCalculations;

		//draw cone mask with collision
		this.offscreenRender.save();
		this.offscreenRender.beginPath();
		this.offscreenRender.moveTo(originPTrans.x, originPTrans.y);
		listofPoints.forEach((point)=>{
			this.offscreenRender.lineTo(point.x, point.y);
		});
		this.offscreenRender.closePath();
		// the fill color
		let gradient = this.offscreenRender.createRadialGradient(
			originPTrans.x, originPTrans.y, (intensity*0.2), 
			originPTrans.x, originPTrans.y, intensity);
    	// gradient.addColorStop(0,"rgba(255, 255, 255, 0)");
    	gradient.addColorStop(0,"rgba(255, 255, 255, 0.9)");
    	gradient.addColorStop(0.6,"rgba(255, 255, 255, 0.9)");
    	gradient.addColorStop(1,"rgba(255, 255, 255, 0)");
    	this.offscreenRender.fillStyle = gradient;
		this.offscreenRender.fill();
		this.offscreenRender.restore();

		//draw glowingObjects
		// console.log(Object.keys(objectsGlowing).length);
		// for(var id in objectsGlowing){
		// 	let objOnScreen = this.CAMERA.translate({x:objectsGlowing[id].x,
		// 											 y:objectsGlowing[id].y});
		// 	let alpha = Utilities.mapNum({
		// 		input: objectsGlowing[id].intensity,
		// 		start1: 0,
		// 		end1: intensity,
		// 		start2: 0,
		// 		end2: 1
		// 	});
		// 	// if(objectsGlowing[id].intensity>50) console.log(objectsGlowing[id].intensity, "=>", alpha);
		// 	this.offscreenRender.save();
		// 	this.offscreenRender.fillStyle = "rgba(255, 255, 255, "+alpha+")";
		// 	this.offscreenRender.fillRect(
		// 		(objOnScreen.x - 25), 
		// 		(objOnScreen.y - 25), 
		// 		50,50);
		// 	this.offscreenRender.restore();
		// 	// this.drawLightPoint(objectsGlowing[id]);
		// }// each glowing object

	}//drawLightCone

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
			closestDist = Hitbox.dist(top, {x:line.x1, y:line.y1});
		}
		let right = Hitbox.collideLineLine(line, boxLineRight);
		if(right){
			let dist = Hitbox.dist(right, {x:line.x1, y:line.y1});
			if(dist < closestDist){
				intersection = right;
				intersectingSegment = boxLineRight;
				closestDist = dist;
			}
		}
		let bottom = Hitbox.collideLineLine(line, boxLineBottom);
		if(bottom){
			let dist = Hitbox.dist(bottom, {x:line.x1, y:line.y1});
			if(dist < closestDist){
				intersection = bottom;
				intersectingSegment = boxLineBottom;
				closestDist = dist;
			}
		}
		let left = Hitbox.collideLineLine(line, boxLineLeft);
		if(left){
			let dist = Hitbox.dist(left, {x:line.x1, y:line.y1});
			if(dist < closestDist){
				intersection = left;
				intersectingSegment = boxLineLeft;
				closestDist = dist;
			}
		}
		return {point: intersection, line: intersectingSegment};
	}//get intersection

}//lighting class