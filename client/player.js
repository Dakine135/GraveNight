class Player{
	constructor({
		socketId=0,
		name="NoName",
		x=100,
		y=100,
		size=50
	}){
		this.socketId = socketId;
		this.name = name;
		this.x = x;
		this.y = y;
		this.size = size;
	}//constructor

	draw(){
		push(); // Start a new drawing state
		noStroke();
		rect (this.x, this.y, this.size, this.size);
		pop(); // Restore original state
	}
}