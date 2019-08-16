var Utilities = require('../shared/Utilities.js');

exports.create = ({
	id=0,
	x=0,
	y=0,
	width=50,
	height=50,
	angle=0
})=>{
	let top    = y - (height/2);
	let bottom = y + (height/2);
	let left   = x - (width/2);
	let right  = x + (width/2)
	return {
		id: id,
		x:  x,
		y:  y,
		width: width,
		height:height,
		angle: angle,
		top:    top,
		bottom: bottom,
		left:   left,
		right:  right,
		topLeft:     {x: left, y: top},
		topRight:    {x: right, y: top},
		bottomLeft:  {x: left, y: bottom},
		bottomRight: {x: right, y: bottom},
		points:      [{x: left, y: top}, {x: right, y: top}, {x: left, y: bottom}, {x: right, y: bottom}]
	}
} //create

function moveTo(obj, x, y){
	obj.hitbox.x = x;
	obj.hitbox.y = y;
	update(obj);
}
exports.moveTo = moveTo;

function update(obj){
	let hitbox = obj.hitbox;
	let top    = hitbox.y - (hitbox.height/2);
	let bottom = hitbox.y + (hitbox.height/2);
	let left   = hitbox.x - (hitbox.width/2);
	let right  = hitbox.x + (hitbox.width/2);

	hitbox.top    = top;
	hitbox.bottom = bottom;
	hitbox.left   = left;
	hitbox.right  = right;
	hitbox.topLeft     = {x: left, y: top};
	hitbox.topRight    = {x: right, y: top};
	hitbox.bottomLeft  = {x: left, y: bottom};
	hitbox.bottomRight = {x: right, y: bottom};
	// hitbox.points      = [hitbox.topLeft, hitbox.topRight, hitbox.bottomLeft, hitbox.bottomRight];
}

function getVisualPoints({obj, viewPoint, getPointsAfterEdge=false}){

	let returnPoints = [];
	if(viewPoint.y < obj.top){              //NW, N, NE
		if(viewPoint.x < obj.left){         //NW
			returnPoints = [obj.topLeft, obj.topRight, obj.bottomLeft];
			let pRotatedCW = Utilities.rotatePoint({
				center: viewPoint,
				point: obj.bottomLeft,
				angle: 0.01});
			pRotatedCW.extend = true;
			returnPoints.push(pRotatedCW);
			let pRotatedCCW = Utilities.rotatePoint({
				center: viewPoint,
				point: obj.topRight,
				angle: -0.01});
			pRotatedCCW.extend = true;
			returnPoints.push(pRotatedCCW);
		} else if(viewPoint.x > obj.right){ //NE
			returnPoints = [obj.topLeft, obj.topRight, obj.bottomRight];
			let pRotatedCW = Utilities.rotatePoint({
				center: viewPoint,
				point: obj.topLeft,
				angle: 0.01});
			pRotatedCW.extend = true;
			returnPoints.push(pRotatedCW);
			let pRotatedCCW = Utilities.rotatePoint({
				center: viewPoint,
				point: obj.bottomRight,
				angle: -0.01});
			pRotatedCCW.extend = true;
			returnPoints.push(pRotatedCCW);
		} else {                            //N
			returnPoints = [obj.topLeft, obj.topRight];
			let pRotatedCW = Utilities.rotatePoint({
				center: viewPoint,
				point: obj.topLeft,
				angle: 0.01});
			pRotatedCW.extend = true;
			returnPoints.push(pRotatedCW);
			let pRotatedCCW = Utilities.rotatePoint({
				center: viewPoint,
				point: obj.topRight,
				angle: -0.01});
			pRotatedCCW.extend = true;
			returnPoints.push(pRotatedCCW);
		}

	} else if(viewPoint.y > obj.bottom){    //SW, S, SE
		if(viewPoint.x < obj.left){         //SW
			returnPoints = [obj.topLeft, obj.bottomLeft, obj.bottomRight];
			let pRotatedCW = Utilities.rotatePoint({
				center: viewPoint,
				point: obj.bottomRight,
				angle: 0.01});
			pRotatedCW.extend = true;
			returnPoints.push(pRotatedCW);
			let pRotatedCCW = Utilities.rotatePoint({
				center: viewPoint,
				point: obj.topLeft,
				angle: -0.01});
			pRotatedCCW.extend = true;
			returnPoints.push(pRotatedCCW);
		} else if(viewPoint.x > obj.right){ //SE
			returnPoints = [obj.topRight, obj.bottomLeft, obj.bottomRight];
			let pRotatedCW = Utilities.rotatePoint({
				center: viewPoint,
				point: obj.topRight,
				angle: 0.01});
			pRotatedCW.extend = true;
			returnPoints.push(pRotatedCW);
			let pRotatedCCW = Utilities.rotatePoint({
				center: viewPoint,
				point: obj.bottomLeft,
				angle: -0.01});
			pRotatedCCW.extend = true;
			returnPoints.push(pRotatedCCW);
		} else {                            //S
			returnPoints = [obj.bottomLeft, obj.bottomRight];
			let pRotatedCW = Utilities.rotatePoint({
				center: viewPoint,
				point: obj.bottomRight,
				angle: 0.01});
			pRotatedCW.extend = true;
			returnPoints.push(pRotatedCW);
			let pRotatedCCW = Utilities.rotatePoint({
				center: viewPoint,
				point: obj.bottomLeft,
				angle: -0.01});
			pRotatedCCW.extend = true;
			returnPoints.push(pRotatedCCW);
		}

	} else {                                //E or W
		if(viewPoint.x < obj.left){         //W
			returnPoints = [obj.topLeft, obj.bottomLeft];
			let pRotatedCW = Utilities.rotatePoint({
				center: viewPoint,
				point: obj.bottomLeft,
				angle: 0.01});
			pRotatedCW.extend = true;
			returnPoints.push(pRotatedCW);
			let pRotatedCCW = Utilities.rotatePoint({
				center: viewPoint,
				point: obj.topLeft,
				angle: -0.01});
			pRotatedCCW.extend = true;
			returnPoints.push(pRotatedCCW);
		} else if(viewPoint.x > obj.right){ //E
			returnPoints = [obj.topRight, obj.bottomRight];
			let pRotatedCW = Utilities.rotatePoint({
				center: viewPoint,
				point: obj.topRight,
				angle: 0.01});
			pRotatedCW.extend = true;
			returnPoints.push(pRotatedCW);
			let pRotatedCCW = Utilities.rotatePoint({
				center: viewPoint,
				point: obj.bottomRight,
				angle: -0.01});
			pRotatedCCW.extend = true;
			returnPoints.push(pRotatedCCW);
		} else {
			// console.log("Catch in getVisualPoints, possibly viewPoint is inside the box");
		}
	}

	// if(returnPoints.length < 4 || returnPoints.length > 5) console.log("Wrong amount of points:", returnPoints.length);

	return returnPoints;

}
exports.getVisualPoints = getVisualPoints;

function colliding(obj1, obj2) {
	//doesnt take angle into account yet.
	let hitbox1 = obj1.hitbox;
	let hitbox2 = obj2.hitbox;

	let roughColliding = false;
	// console.log("In colliding:", hitbox1, hitbox2);
	if(hitbox1.top > hitbox2.bottom ||
	   hitbox1.bottom < hitbox2.top ||
	   hitbox1.right < hitbox2.left ||
	   hitbox1.left > hitbox2.right) {
		roughColliding = false;
	} else roughColliding = true;

	// if(roughColliding){
	// 	//TODO make more granular colliding with collision points and such
	// }
	
	return roughColliding;
} //colliding
exports.colliding = colliding;

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