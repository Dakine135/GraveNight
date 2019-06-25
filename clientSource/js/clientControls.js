import Player from '../../shared/Player.js';

export default class Controls{
	constructor({debug=false, NETWORK=null}){
		console.log("Create Controls");
		this.debug = debug;
		this.NETWORK = NETWORK;
	}

	keyPressed(keyCode, key) {
		if(this.debug) console.log(`Pressed: ${keyCode}, ${key}`);
		let data = {type:'playerMove', pressed:true};
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
	} //keyPressed

	keyReleased(keyCode, key) {
		if(this.debug) console.log(`Released: ${keyCode}, ${key}`);
		let data = {type:'playerMove', pressed:false};
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
	} // keyReleased

	mouseMoved(mouseX, mouseY, sk) {
		if(this.debug) console.log(`Mouse: ${mouseX}, ${mouseY}`);
		let myPlayer = this.NETWORK.getMyPlayer();
		if(myPlayer == null) return;
		let angle = Player.calculateAngle(myPlayer, mouseX, mouseY, sk);
		if(this.debug) console.log("player Angle:", angle);
		this.NETWORK.sendClientAction({
			type:'playerRotate',
			angle: angle
		});
	}


} //Controls Class