// import Utilities from '../../shared/Utilities.js';
module.exports = class lighting{
	constructor({
		debug=false,
		divId="lighting-layer",
		width=0,
		height=0
	}){
		this.width = width;
		this.height = height;
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
        this.render.fillStyle = "rgba(0, 0, 0, 0.9)";
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
        	let energy = 200;
        	let x = player.x + offsetX;
        	let y = player.y + offsetY;
        	// console.log("player light:",player);
        	this.drawLightPoint({x:x, y:y, intensity:energy});
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
		this.render.beginPath();
    	this.render.globalCompositeOperation = "xor";
    	let gradient = this.render.createRadialGradient(x, y, (intensity*0.6), x, y, intensity);
    	gradient.addColorStop(0,"rgba(255, 255, 255, 0.9)");
    	gradient.addColorStop(0.3,"rgba(255, 255, 255, 0.7)");
    	gradient.addColorStop(0.7,"rgba(255, 255, 255, 0.5)");
    	gradient.addColorStop(1,"rgba(255, 255, 255, 0.1)");
    	this.render.fillStyle = gradient;
    	this.render.arc(x, y, intensity, 0, Math.PI*2);
    	this.render.fill();
    	this.render.closePath();
	}

	drawLightCone(){
		
	}


}//lighting class