module.exports = class Camera{
	constructor({
		x=0, y=0, 
		width=500, height=500, 
		speed=0.3
	}){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.goalX = x;
		this.goalY = y;
		this.speed = speed; //1 would be instant camera, percent to move each update toward player of remaining distance
	}

	resize({
		width,
		height
	}){
		this.width = width;
		this.height = height;
	}
	
	moveTo(x, y){
		this.x = x;
		this.y = y;
	}

	setGoal(x,y){
		this.goalX = x;
		this.goalY = y;
	}

	translate({x=0, y=0}){
		let orgiginX = this.x - (this.width/2);
		let orgiginY = this.y - (this.height/2);
		let tx = Math.round(x - orgiginX);
		let ty = Math.round(y - orgiginY);
		return {x:tx, y:ty};
	}

	rotatePoint({
		center={x:0, y:0}, 
		point={x:0, y:0}, 
		angle=0
	}){
		let s = Math.sin(angle);
		let c = Math.cos(angle);

		//make copy
		let newPoint = {x: point.x, y: point.y}; 

		// translate point back to origin:
		newPoint.x -= center.x;
		newPoint.y -= center.y;

		// rotate point
		let xnew = newPoint.x * c - newPoint.y * s;
		let ynew = newPoint.x * s + newPoint.y * c;

		// translate point back:
		newPoint.x = xnew + center.x;
		newPoint.y = ynew + center.y;
		return newPoint;
	}

	update(){
		let diffX = this.x - this.goalX;
		let diffY = this.y - this.goalY;
		let moveX = this.x - (diffX*this.speed);
		let moveY = this.y - (diffY*this.speed);
		if(Math.abs(diffX) < 2) moveX = this.goalX;
		if(Math.abs(diffY) < 2) moveY = this.goalY;
		this.moveTo(moveX, moveY);
		// this.moveTo(this.goalX, this.goalY);
	}
}//camera class