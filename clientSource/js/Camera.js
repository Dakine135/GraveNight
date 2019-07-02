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
		let centerX = Math.floor(x - (this.width / 2));
		let centerY = Math.floor(y - (this.height / 2));
		this.x = centerX;
		this.y = centerY;
	}

	setGoal(x,y){
		this.goalX = x;
		this.goalY = y;
	}

	translate(x, y){
		let tx = Math.round(x - this.x);
		let ty = Math.round(y - this.y);
		return {x:tx, y:ty};
	}

	update(){
		this.moveTo(this.goalX, this.goalY);
	}
}//camera class