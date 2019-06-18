class Player{
	constructor({
		socketId=0,
		name="NoName",
		x=100,
		y=100,
		vX=0,
		vY=0,
		size=50
	}){
		this.socketId = socketId;
		this.name = name;
		this.x = x;
		this.y = y;
		this.vX = vX;
		this.vY = vY;
		this.size = size;
	}//constructor

	clone(){
		let playerClone = new Player(this);
		return playerClone;
	}

	draw(){
		// console.log("drawing");
		push(); // Start a new drawing state
		noStroke();
		rect (this.x, this.y, this.size, this.size);
		pop(); // Restore original state
	}
}