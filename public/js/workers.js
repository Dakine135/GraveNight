/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./clientSource/js/lineOfSight.worker.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./clientSource/js/lineOfSight.worker.js":
/*!***********************************************!*\
  !*** ./clientSource/js/lineOfSight.worker.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const Utilities = __webpack_require__(/*! ../../shared/Utilities.js */ "./shared/Utilities.js");
const Hitbox = __webpack_require__(/*! ../../shared/Hitbox.js */ "./shared/Hitbox.js");

console.log("Worker created");

onmessage = function(event){
	let data = event.data;
	// console.log("message received in worker:", event.data);
	// let testReturn = event.data * 2;
	// postMessage(testReturn);
	let pointsToSend = getPoints({
		objectsInRange: data.objectsInRange,
		origin:         data.origin,
		renderDistance: data.renderDistance,
		camera:         data.camera
	});
	// setTimeout(()=>{
		postMessage({points: pointsToSend, offset: data.camera});
	// },500);
	
}//on message




function getPoints({
	objectsInRange={},
	origin=null,
	renderDistance=500,
	camera=null
}){
	let listOfPoints = [];
	for(var id in objectsInRange){
		let object = objectsInRange[id];
		let points = Hitbox.getVisualPoints({
			obj:         object.hitbox,
			viewPoint:   origin,
			getPointsAfterEdge: true
		});

		points.forEach(function(point){

			let pointToCheck = point;
			if(point.extend){
				pointToCheck = Utilities.extendEndPoint({
					startPoint: origin, 
					endPoint: point, 
					length: renderDistance
				});
			}
			
			let collision = getCollision({
				objects: objectsInRange, 
				origin:  origin, 
				point:   pointToCheck
			});

			//only add point if you collided with the object we are checking, and not if another
			if(!collision.collision || collision.object.id == id){
				let viewPoint = getViewPoint({
					point: collision.point, 
					edge:  !collision.collision,
					color: (collision.collision ? "green" : "yellow"),
					name: "P",
					origin: origin,
					camera: camera
				});
				listOfPoints.push(viewPoint);
			}

			

		});//for each point in object
	}//for objects in range
	return listOfPoints;
}//get Points



function getCollision({objects, origin, point, distance=Infinity}){
		//check all objects in range for collision
		let closestCollision = false;
		let closestSegment = null;
		let closestDist = Infinity;
		//for object glow
		let closestObj = null;
		for(var id in objects){
			let object = objects[id];
			let collision = getIntersection(object.hitbox, {x1: origin.x,  y1: origin.y,
														         x2: point.x,   y2: point.y});
			if(collision){
				let dist = Utilities.dist(collision.point, origin);
				if(closestDist > dist){
					closestObj = object;
					closestDist = dist;
					closestCollision = collision.point;
					closestSegment = collision.line;
				}
			}
		}//for objects in range

		if(closestCollision && closestDist < distance){
			//make points at the corners of the box
			let point1 = {x: closestSegment.x1, y: closestSegment.y1};
			let point2 = {x: closestSegment.x2, y: closestSegment.y2};
			let angleCollisionToPoint1 = calculateAngle({
											point1: point1,
											centerPoint:origin});
			let angleCollisionToPoint2 = calculateAngle({
											point1: point2,
										    centerPoint:origin});
			let angleCollision = calculateAngle({
											point1: closestCollision,
										    centerPoint:origin});

			let cwPoint;
			let ccwPoint;
			if(angleCollisionToPoint1 > angleCollisionToPoint2){
				cwPoint  = point1;
				cwPoint.angle = angleCollisionToPoint1;
				ccwPoint = point2;
				ccwPoint.angle = angleCollisionToPoint2;
			} else {
				cwPoint  = point2;
				cwPoint.angle = angleCollisionToPoint2;
				ccwPoint = point1;
				ccwPoint.angle = angleCollisionToPoint1;
			}

			closestCollision.angle = angleCollision;

			//make sure box edges are not out of range
			// if(cwPoint.angle  >= endPointAngle || cwPoint.angle  <= startPointAngle){
			// 	cwPoint = null;
			// }
			// if(ccwPoint.angle >= endPointAngle || ccwPoint.angle <= startPointAngle){
			// 	ccwPoint = null;
			// }

			return {
				collision: true,
				point: closestCollision,
				dist: closestDist,
				cwPoint: cwPoint,
				ccwPoint: ccwPoint,
				object: closestObj
			}
		}//closest Collision
		else {
			return {
				collision: false,
				point: point
			}
		}
	}//getCollision

	function calculateAngle({point1, point2=null, centerPoint}){
		if(point2==null) point2 = {x: centerPoint.x+10, y:centerPoint.y};
		let pAngle = Utilities.calculateAngle({
										point1: point1, 
										point2: point2,
									    centerPoint:centerPoint});
		// if(pAngle < 0) pAngle = pAngle + Math.PI*2;
		if(pAngle < 0) pAngle = Math.abs(pAngle);
		// if(pAngle > Math.PI) pAngle = Math.PI - pAngle;
		// if(pAngle > width) pAngle = Math.PI*2 - pAngle;
		//Could cause an issue when cone is wider than PI aka 180, maybe?
		return pAngle;
	}

	function getIntersection(corners, line){
		// console.log("corners:",corners);
		let boxLineTop    = {x1:corners.topLeft.x,     y1:corners.topLeft.y, 
						     x2:corners.topRight.x,    y2:corners.topRight.y};
		let boxLineRight  = {x1:corners.topRight.x,    y1:corners.topRight.y, 
						     x2:corners.bottomRight.x, y2:corners.bottomRight.y};
		let boxLineBottom = {x1:corners.bottomRight.x, y1:corners.bottomRight.y, 
						     x2:corners.bottomLeft.x,  y2:corners.bottomLeft.y};
		let boxLineLeft   = {x1:corners.bottomLeft.x,  y1:corners.bottomLeft.y, 
						     x2:corners.topLeft.x,     y2:corners.topLeft.y};
		let intersection = false;
		let intersectingSegment = null;
		let closestDist = Infinity;
		let top = Hitbox.collideLineLine(line, boxLineTop);
		if(top){
			intersection = top;
			intersectingSegment = boxLineTop;
			closestDist = Utilities.dist(top, {x:line.x1, y:line.y1});
		}
		let right = Hitbox.collideLineLine(line, boxLineRight);
		if(right){
			let dist = Utilities.dist(right, {x:line.x1, y:line.y1});
			if(dist < closestDist){
				intersection = right;
				intersectingSegment = boxLineRight;
				closestDist = dist;
			}
		}
		let bottom = Hitbox.collideLineLine(line, boxLineBottom);
		if(bottom){
			let dist = Utilities.dist(bottom, {x:line.x1, y:line.y1});
			if(dist < closestDist){
				intersection = bottom;
				intersectingSegment = boxLineBottom;
				closestDist = dist;
			}
		}
		let left = Hitbox.collideLineLine(line, boxLineLeft);
		if(left){
			let dist = Utilities.dist(left, {x:line.x1, y:line.y1});
			if(dist < closestDist){
				intersection = left;
				intersectingSegment = boxLineLeft;
				closestDist = dist;
			}
		}
		return {point: intersection, line: intersectingSegment};
	}//get intersection

	function getViewPoint({point, edge=false, color="yellow", name="No Name", origin, camera}){
		let pAngle = calculateAngle({
										point1: point,
									    centerPoint:origin});
		//translate to point for display
		let viewPoint = translateCamera({camera: camera, point: point});
		// viewPoint = {x: point.x, y: point.y};
		viewPoint.edge = edge;
		viewPoint.color = color;
		viewPoint.angle = pAngle;
		viewPoint.name = name;
		viewPoint.count = this.orderPointsCreated;
		this.orderPointsCreated++;
		return viewPoint;
	}

	function translateCamera({camera, point}){
		let orgiginX = camera.x - (camera.width/2);
		let orgiginY = camera.y - (camera.height/2);
		let tx = Math.round(point.x - orgiginX);
		let ty = Math.round(point.y - orgiginY);
		return {x:tx, y:ty};
	}

/***/ }),

/***/ "./shared/Hitbox.js":
/*!**************************!*\
  !*** ./shared/Hitbox.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Utilities = __webpack_require__(/*! ../shared/Utilities.js */ "./shared/Utilities.js");

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

/***/ }),

/***/ "./shared/Utilities.js":
/*!*****************************!*\
  !*** ./shared/Utilities.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.error = (string)=>{
	return new Error(string);
}

function randomColor(){
	return {
		r: Math.floor(255*Math.random()),
		g: Math.floor(255*Math.random()),
		b: Math.floor(255*Math.random())
	}
}
exports.randomColor = randomColor;

exports.midPoint = (point1, point2)=>{
    let middleX = point2.x - ((point2.x-point2.x)/2);
    let middleY = point2.y - ((point2.y-point1.y)/2);
   return {x: middleX, y: middleY};
}

exports.rotatePoint = ({center={x:0, y:0}, point={x:0, y:0}, angle=0})=>{
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

exports.extendEndPoint = ({startPoint, endPoint, length})=>{
    let currentlength = Math.sqrt(
        Math.pow(startPoint.x - endPoint.x, 2.0) + 
        Math.pow(startPoint.y - endPoint.y, 2.0)
        );
    let amount = length - currentlength;
    let newEndPoint = {
        x: endPoint.x + ((endPoint.x - startPoint.x) / currentlength * amount),
        y: endPoint.y + ((endPoint.y - startPoint.y) / currentlength * amount)
    };
    return newEndPoint;
}

function dist(point1, point2){
    let diffX = Math.abs(point1.x - point2.x);
    let diffY = Math.abs(point1.y - point2.y);
    let distance = Math.sqrt((Math.pow(diffX, 2) + Math.pow(diffY,2)), 2);
    return distance;
}
exports.dist = dist;

exports.calculateAngle = ({point1, point2, centerPoint={x:0,y:0}})=>{
    if(point1.x === point2.x && point1.y === point2.y) return 0;

    let p1Trans = {x: point1.x - centerPoint.x, y: point1.y - centerPoint.y};
    let p2Trans = {x: point2.x - centerPoint.x, y: point2.y - centerPoint.y};
    // let diffX   = p1Trans.x - p2Trans.x;
    // let diffY   = p1Trans.y - p2Trans.y;
    // var angleRadians = Math.atan2(diffY, diffX);
    let angleOfP1 = Math.atan2(p1Trans.y, p1Trans.x);
    let angleOfP2 = Math.atan2(p2Trans.y, p2Trans.x);
    if(angleOfP1 < 0) angleOfP1 = angleOfP1 + Math.PI*2;
    if(angleOfP2 < 0) angleOfP2 = angleOfP2 + Math.PI*2;
    let angleRadians = angleOfP2 - angleOfP1;
    // if(angleRadians < 0) angleRadians = (angleRadians + Math.PI*2);
    return angleRadians;
    // let angleOfP1 = Math.atan2(p1Trans.x, p1Trans.y);
    // let angleOfP2 = Math.atan2(point2.y - centerPoint.y, point2.x - centerPoint.x);
    // if(angleOfP1 < 0) angleOfP1 = angleOfP1 + Math.PI*2;
    // if(angleOfP2 < 0) angleOfP2 = angleOfP2 + Math.PI*2;
    //angle in radians
    // return  angleOfP2 - angleOfP1;
}

exports.mapNum = ({input, start1, end1, start2, end2 })=>{
    if(input<start1) input = start1;
    else if(input>end1) input = end1;
    let diffRange1 = end1 - start1;
    let fractionOfFirstRange = (input - start1) / diffRange1;
    let diffRange2 = end2 - start2;
    return (diffRange2*fractionOfFirstRange) + start2;
}

function cloneObject(obj){
	//make a new object to return
	let newObj = {};
	//copy all properties onto newobject
	for(var id in obj){
		let propery = obj[id];
		if(typeof propery === 'object' && propery !== null){
			newObj[id] = cloneObject(propery);
		}
		if(propery !== null){
			newObj[id] = propery;
		}
	}
	return newObj;
}
exports.cloneObject = cloneObject;

function memorySizeOf(obj) {
    var bytes = 0;

    function sizeOf(obj) {
        if(obj !== null && obj !== undefined) {
            switch(typeof obj) {
            case 'number':
                bytes += 8;
                break;
            case 'string':
                bytes += obj.length * 2;
                break;
            case 'boolean':
                bytes += 4;
                break;
            case 'object':
                var objClass = Object.prototype.toString.call(obj).slice(8, -1);
                if(objClass === 'Object' || objClass === 'Array') {
                    for(var key in obj) {
                        if(!obj.hasOwnProperty(key)) continue;
                        sizeOf(obj[key]);
                    }
                } else bytes += obj.toString().length * 2;
                break;
            }
        }
        return bytes;
    };

    function formatByteSize(bytes) {
        if(bytes < 1024) return bytes + " bytes";
        else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KiB";
        else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MiB";
        else return(bytes / 1073741824).toFixed(3) + " GiB";
    };

    return formatByteSize(sizeOf(obj));
}; //memorySizeOf 
exports.memorySizeOf = memorySizeOf;

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50U291cmNlL2pzL2xpbmVPZlNpZ2h0Lndvcmtlci5qcyIsIndlYnBhY2s6Ly8vLi9zaGFyZWQvSGl0Ym94LmpzIiwid2VicGFjazovLy8uL3NoYXJlZC9VdGlsaXRpZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBLGtCQUFrQixtQkFBTyxDQUFDLHdEQUEyQjtBQUNyRCxlQUFlLG1CQUFPLENBQUMsa0RBQXdCOztBQUUvQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBLGVBQWUsMENBQTBDO0FBQ3pELEtBQUs7O0FBRUwsQ0FBQzs7Ozs7QUFLRDtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFD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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEVBQUU7QUFDRixvQyIsImZpbGUiOiJ3b3JrZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9jbGllbnRTb3VyY2UvanMvbGluZU9mU2lnaHQud29ya2VyLmpzXCIpO1xuIiwiY29uc3QgVXRpbGl0aWVzID0gcmVxdWlyZSgnLi4vLi4vc2hhcmVkL1V0aWxpdGllcy5qcycpO1xuY29uc3QgSGl0Ym94ID0gcmVxdWlyZSgnLi4vLi4vc2hhcmVkL0hpdGJveC5qcycpO1xuXG5jb25zb2xlLmxvZyhcIldvcmtlciBjcmVhdGVkXCIpO1xuXG5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCl7XG5cdGxldCBkYXRhID0gZXZlbnQuZGF0YTtcblx0Ly8gY29uc29sZS5sb2coXCJtZXNzYWdlIHJlY2VpdmVkIGluIHdvcmtlcjpcIiwgZXZlbnQuZGF0YSk7XG5cdC8vIGxldCB0ZXN0UmV0dXJuID0gZXZlbnQuZGF0YSAqIDI7XG5cdC8vIHBvc3RNZXNzYWdlKHRlc3RSZXR1cm4pO1xuXHRsZXQgcG9pbnRzVG9TZW5kID0gZ2V0UG9pbnRzKHtcblx0XHRvYmplY3RzSW5SYW5nZTogZGF0YS5vYmplY3RzSW5SYW5nZSxcblx0XHRvcmlnaW46ICAgICAgICAgZGF0YS5vcmlnaW4sXG5cdFx0cmVuZGVyRGlzdGFuY2U6IGRhdGEucmVuZGVyRGlzdGFuY2UsXG5cdFx0Y2FtZXJhOiAgICAgICAgIGRhdGEuY2FtZXJhXG5cdH0pO1xuXHQvLyBzZXRUaW1lb3V0KCgpPT57XG5cdFx0cG9zdE1lc3NhZ2Uoe3BvaW50czogcG9pbnRzVG9TZW5kLCBvZmZzZXQ6IGRhdGEuY2FtZXJhfSk7XG5cdC8vIH0sNTAwKTtcblx0XG59Ly9vbiBtZXNzYWdlXG5cblxuXG5cbmZ1bmN0aW9uIGdldFBvaW50cyh7XG5cdG9iamVjdHNJblJhbmdlPXt9LFxuXHRvcmlnaW49bnVsbCxcblx0cmVuZGVyRGlzdGFuY2U9NTAwLFxuXHRjYW1lcmE9bnVsbFxufSl7XG5cdGxldCBsaXN0T2ZQb2ludHMgPSBbXTtcblx0Zm9yKHZhciBpZCBpbiBvYmplY3RzSW5SYW5nZSl7XG5cdFx0bGV0IG9iamVjdCA9IG9iamVjdHNJblJhbmdlW2lkXTtcblx0XHRsZXQgcG9pbnRzID0gSGl0Ym94LmdldFZpc3VhbFBvaW50cyh7XG5cdFx0XHRvYmo6ICAgICAgICAgb2JqZWN0LmhpdGJveCxcblx0XHRcdHZpZXdQb2ludDogICBvcmlnaW4sXG5cdFx0XHRnZXRQb2ludHNBZnRlckVkZ2U6IHRydWVcblx0XHR9KTtcblxuXHRcdHBvaW50cy5mb3JFYWNoKGZ1bmN0aW9uKHBvaW50KXtcblxuXHRcdFx0bGV0IHBvaW50VG9DaGVjayA9IHBvaW50O1xuXHRcdFx0aWYocG9pbnQuZXh0ZW5kKXtcblx0XHRcdFx0cG9pbnRUb0NoZWNrID0gVXRpbGl0aWVzLmV4dGVuZEVuZFBvaW50KHtcblx0XHRcdFx0XHRzdGFydFBvaW50OiBvcmlnaW4sIFxuXHRcdFx0XHRcdGVuZFBvaW50OiBwb2ludCwgXG5cdFx0XHRcdFx0bGVuZ3RoOiByZW5kZXJEaXN0YW5jZVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0bGV0IGNvbGxpc2lvbiA9IGdldENvbGxpc2lvbih7XG5cdFx0XHRcdG9iamVjdHM6IG9iamVjdHNJblJhbmdlLCBcblx0XHRcdFx0b3JpZ2luOiAgb3JpZ2luLCBcblx0XHRcdFx0cG9pbnQ6ICAgcG9pbnRUb0NoZWNrXG5cdFx0XHR9KTtcblxuXHRcdFx0Ly9vbmx5IGFkZCBwb2ludCBpZiB5b3UgY29sbGlkZWQgd2l0aCB0aGUgb2JqZWN0IHdlIGFyZSBjaGVja2luZywgYW5kIG5vdCBpZiBhbm90aGVyXG5cdFx0XHRpZighY29sbGlzaW9uLmNvbGxpc2lvbiB8fCBjb2xsaXNpb24ub2JqZWN0LmlkID09IGlkKXtcblx0XHRcdFx0bGV0IHZpZXdQb2ludCA9IGdldFZpZXdQb2ludCh7XG5cdFx0XHRcdFx0cG9pbnQ6IGNvbGxpc2lvbi5wb2ludCwgXG5cdFx0XHRcdFx0ZWRnZTogICFjb2xsaXNpb24uY29sbGlzaW9uLFxuXHRcdFx0XHRcdGNvbG9yOiAoY29sbGlzaW9uLmNvbGxpc2lvbiA/IFwiZ3JlZW5cIiA6IFwieWVsbG93XCIpLFxuXHRcdFx0XHRcdG5hbWU6IFwiUFwiLFxuXHRcdFx0XHRcdG9yaWdpbjogb3JpZ2luLFxuXHRcdFx0XHRcdGNhbWVyYTogY2FtZXJhXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRsaXN0T2ZQb2ludHMucHVzaCh2aWV3UG9pbnQpO1xuXHRcdFx0fVxuXG5cdFx0XHRcblxuXHRcdH0pOy8vZm9yIGVhY2ggcG9pbnQgaW4gb2JqZWN0XG5cdH0vL2ZvciBvYmplY3RzIGluIHJhbmdlXG5cdHJldHVybiBsaXN0T2ZQb2ludHM7XG59Ly9nZXQgUG9pbnRzXG5cblxuXG5mdW5jdGlvbiBnZXRDb2xsaXNpb24oe29iamVjdHMsIG9yaWdpbiwgcG9pbnQsIGRpc3RhbmNlPUluZmluaXR5fSl7XG5cdFx0Ly9jaGVjayBhbGwgb2JqZWN0cyBpbiByYW5nZSBmb3IgY29sbGlzaW9uXG5cdFx0bGV0IGNsb3Nlc3RDb2xsaXNpb24gPSBmYWxzZTtcblx0XHRsZXQgY2xvc2VzdFNlZ21lbnQgPSBudWxsO1xuXHRcdGxldCBjbG9zZXN0RGlzdCA9IEluZmluaXR5O1xuXHRcdC8vZm9yIG9iamVjdCBnbG93XG5cdFx0bGV0IGNsb3Nlc3RPYmogPSBudWxsO1xuXHRcdGZvcih2YXIgaWQgaW4gb2JqZWN0cyl7XG5cdFx0XHRsZXQgb2JqZWN0ID0gb2JqZWN0c1tpZF07XG5cdFx0XHRsZXQgY29sbGlzaW9uID0gZ2V0SW50ZXJzZWN0aW9uKG9iamVjdC5oaXRib3gsIHt4MTogb3JpZ2luLngsICB5MTogb3JpZ2luLnksXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICAgICAgICAgeDI6IHBvaW50LngsICAgeTI6IHBvaW50Lnl9KTtcblx0XHRcdGlmKGNvbGxpc2lvbil7XG5cdFx0XHRcdGxldCBkaXN0ID0gVXRpbGl0aWVzLmRpc3QoY29sbGlzaW9uLnBvaW50LCBvcmlnaW4pO1xuXHRcdFx0XHRpZihjbG9zZXN0RGlzdCA+IGRpc3Qpe1xuXHRcdFx0XHRcdGNsb3Nlc3RPYmogPSBvYmplY3Q7XG5cdFx0XHRcdFx0Y2xvc2VzdERpc3QgPSBkaXN0O1xuXHRcdFx0XHRcdGNsb3Nlc3RDb2xsaXNpb24gPSBjb2xsaXNpb24ucG9pbnQ7XG5cdFx0XHRcdFx0Y2xvc2VzdFNlZ21lbnQgPSBjb2xsaXNpb24ubGluZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0vL2ZvciBvYmplY3RzIGluIHJhbmdlXG5cblx0XHRpZihjbG9zZXN0Q29sbGlzaW9uICYmIGNsb3Nlc3REaXN0IDwgZGlzdGFuY2Upe1xuXHRcdFx0Ly9tYWtlIHBvaW50cyBhdCB0aGUgY29ybmVycyBvZiB0aGUgYm94XG5cdFx0XHRsZXQgcG9pbnQxID0ge3g6IGNsb3Nlc3RTZWdtZW50LngxLCB5OiBjbG9zZXN0U2VnbWVudC55MX07XG5cdFx0XHRsZXQgcG9pbnQyID0ge3g6IGNsb3Nlc3RTZWdtZW50LngyLCB5OiBjbG9zZXN0U2VnbWVudC55Mn07XG5cdFx0XHRsZXQgYW5nbGVDb2xsaXNpb25Ub1BvaW50MSA9IGNhbGN1bGF0ZUFuZ2xlKHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb2ludDE6IHBvaW50MSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjZW50ZXJQb2ludDpvcmlnaW59KTtcblx0XHRcdGxldCBhbmdsZUNvbGxpc2lvblRvUG9pbnQyID0gY2FsY3VsYXRlQW5nbGUoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvaW50MTogcG9pbnQyLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHQgICAgY2VudGVyUG9pbnQ6b3JpZ2lufSk7XG5cdFx0XHRsZXQgYW5nbGVDb2xsaXNpb24gPSBjYWxjdWxhdGVBbmdsZSh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG9pbnQxOiBjbG9zZXN0Q29sbGlzaW9uLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHQgICAgY2VudGVyUG9pbnQ6b3JpZ2lufSk7XG5cblx0XHRcdGxldCBjd1BvaW50O1xuXHRcdFx0bGV0IGNjd1BvaW50O1xuXHRcdFx0aWYoYW5nbGVDb2xsaXNpb25Ub1BvaW50MSA+IGFuZ2xlQ29sbGlzaW9uVG9Qb2ludDIpe1xuXHRcdFx0XHRjd1BvaW50ICA9IHBvaW50MTtcblx0XHRcdFx0Y3dQb2ludC5hbmdsZSA9IGFuZ2xlQ29sbGlzaW9uVG9Qb2ludDE7XG5cdFx0XHRcdGNjd1BvaW50ID0gcG9pbnQyO1xuXHRcdFx0XHRjY3dQb2ludC5hbmdsZSA9IGFuZ2xlQ29sbGlzaW9uVG9Qb2ludDI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjd1BvaW50ICA9IHBvaW50Mjtcblx0XHRcdFx0Y3dQb2ludC5hbmdsZSA9IGFuZ2xlQ29sbGlzaW9uVG9Qb2ludDI7XG5cdFx0XHRcdGNjd1BvaW50ID0gcG9pbnQxO1xuXHRcdFx0XHRjY3dQb2ludC5hbmdsZSA9IGFuZ2xlQ29sbGlzaW9uVG9Qb2ludDE7XG5cdFx0XHR9XG5cblx0XHRcdGNsb3Nlc3RDb2xsaXNpb24uYW5nbGUgPSBhbmdsZUNvbGxpc2lvbjtcblxuXHRcdFx0Ly9tYWtlIHN1cmUgYm94IGVkZ2VzIGFyZSBub3Qgb3V0IG9mIHJhbmdlXG5cdFx0XHQvLyBpZihjd1BvaW50LmFuZ2xlICA+PSBlbmRQb2ludEFuZ2xlIHx8IGN3UG9pbnQuYW5nbGUgIDw9IHN0YXJ0UG9pbnRBbmdsZSl7XG5cdFx0XHQvLyBcdGN3UG9pbnQgPSBudWxsO1xuXHRcdFx0Ly8gfVxuXHRcdFx0Ly8gaWYoY2N3UG9pbnQuYW5nbGUgPj0gZW5kUG9pbnRBbmdsZSB8fCBjY3dQb2ludC5hbmdsZSA8PSBzdGFydFBvaW50QW5nbGUpe1xuXHRcdFx0Ly8gXHRjY3dQb2ludCA9IG51bGw7XG5cdFx0XHQvLyB9XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGNvbGxpc2lvbjogdHJ1ZSxcblx0XHRcdFx0cG9pbnQ6IGNsb3Nlc3RDb2xsaXNpb24sXG5cdFx0XHRcdGRpc3Q6IGNsb3Nlc3REaXN0LFxuXHRcdFx0XHRjd1BvaW50OiBjd1BvaW50LFxuXHRcdFx0XHRjY3dQb2ludDogY2N3UG9pbnQsXG5cdFx0XHRcdG9iamVjdDogY2xvc2VzdE9ialxuXHRcdFx0fVxuXHRcdH0vL2Nsb3Nlc3QgQ29sbGlzaW9uXG5cdFx0ZWxzZSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRjb2xsaXNpb246IGZhbHNlLFxuXHRcdFx0XHRwb2ludDogcG9pbnRcblx0XHRcdH1cblx0XHR9XG5cdH0vL2dldENvbGxpc2lvblxuXG5cdGZ1bmN0aW9uIGNhbGN1bGF0ZUFuZ2xlKHtwb2ludDEsIHBvaW50Mj1udWxsLCBjZW50ZXJQb2ludH0pe1xuXHRcdGlmKHBvaW50Mj09bnVsbCkgcG9pbnQyID0ge3g6IGNlbnRlclBvaW50LngrMTAsIHk6Y2VudGVyUG9pbnQueX07XG5cdFx0bGV0IHBBbmdsZSA9IFV0aWxpdGllcy5jYWxjdWxhdGVBbmdsZSh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHBvaW50MTogcG9pbnQxLCBcblx0XHRcdFx0XHRcdFx0XHRcdFx0cG9pbnQyOiBwb2ludDIsXG5cdFx0XHRcdFx0XHRcdFx0XHQgICAgY2VudGVyUG9pbnQ6Y2VudGVyUG9pbnR9KTtcblx0XHQvLyBpZihwQW5nbGUgPCAwKSBwQW5nbGUgPSBwQW5nbGUgKyBNYXRoLlBJKjI7XG5cdFx0aWYocEFuZ2xlIDwgMCkgcEFuZ2xlID0gTWF0aC5hYnMocEFuZ2xlKTtcblx0XHQvLyBpZihwQW5nbGUgPiBNYXRoLlBJKSBwQW5nbGUgPSBNYXRoLlBJIC0gcEFuZ2xlO1xuXHRcdC8vIGlmKHBBbmdsZSA+IHdpZHRoKSBwQW5nbGUgPSBNYXRoLlBJKjIgLSBwQW5nbGU7XG5cdFx0Ly9Db3VsZCBjYXVzZSBhbiBpc3N1ZSB3aGVuIGNvbmUgaXMgd2lkZXIgdGhhbiBQSSBha2EgMTgwLCBtYXliZT9cblx0XHRyZXR1cm4gcEFuZ2xlO1xuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0SW50ZXJzZWN0aW9uKGNvcm5lcnMsIGxpbmUpe1xuXHRcdC8vIGNvbnNvbGUubG9nKFwiY29ybmVyczpcIixjb3JuZXJzKTtcblx0XHRsZXQgYm94TGluZVRvcCAgICA9IHt4MTpjb3JuZXJzLnRvcExlZnQueCwgICAgIHkxOmNvcm5lcnMudG9wTGVmdC55LCBcblx0XHRcdFx0XHRcdCAgICAgeDI6Y29ybmVycy50b3BSaWdodC54LCAgICB5Mjpjb3JuZXJzLnRvcFJpZ2h0Lnl9O1xuXHRcdGxldCBib3hMaW5lUmlnaHQgID0ge3gxOmNvcm5lcnMudG9wUmlnaHQueCwgICAgeTE6Y29ybmVycy50b3BSaWdodC55LCBcblx0XHRcdFx0XHRcdCAgICAgeDI6Y29ybmVycy5ib3R0b21SaWdodC54LCB5Mjpjb3JuZXJzLmJvdHRvbVJpZ2h0Lnl9O1xuXHRcdGxldCBib3hMaW5lQm90dG9tID0ge3gxOmNvcm5lcnMuYm90dG9tUmlnaHQueCwgeTE6Y29ybmVycy5ib3R0b21SaWdodC55LCBcblx0XHRcdFx0XHRcdCAgICAgeDI6Y29ybmVycy5ib3R0b21MZWZ0LngsICB5Mjpjb3JuZXJzLmJvdHRvbUxlZnQueX07XG5cdFx0bGV0IGJveExpbmVMZWZ0ICAgPSB7eDE6Y29ybmVycy5ib3R0b21MZWZ0LngsICB5MTpjb3JuZXJzLmJvdHRvbUxlZnQueSwgXG5cdFx0XHRcdFx0XHQgICAgIHgyOmNvcm5lcnMudG9wTGVmdC54LCAgICAgeTI6Y29ybmVycy50b3BMZWZ0Lnl9O1xuXHRcdGxldCBpbnRlcnNlY3Rpb24gPSBmYWxzZTtcblx0XHRsZXQgaW50ZXJzZWN0aW5nU2VnbWVudCA9IG51bGw7XG5cdFx0bGV0IGNsb3Nlc3REaXN0ID0gSW5maW5pdHk7XG5cdFx0bGV0IHRvcCA9IEhpdGJveC5jb2xsaWRlTGluZUxpbmUobGluZSwgYm94TGluZVRvcCk7XG5cdFx0aWYodG9wKXtcblx0XHRcdGludGVyc2VjdGlvbiA9IHRvcDtcblx0XHRcdGludGVyc2VjdGluZ1NlZ21lbnQgPSBib3hMaW5lVG9wO1xuXHRcdFx0Y2xvc2VzdERpc3QgPSBVdGlsaXRpZXMuZGlzdCh0b3AsIHt4OmxpbmUueDEsIHk6bGluZS55MX0pO1xuXHRcdH1cblx0XHRsZXQgcmlnaHQgPSBIaXRib3guY29sbGlkZUxpbmVMaW5lKGxpbmUsIGJveExpbmVSaWdodCk7XG5cdFx0aWYocmlnaHQpe1xuXHRcdFx0bGV0IGRpc3QgPSBVdGlsaXRpZXMuZGlzdChyaWdodCwge3g6bGluZS54MSwgeTpsaW5lLnkxfSk7XG5cdFx0XHRpZihkaXN0IDwgY2xvc2VzdERpc3Qpe1xuXHRcdFx0XHRpbnRlcnNlY3Rpb24gPSByaWdodDtcblx0XHRcdFx0aW50ZXJzZWN0aW5nU2VnbWVudCA9IGJveExpbmVSaWdodDtcblx0XHRcdFx0Y2xvc2VzdERpc3QgPSBkaXN0O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRsZXQgYm90dG9tID0gSGl0Ym94LmNvbGxpZGVMaW5lTGluZShsaW5lLCBib3hMaW5lQm90dG9tKTtcblx0XHRpZihib3R0b20pe1xuXHRcdFx0bGV0IGRpc3QgPSBVdGlsaXRpZXMuZGlzdChib3R0b20sIHt4OmxpbmUueDEsIHk6bGluZS55MX0pO1xuXHRcdFx0aWYoZGlzdCA8IGNsb3Nlc3REaXN0KXtcblx0XHRcdFx0aW50ZXJzZWN0aW9uID0gYm90dG9tO1xuXHRcdFx0XHRpbnRlcnNlY3RpbmdTZWdtZW50ID0gYm94TGluZUJvdHRvbTtcblx0XHRcdFx0Y2xvc2VzdERpc3QgPSBkaXN0O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRsZXQgbGVmdCA9IEhpdGJveC5jb2xsaWRlTGluZUxpbmUobGluZSwgYm94TGluZUxlZnQpO1xuXHRcdGlmKGxlZnQpe1xuXHRcdFx0bGV0IGRpc3QgPSBVdGlsaXRpZXMuZGlzdChsZWZ0LCB7eDpsaW5lLngxLCB5OmxpbmUueTF9KTtcblx0XHRcdGlmKGRpc3QgPCBjbG9zZXN0RGlzdCl7XG5cdFx0XHRcdGludGVyc2VjdGlvbiA9IGxlZnQ7XG5cdFx0XHRcdGludGVyc2VjdGluZ1NlZ21lbnQgPSBib3hMaW5lTGVmdDtcblx0XHRcdFx0Y2xvc2VzdERpc3QgPSBkaXN0O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4ge3BvaW50OiBpbnRlcnNlY3Rpb24sIGxpbmU6IGludGVyc2VjdGluZ1NlZ21lbnR9O1xuXHR9Ly9nZXQgaW50ZXJzZWN0aW9uXG5cblx0ZnVuY3Rpb24gZ2V0Vmlld1BvaW50KHtwb2ludCwgZWRnZT1mYWxzZSwgY29sb3I9XCJ5ZWxsb3dcIiwgbmFtZT1cIk5vIE5hbWVcIiwgb3JpZ2luLCBjYW1lcmF9KXtcblx0XHRsZXQgcEFuZ2xlID0gY2FsY3VsYXRlQW5nbGUoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRwb2ludDE6IHBvaW50LFxuXHRcdFx0XHRcdFx0XHRcdFx0ICAgIGNlbnRlclBvaW50Om9yaWdpbn0pO1xuXHRcdC8vdHJhbnNsYXRlIHRvIHBvaW50IGZvciBkaXNwbGF5XG5cdFx0bGV0IHZpZXdQb2ludCA9IHRyYW5zbGF0ZUNhbWVyYSh7Y2FtZXJhOiBjYW1lcmEsIHBvaW50OiBwb2ludH0pO1xuXHRcdC8vIHZpZXdQb2ludCA9IHt4OiBwb2ludC54LCB5OiBwb2ludC55fTtcblx0XHR2aWV3UG9pbnQuZWRnZSA9IGVkZ2U7XG5cdFx0dmlld1BvaW50LmNvbG9yID0gY29sb3I7XG5cdFx0dmlld1BvaW50LmFuZ2xlID0gcEFuZ2xlO1xuXHRcdHZpZXdQb2ludC5uYW1lID0gbmFtZTtcblx0XHR2aWV3UG9pbnQuY291bnQgPSB0aGlzLm9yZGVyUG9pbnRzQ3JlYXRlZDtcblx0XHR0aGlzLm9yZGVyUG9pbnRzQ3JlYXRlZCsrO1xuXHRcdHJldHVybiB2aWV3UG9pbnQ7XG5cdH1cblxuXHRmdW5jdGlvbiB0cmFuc2xhdGVDYW1lcmEoe2NhbWVyYSwgcG9pbnR9KXtcblx0XHRsZXQgb3JnaWdpblggPSBjYW1lcmEueCAtIChjYW1lcmEud2lkdGgvMik7XG5cdFx0bGV0IG9yZ2lnaW5ZID0gY2FtZXJhLnkgLSAoY2FtZXJhLmhlaWdodC8yKTtcblx0XHRsZXQgdHggPSBNYXRoLnJvdW5kKHBvaW50LnggLSBvcmdpZ2luWCk7XG5cdFx0bGV0IHR5ID0gTWF0aC5yb3VuZChwb2ludC55IC0gb3JnaWdpblkpO1xuXHRcdHJldHVybiB7eDp0eCwgeTp0eX07XG5cdH0iLCJ2YXIgVXRpbGl0aWVzID0gcmVxdWlyZSgnLi4vc2hhcmVkL1V0aWxpdGllcy5qcycpO1xuXG5leHBvcnRzLmNyZWF0ZSA9ICh7XG5cdGlkPTAsXG5cdHg9MCxcblx0eT0wLFxuXHR3aWR0aD01MCxcblx0aGVpZ2h0PTUwLFxuXHRhbmdsZT0wXG59KT0+e1xuXHRsZXQgdG9wICAgID0geSAtIChoZWlnaHQvMik7XG5cdGxldCBib3R0b20gPSB5ICsgKGhlaWdodC8yKTtcblx0bGV0IGxlZnQgICA9IHggLSAod2lkdGgvMik7XG5cdGxldCByaWdodCAgPSB4ICsgKHdpZHRoLzIpXG5cdHJldHVybiB7XG5cdFx0aWQ6IGlkLFxuXHRcdHg6ICB4LFxuXHRcdHk6ICB5LFxuXHRcdHdpZHRoOiB3aWR0aCxcblx0XHRoZWlnaHQ6aGVpZ2h0LFxuXHRcdGFuZ2xlOiBhbmdsZSxcblx0XHR0b3A6ICAgIHRvcCxcblx0XHRib3R0b206IGJvdHRvbSxcblx0XHRsZWZ0OiAgIGxlZnQsXG5cdFx0cmlnaHQ6ICByaWdodCxcblx0XHR0b3BMZWZ0OiAgICAge3g6IGxlZnQsIHk6IHRvcH0sXG5cdFx0dG9wUmlnaHQ6ICAgIHt4OiByaWdodCwgeTogdG9wfSxcblx0XHRib3R0b21MZWZ0OiAge3g6IGxlZnQsIHk6IGJvdHRvbX0sXG5cdFx0Ym90dG9tUmlnaHQ6IHt4OiByaWdodCwgeTogYm90dG9tfSxcblx0XHRwb2ludHM6ICAgICAgW3t4OiBsZWZ0LCB5OiB0b3B9LCB7eDogcmlnaHQsIHk6IHRvcH0sIHt4OiBsZWZ0LCB5OiBib3R0b219LCB7eDogcmlnaHQsIHk6IGJvdHRvbX1dXG5cdH1cbn0gLy9jcmVhdGVcblxuZnVuY3Rpb24gbW92ZVRvKG9iaiwgeCwgeSl7XG5cdG9iai5oaXRib3gueCA9IHg7XG5cdG9iai5oaXRib3gueSA9IHk7XG5cdHVwZGF0ZShvYmopO1xufVxuZXhwb3J0cy5tb3ZlVG8gPSBtb3ZlVG87XG5cbmZ1bmN0aW9uIHVwZGF0ZShvYmope1xuXHRsZXQgaGl0Ym94ID0gb2JqLmhpdGJveDtcblx0bGV0IHRvcCAgICA9IGhpdGJveC55IC0gKGhpdGJveC5oZWlnaHQvMik7XG5cdGxldCBib3R0b20gPSBoaXRib3gueSArIChoaXRib3guaGVpZ2h0LzIpO1xuXHRsZXQgbGVmdCAgID0gaGl0Ym94LnggLSAoaGl0Ym94LndpZHRoLzIpO1xuXHRsZXQgcmlnaHQgID0gaGl0Ym94LnggKyAoaGl0Ym94LndpZHRoLzIpO1xuXG5cdGhpdGJveC50b3AgICAgPSB0b3A7XG5cdGhpdGJveC5ib3R0b20gPSBib3R0b207XG5cdGhpdGJveC5sZWZ0ICAgPSBsZWZ0O1xuXHRoaXRib3gucmlnaHQgID0gcmlnaHQ7XG5cdGhpdGJveC50b3BMZWZ0ICAgICA9IHt4OiBsZWZ0LCB5OiB0b3B9O1xuXHRoaXRib3gudG9wUmlnaHQgICAgPSB7eDogcmlnaHQsIHk6IHRvcH07XG5cdGhpdGJveC5ib3R0b21MZWZ0ICA9IHt4OiBsZWZ0LCB5OiBib3R0b219O1xuXHRoaXRib3guYm90dG9tUmlnaHQgPSB7eDogcmlnaHQsIHk6IGJvdHRvbX07XG5cdC8vIGhpdGJveC5wb2ludHMgICAgICA9IFtoaXRib3gudG9wTGVmdCwgaGl0Ym94LnRvcFJpZ2h0LCBoaXRib3guYm90dG9tTGVmdCwgaGl0Ym94LmJvdHRvbVJpZ2h0XTtcbn1cblxuZnVuY3Rpb24gZ2V0VmlzdWFsUG9pbnRzKHtvYmosIHZpZXdQb2ludCwgZ2V0UG9pbnRzQWZ0ZXJFZGdlPWZhbHNlfSl7XG5cblx0bGV0IHJldHVyblBvaW50cyA9IFtdO1xuXHRpZih2aWV3UG9pbnQueSA8IG9iai50b3ApeyAgICAgICAgICAgICAgLy9OVywgTiwgTkVcblx0XHRpZih2aWV3UG9pbnQueCA8IG9iai5sZWZ0KXsgICAgICAgICAvL05XXG5cdFx0XHRyZXR1cm5Qb2ludHMgPSBbb2JqLnRvcExlZnQsIG9iai50b3BSaWdodCwgb2JqLmJvdHRvbUxlZnRdO1xuXHRcdFx0bGV0IHBSb3RhdGVkQ1cgPSBVdGlsaXRpZXMucm90YXRlUG9pbnQoe1xuXHRcdFx0XHRjZW50ZXI6IHZpZXdQb2ludCxcblx0XHRcdFx0cG9pbnQ6IG9iai5ib3R0b21MZWZ0LFxuXHRcdFx0XHRhbmdsZTogMC4wMX0pO1xuXHRcdFx0cFJvdGF0ZWRDVy5leHRlbmQgPSB0cnVlO1xuXHRcdFx0cmV0dXJuUG9pbnRzLnB1c2gocFJvdGF0ZWRDVyk7XG5cdFx0XHRsZXQgcFJvdGF0ZWRDQ1cgPSBVdGlsaXRpZXMucm90YXRlUG9pbnQoe1xuXHRcdFx0XHRjZW50ZXI6IHZpZXdQb2ludCxcblx0XHRcdFx0cG9pbnQ6IG9iai50b3BSaWdodCxcblx0XHRcdFx0YW5nbGU6IC0wLjAxfSk7XG5cdFx0XHRwUm90YXRlZENDVy5leHRlbmQgPSB0cnVlO1xuXHRcdFx0cmV0dXJuUG9pbnRzLnB1c2gocFJvdGF0ZWRDQ1cpO1xuXHRcdH0gZWxzZSBpZih2aWV3UG9pbnQueCA+IG9iai5yaWdodCl7IC8vTkVcblx0XHRcdHJldHVyblBvaW50cyA9IFtvYmoudG9wTGVmdCwgb2JqLnRvcFJpZ2h0LCBvYmouYm90dG9tUmlnaHRdO1xuXHRcdFx0bGV0IHBSb3RhdGVkQ1cgPSBVdGlsaXRpZXMucm90YXRlUG9pbnQoe1xuXHRcdFx0XHRjZW50ZXI6IHZpZXdQb2ludCxcblx0XHRcdFx0cG9pbnQ6IG9iai50b3BMZWZ0LFxuXHRcdFx0XHRhbmdsZTogMC4wMX0pO1xuXHRcdFx0cFJvdGF0ZWRDVy5leHRlbmQgPSB0cnVlO1xuXHRcdFx0cmV0dXJuUG9pbnRzLnB1c2gocFJvdGF0ZWRDVyk7XG5cdFx0XHRsZXQgcFJvdGF0ZWRDQ1cgPSBVdGlsaXRpZXMucm90YXRlUG9pbnQoe1xuXHRcdFx0XHRjZW50ZXI6IHZpZXdQb2ludCxcblx0XHRcdFx0cG9pbnQ6IG9iai5ib3R0b21SaWdodCxcblx0XHRcdFx0YW5nbGU6IC0wLjAxfSk7XG5cdFx0XHRwUm90YXRlZENDVy5leHRlbmQgPSB0cnVlO1xuXHRcdFx0cmV0dXJuUG9pbnRzLnB1c2gocFJvdGF0ZWRDQ1cpO1xuXHRcdH0gZWxzZSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vTlxuXHRcdFx0cmV0dXJuUG9pbnRzID0gW29iai50b3BMZWZ0LCBvYmoudG9wUmlnaHRdO1xuXHRcdFx0bGV0IHBSb3RhdGVkQ1cgPSBVdGlsaXRpZXMucm90YXRlUG9pbnQoe1xuXHRcdFx0XHRjZW50ZXI6IHZpZXdQb2ludCxcblx0XHRcdFx0cG9pbnQ6IG9iai50b3BMZWZ0LFxuXHRcdFx0XHRhbmdsZTogMC4wMX0pO1xuXHRcdFx0cFJvdGF0ZWRDVy5leHRlbmQgPSB0cnVlO1xuXHRcdFx0cmV0dXJuUG9pbnRzLnB1c2gocFJvdGF0ZWRDVyk7XG5cdFx0XHRsZXQgcFJvdGF0ZWRDQ1cgPSBVdGlsaXRpZXMucm90YXRlUG9pbnQoe1xuXHRcdFx0XHRjZW50ZXI6IHZpZXdQb2ludCxcblx0XHRcdFx0cG9pbnQ6IG9iai50b3BSaWdodCxcblx0XHRcdFx0YW5nbGU6IC0wLjAxfSk7XG5cdFx0XHRwUm90YXRlZENDVy5leHRlbmQgPSB0cnVlO1xuXHRcdFx0cmV0dXJuUG9pbnRzLnB1c2gocFJvdGF0ZWRDQ1cpO1xuXHRcdH1cblxuXHR9IGVsc2UgaWYodmlld1BvaW50LnkgPiBvYmouYm90dG9tKXsgICAgLy9TVywgUywgU0Vcblx0XHRpZih2aWV3UG9pbnQueCA8IG9iai5sZWZ0KXsgICAgICAgICAvL1NXXG5cdFx0XHRyZXR1cm5Qb2ludHMgPSBbb2JqLnRvcExlZnQsIG9iai5ib3R0b21MZWZ0LCBvYmouYm90dG9tUmlnaHRdO1xuXHRcdFx0bGV0IHBSb3RhdGVkQ1cgPSBVdGlsaXRpZXMucm90YXRlUG9pbnQoe1xuXHRcdFx0XHRjZW50ZXI6IHZpZXdQb2ludCxcblx0XHRcdFx0cG9pbnQ6IG9iai5ib3R0b21SaWdodCxcblx0XHRcdFx0YW5nbGU6IDAuMDF9KTtcblx0XHRcdHBSb3RhdGVkQ1cuZXh0ZW5kID0gdHJ1ZTtcblx0XHRcdHJldHVyblBvaW50cy5wdXNoKHBSb3RhdGVkQ1cpO1xuXHRcdFx0bGV0IHBSb3RhdGVkQ0NXID0gVXRpbGl0aWVzLnJvdGF0ZVBvaW50KHtcblx0XHRcdFx0Y2VudGVyOiB2aWV3UG9pbnQsXG5cdFx0XHRcdHBvaW50OiBvYmoudG9wTGVmdCxcblx0XHRcdFx0YW5nbGU6IC0wLjAxfSk7XG5cdFx0XHRwUm90YXRlZENDVy5leHRlbmQgPSB0cnVlO1xuXHRcdFx0cmV0dXJuUG9pbnRzLnB1c2gocFJvdGF0ZWRDQ1cpO1xuXHRcdH0gZWxzZSBpZih2aWV3UG9pbnQueCA+IG9iai5yaWdodCl7IC8vU0Vcblx0XHRcdHJldHVyblBvaW50cyA9IFtvYmoudG9wUmlnaHQsIG9iai5ib3R0b21MZWZ0LCBvYmouYm90dG9tUmlnaHRdO1xuXHRcdFx0bGV0IHBSb3RhdGVkQ1cgPSBVdGlsaXRpZXMucm90YXRlUG9pbnQoe1xuXHRcdFx0XHRjZW50ZXI6IHZpZXdQb2ludCxcblx0XHRcdFx0cG9pbnQ6IG9iai50b3BSaWdodCxcblx0XHRcdFx0YW5nbGU6IDAuMDF9KTtcblx0XHRcdHBSb3RhdGVkQ1cuZXh0ZW5kID0gdHJ1ZTtcblx0XHRcdHJldHVyblBvaW50cy5wdXNoKHBSb3RhdGVkQ1cpO1xuXHRcdFx0bGV0IHBSb3RhdGVkQ0NXID0gVXRpbGl0aWVzLnJvdGF0ZVBvaW50KHtcblx0XHRcdFx0Y2VudGVyOiB2aWV3UG9pbnQsXG5cdFx0XHRcdHBvaW50OiBvYmouYm90dG9tTGVmdCxcblx0XHRcdFx0YW5nbGU6IC0wLjAxfSk7XG5cdFx0XHRwUm90YXRlZENDVy5leHRlbmQgPSB0cnVlO1xuXHRcdFx0cmV0dXJuUG9pbnRzLnB1c2gocFJvdGF0ZWRDQ1cpO1xuXHRcdH0gZWxzZSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vU1xuXHRcdFx0cmV0dXJuUG9pbnRzID0gW29iai5ib3R0b21MZWZ0LCBvYmouYm90dG9tUmlnaHRdO1xuXHRcdFx0bGV0IHBSb3RhdGVkQ1cgPSBVdGlsaXRpZXMucm90YXRlUG9pbnQoe1xuXHRcdFx0XHRjZW50ZXI6IHZpZXdQb2ludCxcblx0XHRcdFx0cG9pbnQ6IG9iai5ib3R0b21SaWdodCxcblx0XHRcdFx0YW5nbGU6IDAuMDF9KTtcblx0XHRcdHBSb3RhdGVkQ1cuZXh0ZW5kID0gdHJ1ZTtcblx0XHRcdHJldHVyblBvaW50cy5wdXNoKHBSb3RhdGVkQ1cpO1xuXHRcdFx0bGV0IHBSb3RhdGVkQ0NXID0gVXRpbGl0aWVzLnJvdGF0ZVBvaW50KHtcblx0XHRcdFx0Y2VudGVyOiB2aWV3UG9pbnQsXG5cdFx0XHRcdHBvaW50OiBvYmouYm90dG9tTGVmdCxcblx0XHRcdFx0YW5nbGU6IC0wLjAxfSk7XG5cdFx0XHRwUm90YXRlZENDVy5leHRlbmQgPSB0cnVlO1xuXHRcdFx0cmV0dXJuUG9pbnRzLnB1c2gocFJvdGF0ZWRDQ1cpO1xuXHRcdH1cblxuXHR9IGVsc2UgeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9FIG9yIFdcblx0XHRpZih2aWV3UG9pbnQueCA8IG9iai5sZWZ0KXsgICAgICAgICAvL1dcblx0XHRcdHJldHVyblBvaW50cyA9IFtvYmoudG9wTGVmdCwgb2JqLmJvdHRvbUxlZnRdO1xuXHRcdFx0bGV0IHBSb3RhdGVkQ1cgPSBVdGlsaXRpZXMucm90YXRlUG9pbnQoe1xuXHRcdFx0XHRjZW50ZXI6IHZpZXdQb2ludCxcblx0XHRcdFx0cG9pbnQ6IG9iai5ib3R0b21MZWZ0LFxuXHRcdFx0XHRhbmdsZTogMC4wMX0pO1xuXHRcdFx0cFJvdGF0ZWRDVy5leHRlbmQgPSB0cnVlO1xuXHRcdFx0cmV0dXJuUG9pbnRzLnB1c2gocFJvdGF0ZWRDVyk7XG5cdFx0XHRsZXQgcFJvdGF0ZWRDQ1cgPSBVdGlsaXRpZXMucm90YXRlUG9pbnQoe1xuXHRcdFx0XHRjZW50ZXI6IHZpZXdQb2ludCxcblx0XHRcdFx0cG9pbnQ6IG9iai50b3BMZWZ0LFxuXHRcdFx0XHRhbmdsZTogLTAuMDF9KTtcblx0XHRcdHBSb3RhdGVkQ0NXLmV4dGVuZCA9IHRydWU7XG5cdFx0XHRyZXR1cm5Qb2ludHMucHVzaChwUm90YXRlZENDVyk7XG5cdFx0fSBlbHNlIGlmKHZpZXdQb2ludC54ID4gb2JqLnJpZ2h0KXsgLy9FXG5cdFx0XHRyZXR1cm5Qb2ludHMgPSBbb2JqLnRvcFJpZ2h0LCBvYmouYm90dG9tUmlnaHRdO1xuXHRcdFx0bGV0IHBSb3RhdGVkQ1cgPSBVdGlsaXRpZXMucm90YXRlUG9pbnQoe1xuXHRcdFx0XHRjZW50ZXI6IHZpZXdQb2ludCxcblx0XHRcdFx0cG9pbnQ6IG9iai50b3BSaWdodCxcblx0XHRcdFx0YW5nbGU6IDAuMDF9KTtcblx0XHRcdHBSb3RhdGVkQ1cuZXh0ZW5kID0gdHJ1ZTtcblx0XHRcdHJldHVyblBvaW50cy5wdXNoKHBSb3RhdGVkQ1cpO1xuXHRcdFx0bGV0IHBSb3RhdGVkQ0NXID0gVXRpbGl0aWVzLnJvdGF0ZVBvaW50KHtcblx0XHRcdFx0Y2VudGVyOiB2aWV3UG9pbnQsXG5cdFx0XHRcdHBvaW50OiBvYmouYm90dG9tUmlnaHQsXG5cdFx0XHRcdGFuZ2xlOiAtMC4wMX0pO1xuXHRcdFx0cFJvdGF0ZWRDQ1cuZXh0ZW5kID0gdHJ1ZTtcblx0XHRcdHJldHVyblBvaW50cy5wdXNoKHBSb3RhdGVkQ0NXKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gY29uc29sZS5sb2coXCJDYXRjaCBpbiBnZXRWaXN1YWxQb2ludHMsIHBvc3NpYmx5IHZpZXdQb2ludCBpcyBpbnNpZGUgdGhlIGJveFwiKTtcblx0XHR9XG5cdH1cblxuXHQvLyBpZihyZXR1cm5Qb2ludHMubGVuZ3RoIDwgNCB8fCByZXR1cm5Qb2ludHMubGVuZ3RoID4gNSkgY29uc29sZS5sb2coXCJXcm9uZyBhbW91bnQgb2YgcG9pbnRzOlwiLCByZXR1cm5Qb2ludHMubGVuZ3RoKTtcblxuXHRyZXR1cm4gcmV0dXJuUG9pbnRzO1xuXG59XG5leHBvcnRzLmdldFZpc3VhbFBvaW50cyA9IGdldFZpc3VhbFBvaW50cztcblxuZnVuY3Rpb24gY29sbGlkaW5nKG9iajEsIG9iajIpIHtcblx0Ly9kb2VzbnQgdGFrZSBhbmdsZSBpbnRvIGFjY291bnQgeWV0LlxuXHRsZXQgaGl0Ym94MSA9IG9iajEuaGl0Ym94O1xuXHRsZXQgaGl0Ym94MiA9IG9iajIuaGl0Ym94O1xuXG5cdGxldCByb3VnaENvbGxpZGluZyA9IGZhbHNlO1xuXHQvLyBjb25zb2xlLmxvZyhcIkluIGNvbGxpZGluZzpcIiwgaGl0Ym94MSwgaGl0Ym94Mik7XG5cdGlmKGhpdGJveDEudG9wID4gaGl0Ym94Mi5ib3R0b20gfHxcblx0ICAgaGl0Ym94MS5ib3R0b20gPCBoaXRib3gyLnRvcCB8fFxuXHQgICBoaXRib3gxLnJpZ2h0IDwgaGl0Ym94Mi5sZWZ0IHx8XG5cdCAgIGhpdGJveDEubGVmdCA+IGhpdGJveDIucmlnaHQpIHtcblx0XHRyb3VnaENvbGxpZGluZyA9IGZhbHNlO1xuXHR9IGVsc2Ugcm91Z2hDb2xsaWRpbmcgPSB0cnVlO1xuXG5cdC8vIGlmKHJvdWdoQ29sbGlkaW5nKXtcblx0Ly8gXHQvL1RPRE8gbWFrZSBtb3JlIGdyYW51bGFyIGNvbGxpZGluZyB3aXRoIGNvbGxpc2lvbiBwb2ludHMgYW5kIHN1Y2hcblx0Ly8gfVxuXHRcblx0cmV0dXJuIHJvdWdoQ29sbGlkaW5nO1xufSAvL2NvbGxpZGluZ1xuZXhwb3J0cy5jb2xsaWRpbmcgPSBjb2xsaWRpbmc7XG5cbmZ1bmN0aW9uIGNvbGxpZGVMaW5lTGluZShsaW5lMSwgbGluZTIpIHtcblxuXHQvLyBjYWxjdWxhdGUgdGhlIGRpc3RhbmNlIHRvIGludGVyc2VjdGlvbiBwb2ludFxuXHR2YXIgdUEgPSAoKGxpbmUyLngyLWxpbmUyLngxKSoobGluZTEueTEtbGluZTIueTEpIC0gXG5cdFx0XHQgKGxpbmUyLnkyLWxpbmUyLnkxKSoobGluZTEueDEtbGluZTIueDEpKSAvIFxuXHRcdFx0ICgobGluZTIueTItbGluZTIueTEpKihsaW5lMS54Mi1saW5lMS54MSkgLSBcblx0XHRcdCAobGluZTIueDItbGluZTIueDEpKihsaW5lMS55Mi1saW5lMS55MSkpO1xuXHR2YXIgdUIgPSAoKGxpbmUxLngyLWxpbmUxLngxKSoobGluZTEueTEtbGluZTIueTEpIC0gXG5cdFx0XHQgKGxpbmUxLnkyLWxpbmUxLnkxKSoobGluZTEueDEtbGluZTIueDEpKSAvIFxuXHRcdFx0ICgobGluZTIueTItbGluZTIueTEpKihsaW5lMS54Mi1saW5lMS54MSkgLSBcblx0XHRcdCAobGluZTIueDItbGluZTIueDEpKihsaW5lMS55Mi1saW5lMS55MSkpO1xuXG5cdC8vIGlmIHVBIGFuZCB1QiBhcmUgYmV0d2VlbiAwLTEsIGxpbmVzIGFyZSBjb2xsaWRpbmdcblx0aWYgKHVBID49IDAgJiYgdUEgPD0gMSAmJiB1QiA+PSAwICYmIHVCIDw9IDEpIHtcblxuXHQgIHZhciBpbnRlcnNlY3Rpb25YID0gbGluZTEueDEgKyAodUEgKiAobGluZTEueDItbGluZTEueDEpKTtcblx0ICB2YXIgaW50ZXJzZWN0aW9uWSA9IGxpbmUxLnkxICsgKHVBICogKGxpbmUxLnkyLWxpbmUxLnkxKSk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIFwieFwiOmludGVyc2VjdGlvblgsXG4gICAgICAgIFwieVwiOmludGVyc2VjdGlvbllcbiAgICAgIH07XG5cdH1cblx0cmV0dXJuIGZhbHNlO1xufVxuZXhwb3J0cy5jb2xsaWRlTGluZUxpbmUgPSBjb2xsaWRlTGluZUxpbmU7XG5cbmZ1bmN0aW9uIGNvbGxpZGVMaW5lUmVjdChsaW5lLCByZWMpIHsvL3gxLCB5MSwgeDIsIHkyLCAgIHJ4LCByeSwgcncsIHJoXG5cbiAgLy9jaGVjayBpZiB0aGUgbGluZSBoYXMgaGl0IGFueSBvZiB0aGUgcmVjdGFuZ2xlJ3Mgc2lkZXMuIHVzZXMgdGhlIGNvbGxpZGVMaW5lTGluZSBmdW5jdGlvbiBhYm92ZVxuXG5cdGxldCBsZWZ0ID0gICB0aGlzLmNvbGxpZGVMaW5lTGluZSh4MSx5MSx4Mix5MiwgcngscnkscngsIHJ5K3JoKTtcblx0bGV0IHJpZ2h0ID0gIHRoaXMuY29sbGlkZUxpbmVMaW5lKHgxLHkxLHgyLHkyLCByeCtydyxyeSwgcngrcncscnkrcmgpO1xuXHRsZXQgdG9wID0gICAgdGhpcy5jb2xsaWRlTGluZUxpbmUoeDEseTEseDIseTIsIHJ4LHJ5LCByeCtydyxyeSk7XG5cdGxldCBib3R0b20gPSB0aGlzLmNvbGxpZGVMaW5lTGluZSh4MSx5MSx4Mix5MiwgcngscnkrcmgsIHJ4K3J3LHJ5K3JoKTtcblx0bGV0IGludGVyc2VjdGlvbiA9IHtcblx0XHRcImxlZnRcIiA6IGxlZnQsXG5cdFx0XCJyaWdodFwiIDogcmlnaHQsXG5cdFx0XCJ0b3BcIiA6IHRvcCxcblx0XHRcImJvdHRvbVwiIDogYm90dG9tXG5cdH1cblxuICAvL2lmIEFOWSBvZiB0aGUgYWJvdmUgYXJlIHRydWUsIHRoZSBsaW5lIGhhcyBoaXQgdGhlIHJlY3RhbmdsZVxuICBpZiAobGVmdCB8fCByaWdodCB8fCB0b3AgfHwgYm90dG9tKSB7XG4gICAgICByZXR1cm4gaW50ZXJzZWN0aW9uO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cbmV4cG9ydHMuY29sbGlkZUxpbmVSZWN0ID0gY29sbGlkZUxpbmVSZWN0OyIsImV4cG9ydHMuZXJyb3IgPSAoc3RyaW5nKT0+e1xuXHRyZXR1cm4gbmV3IEVycm9yKHN0cmluZyk7XG59XG5cbmZ1bmN0aW9uIHJhbmRvbUNvbG9yKCl7XG5cdHJldHVybiB7XG5cdFx0cjogTWF0aC5mbG9vcigyNTUqTWF0aC5yYW5kb20oKSksXG5cdFx0ZzogTWF0aC5mbG9vcigyNTUqTWF0aC5yYW5kb20oKSksXG5cdFx0YjogTWF0aC5mbG9vcigyNTUqTWF0aC5yYW5kb20oKSlcblx0fVxufVxuZXhwb3J0cy5yYW5kb21Db2xvciA9IHJhbmRvbUNvbG9yO1xuXG5leHBvcnRzLm1pZFBvaW50ID0gKHBvaW50MSwgcG9pbnQyKT0+e1xuICAgIGxldCBtaWRkbGVYID0gcG9pbnQyLnggLSAoKHBvaW50Mi54LXBvaW50Mi54KS8yKTtcbiAgICBsZXQgbWlkZGxlWSA9IHBvaW50Mi55IC0gKChwb2ludDIueS1wb2ludDEueSkvMik7XG4gICByZXR1cm4ge3g6IG1pZGRsZVgsIHk6IG1pZGRsZVl9O1xufVxuXG5leHBvcnRzLnJvdGF0ZVBvaW50ID0gKHtjZW50ZXI9e3g6MCwgeTowfSwgcG9pbnQ9e3g6MCwgeTowfSwgYW5nbGU9MH0pPT57XG4gICAgICAgIGxldCBzID0gTWF0aC5zaW4oYW5nbGUpO1xuICAgICAgICBsZXQgYyA9IE1hdGguY29zKGFuZ2xlKTtcblxuICAgICAgICAvL21ha2UgY29weVxuICAgICAgICBsZXQgbmV3UG9pbnQgPSB7eDogcG9pbnQueCwgeTogcG9pbnQueX07IFxuXG4gICAgICAgIC8vIHRyYW5zbGF0ZSBwb2ludCBiYWNrIHRvIG9yaWdpbjpcbiAgICAgICAgbmV3UG9pbnQueCAtPSBjZW50ZXIueDtcbiAgICAgICAgbmV3UG9pbnQueSAtPSBjZW50ZXIueTtcblxuICAgICAgICAvLyByb3RhdGUgcG9pbnRcbiAgICAgICAgbGV0IHhuZXcgPSBuZXdQb2ludC54ICogYyAtIG5ld1BvaW50LnkgKiBzO1xuICAgICAgICBsZXQgeW5ldyA9IG5ld1BvaW50LnggKiBzICsgbmV3UG9pbnQueSAqIGM7XG5cbiAgICAgICAgLy8gdHJhbnNsYXRlIHBvaW50IGJhY2s6XG4gICAgICAgIG5ld1BvaW50LnggPSB4bmV3ICsgY2VudGVyLng7XG4gICAgICAgIG5ld1BvaW50LnkgPSB5bmV3ICsgY2VudGVyLnk7XG4gICAgICAgIHJldHVybiBuZXdQb2ludDtcbiAgICB9XG5cbmV4cG9ydHMuZXh0ZW5kRW5kUG9pbnQgPSAoe3N0YXJ0UG9pbnQsIGVuZFBvaW50LCBsZW5ndGh9KT0+e1xuICAgIGxldCBjdXJyZW50bGVuZ3RoID0gTWF0aC5zcXJ0KFxuICAgICAgICBNYXRoLnBvdyhzdGFydFBvaW50LnggLSBlbmRQb2ludC54LCAyLjApICsgXG4gICAgICAgIE1hdGgucG93KHN0YXJ0UG9pbnQueSAtIGVuZFBvaW50LnksIDIuMClcbiAgICAgICAgKTtcbiAgICBsZXQgYW1vdW50ID0gbGVuZ3RoIC0gY3VycmVudGxlbmd0aDtcbiAgICBsZXQgbmV3RW5kUG9pbnQgPSB7XG4gICAgICAgIHg6IGVuZFBvaW50LnggKyAoKGVuZFBvaW50LnggLSBzdGFydFBvaW50LngpIC8gY3VycmVudGxlbmd0aCAqIGFtb3VudCksXG4gICAgICAgIHk6IGVuZFBvaW50LnkgKyAoKGVuZFBvaW50LnkgLSBzdGFydFBvaW50LnkpIC8gY3VycmVudGxlbmd0aCAqIGFtb3VudClcbiAgICB9O1xuICAgIHJldHVybiBuZXdFbmRQb2ludDtcbn1cblxuZnVuY3Rpb24gZGlzdChwb2ludDEsIHBvaW50Mil7XG4gICAgbGV0IGRpZmZYID0gTWF0aC5hYnMocG9pbnQxLnggLSBwb2ludDIueCk7XG4gICAgbGV0IGRpZmZZID0gTWF0aC5hYnMocG9pbnQxLnkgLSBwb2ludDIueSk7XG4gICAgbGV0IGRpc3RhbmNlID0gTWF0aC5zcXJ0KChNYXRoLnBvdyhkaWZmWCwgMikgKyBNYXRoLnBvdyhkaWZmWSwyKSksIDIpO1xuICAgIHJldHVybiBkaXN0YW5jZTtcbn1cbmV4cG9ydHMuZGlzdCA9IGRpc3Q7XG5cbmV4cG9ydHMuY2FsY3VsYXRlQW5nbGUgPSAoe3BvaW50MSwgcG9pbnQyLCBjZW50ZXJQb2ludD17eDowLHk6MH19KT0+e1xuICAgIGlmKHBvaW50MS54ID09PSBwb2ludDIueCAmJiBwb2ludDEueSA9PT0gcG9pbnQyLnkpIHJldHVybiAwO1xuXG4gICAgbGV0IHAxVHJhbnMgPSB7eDogcG9pbnQxLnggLSBjZW50ZXJQb2ludC54LCB5OiBwb2ludDEueSAtIGNlbnRlclBvaW50Lnl9O1xuICAgIGxldCBwMlRyYW5zID0ge3g6IHBvaW50Mi54IC0gY2VudGVyUG9pbnQueCwgeTogcG9pbnQyLnkgLSBjZW50ZXJQb2ludC55fTtcbiAgICAvLyBsZXQgZGlmZlggICA9IHAxVHJhbnMueCAtIHAyVHJhbnMueDtcbiAgICAvLyBsZXQgZGlmZlkgICA9IHAxVHJhbnMueSAtIHAyVHJhbnMueTtcbiAgICAvLyB2YXIgYW5nbGVSYWRpYW5zID0gTWF0aC5hdGFuMihkaWZmWSwgZGlmZlgpO1xuICAgIGxldCBhbmdsZU9mUDEgPSBNYXRoLmF0YW4yKHAxVHJhbnMueSwgcDFUcmFucy54KTtcbiAgICBsZXQgYW5nbGVPZlAyID0gTWF0aC5hdGFuMihwMlRyYW5zLnksIHAyVHJhbnMueCk7XG4gICAgaWYoYW5nbGVPZlAxIDwgMCkgYW5nbGVPZlAxID0gYW5nbGVPZlAxICsgTWF0aC5QSSoyO1xuICAgIGlmKGFuZ2xlT2ZQMiA8IDApIGFuZ2xlT2ZQMiA9IGFuZ2xlT2ZQMiArIE1hdGguUEkqMjtcbiAgICBsZXQgYW5nbGVSYWRpYW5zID0gYW5nbGVPZlAyIC0gYW5nbGVPZlAxO1xuICAgIC8vIGlmKGFuZ2xlUmFkaWFucyA8IDApIGFuZ2xlUmFkaWFucyA9IChhbmdsZVJhZGlhbnMgKyBNYXRoLlBJKjIpO1xuICAgIHJldHVybiBhbmdsZVJhZGlhbnM7XG4gICAgLy8gbGV0IGFuZ2xlT2ZQMSA9IE1hdGguYXRhbjIocDFUcmFucy54LCBwMVRyYW5zLnkpO1xuICAgIC8vIGxldCBhbmdsZU9mUDIgPSBNYXRoLmF0YW4yKHBvaW50Mi55IC0gY2VudGVyUG9pbnQueSwgcG9pbnQyLnggLSBjZW50ZXJQb2ludC54KTtcbiAgICAvLyBpZihhbmdsZU9mUDEgPCAwKSBhbmdsZU9mUDEgPSBhbmdsZU9mUDEgKyBNYXRoLlBJKjI7XG4gICAgLy8gaWYoYW5nbGVPZlAyIDwgMCkgYW5nbGVPZlAyID0gYW5nbGVPZlAyICsgTWF0aC5QSSoyO1xuICAgIC8vYW5nbGUgaW4gcmFkaWFuc1xuICAgIC8vIHJldHVybiAgYW5nbGVPZlAyIC0gYW5nbGVPZlAxO1xufVxuXG5leHBvcnRzLm1hcE51bSA9ICh7aW5wdXQsIHN0YXJ0MSwgZW5kMSwgc3RhcnQyLCBlbmQyIH0pPT57XG4gICAgaWYoaW5wdXQ8c3RhcnQxKSBpbnB1dCA9IHN0YXJ0MTtcbiAgICBlbHNlIGlmKGlucHV0PmVuZDEpIGlucHV0ID0gZW5kMTtcbiAgICBsZXQgZGlmZlJhbmdlMSA9IGVuZDEgLSBzdGFydDE7XG4gICAgbGV0IGZyYWN0aW9uT2ZGaXJzdFJhbmdlID0gKGlucHV0IC0gc3RhcnQxKSAvIGRpZmZSYW5nZTE7XG4gICAgbGV0IGRpZmZSYW5nZTIgPSBlbmQyIC0gc3RhcnQyO1xuICAgIHJldHVybiAoZGlmZlJhbmdlMipmcmFjdGlvbk9mRmlyc3RSYW5nZSkgKyBzdGFydDI7XG59XG5cbmZ1bmN0aW9uIGNsb25lT2JqZWN0KG9iail7XG5cdC8vbWFrZSBhIG5ldyBvYmplY3QgdG8gcmV0dXJuXG5cdGxldCBuZXdPYmogPSB7fTtcblx0Ly9jb3B5IGFsbCBwcm9wZXJ0aWVzIG9udG8gbmV3b2JqZWN0XG5cdGZvcih2YXIgaWQgaW4gb2JqKXtcblx0XHRsZXQgcHJvcGVyeSA9IG9ialtpZF07XG5cdFx0aWYodHlwZW9mIHByb3BlcnkgPT09ICdvYmplY3QnICYmIHByb3BlcnkgIT09IG51bGwpe1xuXHRcdFx0bmV3T2JqW2lkXSA9IGNsb25lT2JqZWN0KHByb3BlcnkpO1xuXHRcdH1cblx0XHRpZihwcm9wZXJ5ICE9PSBudWxsKXtcblx0XHRcdG5ld09ialtpZF0gPSBwcm9wZXJ5O1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gbmV3T2JqO1xufVxuZXhwb3J0cy5jbG9uZU9iamVjdCA9IGNsb25lT2JqZWN0O1xuXG5mdW5jdGlvbiBtZW1vcnlTaXplT2Yob2JqKSB7XG4gICAgdmFyIGJ5dGVzID0gMDtcblxuICAgIGZ1bmN0aW9uIHNpemVPZihvYmopIHtcbiAgICAgICAgaWYob2JqICE9PSBudWxsICYmIG9iaiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzd2l0Y2godHlwZW9mIG9iaikge1xuICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgICAgICBieXRlcyArPSA4O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgICAgICAgICBieXRlcyArPSBvYmoubGVuZ3RoICogMjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICAgICAgICAgIGJ5dGVzICs9IDQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICAgICAgICAgIHZhciBvYmpDbGFzcyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopLnNsaWNlKDgsIC0xKTtcbiAgICAgICAgICAgICAgICBpZihvYmpDbGFzcyA9PT0gJ09iamVjdCcgfHwgb2JqQ2xhc3MgPT09ICdBcnJheScpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZighb2JqLmhhc093blByb3BlcnR5KGtleSkpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZU9mKG9ialtrZXldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBieXRlcyArPSBvYmoudG9TdHJpbmcoKS5sZW5ndGggKiAyO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBieXRlcztcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZm9ybWF0Qnl0ZVNpemUoYnl0ZXMpIHtcbiAgICAgICAgaWYoYnl0ZXMgPCAxMDI0KSByZXR1cm4gYnl0ZXMgKyBcIiBieXRlc1wiO1xuICAgICAgICBlbHNlIGlmKGJ5dGVzIDwgMTA0ODU3NikgcmV0dXJuKGJ5dGVzIC8gMTAyNCkudG9GaXhlZCgzKSArIFwiIEtpQlwiO1xuICAgICAgICBlbHNlIGlmKGJ5dGVzIDwgMTA3Mzc0MTgyNCkgcmV0dXJuKGJ5dGVzIC8gMTA0ODU3NikudG9GaXhlZCgzKSArIFwiIE1pQlwiO1xuICAgICAgICBlbHNlIHJldHVybihieXRlcyAvIDEwNzM3NDE4MjQpLnRvRml4ZWQoMykgKyBcIiBHaUJcIjtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGZvcm1hdEJ5dGVTaXplKHNpemVPZihvYmopKTtcbn07IC8vbWVtb3J5U2l6ZU9mIFxuZXhwb3J0cy5tZW1vcnlTaXplT2YgPSBtZW1vcnlTaXplT2Y7Il0sInNvdXJjZVJvb3QiOiIifQ==