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
		this.offscreenCanvas = new OffscreenCanvas(width, height);
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
        	this.drawLightPoint({x:x, y:y, intensity:(player.energy/4)});
        	//flashlight location
        	this.offscreenRender.save();
        	this.offscreenRender.translate(x, y);
        	x = player.width/2;
        	y = player.height/2;
        	this.offscreenRender.rotate(player.angle);
        	this.drawLightCone({x:x, y:y, intensity:(player.energy*2),state:state});
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
		intensity,
		state
	}){
		if(intensity<=0){
			return;
		}
		// the triangle
		var numDiv = 50;
		//var 
		for(var i=0;i<=numDiv;i++){
		this.offscreenRender.beginPath();
		this.offscreenRender.moveTo(x, y);
		var toY1 = (y-(intensity*0.5))+(intensity*(i/numDiv));
		var toY2 = (y-(intensity*0.5))+(intensity*(i/numDiv))+(intensity*1/numDiv)+1;
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
    	//this.offscreenRender.noStroke();
    	this.offscreenRender.fillStyle = gradient;
		this.offscreenRender.fill();
		}
	}


}//lighting class