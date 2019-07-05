module.exports = class HUD{
	constructor({
		debug=false,
		divId="hud-layer",
		width=0,
		height=0,
		fontSize=20
	}){
		this.width = width;
		this.height = height;
		this.canvas = document.getElementById(divId);
		this.render = this.canvas.getContext("2d");
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.debug = debug;

		this.fontSize = fontSize;
		this.startX = 10;
		this.startY = this.fontSize;
		this.debugVars = {};
		console.log("Created hud-layer", this.width, this.height);
	}//constructor

	update(obj){
		//update debugText based on debug vars
		for(var id in obj){
			this.debugVars[id] = obj[id];
		}

	}

	draw(){
		//clear the canvas
     	this.render.save();
        this.render.setTransform(1, 0, 0, 1, 0, 0);
        this.render.clearRect(0, 0, this.width, this.height);
        this.render.beginPath();
        this.render.restore();

		this.render.font = this.fontSize+"px Arial";
		this.render.fillStyle = "yellow";
		this.render.strokeStyle = "blue";
		this.render.textAlign = "left";
		let offset = 0;
		for(var id in this.debugVars){
			let text = id + ": " + this.debugVars[id];
			this.render.fillText(text, this.startX, this.startY+offset);
			this.render.strokeText(text, this.startX, this.startY+offset); 
			offset += this.fontSize;
		}
		
	}


}//HUD