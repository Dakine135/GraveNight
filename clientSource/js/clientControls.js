import Player from '../../shared/Player.js';

export default class Controls{
	constructor({debug=false, NETWORK=null, STATES=null}){
		console.log("Create Controls");
		this.debug = debug;
		this.NETWORK = NETWORK;
		this.STATES = STATES;

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
		}//switch
		this.NETWORK.sendClientAction(data);
		data.socketId = this.NETWORK.mySocketId;
		this.STATES.addAction(data);
	} //keyPressed

	keyReleased(keyCode, key) {
		if(this.debug) console.log(`Released: ${keyCode}, ${key}`);
		let eventTime = this.STATES.nextState.time + this.STATES.currentDeltaTime;
		let data = {
			type:'playerMove', 
			pressed:false,
			time: eventTime
		};
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
		}
		this.NETWORK.sendClientAction(data);
		data.socketId = this.NETWORK.mySocketId;
		this.STATES.addAction(data);
	} // keyReleased

	mouseMoved(mouseX, mouseY) {
		if(this.debug) console.log(`Mouse: ${mouseX}, ${mouseY}`);
		// if(this.debug) console.log("player Angle:", angle);
		let eventTime = this.STATES.nextState.time + this.STATES.currentDeltaTime;
		let data = {
			type:'playerCursor',
			x: mouseX,
			y: mouseY,
			time: eventTime
		};
		this.NETWORK.sendClientAction(data);
		data.socketId = this.NETWORK.mySocketId;
		this.STATES.addAction(data);
	}


} //Controls Class