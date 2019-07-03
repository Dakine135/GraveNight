import Player from '../../shared/Player.js';

export default class Controls{
	constructor({debug=false, NETWORK=null, STATES=null, CAMERA=null}){
		console.log("Create Controls");
		this.debug = debug;
		this.NETWORK = NETWORK;
		this.STATES = STATES;
		this.CAMERA = CAMERA;

		this.leftClickPressed=false;
		this.middleClickPressed=false;
		this.rightClickPressed=false;
		window.addEventListener('mousedown', event => {
		  // console.log(event.button);
		  switch(event.button){
		    case 0:
		      this.leftClickPressed = true;
		      break;
		    case 1:
		      this.middleClickPressed=true;
		      break;
		    case 2:
		      this.rightClickPressed = true;
		      break;
		  }
		});
		window.addEventListener('mouseup', event => {
		  // console.log(event.button);
		  switch(event.button){
		    case 0:
		      this.leftClickPressed = false;
		      break;
		    case 1:
		      this.middleClickPressed=false;
		      break;
		    case 2:
		      this.rightClickPressed = false;
		      break;
		  }
		});
	}

	keyPressed(keyCode, key) {
		if(this.debug) console.log(`Pressed: ${keyCode}, ${key}`);
		let eventTime = this.STATES.nextState.time + this.STATES.currentDeltaTime;
		let data = {
			type:'playerMove', 
			pressed:true,
			time: eventTime
		};
		let validKey = true;
		switch(keyCode){
			case 65: //A
				//player move Left
				data.x = -1;
				data.y = 0;
				break;
			case 68: //D
				//Player move Right
				data.x = 1;
				data.y = 0;
				break;
			case 87: //W
				//Player Move Up
				data.x = 0;
				data.y = -1;
				break;
			case 83: //S
				//Player Move Down
				data.x = 0;
				data.y = 1;
				break;
			default:
				console.log(`Key Not Used Pressed: ${keyCode}, ${key}`);
				validKey = false;
		}//switch
		if(validKey){
			this.NETWORK.sendClientAction(data);
			data.socketId = this.NETWORK.mySocketId;
			this.STATES.addAction(data);
		}
	} //keyPressed

	keyReleased(keyCode, key) {
		if(this.debug) console.log(`Released: ${keyCode}, ${key}`);
		let eventTime = this.STATES.nextState.time + this.STATES.currentDeltaTime;
		let data = {
			type:'playerMove', 
			pressed:false,
			time: eventTime
		};
		let validKey = true;
		switch(keyCode){
			case 65: //A
				//player move Left
				data.x = -1;
				data.y = 0;
				break;
			case 68: //D
				//Player move Right
				data.x = 1;
				data.y = 0;
				break;
			case 87: //W
				//Player Move Up
				data.x = 0;
				data.y = -1;
				break;
			case 83: //S
				//Player Move Down
				data.x = 0;
				data.y = 1;
				break;
			default:
				console.log(`Key Not Used Released: ${keyCode}, ${key}`);
				validKey = false;
		}
		if(validKey){
			this.NETWORK.sendClientAction(data);
			data.socketId = this.NETWORK.mySocketId;
			this.STATES.addAction(data);
		}
	} // keyReleased

	translateScreenLocToWorld(x,y){
		let offsetX = x - (this.CAMERA.width/2);
		let offsetY = y - (this.CAMERA.height/2);
		let worldX = Math.round((this.CAMERA.x) + offsetX);
		let worldY = Math.round((this.CAMERA.y) + offsetY);
		return {x:worldX, y:worldY};
	}

	mouseMoved(mouseX, mouseY) {
		if(this.debug) console.log(`Mouse: ${mouseX}, ${mouseY}`);
		let locInWorld = this.translateScreenLocToWorld(mouseX, mouseY);
		if(this.debug) console.log(`locInWorld: ${locInWorld.x}, ${locInWorld.y}`);
		// if(this.debug) console.log("player Angle:", angle);
		let eventTime = this.STATES.nextState.time + this.STATES.currentDeltaTime;
		let data = {
			type:'playerCursor',
			x: locInWorld.x,
			y: locInWorld.y,
			time: eventTime
		};
		this.NETWORK.sendClientAction(data);
		data.socketId = this.NETWORK.mySocketId;
		this.STATES.addAction(data);
	}


} //Controls Class