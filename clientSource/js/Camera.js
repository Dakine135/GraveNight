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
	
	moveTo(x, y){
		this.x = x;
		this.y = y;
	}

	setGoal(x,y){
		this.goalX = x;
		this.goalY = y;
	}

	translate(x, y){
		let orgiginX = this.x - (this.width/2);
		let orgiginY = this.y - (this.height/2);
		let tx = Math.round(x - orgiginX);
		let ty = Math.round(y - orgiginY);
		return {x:tx, y:ty};
	}

	update(){
		let diffX = this.x - this.goalX;
		let diffY = this.y - this.goalY;
		let moveX = this.x - (diffX*this.speed);
		let moveY = this.y - (diffY*this.speed);
		if(Math.abs(diffX) < 2) moveX = this.goalX;
		if(Math.abs(diffY) < 2) moveY = this.goalY;
		this.moveTo(moveX, moveY);
	}
}//camera class