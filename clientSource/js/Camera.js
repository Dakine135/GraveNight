const Utilities = require('../../shared/Utilities.js');
module.exports = class Camera{
	constructor({
		x=0, y=0, 
		engine=Utilities.error("engine not linked"),
		speed=0.3,
		debug=false
	}){
		this.x = x;
		this.y = y;
		this.engine = engine;
		this.debug = debug;
		this.goalX = x;
		this.goalY = y;
		this.speed = speed; //1 would be instant camera, percent to move each update toward player of remaining distance
	}
	
	moveTo(x, y){
		this.x = Math.round(x);
		this.y = Math.round(y);
	}

	setGoal(x,y){
		this.goalX = x;
		this.goalY = y;
	}

	translate({x=0, y=0}){
		let orgiginX = this.x - (this.engine.width/2);
		let orgiginY = this.y - (this.engine.height/2);
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
		if(this.debug) this.moveTo(this.goalX, this.goalY);
		else {
			let diffX = this.x - this.goalX;
			let diffY = this.y - this.goalY;
			let moveX = this.x - (diffX*this.speed);
			let moveY = this.y - (diffY*this.speed);
			if(Math.abs(diffX) < 2) moveX = this.goalX;
			if(Math.abs(diffY) < 2) moveY = this.goalY;
			this.moveTo(moveX, moveY);
		}
	}
}//camera class