var Utilities = require('../shared/Utilities.js');

exports.create = ({
	top = 0,
	bottom = 0,
	left = 0,
	right = 0
})=>{
	return {
		top: top,
		bottom: bottom,
		left: left,
		right: right
	}
} //create

function colliding(obj1, obj2) {
	let hitbox1 = getHitbox(obj1);
	let hitbox2 = getHitbox(obj2);
	// console.log("In colliding:", hitbox1, hitbox2);
	if(hitbox1.top > hitbox2.bottom ||
	   hitbox1.bottom < hitbox2.top ||
	   hitbox1.right < hitbox2.left ||
	   hitbox1.left > hitbox2.right) {
		return false;
	}
	return true;
} //colliding
exports.colliding = colliding;

function translate({
	x=0, 
	y=0, 
	hitbox=null, 
	angle=0 //not yet implemented
}){
	let translatedHitbox    = Utilities.cloneObject(hitbox);
	translatedHitbox.top    = translatedHitbox.top + y;
	translatedHitbox.bottom = translatedHitbox.bottom + y;
	translatedHitbox.left   = translatedHitbox.left + x;
	translatedHitbox.right  = translatedHitbox.right + x;
	return translatedHitbox;
}; //translate
exports.translate = translate;

function getCorners(obj){
	let hitbox = getHitbox(obj);
	// console.log("hitbox: ",hitbox);
	let width  = hitbox.right  - hitbox.left;
	let height = hitbox.bottom - hitbox.top;
	return {
		topLeft:     {x: hitbox.left, y: hitbox.top},
		topRight:    {x: hitbox.right, y: hitbox.top},
		bottomLeft:  {x: hitbox.left, y: hitbox.bottom},
		bottomRight: {x: hitbox.right, y: hitbox.bottom}
	};
}
exports.getCorners = getCorners;

function getHitbox(obj){
	return translate({
		x: obj.x,
		y: obj.y,
		hitbox: obj.hitbox,
		angle: obj.angle
	});
}
exports.getHitbox = getHitbox;

function dist(point1, point2){
	let diffX = Math.abs(point1.x - point2.x);
	let diffY = Math.abs(point1.y - point2.y);
	let distance = Math.sqrt((Math.pow(diffX, 2) + Math.pow(diffY,2)), 2);
	return distance;
}
exports.dist = dist;

function collideLineLine(line1, line2) {

	// calculate the distance to intersection point
	var uA = ((line2.x2-line2.x1)*(line1.y1-line2.y1) - 
			 (line2.y2-line2.y1)*(line1.x1-line2.x1)) / 
			 ((line2.y2-line2.y1)*(line1.x2-line1.x1) - 
			 (line2.x2-line2.x1)*(line1.y2-line1.y1));
	var uB = ((line1.x2-line1.x1)*(line1.y1-line2.y1) - 
			 (line1.y2-line1.y1)*(line1.x1-line2.x1)) / 
			 ((line2.y2-line2.y1)*(line1.x2-line1.x1) - 
			 (line2.x2-line2.x1)*(line1.y2-line1.y1));

	// if uA and uB are between 0-1, lines are colliding
	if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {

	  var intersectionX = line1.x1 + (uA * (line1.x2-line1.x1));
	  var intersectionY = line1.y1 + (uA * (line1.y2-line1.y1));

      return {
        "x":intersectionX,
        "y":intersectionY
      };
	}
	return false;
}
exports.collideLineLine = collideLineLine;

function collideLineRect(line, rec) {//x1, y1, x2, y2,   rx, ry, rw, rh

  //check if the line has hit any of the rectangle's sides. uses the collideLineLine function above

	let left =   this.collideLineLine(x1,y1,x2,y2, rx,ry,rx, ry+rh);
	let right =  this.collideLineLine(x1,y1,x2,y2, rx+rw,ry, rx+rw,ry+rh);
	let top =    this.collideLineLine(x1,y1,x2,y2, rx,ry, rx+rw,ry);
	let bottom = this.collideLineLine(x1,y1,x2,y2, rx,ry+rh, rx+rw,ry+rh);
	let intersection = {
		"left" : left,
		"right" : right,
		"top" : top,
		"bottom" : bottom
	}

  //if ANY of the above are true, the line has hit the rectangle
  if (left || right || top || bottom) {
      return intersection;
  }
  return false;
}
exports.collideLineRect = collideLineRect;