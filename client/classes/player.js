class Player{
	constructor({
		socketId=0,
		name="NoName",
		x=100,
		y=100,
		vX=0,
		vY=0,
		size=50,
		angle=0,
		color={r:255,g:255,b:255}
	}){
		this.socketId = socketId;
		this.name = name;
		this.x = x;
		this.y = y;
		this.vX = vX;
		this.vY = vY;
		this.size = size;
		this.angle = angle;
		this.color = color;
	}//constructor

	clone(){
		let playerClone = new Player(this);
		return playerClone;
	}

	calculateAngle(mouseX, mouseY){
		let v1 = createVector(mouseX-this.x, mouseY-this.y);
		let v2 = createVector(1,0);
		let angle = v1.angleBetween(v2);
		//angle = acos((v1.dot(v2))/(abs(v1.mag())*abs(v2.mag())));
		if(mouseY <= this.y) angle = -angle;
		return angle;
	}

	draw(){
		// console.log("drawing");
		push(); // Start a new drawing state
		noStroke();
		translate(this.x, this.y);
		textSize(18);
		fill(this.color.r, this.color.g, this.color.b);
		textAlign(CENTER);
		text(this.name, 0, -this.size);
		rotate(this.angle);
		rect (0, 0, this.size, this.size);
		fill(0, 0, 255);
		circle(15, 10, 10);
		circle(15, -10, 10);
		fill(0);
		rect(25, 25, 20, 10);
		pop(); // Restore original state
	}
}