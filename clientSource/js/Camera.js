module.exports = class Camera{
	constructor(x,y, width, height){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.goalX = x;
		this.goalY = y;
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
		let moveX = this.x - (diffX/50);
		let moveY = this.y - (diffY/50);
		if(Math.abs(diffX) < 1) moveX = this.goalX;
		if(Math.abs(diffY) < 1) moveY = this.goalY;
		this.moveTo(moveX, moveY);
	}
}//camera class