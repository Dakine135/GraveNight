module.exports = class HUD{
	constructor({
		debug=false,
		divId="hud-layer",
		width=0,
		height=0,
		fontSize=20,
		CONTROLS=null
	}){
		this.width = width;
		this.height = height;
		this.CONTROLS = CONTROLS;
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

	resize({
		width,
		height
	}){
		this.width = width;
		this.height = height;
		this.canvas.width = this.width;
		this.canvas.height = this.height;
	}

	update(obj){
		for(var id in obj){
			this[id] = obj[id];
		}
	}

	debugUpdate(obj){
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

		//draw cross-hair
    let size = 10;
    if(this.CONTROLS.rightClickPressed){
    	this.render.beginPath();
      this.render.arc(this.CONTROLS.mouse.x, this.CONTROLS.mouse.y, 
      	size*2, 0, Math.PI*2
      );
      this.render.stroke();
    }
    if(this.CONTROLS.leftClickPressed){
    	this.render.beginPath();
      this.render.arc(this.CONTROLS.mouse.x, this.CONTROLS.mouse.y, 
      	size/2, 0, Math.PI*2
      );
      this.render.stroke();
    }
    // this.render.stroke(100);
    this.render.save();
    this.render.beginPath();
    this.render.moveTo(this.CONTROLS.mouse.x-size, this.CONTROLS.mouse.y);
    this.render.lineTo(this.CONTROLS.mouse.x+size, this.CONTROLS.mouse.y);
    this.render.stroke();
    this.render.moveTo(this.CONTROLS.mouse.x, this.CONTROLS.mouse.y-size);
    this.render.lineTo(this.CONTROLS.mouse.x, this.CONTROLS.mouse.y+size);
    this.render.stroke();
    this.render.font = size+"px Arial";
	this.render.strokeStyle = "white";
	this.render.textAlign = "center";
    //location on screen
    this.render.fillText(this.CONTROLS.mouse.x+","+this.CONTROLS.mouse.y, 
    	this.CONTROLS.mouse.x, this.CONTROLS.mouse.y-size
    );
    //location in world
    let mouseWorld = this.CONTROLS.translateScreenLocToWorld(
    	this.CONTROLS.mouse.x, this.CONTROLS.mouse.y
    );
    this.render.fillText(mouseWorld.x+","+mouseWorld.y, 
    	this.CONTROLS.mouse.x, this.CONTROLS.mouse.y+(size*2)
    );
    this.render.restore();
		
	}//draw


}//HUD