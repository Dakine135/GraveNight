module.exports = class Player{
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

	calculateAngle(mouseX, mouseY, sk){
		let v1 = sk.createVector(mouseX-this.x, mouseY-this.y);
		let v2 = sk.createVector(1,0);
		let angle = v1.angleBetween(v2);
		//angle = acos((v1.dot(v2))/(abs(v1.mag())*abs(v2.mag())));
		if(mouseY <= this.y) angle = -angle;
		return angle;
	}

	draw(sk){
		// console.log("drawing");
		sk.push(); // Start a new drawing state
		sk.noStroke();
		sk.translate(this.x, this.y);
		sk.textSize(18);
		sk.fill(this.color.r, this.color.g, this.color.b);
		sk.textAlign(sk.CENTER);
		sk.text(this.name, 0, -this.size);
		sk.rotate(this.angle);
		sk.rect (0, 0, this.size, this.size);
		sk.fill(0, 0, 255);
		sk.circle(15, 10, 10);
		sk.circle(15, -10, 10);
		sk.fill(0);
		sk.rect(25, 25, 20, 10);
		sk.pop(); // Restore original state
	}
}