class Controls{
	constructor({debug=false}){
		console.log("Create Controls");
		this.debug = debug;
	}

	keyPressed(keyCode, key) {
		if(this.debug) console.log(`Pressed: ${keyCode}, ${key}`);
		switch(keyCode){
			case 65: //A
				//player move Left
				NETWORK.sendClientAction({
					type:'playerMove',
					pressed: true,
					x:-1,
					y:0
				});
				break;
			case 68: //D
				//Player move Right
				NETWORK.sendClientAction({
					type:'playerMove',
					pressed: true,
					x:1,
					y:0
				});
				break;
			case 87: //W
				//Player Move Up
				NETWORK.sendClientAction({
					type:'playerMove',
					pressed: true,
					x:0,
					y:-1
				});
				break;
			case 83: //S
				//Player Move Down
				NETWORK.sendClientAction({
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
				NETWORK.sendClientAction({
					type:'playerMove',
					pressed: false,
					x:-1,
					y:0
				});
				break;
			case 68: //D
				//Player move Right
				NETWORK.sendClientAction({
					type:'playerMove',
					pressed: false,
					x:1,
					y:0
				});
				break;
			case 87: //W
				//Player Move Up
				NETWORK.sendClientAction({
					type:'playerMove',
					pressed: false,
					x:0,
					y:-1
				});
				break;
			case 83: //S
				//Player Move Down
				NETWORK.sendClientAction({
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

	mouseMoved(mouseX, mouseY) {
		if(this.debug) console.log(`Mouse: ${mouseX}, ${mouseY}`);
		let myPlayer = NETWORK.getMyPlayer();
		if(myPlayer == null) return;
		let angle = myPlayer.calculateAngle(mouseX, mouseY);
		if(this.debug) console.log("player Angle:", angle);
		NETWORK.sendClientAction({
			type:'playerRotate',
			angle: angle
		});
	}


} //Controls Class