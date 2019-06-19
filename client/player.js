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
		translate(this.x, this.y);
		let angle = 0;
		let v1 = createVector(mouseX-this.x, mouseY-this.y);
		let v2 = createVector(cos(angle),sin(angle));
		angle = v1.angleBetween(v2);
		//angle = acos((v1.dot(v2))/(abs(v1.mag())*abs(v2.mag())));
		if(mouseY <= this.y) angle = -angle;
		rotate(angle);
		rect (0, 0, this.size, this.size);
		fill(0, 0, 255);
		circle(15, 10, 10);
		circle(15, -10, 10);
		fill(0);
		rect(25, 25, 20, 10);
		pop(); // Restore original state
	}
}