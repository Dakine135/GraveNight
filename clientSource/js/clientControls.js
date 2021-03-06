const Player = require('../../shared/Player.js');

module.exports = class Controls{
	constructor({debug=false, engine=null}){
		console.log("Create Controls");
		this.debug = debug;
		this.ENGINE = engine;

		this.mouse = {x:0, y:0};
		this.keysBeingPressed = {};

		this.leftClickPressed=false;
		this.middleClickPressed=false;
		this.rightClickPressed=false;
		window.addEventListener('mousedown', event => {
		  if(this.debug) console.log("mousePressed:", event.button);
		  switch(event.button){
		    case 0: this.leftClickPressed   = true; break;
		    case 1: this.middleClickPressed = true; break;
		    case 2: this.rightClickPressed  = true; break;
		  }
		});
		window.addEventListener('mouseup', event => {
		  if(this.debug) console.log("mouseReleased:", event.button);
		  switch(event.button){
		    case 0: this.leftClickPressed   = false; break;
		    case 1: this.middleClickPressed = false; break;
		    case 2: this.rightClickPressed  = false; break;
		  }
		});
		window.addEventListener('wheel',          this.scrollEvent.bind(this));
		window.addEventListener('keydown',        this.keyPressed.bind(this));
		window.addEventListener('keyup',          this.keyReleased.bind(this));
		window.addEventListener('mousemove',      this.mouseMoved.bind(this));
	}//constructor

	scrollEvent(event){
		// let eventTime = this.ENGINE.STATES.serverState.time + this.ENGINE.STATES.currentDeltaTime;
		let data = {
			type:'playerScroll',
			time: this.ENGINE.STATES.currentTimeInSimulation
		};
		if(event.deltaY > 0){
			if(this.debug) console.log("scroll Down");
			data.direction = 1;
		} else {
			if(this.debug) console.log("scroll up");
			data.direction = -1;
		}
		this.ENGINE.NETWORK.sendClientAction(data);
		data.socketId = this.ENGINE.NETWORK.mySocketId;
		this.ENGINE.STATES.addAction(data);
	}

	keyPressed(event) {
		let keyCode = event.keyCode;
		let key     = event.key;
		if(this.debug) console.log(`Pressed: ${keyCode}, ${key}`);
		if(!this.keysBeingPressed[keyCode]) this.keysBeingPressed[keyCode] = true;
		else{ 
			//console.log("key already pressed:", keyCode); 
			return;
		};
		// let eventTime = this.ENGINE.STATES.state.time + this.ENGINE.STATES.currentDeltaTime;
		let data = {
			type:'playerMove', 
			pressed:true,
			time: this.ENGINE.STATES.currentTimeInSimulation
		};
		let validKey = true;
		switch(keyCode){
			case 65: //A
			case 37: //left arrow
				//player move Left
				data.x = -1;
				data.y = 0;
				break;
			case 68: //D
			case 39: //right arrow
				//Player move Right
				data.x = 1;
				data.y = 0;
				break;
			case 87: //W
			case 38: //arrow up
				//Player Move Up
				data.x = 0;
				data.y = -1;
				break;
			case 83: //S
			case 40: //arrow down
				//Player Move Down
				data.x = 0;
				data.y = 1;
				break;
			default:
				console.log(`Key Not Used Pressed: ${keyCode}, ${key}`);
				validKey = false;
		}//switch
		if(validKey){
			this.ENGINE.NETWORK.sendClientAction(data);
			data.socketId = this.ENGINE.NETWORK.mySocketId;
			this.ENGINE.STATES.addAction(data);
		}
	} //keyPressed

	keyReleased(event) {
		let keyCode = event.keyCode;
		let key     = event.key;
		if(this.debug) console.log(`Released: ${keyCode}, ${key}`);
		if(this.keysBeingPressed[keyCode]) this.keysBeingPressed[keyCode] = false;
		else{ 
			//console.log("key never pressed but Released:", keyCode); 
			return;
		};
		// let eventTime = this.ENGINE.STATES.state.time + this.ENGINE.STATES.currentDeltaTime;
		let data = {
			type:'playerMove', 
			pressed:false,
			time: this.ENGINE.STATES.currentTimeInSimulation
		};
		let validKey = true;
		switch(keyCode){
			case 65: //A
			case 37: //left arrow
				//player move Left
				data.x = -1;
				data.y = 0;
				break;
			case 68: //D
			case 39: //right arrow
				//Player move Right
				data.x = 1;
				data.y = 0;
				break;
			case 87: //W
			case 38: //arrow up
				//Player Move Up
				data.x = 0;
				data.y = -1;
				break;
			case 83: //S
			case 40: //arrow down
				//Player Move Down
				data.x = 0;
				data.y = 1;
				break;
			default:
				console.log(`Key Not Used Released: ${keyCode}, ${key}`);
				validKey = false;
		}
		if(validKey){
			this.ENGINE.NETWORK.sendClientAction(data);
			data.socketId = this.ENGINE.NETWORK.mySocketId;
			this.ENGINE.STATES.addAction(data);
		}
	} // keyReleased

	translateScreenLocToWorld(x,y){
		let offsetX = x - (this.ENGINE.width/2);
		let offsetY = y - (this.ENGINE.height/2);
		let worldX = Math.round((this.ENGINE.CAMERA.x) + offsetX);
		let worldY = Math.round((this.ENGINE.CAMERA.y) + offsetY);
		return {x:worldX, y:worldY};
	}

	mouseMoved(event) {
		let mouseX = event.pageX;
		let mouseY = event.pageY;
		this.mouse = {x: mouseX, y: mouseY};
		let locInWorld = this.translateScreenLocToWorld(mouseX, mouseY);
		// let eventTime = this.ENGINE.STATES.serverState.time + this.ENGINE.STATES.currentDeltaTime;
		let data = {
			type:'playerCursor',
			x: locInWorld.x,
			y: locInWorld.y,
			time: this.ENGINE.STATES.currentTimeInSimulation
		};
		this.ENGINE.NETWORK.sendClientAction(data);
		data.socketId = this.ENGINE.NETWORK.mySocketId;
		this.ENGINE.STATES.addAction(data);
	}


} //Controls Class