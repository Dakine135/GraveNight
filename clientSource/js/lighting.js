// import Utilities from '../../shared/Utilities.js';
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
        	this.drawLightPoint({x:x, y:y, intensity:player.energy});
        	//flashlight location
        	this.render.save();
        	this.render.translate(x, y);
        	x = player.width/2;
        	y = player.height/2;
        	this.render.rotate(player.angle);
        	this.drawLightCone({x:x, y:y, intensity:(player.energy*2)});
        	this.render.restore();
        }
	}//draw

	drawLightPoint({
		x, 
		y, 
		intensity
	}){
		// console.log("lightdraw:",intensity);
		x = Math.round(x);
		y = Math.round(y);
		this.render.save();
		this.render.beginPath();
    	this.render.globalCompositeOperation = "xor";
    	let gradient = this.render.createRadialGradient(x, y, (intensity*0.6), x, y, intensity);
    	gradient.addColorStop(0,"rgba(255, 255, 255, 0.9)");
    	gradient.addColorStop(0.3,"rgba(255, 255, 255, 0.7)");
    	gradient.addColorStop(0.7,"rgba(255, 255, 255, 0.5)");
    	gradient.addColorStop(1,"rgba(255, 255, 255, 0.1)");
    	this.render.fillStyle = gradient;
    	this.render.arc(x, y, intensity, 0, Math.PI*2);
    	this.render.closePath();
    	this.render.fill();
    	this.render.restore();
	}

	drawLightCone({
		x, 
		y,
		intensity
	}){
		// the triangle
		this.render.beginPath();
		this.render.globalCompositeOperation = "xor";
		this.render.moveTo(x, y);
		this.render.lineTo(x+intensity, y-(intensity*0.5));
		this.render.lineTo(x+intensity, y+(intensity*0.5));
		this.render.closePath();
		// the fill color
		let gradient = this.render.createRadialGradient(x, y, (intensity*0.2), x, y, intensity);
    	gradient.addColorStop(0,"rgba(255, 255, 255, 0)");
    	gradient.addColorStop(0.3,"rgba(255, 255, 255, 1)");
    	gradient.addColorStop(0.8,"rgba(255, 255, 255, 0.8)");
    	gradient.addColorStop(1,"rgba(255, 255, 255, 0)");
    	this.render.fillStyle = gradient;
		this.render.fill();
	}


}//lighting class