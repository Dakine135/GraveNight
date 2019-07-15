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
		CONTROLS=null
	}){
		this.width = width;
		this.height = height;
		this.darkness=darkness;
		this.CONTROLS = CONTROLS;
		this.CAMERA = CAMERA;
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
		console.log("Created lighting-layer",this.width, this.height);
	}//constructor

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

        
        //fill black
        // this.offscreenRender.save();
        // this.offscreenRender.fillStyle = "rgba(0, 0, 0,"+ this.darkness +")";
        // this.offscreenRender.fillRect(0,0,this.width,this.height);
        // this.offscreenRender.restore();

        //draw light sources
        for(var id in this.lightSources){
        	let light = this.lightSources[id];
        	// let x = light.x + this.offsetX;
        	// let y = light.y + this.offsetY;
        	this.drawLightPoint({x:light.x, y:light.y, intensity:light.intensity});
        	
        }

        //draw Player lights
        for(var id in state.players){
        	let player = state.players[id];
        	//placeholder for player energy eventually
        	// let x = player.x + this.offsetX;
        	// let y = player.y + this.offsetY;
        	// console.log("player light:",player);
        	//old light point draw
        	//flashlight location
        	// this.offscreenRender.save();
        	// this.offscreenRender.translate(x, y);
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
        	// this.offscreenRender.rotate(player.angle);
        	this.drawLightCone({
        		x: rotatedPoint.x, 
        		y: rotatedPoint.y,
        		angle: player.angle,
        		intensity:(player.energy*2), 
        		state:state
        	});
        	// this.offscreenRender.restore();
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
	}

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
		
		var numDiv = 30;
		if(state == null || state.world == null) return;
		//TODO optimization, get objects needs to take direction into account
		let objectsInRange = State.getObjectsInRange({
			state: state, 
			x: originP.x, 
			y: originP.y, 
			distance: 500
		});
		// console.log("search from: ", worldX, worldY);
		// console.log("Number of Objects in Range:",
		// 	Math.floor(originP.x), 
		// 	Math.floor(originP.y),
		// 	Object.keys(objectsInRange).length
		// );
		// console.log(objectsInRange);
		// let maxIntensity = intensity;
		let offsetAmount = intensity/numDiv;
		for(var i=0;i<numDiv;i++){

			let pointLeft =  {x: originP.x+intensity,
						  	  y: (originP.y-(intensity*0.5))+offsetAmount*i};

			let pointRight = {x: originP.x+intensity,
						  	  y: (originP.y-(intensity*0.5))+offsetAmount*(i+1)};

			let pLRotated = this.CAMERA.rotatePoint({
				center: originP,
				point: pointLeft,
				angle: angle
			});
			let pRRotated = this.CAMERA.rotatePoint({
				center: originP,
				point: pointRight,
				angle: angle
			});

			let closestCollisionL = false;
			let closestCollisionR = false;
			let closestDistL = Infinity;
			let closestDistR = Infinity;
			//for object glow
			let objectsGlowing = {};
			let closestObjIdL = null;
			let closestObjIdR = null;
			for(var id in objectsInRange){
				let object = objectsInRange[id];
				let corners = Hitbox.getCorners(object);
				// console.log("corners:",corners);
				let collisionL = this.getIntersection(corners, {x1: originP.x, y1: originP.y,
																x2: pLRotated.x, y2: pLRotated.y});
				let collisionR = this.getIntersection(corners, {x1: originP.x, y1: originP.y,
																x2: pRRotated.x, y2: pRRotated.y});
				if(collisionL){
					// console.log("collision in loop for all objects:", collision);
					let dist = Hitbox.dist(collisionL, originP);
					if(closestDistL > dist){
						closestObjIdL = corners;
						closestDistL = dist;
						closestCollisionL = collisionL;
					}
				}
				if(collisionR){
					// console.log("collision in loop for all objects:", collision);
					let dist = Hitbox.dist(collisionR, originP);
					if(closestDistR > dist){
						closestObjIdR = corners;
						closestDistR = dist;
						closestCollisionR = collisionR;
					}
				}
			}

			if(closestCollisionL){
				//calculate "lost" intensity
				let lostIntensity = Math.floor((intensity - closestDistL)/10);
				if(objectsGlowing[closestObjIdL.id] == null){
					objectsGlowing[closestObjIdL.id] = {
						x: closestObjIdL.x,
						y: closestObjIdL.y,
						intensity: lostIntensity
					};
				} else {
					objectsGlowing[closestObjIdL.id].intensity += lostIntensity;
				}
				pLRotated = closestCollisionL;
			}
			if(closestCollisionR){
				//calculate "lost" intensity
				let lostIntensity = Math.floor((intensity - closestDistR)/10);
				if(objectsGlowing[closestObjIdR.id] == null){
					objectsGlowing[closestObjIdR.id] = {
						x: closestObjIdR.x,
						y: closestObjIdR.y,
						intensity: lostIntensity
					}
				} else {
					objectsGlowing[closestObjIdR.id].intensity += lostIntensity;
				}
				pRRotated = closestCollisionR;
			}
			
			//draw light beam
			//translate to screen location
			this.offscreenRender.save();
			pLRotated = this.CAMERA.translate(pLRotated);
			pRRotated = this.CAMERA.translate(pRRotated);
			this.offscreenRender.beginPath();
			this.offscreenRender.moveTo(originPTrans.x, originPTrans.y);
			
			this.offscreenRender.lineTo(pLRotated.x, pLRotated.y);
			this.offscreenRender.lineTo(pRRotated.x, pRRotated.y);
			this.offscreenRender.closePath();
			// the fill color
			let gradient = this.offscreenRender.createRadialGradient(
				originPTrans.x, originPTrans.y, (intensity*0.2), originPTrans.x, originPTrans.y, intensity);
	    	// gradient.addColorStop(0,"rgba(255, 255, 255, 0)");
	    	gradient.addColorStop(0,"rgba(255, 255, 255, 0.9)");
	    	gradient.addColorStop(0.6,"rgba(255, 255, 255, 0.9)");
	    	gradient.addColorStop(1,"rgba(255, 255, 255, 0)");
	    	this.offscreenRender.fillStyle = gradient;
			this.offscreenRender.fill();
			this.offscreenRender.restore();
			
			//draw glowingObjects
			// console.log(Object.keys(objectsGlowing).length);
			for(var id in objectsGlowing){
				let objOnScreen = this.CAMERA.translate({x:objectsGlowing[id].x,
														 y:objectsGlowing[id].y});
				this.offscreenRender.save();
				this.offscreenRender.fillStyle = "rgba(255, 255, 255, 1)";
				this.offscreenRender.fillRect(
					(objOnScreen.x - 25), 
					(objOnScreen.y - 25), 
					50,50);
				this.offscreenRender.restore();
				this.drawLightPoint(objectsGlowing[id]);
			}// each glowing object
		}//for every light beam
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
		let closestDist = Infinity;
		let top = Hitbox.collideLineLine(line, boxLineTop);
		if(top){
			intersection = top;
			closestDist = Hitbox.dist(top, {x:line.x1, y:line.y1});
		}
		let right = Hitbox.collideLineLine(line, boxLineRight);
		if(right){
			let dist = Hitbox.dist(right, {x:line.x1, y:line.y1});
			if(dist < closestDist){
				intersection = right;
				closestDist = dist;
			}
		}
		let bottom = Hitbox.collideLineLine(line, boxLineBottom);
		if(bottom){
			let dist = Hitbox.dist(bottom, {x:line.x1, y:line.y1});
			if(dist < closestDist){
				intersection = bottom;
				closestDist = dist;
			}
		}
		let left = Hitbox.collideLineLine(line, boxLineLeft);
		if(left){
			let dist = Hitbox.dist(left, {x:line.x1, y:line.y1});
			if(dist < closestDist){
				intersection = left;
				closestDist = dist;
			}
		}
		return intersection;
	}//get intersection

}//lighting class