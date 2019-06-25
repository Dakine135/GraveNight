import Player from '../../shared/Player.js';

export default class Controls{
	constructor({debug=false, NETWORK=null}){
		console.log("Create Controls");
		this.debug = debug;
		this.NETWORK = NETWORK;
	}

	keyPressed(keyCode, key) {
		if(this.debug) console.log(`Pressed: ${keyCode}, ${key}`);
		switch(keyCode){
			case 65: //A
				//player move Left
				this.NETWORK.sendClientAction({
					type:'playerMove',
					pressed: true,
					x:-1,
					y:0
				});
				break;
			case 68: //D
				//Player move Right
				this.NETWORK.sendClientAction({
					type:'playerMove',
					pressed: true,
					x:1,
					y:0
				});
				break;
			case 87: //W
				//Player Move Up
				this.NETWORK.sendClientAction({
					type:'playerMove',
					pressed: true,
					x:0,
					y:-1
				});
				break;
			case 83: //S
				//Player Move Down
				this.NETWORK.sendClientAction({
					type:'playerMove',
					pressed: true,
					x:0,
					y:1
				});
				break;
			default:
				console.log(`Key Not Used Pressed: ${keyCode}, ${key}`);
		}//switch
	} //keyPressed

	keyReleased(keyCode, key) {
		if(this.debug) console.log(`Released: ${keyCode}, ${key}`);
		switch(keyCode){
			case 65: //A
				//player move Left
				this.NETWORK.sendClientAction({
					type:'playerMove',
					pressed: false,
					x:-1,
					y:0
				});
				break;
			case 68: //D
				//Player move Right
				this.NETWORK.sendClientAction({
					type:'playerMove',
					pressed: false,
					x:1,
					y:0
				});
				break;
			case 87: //W
				//Player Move Up
				this.NETWORK.sendClientAction({
					type:'playerMove',
					pressed: false,
					x:0,
					y:-1
				});
				break;
			case 83: //S
				//Player Move Down
				this.NETWORK.sendClientAction({
					type:'playerMove',
					pressed: false,
					x:0,
					y:1
				});
				break;
			default:
				console.log(`Key Not Used Released: ${keyCode}, ${key}`);
		}
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