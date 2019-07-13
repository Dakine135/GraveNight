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
		darkness=0.9
	}){
		this.width = width;
		this.height = height;
		this.darkness=darkness;
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

	draw(offsetX, offsetY, state){
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
        	let x = light.x + offsetX;
        	let y = light.y + offsetY;
        	this.drawLightPoint({x:x, y:y, intensity:light.intensity});
        	
        }

        //draw Player lights
        for(var id in state.players){
        	let player = state.players[id];
        	//placeholder for player energy eventually
        	let x = player.x + offsetX;
        	let y = player.y + offsetY;
        	// console.log("player light:",player);
        	this.drawLightPoint({x:x, y:y, intensity:(player.energy/2)});
        	//flashlight location
        	this.offscreenRender.save();
        	this.offscreenRender.translate(x, y);
        	x = player.width/2;
        	y = player.height/2;
        	this.offscreenRender.rotate(player.angle);
        	this.drawLightCone({
        		x:x, 
        		y:y,
        		worldX:(x + offsetX),
        		worldY:(y + offsetY), 
        		intensity:(player.energy*2), 
        		state:state
        	});
        	this.offscreenRender.restore();
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
		x = Math.round(x);
		y = Math.round(y);
		this.offscreenRender.save();
		this.offscreenRender.beginPath();
    	let gradient = this.offscreenRender.createRadialGradient(x, y, (intensity*0.6), x, y, intensity);
    	gradient.addColorStop(0,"rgba(255, 255, 255, 0.9)");
    	gradient.addColorStop(0.3,"rgba(255, 255, 255, 0.7)");
    	gradient.addColorStop(0.7,"rgba(255, 255, 255, 0.5)");
    	gradient.addColorStop(1,"rgba(255, 255, 255, 0.1)");
    	this.offscreenRender.fillStyle = gradient;
    	this.offscreenRender.arc(x, y, intensity, 0, Math.PI*2);
    	this.offscreenRender.closePath();
    	this.offscreenRender.fill();
    	this.offscreenRender.restore();
	}

	drawLightCone({
		x, 
		y,
		worldX,
		worldY,
		intensity,
		state
	}){
		if(intensity<=0){
			return;
		}
		// the triangle
		// console.log(this.offscreenRender.getTransform());
		var numDiv = 20;
		if(state == null || state.world == null) return;
		let objectsInRange = State.getObjectsInRange({
			state: state, 
			x: worldX, 
			y: worldY, 
			distance: 100
		});
		// console.log(Object.keys(objectsInRange).length);
		// console.log(objectsInRange);
		let maxIntensity = intensity;
		for(var i=0;i<=numDiv;i++){

			var toY1 = (y-(intensity*0.5))+(intensity*(i/numDiv));
			var toY2 = (y-(intensity*0.5))+(intensity*(i/numDiv))+(intensity*1/numDiv);
			let middleOfBeamEnd = toY2 - ((toY2-toY1)/2);
			// console.log("Y1, Y2, Middle", toY1, toY2, middleOfBeamEnd);
			let line = {x1:x, y1:y, x2:x, y2:middleOfBeamEnd};
			let closestCollision = false;
			let closestDist = Infinity;
			for(var id in objectsInRange){
				let object = objectsInRange[id];
				let corners = Hitbox.getCorners(object);
				let collision = this.getIntersection(corners, line);
				if(collision){
					let dist = Hitbox.dist(collision, {x:line.x1, y:line.y1});
					if(closestDist > dist){
						closestDist = dist;
						closestCollision = collision;
					}
				}
			}

			if(closestCollision){
				console.log("collision at",closestCollision);
				intensity = closestDist;
			}
			
			//draw light beam
			this.offscreenRender.beginPath();
			this.offscreenRender.moveTo(x, y);
			
			this.offscreenRender.lineTo(x+intensity, toY1);
			this.offscreenRender.lineTo(x+intensity, toY2);
			this.offscreenRender.closePath();
			// the fill color
			let gradient = this.offscreenRender.createRadialGradient(
				x, y, (intensity*0.2), x, y, intensity);
	    	// gradient.addColorStop(0,"rgba(255, 255, 255, 0)");
	    	gradient.addColorStop(0,"rgba(255, 255, 255, 0.9)");
	    	gradient.addColorStop(0.6,"rgba(255, 255, 255, 0.9)");
	    	gradient.addColorStop(1,"rgba(255, 255, 255, 0)");
	    	this.offscreenRender.fillStyle = "white";
			this.offscreenRender.fill();
			intensity = maxIntensity;
		}
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