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
	new Error(string);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50U291cmNlL2pzL2xpbmVPZlNpZ2h0Lndvcmtlci5qcyIsIndlYnBhY2s6Ly8vLi9zaGFyZWQvSGl0Ym94LmpzIiwid2VicGFjazovLy8uL3NoYXJlZC9VdGlsaXRpZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBLGtCQUFrQixtQkFBTyxDQUFDLHdEQUEyQjtBQUNyRCxlQUFlLG1CQUFPLENBQUMsa0RBQXdCOztBQUUvQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBLGVBQWUsMENBQTBDO0FBQ3pELEtBQUs7O0FBRUwsQ0FBQzs7Ozs7QUFLRDtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFD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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEVBQUU7QUFDRixvQyIsImZpbGUiOiJ3b3JrZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9jbGllbnRTb3VyY2UvanMvbGluZU9mU2lnaHQud29ya2VyLmpzXCIpO1xuIiwiY29uc3QgVXRpbGl0aWVzID0gcmVxdWlyZSgnLi4vLi4vc2hhcmVkL1V0aWxpdGllcy5qcycpO1xyXG5jb25zdCBIaXRib3ggPSByZXF1aXJlKCcuLi8uLi9zaGFyZWQvSGl0Ym94LmpzJyk7XHJcblxyXG5jb25zb2xlLmxvZyhcIldvcmtlciBjcmVhdGVkXCIpO1xyXG5cclxub25tZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpe1xyXG5cdGxldCBkYXRhID0gZXZlbnQuZGF0YTtcclxuXHQvLyBjb25zb2xlLmxvZyhcIm1lc3NhZ2UgcmVjZWl2ZWQgaW4gd29ya2VyOlwiLCBldmVudC5kYXRhKTtcclxuXHQvLyBsZXQgdGVzdFJldHVybiA9IGV2ZW50LmRhdGEgKiAyO1xyXG5cdC8vIHBvc3RNZXNzYWdlKHRlc3RSZXR1cm4pO1xyXG5cdGxldCBwb2ludHNUb1NlbmQgPSBnZXRQb2ludHMoe1xyXG5cdFx0b2JqZWN0c0luUmFuZ2U6IGRhdGEub2JqZWN0c0luUmFuZ2UsXHJcblx0XHRvcmlnaW46ICAgICAgICAgZGF0YS5vcmlnaW4sXHJcblx0XHRyZW5kZXJEaXN0YW5jZTogZGF0YS5yZW5kZXJEaXN0YW5jZSxcclxuXHRcdGNhbWVyYTogICAgICAgICBkYXRhLmNhbWVyYVxyXG5cdH0pO1xyXG5cdC8vIHNldFRpbWVvdXQoKCk9PntcclxuXHRcdHBvc3RNZXNzYWdlKHtwb2ludHM6IHBvaW50c1RvU2VuZCwgb2Zmc2V0OiBkYXRhLmNhbWVyYX0pO1xyXG5cdC8vIH0sNTAwKTtcclxuXHRcclxufS8vb24gbWVzc2FnZVxyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0UG9pbnRzKHtcclxuXHRvYmplY3RzSW5SYW5nZT17fSxcclxuXHRvcmlnaW49bnVsbCxcclxuXHRyZW5kZXJEaXN0YW5jZT01MDAsXHJcblx0Y2FtZXJhPW51bGxcclxufSl7XHJcblx0bGV0IGxpc3RPZlBvaW50cyA9IFtdO1xyXG5cdGZvcih2YXIgaWQgaW4gb2JqZWN0c0luUmFuZ2Upe1xyXG5cdFx0bGV0IG9iamVjdCA9IG9iamVjdHNJblJhbmdlW2lkXTtcclxuXHRcdGxldCBwb2ludHMgPSBIaXRib3guZ2V0VmlzdWFsUG9pbnRzKHtcclxuXHRcdFx0b2JqOiAgICAgICAgIG9iamVjdC5oaXRib3gsXHJcblx0XHRcdHZpZXdQb2ludDogICBvcmlnaW4sXHJcblx0XHRcdGdldFBvaW50c0FmdGVyRWRnZTogdHJ1ZVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cG9pbnRzLmZvckVhY2goZnVuY3Rpb24ocG9pbnQpe1xyXG5cclxuXHRcdFx0bGV0IHBvaW50VG9DaGVjayA9IHBvaW50O1xyXG5cdFx0XHRpZihwb2ludC5leHRlbmQpe1xyXG5cdFx0XHRcdHBvaW50VG9DaGVjayA9IFV0aWxpdGllcy5leHRlbmRFbmRQb2ludCh7XHJcblx0XHRcdFx0XHRzdGFydFBvaW50OiBvcmlnaW4sIFxyXG5cdFx0XHRcdFx0ZW5kUG9pbnQ6IHBvaW50LCBcclxuXHRcdFx0XHRcdGxlbmd0aDogcmVuZGVyRGlzdGFuY2VcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0bGV0IGNvbGxpc2lvbiA9IGdldENvbGxpc2lvbih7XHJcblx0XHRcdFx0b2JqZWN0czogb2JqZWN0c0luUmFuZ2UsIFxyXG5cdFx0XHRcdG9yaWdpbjogIG9yaWdpbiwgXHJcblx0XHRcdFx0cG9pbnQ6ICAgcG9pbnRUb0NoZWNrXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Ly9vbmx5IGFkZCBwb2ludCBpZiB5b3UgY29sbGlkZWQgd2l0aCB0aGUgb2JqZWN0IHdlIGFyZSBjaGVja2luZywgYW5kIG5vdCBpZiBhbm90aGVyXHJcblx0XHRcdGlmKCFjb2xsaXNpb24uY29sbGlzaW9uIHx8IGNvbGxpc2lvbi5vYmplY3QuaWQgPT0gaWQpe1xyXG5cdFx0XHRcdGxldCB2aWV3UG9pbnQgPSBnZXRWaWV3UG9pbnQoe1xyXG5cdFx0XHRcdFx0cG9pbnQ6IGNvbGxpc2lvbi5wb2ludCwgXHJcblx0XHRcdFx0XHRlZGdlOiAgIWNvbGxpc2lvbi5jb2xsaXNpb24sXHJcblx0XHRcdFx0XHRjb2xvcjogKGNvbGxpc2lvbi5jb2xsaXNpb24gPyBcImdyZWVuXCIgOiBcInllbGxvd1wiKSxcclxuXHRcdFx0XHRcdG5hbWU6IFwiUFwiLFxyXG5cdFx0XHRcdFx0b3JpZ2luOiBvcmlnaW4sXHJcblx0XHRcdFx0XHRjYW1lcmE6IGNhbWVyYVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdGxpc3RPZlBvaW50cy5wdXNoKHZpZXdQb2ludCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdFxyXG5cclxuXHRcdH0pOy8vZm9yIGVhY2ggcG9pbnQgaW4gb2JqZWN0XHJcblx0fS8vZm9yIG9iamVjdHMgaW4gcmFuZ2VcclxuXHRyZXR1cm4gbGlzdE9mUG9pbnRzO1xyXG59Ly9nZXQgUG9pbnRzXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldENvbGxpc2lvbih7b2JqZWN0cywgb3JpZ2luLCBwb2ludCwgZGlzdGFuY2U9SW5maW5pdHl9KXtcclxuXHRcdC8vY2hlY2sgYWxsIG9iamVjdHMgaW4gcmFuZ2UgZm9yIGNvbGxpc2lvblxyXG5cdFx0bGV0IGNsb3Nlc3RDb2xsaXNpb24gPSBmYWxzZTtcclxuXHRcdGxldCBjbG9zZXN0U2VnbWVudCA9IG51bGw7XHJcblx0XHRsZXQgY2xvc2VzdERpc3QgPSBJbmZpbml0eTtcclxuXHRcdC8vZm9yIG9iamVjdCBnbG93XHJcblx0XHRsZXQgY2xvc2VzdE9iaiA9IG51bGw7XHJcblx0XHRmb3IodmFyIGlkIGluIG9iamVjdHMpe1xyXG5cdFx0XHRsZXQgb2JqZWN0ID0gb2JqZWN0c1tpZF07XHJcblx0XHRcdGxldCBjb2xsaXNpb24gPSBnZXRJbnRlcnNlY3Rpb24ob2JqZWN0LmhpdGJveCwge3gxOiBvcmlnaW4ueCwgIHkxOiBvcmlnaW4ueSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgICAgICAgIHgyOiBwb2ludC54LCAgIHkyOiBwb2ludC55fSk7XHJcblx0XHRcdGlmKGNvbGxpc2lvbil7XHJcblx0XHRcdFx0bGV0IGRpc3QgPSBVdGlsaXRpZXMuZGlzdChjb2xsaXNpb24ucG9pbnQsIG9yaWdpbik7XHJcblx0XHRcdFx0aWYoY2xvc2VzdERpc3QgPiBkaXN0KXtcclxuXHRcdFx0XHRcdGNsb3Nlc3RPYmogPSBvYmplY3Q7XHJcblx0XHRcdFx0XHRjbG9zZXN0RGlzdCA9IGRpc3Q7XHJcblx0XHRcdFx0XHRjbG9zZXN0Q29sbGlzaW9uID0gY29sbGlzaW9uLnBvaW50O1xyXG5cdFx0XHRcdFx0Y2xvc2VzdFNlZ21lbnQgPSBjb2xsaXNpb24ubGluZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0vL2ZvciBvYmplY3RzIGluIHJhbmdlXHJcblxyXG5cdFx0aWYoY2xvc2VzdENvbGxpc2lvbiAmJiBjbG9zZXN0RGlzdCA8IGRpc3RhbmNlKXtcclxuXHRcdFx0Ly9tYWtlIHBvaW50cyBhdCB0aGUgY29ybmVycyBvZiB0aGUgYm94XHJcblx0XHRcdGxldCBwb2ludDEgPSB7eDogY2xvc2VzdFNlZ21lbnQueDEsIHk6IGNsb3Nlc3RTZWdtZW50LnkxfTtcclxuXHRcdFx0bGV0IHBvaW50MiA9IHt4OiBjbG9zZXN0U2VnbWVudC54MiwgeTogY2xvc2VzdFNlZ21lbnQueTJ9O1xyXG5cdFx0XHRsZXQgYW5nbGVDb2xsaXNpb25Ub1BvaW50MSA9IGNhbGN1bGF0ZUFuZ2xlKHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvaW50MTogcG9pbnQxLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2VudGVyUG9pbnQ6b3JpZ2lufSk7XHJcblx0XHRcdGxldCBhbmdsZUNvbGxpc2lvblRvUG9pbnQyID0gY2FsY3VsYXRlQW5nbGUoe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG9pbnQxOiBwb2ludDIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ICAgIGNlbnRlclBvaW50Om9yaWdpbn0pO1xyXG5cdFx0XHRsZXQgYW5nbGVDb2xsaXNpb24gPSBjYWxjdWxhdGVBbmdsZSh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb2ludDE6IGNsb3Nlc3RDb2xsaXNpb24sXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ICAgIGNlbnRlclBvaW50Om9yaWdpbn0pO1xyXG5cclxuXHRcdFx0bGV0IGN3UG9pbnQ7XHJcblx0XHRcdGxldCBjY3dQb2ludDtcclxuXHRcdFx0aWYoYW5nbGVDb2xsaXNpb25Ub1BvaW50MSA+IGFuZ2xlQ29sbGlzaW9uVG9Qb2ludDIpe1xyXG5cdFx0XHRcdGN3UG9pbnQgID0gcG9pbnQxO1xyXG5cdFx0XHRcdGN3UG9pbnQuYW5nbGUgPSBhbmdsZUNvbGxpc2lvblRvUG9pbnQxO1xyXG5cdFx0XHRcdGNjd1BvaW50ID0gcG9pbnQyO1xyXG5cdFx0XHRcdGNjd1BvaW50LmFuZ2xlID0gYW5nbGVDb2xsaXNpb25Ub1BvaW50MjtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjd1BvaW50ICA9IHBvaW50MjtcclxuXHRcdFx0XHRjd1BvaW50LmFuZ2xlID0gYW5nbGVDb2xsaXNpb25Ub1BvaW50MjtcclxuXHRcdFx0XHRjY3dQb2ludCA9IHBvaW50MTtcclxuXHRcdFx0XHRjY3dQb2ludC5hbmdsZSA9IGFuZ2xlQ29sbGlzaW9uVG9Qb2ludDE7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNsb3Nlc3RDb2xsaXNpb24uYW5nbGUgPSBhbmdsZUNvbGxpc2lvbjtcclxuXHJcblx0XHRcdC8vbWFrZSBzdXJlIGJveCBlZGdlcyBhcmUgbm90IG91dCBvZiByYW5nZVxyXG5cdFx0XHQvLyBpZihjd1BvaW50LmFuZ2xlICA+PSBlbmRQb2ludEFuZ2xlIHx8IGN3UG9pbnQuYW5nbGUgIDw9IHN0YXJ0UG9pbnRBbmdsZSl7XHJcblx0XHRcdC8vIFx0Y3dQb2ludCA9IG51bGw7XHJcblx0XHRcdC8vIH1cclxuXHRcdFx0Ly8gaWYoY2N3UG9pbnQuYW5nbGUgPj0gZW5kUG9pbnRBbmdsZSB8fCBjY3dQb2ludC5hbmdsZSA8PSBzdGFydFBvaW50QW5nbGUpe1xyXG5cdFx0XHQvLyBcdGNjd1BvaW50ID0gbnVsbDtcclxuXHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRjb2xsaXNpb246IHRydWUsXHJcblx0XHRcdFx0cG9pbnQ6IGNsb3Nlc3RDb2xsaXNpb24sXHJcblx0XHRcdFx0ZGlzdDogY2xvc2VzdERpc3QsXHJcblx0XHRcdFx0Y3dQb2ludDogY3dQb2ludCxcclxuXHRcdFx0XHRjY3dQb2ludDogY2N3UG9pbnQsXHJcblx0XHRcdFx0b2JqZWN0OiBjbG9zZXN0T2JqXHJcblx0XHRcdH1cclxuXHRcdH0vL2Nsb3Nlc3QgQ29sbGlzaW9uXHJcblx0XHRlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRjb2xsaXNpb246IGZhbHNlLFxyXG5cdFx0XHRcdHBvaW50OiBwb2ludFxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fS8vZ2V0Q29sbGlzaW9uXHJcblxyXG5cdGZ1bmN0aW9uIGNhbGN1bGF0ZUFuZ2xlKHtwb2ludDEsIHBvaW50Mj1udWxsLCBjZW50ZXJQb2ludH0pe1xyXG5cdFx0aWYocG9pbnQyPT1udWxsKSBwb2ludDIgPSB7eDogY2VudGVyUG9pbnQueCsxMCwgeTpjZW50ZXJQb2ludC55fTtcclxuXHRcdGxldCBwQW5nbGUgPSBVdGlsaXRpZXMuY2FsY3VsYXRlQW5nbGUoe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHBvaW50MTogcG9pbnQxLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRwb2ludDI6IHBvaW50MixcclxuXHRcdFx0XHRcdFx0XHRcdFx0ICAgIGNlbnRlclBvaW50OmNlbnRlclBvaW50fSk7XHJcblx0XHQvLyBpZihwQW5nbGUgPCAwKSBwQW5nbGUgPSBwQW5nbGUgKyBNYXRoLlBJKjI7XHJcblx0XHRpZihwQW5nbGUgPCAwKSBwQW5nbGUgPSBNYXRoLmFicyhwQW5nbGUpO1xyXG5cdFx0Ly8gaWYocEFuZ2xlID4gTWF0aC5QSSkgcEFuZ2xlID0gTWF0aC5QSSAtIHBBbmdsZTtcclxuXHRcdC8vIGlmKHBBbmdsZSA+IHdpZHRoKSBwQW5nbGUgPSBNYXRoLlBJKjIgLSBwQW5nbGU7XHJcblx0XHQvL0NvdWxkIGNhdXNlIGFuIGlzc3VlIHdoZW4gY29uZSBpcyB3aWRlciB0aGFuIFBJIGFrYSAxODAsIG1heWJlP1xyXG5cdFx0cmV0dXJuIHBBbmdsZTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldEludGVyc2VjdGlvbihjb3JuZXJzLCBsaW5lKXtcclxuXHRcdC8vIGNvbnNvbGUubG9nKFwiY29ybmVyczpcIixjb3JuZXJzKTtcclxuXHRcdGxldCBib3hMaW5lVG9wICAgID0ge3gxOmNvcm5lcnMudG9wTGVmdC54LCAgICAgeTE6Y29ybmVycy50b3BMZWZ0LnksIFxyXG5cdFx0XHRcdFx0XHQgICAgIHgyOmNvcm5lcnMudG9wUmlnaHQueCwgICAgeTI6Y29ybmVycy50b3BSaWdodC55fTtcclxuXHRcdGxldCBib3hMaW5lUmlnaHQgID0ge3gxOmNvcm5lcnMudG9wUmlnaHQueCwgICAgeTE6Y29ybmVycy50b3BSaWdodC55LCBcclxuXHRcdFx0XHRcdFx0ICAgICB4Mjpjb3JuZXJzLmJvdHRvbVJpZ2h0LngsIHkyOmNvcm5lcnMuYm90dG9tUmlnaHQueX07XHJcblx0XHRsZXQgYm94TGluZUJvdHRvbSA9IHt4MTpjb3JuZXJzLmJvdHRvbVJpZ2h0LngsIHkxOmNvcm5lcnMuYm90dG9tUmlnaHQueSwgXHJcblx0XHRcdFx0XHRcdCAgICAgeDI6Y29ybmVycy5ib3R0b21MZWZ0LngsICB5Mjpjb3JuZXJzLmJvdHRvbUxlZnQueX07XHJcblx0XHRsZXQgYm94TGluZUxlZnQgICA9IHt4MTpjb3JuZXJzLmJvdHRvbUxlZnQueCwgIHkxOmNvcm5lcnMuYm90dG9tTGVmdC55LCBcclxuXHRcdFx0XHRcdFx0ICAgICB4Mjpjb3JuZXJzLnRvcExlZnQueCwgICAgIHkyOmNvcm5lcnMudG9wTGVmdC55fTtcclxuXHRcdGxldCBpbnRlcnNlY3Rpb24gPSBmYWxzZTtcclxuXHRcdGxldCBpbnRlcnNlY3RpbmdTZWdtZW50ID0gbnVsbDtcclxuXHRcdGxldCBjbG9zZXN0RGlzdCA9IEluZmluaXR5O1xyXG5cdFx0bGV0IHRvcCA9IEhpdGJveC5jb2xsaWRlTGluZUxpbmUobGluZSwgYm94TGluZVRvcCk7XHJcblx0XHRpZih0b3Ape1xyXG5cdFx0XHRpbnRlcnNlY3Rpb24gPSB0b3A7XHJcblx0XHRcdGludGVyc2VjdGluZ1NlZ21lbnQgPSBib3hMaW5lVG9wO1xyXG5cdFx0XHRjbG9zZXN0RGlzdCA9IFV0aWxpdGllcy5kaXN0KHRvcCwge3g6bGluZS54MSwgeTpsaW5lLnkxfSk7XHJcblx0XHR9XHJcblx0XHRsZXQgcmlnaHQgPSBIaXRib3guY29sbGlkZUxpbmVMaW5lKGxpbmUsIGJveExpbmVSaWdodCk7XHJcblx0XHRpZihyaWdodCl7XHJcblx0XHRcdGxldCBkaXN0ID0gVXRpbGl0aWVzLmRpc3QocmlnaHQsIHt4OmxpbmUueDEsIHk6bGluZS55MX0pO1xyXG5cdFx0XHRpZihkaXN0IDwgY2xvc2VzdERpc3Qpe1xyXG5cdFx0XHRcdGludGVyc2VjdGlvbiA9IHJpZ2h0O1xyXG5cdFx0XHRcdGludGVyc2VjdGluZ1NlZ21lbnQgPSBib3hMaW5lUmlnaHQ7XHJcblx0XHRcdFx0Y2xvc2VzdERpc3QgPSBkaXN0O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRsZXQgYm90dG9tID0gSGl0Ym94LmNvbGxpZGVMaW5lTGluZShsaW5lLCBib3hMaW5lQm90dG9tKTtcclxuXHRcdGlmKGJvdHRvbSl7XHJcblx0XHRcdGxldCBkaXN0ID0gVXRpbGl0aWVzLmRpc3QoYm90dG9tLCB7eDpsaW5lLngxLCB5OmxpbmUueTF9KTtcclxuXHRcdFx0aWYoZGlzdCA8IGNsb3Nlc3REaXN0KXtcclxuXHRcdFx0XHRpbnRlcnNlY3Rpb24gPSBib3R0b207XHJcblx0XHRcdFx0aW50ZXJzZWN0aW5nU2VnbWVudCA9IGJveExpbmVCb3R0b207XHJcblx0XHRcdFx0Y2xvc2VzdERpc3QgPSBkaXN0O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRsZXQgbGVmdCA9IEhpdGJveC5jb2xsaWRlTGluZUxpbmUobGluZSwgYm94TGluZUxlZnQpO1xyXG5cdFx0aWYobGVmdCl7XHJcblx0XHRcdGxldCBkaXN0ID0gVXRpbGl0aWVzLmRpc3QobGVmdCwge3g6bGluZS54MSwgeTpsaW5lLnkxfSk7XHJcblx0XHRcdGlmKGRpc3QgPCBjbG9zZXN0RGlzdCl7XHJcblx0XHRcdFx0aW50ZXJzZWN0aW9uID0gbGVmdDtcclxuXHRcdFx0XHRpbnRlcnNlY3RpbmdTZWdtZW50ID0gYm94TGluZUxlZnQ7XHJcblx0XHRcdFx0Y2xvc2VzdERpc3QgPSBkaXN0O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4ge3BvaW50OiBpbnRlcnNlY3Rpb24sIGxpbmU6IGludGVyc2VjdGluZ1NlZ21lbnR9O1xyXG5cdH0vL2dldCBpbnRlcnNlY3Rpb25cclxuXHJcblx0ZnVuY3Rpb24gZ2V0Vmlld1BvaW50KHtwb2ludCwgZWRnZT1mYWxzZSwgY29sb3I9XCJ5ZWxsb3dcIiwgbmFtZT1cIk5vIE5hbWVcIiwgb3JpZ2luLCBjYW1lcmF9KXtcclxuXHRcdGxldCBwQW5nbGUgPSBjYWxjdWxhdGVBbmdsZSh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cG9pbnQxOiBwb2ludCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0ICAgIGNlbnRlclBvaW50Om9yaWdpbn0pO1xyXG5cdFx0Ly90cmFuc2xhdGUgdG8gcG9pbnQgZm9yIGRpc3BsYXlcclxuXHRcdGxldCB2aWV3UG9pbnQgPSB0cmFuc2xhdGVDYW1lcmEoe2NhbWVyYTogY2FtZXJhLCBwb2ludDogcG9pbnR9KTtcclxuXHRcdC8vIHZpZXdQb2ludCA9IHt4OiBwb2ludC54LCB5OiBwb2ludC55fTtcclxuXHRcdHZpZXdQb2ludC5lZGdlID0gZWRnZTtcclxuXHRcdHZpZXdQb2ludC5jb2xvciA9IGNvbG9yO1xyXG5cdFx0dmlld1BvaW50LmFuZ2xlID0gcEFuZ2xlO1xyXG5cdFx0dmlld1BvaW50Lm5hbWUgPSBuYW1lO1xyXG5cdFx0dmlld1BvaW50LmNvdW50ID0gdGhpcy5vcmRlclBvaW50c0NyZWF0ZWQ7XHJcblx0XHR0aGlzLm9yZGVyUG9pbnRzQ3JlYXRlZCsrO1xyXG5cdFx0cmV0dXJuIHZpZXdQb2ludDtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHRyYW5zbGF0ZUNhbWVyYSh7Y2FtZXJhLCBwb2ludH0pe1xyXG5cdFx0bGV0IG9yZ2lnaW5YID0gY2FtZXJhLnggLSAoY2FtZXJhLndpZHRoLzIpO1xyXG5cdFx0bGV0IG9yZ2lnaW5ZID0gY2FtZXJhLnkgLSAoY2FtZXJhLmhlaWdodC8yKTtcclxuXHRcdGxldCB0eCA9IE1hdGgucm91bmQocG9pbnQueCAtIG9yZ2lnaW5YKTtcclxuXHRcdGxldCB0eSA9IE1hdGgucm91bmQocG9pbnQueSAtIG9yZ2lnaW5ZKTtcclxuXHRcdHJldHVybiB7eDp0eCwgeTp0eX07XHJcblx0fSIsInZhciBVdGlsaXRpZXMgPSByZXF1aXJlKCcuLi9zaGFyZWQvVXRpbGl0aWVzLmpzJyk7XHJcblxyXG5leHBvcnRzLmNyZWF0ZSA9ICh7XHJcblx0aWQ9MCxcclxuXHR4PTAsXHJcblx0eT0wLFxyXG5cdHdpZHRoPTUwLFxyXG5cdGhlaWdodD01MCxcclxuXHRhbmdsZT0wXHJcbn0pPT57XHJcblx0bGV0IHRvcCAgICA9IHkgLSAoaGVpZ2h0LzIpO1xyXG5cdGxldCBib3R0b20gPSB5ICsgKGhlaWdodC8yKTtcclxuXHRsZXQgbGVmdCAgID0geCAtICh3aWR0aC8yKTtcclxuXHRsZXQgcmlnaHQgID0geCArICh3aWR0aC8yKVxyXG5cdHJldHVybiB7XHJcblx0XHRpZDogaWQsXHJcblx0XHR4OiAgeCxcclxuXHRcdHk6ICB5LFxyXG5cdFx0d2lkdGg6IHdpZHRoLFxyXG5cdFx0aGVpZ2h0OmhlaWdodCxcclxuXHRcdGFuZ2xlOiBhbmdsZSxcclxuXHRcdHRvcDogICAgdG9wLFxyXG5cdFx0Ym90dG9tOiBib3R0b20sXHJcblx0XHRsZWZ0OiAgIGxlZnQsXHJcblx0XHRyaWdodDogIHJpZ2h0LFxyXG5cdFx0dG9wTGVmdDogICAgIHt4OiBsZWZ0LCB5OiB0b3B9LFxyXG5cdFx0dG9wUmlnaHQ6ICAgIHt4OiByaWdodCwgeTogdG9wfSxcclxuXHRcdGJvdHRvbUxlZnQ6ICB7eDogbGVmdCwgeTogYm90dG9tfSxcclxuXHRcdGJvdHRvbVJpZ2h0OiB7eDogcmlnaHQsIHk6IGJvdHRvbX0sXHJcblx0XHRwb2ludHM6ICAgICAgW3t4OiBsZWZ0LCB5OiB0b3B9LCB7eDogcmlnaHQsIHk6IHRvcH0sIHt4OiBsZWZ0LCB5OiBib3R0b219LCB7eDogcmlnaHQsIHk6IGJvdHRvbX1dXHJcblx0fVxyXG59IC8vY3JlYXRlXHJcblxyXG5mdW5jdGlvbiBtb3ZlVG8ob2JqLCB4LCB5KXtcclxuXHRvYmouaGl0Ym94LnggPSB4O1xyXG5cdG9iai5oaXRib3gueSA9IHk7XHJcblx0dXBkYXRlKG9iaik7XHJcbn1cclxuZXhwb3J0cy5tb3ZlVG8gPSBtb3ZlVG87XHJcblxyXG5mdW5jdGlvbiB1cGRhdGUob2JqKXtcclxuXHRsZXQgaGl0Ym94ID0gb2JqLmhpdGJveDtcclxuXHRsZXQgdG9wICAgID0gaGl0Ym94LnkgLSAoaGl0Ym94LmhlaWdodC8yKTtcclxuXHRsZXQgYm90dG9tID0gaGl0Ym94LnkgKyAoaGl0Ym94LmhlaWdodC8yKTtcclxuXHRsZXQgbGVmdCAgID0gaGl0Ym94LnggLSAoaGl0Ym94LndpZHRoLzIpO1xyXG5cdGxldCByaWdodCAgPSBoaXRib3gueCArIChoaXRib3gud2lkdGgvMik7XHJcblxyXG5cdGhpdGJveC50b3AgICAgPSB0b3A7XHJcblx0aGl0Ym94LmJvdHRvbSA9IGJvdHRvbTtcclxuXHRoaXRib3gubGVmdCAgID0gbGVmdDtcclxuXHRoaXRib3gucmlnaHQgID0gcmlnaHQ7XHJcblx0aGl0Ym94LnRvcExlZnQgICAgID0ge3g6IGxlZnQsIHk6IHRvcH07XHJcblx0aGl0Ym94LnRvcFJpZ2h0ICAgID0ge3g6IHJpZ2h0LCB5OiB0b3B9O1xyXG5cdGhpdGJveC5ib3R0b21MZWZ0ICA9IHt4OiBsZWZ0LCB5OiBib3R0b219O1xyXG5cdGhpdGJveC5ib3R0b21SaWdodCA9IHt4OiByaWdodCwgeTogYm90dG9tfTtcclxuXHQvLyBoaXRib3gucG9pbnRzICAgICAgPSBbaGl0Ym94LnRvcExlZnQsIGhpdGJveC50b3BSaWdodCwgaGl0Ym94LmJvdHRvbUxlZnQsIGhpdGJveC5ib3R0b21SaWdodF07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFZpc3VhbFBvaW50cyh7b2JqLCB2aWV3UG9pbnQsIGdldFBvaW50c0FmdGVyRWRnZT1mYWxzZX0pe1xyXG5cclxuXHRsZXQgcmV0dXJuUG9pbnRzID0gW107XHJcblx0aWYodmlld1BvaW50LnkgPCBvYmoudG9wKXsgICAgICAgICAgICAgIC8vTlcsIE4sIE5FXHJcblx0XHRpZih2aWV3UG9pbnQueCA8IG9iai5sZWZ0KXsgICAgICAgICAvL05XXHJcblx0XHRcdHJldHVyblBvaW50cyA9IFtvYmoudG9wTGVmdCwgb2JqLnRvcFJpZ2h0LCBvYmouYm90dG9tTGVmdF07XHJcblx0XHRcdGxldCBwUm90YXRlZENXID0gVXRpbGl0aWVzLnJvdGF0ZVBvaW50KHtcclxuXHRcdFx0XHRjZW50ZXI6IHZpZXdQb2ludCxcclxuXHRcdFx0XHRwb2ludDogb2JqLmJvdHRvbUxlZnQsXHJcblx0XHRcdFx0YW5nbGU6IDAuMDF9KTtcclxuXHRcdFx0cFJvdGF0ZWRDVy5leHRlbmQgPSB0cnVlO1xyXG5cdFx0XHRyZXR1cm5Qb2ludHMucHVzaChwUm90YXRlZENXKTtcclxuXHRcdFx0bGV0IHBSb3RhdGVkQ0NXID0gVXRpbGl0aWVzLnJvdGF0ZVBvaW50KHtcclxuXHRcdFx0XHRjZW50ZXI6IHZpZXdQb2ludCxcclxuXHRcdFx0XHRwb2ludDogb2JqLnRvcFJpZ2h0LFxyXG5cdFx0XHRcdGFuZ2xlOiAtMC4wMX0pO1xyXG5cdFx0XHRwUm90YXRlZENDVy5leHRlbmQgPSB0cnVlO1xyXG5cdFx0XHRyZXR1cm5Qb2ludHMucHVzaChwUm90YXRlZENDVyk7XHJcblx0XHR9IGVsc2UgaWYodmlld1BvaW50LnggPiBvYmoucmlnaHQpeyAvL05FXHJcblx0XHRcdHJldHVyblBvaW50cyA9IFtvYmoudG9wTGVmdCwgb2JqLnRvcFJpZ2h0LCBvYmouYm90dG9tUmlnaHRdO1xyXG5cdFx0XHRsZXQgcFJvdGF0ZWRDVyA9IFV0aWxpdGllcy5yb3RhdGVQb2ludCh7XHJcblx0XHRcdFx0Y2VudGVyOiB2aWV3UG9pbnQsXHJcblx0XHRcdFx0cG9pbnQ6IG9iai50b3BMZWZ0LFxyXG5cdFx0XHRcdGFuZ2xlOiAwLjAxfSk7XHJcblx0XHRcdHBSb3RhdGVkQ1cuZXh0ZW5kID0gdHJ1ZTtcclxuXHRcdFx0cmV0dXJuUG9pbnRzLnB1c2gocFJvdGF0ZWRDVyk7XHJcblx0XHRcdGxldCBwUm90YXRlZENDVyA9IFV0aWxpdGllcy5yb3RhdGVQb2ludCh7XHJcblx0XHRcdFx0Y2VudGVyOiB2aWV3UG9pbnQsXHJcblx0XHRcdFx0cG9pbnQ6IG9iai5ib3R0b21SaWdodCxcclxuXHRcdFx0XHRhbmdsZTogLTAuMDF9KTtcclxuXHRcdFx0cFJvdGF0ZWRDQ1cuZXh0ZW5kID0gdHJ1ZTtcclxuXHRcdFx0cmV0dXJuUG9pbnRzLnB1c2gocFJvdGF0ZWRDQ1cpO1xyXG5cdFx0fSBlbHNlIHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9OXHJcblx0XHRcdHJldHVyblBvaW50cyA9IFtvYmoudG9wTGVmdCwgb2JqLnRvcFJpZ2h0XTtcclxuXHRcdFx0bGV0IHBSb3RhdGVkQ1cgPSBVdGlsaXRpZXMucm90YXRlUG9pbnQoe1xyXG5cdFx0XHRcdGNlbnRlcjogdmlld1BvaW50LFxyXG5cdFx0XHRcdHBvaW50OiBvYmoudG9wTGVmdCxcclxuXHRcdFx0XHRhbmdsZTogMC4wMX0pO1xyXG5cdFx0XHRwUm90YXRlZENXLmV4dGVuZCA9IHRydWU7XHJcblx0XHRcdHJldHVyblBvaW50cy5wdXNoKHBSb3RhdGVkQ1cpO1xyXG5cdFx0XHRsZXQgcFJvdGF0ZWRDQ1cgPSBVdGlsaXRpZXMucm90YXRlUG9pbnQoe1xyXG5cdFx0XHRcdGNlbnRlcjogdmlld1BvaW50LFxyXG5cdFx0XHRcdHBvaW50OiBvYmoudG9wUmlnaHQsXHJcblx0XHRcdFx0YW5nbGU6IC0wLjAxfSk7XHJcblx0XHRcdHBSb3RhdGVkQ0NXLmV4dGVuZCA9IHRydWU7XHJcblx0XHRcdHJldHVyblBvaW50cy5wdXNoKHBSb3RhdGVkQ0NXKTtcclxuXHRcdH1cclxuXHJcblx0fSBlbHNlIGlmKHZpZXdQb2ludC55ID4gb2JqLmJvdHRvbSl7ICAgIC8vU1csIFMsIFNFXHJcblx0XHRpZih2aWV3UG9pbnQueCA8IG9iai5sZWZ0KXsgICAgICAgICAvL1NXXHJcblx0XHRcdHJldHVyblBvaW50cyA9IFtvYmoudG9wTGVmdCwgb2JqLmJvdHRvbUxlZnQsIG9iai5ib3R0b21SaWdodF07XHJcblx0XHRcdGxldCBwUm90YXRlZENXID0gVXRpbGl0aWVzLnJvdGF0ZVBvaW50KHtcclxuXHRcdFx0XHRjZW50ZXI6IHZpZXdQb2ludCxcclxuXHRcdFx0XHRwb2ludDogb2JqLmJvdHRvbVJpZ2h0LFxyXG5cdFx0XHRcdGFuZ2xlOiAwLjAxfSk7XHJcblx0XHRcdHBSb3RhdGVkQ1cuZXh0ZW5kID0gdHJ1ZTtcclxuXHRcdFx0cmV0dXJuUG9pbnRzLnB1c2gocFJvdGF0ZWRDVyk7XHJcblx0XHRcdGxldCBwUm90YXRlZENDVyA9IFV0aWxpdGllcy5yb3RhdGVQb2ludCh7XHJcblx0XHRcdFx0Y2VudGVyOiB2aWV3UG9pbnQsXHJcblx0XHRcdFx0cG9pbnQ6IG9iai50b3BMZWZ0LFxyXG5cdFx0XHRcdGFuZ2xlOiAtMC4wMX0pO1xyXG5cdFx0XHRwUm90YXRlZENDVy5leHRlbmQgPSB0cnVlO1xyXG5cdFx0XHRyZXR1cm5Qb2ludHMucHVzaChwUm90YXRlZENDVyk7XHJcblx0XHR9IGVsc2UgaWYodmlld1BvaW50LnggPiBvYmoucmlnaHQpeyAvL1NFXHJcblx0XHRcdHJldHVyblBvaW50cyA9IFtvYmoudG9wUmlnaHQsIG9iai5ib3R0b21MZWZ0LCBvYmouYm90dG9tUmlnaHRdO1xyXG5cdFx0XHRsZXQgcFJvdGF0ZWRDVyA9IFV0aWxpdGllcy5yb3RhdGVQb2ludCh7XHJcblx0XHRcdFx0Y2VudGVyOiB2aWV3UG9pbnQsXHJcblx0XHRcdFx0cG9pbnQ6IG9iai50b3BSaWdodCxcclxuXHRcdFx0XHRhbmdsZTogMC4wMX0pO1xyXG5cdFx0XHRwUm90YXRlZENXLmV4dGVuZCA9IHRydWU7XHJcblx0XHRcdHJldHVyblBvaW50cy5wdXNoKHBSb3RhdGVkQ1cpO1xyXG5cdFx0XHRsZXQgcFJvdGF0ZWRDQ1cgPSBVdGlsaXRpZXMucm90YXRlUG9pbnQoe1xyXG5cdFx0XHRcdGNlbnRlcjogdmlld1BvaW50LFxyXG5cdFx0XHRcdHBvaW50OiBvYmouYm90dG9tTGVmdCxcclxuXHRcdFx0XHRhbmdsZTogLTAuMDF9KTtcclxuXHRcdFx0cFJvdGF0ZWRDQ1cuZXh0ZW5kID0gdHJ1ZTtcclxuXHRcdFx0cmV0dXJuUG9pbnRzLnB1c2gocFJvdGF0ZWRDQ1cpO1xyXG5cdFx0fSBlbHNlIHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9TXHJcblx0XHRcdHJldHVyblBvaW50cyA9IFtvYmouYm90dG9tTGVmdCwgb2JqLmJvdHRvbVJpZ2h0XTtcclxuXHRcdFx0bGV0IHBSb3RhdGVkQ1cgPSBVdGlsaXRpZXMucm90YXRlUG9pbnQoe1xyXG5cdFx0XHRcdGNlbnRlcjogdmlld1BvaW50LFxyXG5cdFx0XHRcdHBvaW50OiBvYmouYm90dG9tUmlnaHQsXHJcblx0XHRcdFx0YW5nbGU6IDAuMDF9KTtcclxuXHRcdFx0cFJvdGF0ZWRDVy5leHRlbmQgPSB0cnVlO1xyXG5cdFx0XHRyZXR1cm5Qb2ludHMucHVzaChwUm90YXRlZENXKTtcclxuXHRcdFx0bGV0IHBSb3RhdGVkQ0NXID0gVXRpbGl0aWVzLnJvdGF0ZVBvaW50KHtcclxuXHRcdFx0XHRjZW50ZXI6IHZpZXdQb2ludCxcclxuXHRcdFx0XHRwb2ludDogb2JqLmJvdHRvbUxlZnQsXHJcblx0XHRcdFx0YW5nbGU6IC0wLjAxfSk7XHJcblx0XHRcdHBSb3RhdGVkQ0NXLmV4dGVuZCA9IHRydWU7XHJcblx0XHRcdHJldHVyblBvaW50cy5wdXNoKHBSb3RhdGVkQ0NXKTtcclxuXHRcdH1cclxuXHJcblx0fSBlbHNlIHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vRSBvciBXXHJcblx0XHRpZih2aWV3UG9pbnQueCA8IG9iai5sZWZ0KXsgICAgICAgICAvL1dcclxuXHRcdFx0cmV0dXJuUG9pbnRzID0gW29iai50b3BMZWZ0LCBvYmouYm90dG9tTGVmdF07XHJcblx0XHRcdGxldCBwUm90YXRlZENXID0gVXRpbGl0aWVzLnJvdGF0ZVBvaW50KHtcclxuXHRcdFx0XHRjZW50ZXI6IHZpZXdQb2ludCxcclxuXHRcdFx0XHRwb2ludDogb2JqLmJvdHRvbUxlZnQsXHJcblx0XHRcdFx0YW5nbGU6IDAuMDF9KTtcclxuXHRcdFx0cFJvdGF0ZWRDVy5leHRlbmQgPSB0cnVlO1xyXG5cdFx0XHRyZXR1cm5Qb2ludHMucHVzaChwUm90YXRlZENXKTtcclxuXHRcdFx0bGV0IHBSb3RhdGVkQ0NXID0gVXRpbGl0aWVzLnJvdGF0ZVBvaW50KHtcclxuXHRcdFx0XHRjZW50ZXI6IHZpZXdQb2ludCxcclxuXHRcdFx0XHRwb2ludDogb2JqLnRvcExlZnQsXHJcblx0XHRcdFx0YW5nbGU6IC0wLjAxfSk7XHJcblx0XHRcdHBSb3RhdGVkQ0NXLmV4dGVuZCA9IHRydWU7XHJcblx0XHRcdHJldHVyblBvaW50cy5wdXNoKHBSb3RhdGVkQ0NXKTtcclxuXHRcdH0gZWxzZSBpZih2aWV3UG9pbnQueCA+IG9iai5yaWdodCl7IC8vRVxyXG5cdFx0XHRyZXR1cm5Qb2ludHMgPSBbb2JqLnRvcFJpZ2h0LCBvYmouYm90dG9tUmlnaHRdO1xyXG5cdFx0XHRsZXQgcFJvdGF0ZWRDVyA9IFV0aWxpdGllcy5yb3RhdGVQb2ludCh7XHJcblx0XHRcdFx0Y2VudGVyOiB2aWV3UG9pbnQsXHJcblx0XHRcdFx0cG9pbnQ6IG9iai50b3BSaWdodCxcclxuXHRcdFx0XHRhbmdsZTogMC4wMX0pO1xyXG5cdFx0XHRwUm90YXRlZENXLmV4dGVuZCA9IHRydWU7XHJcblx0XHRcdHJldHVyblBvaW50cy5wdXNoKHBSb3RhdGVkQ1cpO1xyXG5cdFx0XHRsZXQgcFJvdGF0ZWRDQ1cgPSBVdGlsaXRpZXMucm90YXRlUG9pbnQoe1xyXG5cdFx0XHRcdGNlbnRlcjogdmlld1BvaW50LFxyXG5cdFx0XHRcdHBvaW50OiBvYmouYm90dG9tUmlnaHQsXHJcblx0XHRcdFx0YW5nbGU6IC0wLjAxfSk7XHJcblx0XHRcdHBSb3RhdGVkQ0NXLmV4dGVuZCA9IHRydWU7XHJcblx0XHRcdHJldHVyblBvaW50cy5wdXNoKHBSb3RhdGVkQ0NXKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKFwiQ2F0Y2ggaW4gZ2V0VmlzdWFsUG9pbnRzLCBwb3NzaWJseSB2aWV3UG9pbnQgaXMgaW5zaWRlIHRoZSBib3hcIik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBpZihyZXR1cm5Qb2ludHMubGVuZ3RoIDwgNCB8fCByZXR1cm5Qb2ludHMubGVuZ3RoID4gNSkgY29uc29sZS5sb2coXCJXcm9uZyBhbW91bnQgb2YgcG9pbnRzOlwiLCByZXR1cm5Qb2ludHMubGVuZ3RoKTtcclxuXHJcblx0cmV0dXJuIHJldHVyblBvaW50cztcclxuXHJcbn1cclxuZXhwb3J0cy5nZXRWaXN1YWxQb2ludHMgPSBnZXRWaXN1YWxQb2ludHM7XHJcblxyXG5mdW5jdGlvbiBjb2xsaWRpbmcob2JqMSwgb2JqMikge1xyXG5cdC8vZG9lc250IHRha2UgYW5nbGUgaW50byBhY2NvdW50IHlldC5cclxuXHRsZXQgaGl0Ym94MSA9IG9iajEuaGl0Ym94O1xyXG5cdGxldCBoaXRib3gyID0gb2JqMi5oaXRib3g7XHJcblxyXG5cdGxldCByb3VnaENvbGxpZGluZyA9IGZhbHNlO1xyXG5cdC8vIGNvbnNvbGUubG9nKFwiSW4gY29sbGlkaW5nOlwiLCBoaXRib3gxLCBoaXRib3gyKTtcclxuXHRpZihoaXRib3gxLnRvcCA+IGhpdGJveDIuYm90dG9tIHx8XHJcblx0ICAgaGl0Ym94MS5ib3R0b20gPCBoaXRib3gyLnRvcCB8fFxyXG5cdCAgIGhpdGJveDEucmlnaHQgPCBoaXRib3gyLmxlZnQgfHxcclxuXHQgICBoaXRib3gxLmxlZnQgPiBoaXRib3gyLnJpZ2h0KSB7XHJcblx0XHRyb3VnaENvbGxpZGluZyA9IGZhbHNlO1xyXG5cdH0gZWxzZSByb3VnaENvbGxpZGluZyA9IHRydWU7XHJcblxyXG5cdC8vIGlmKHJvdWdoQ29sbGlkaW5nKXtcclxuXHQvLyBcdC8vVE9ETyBtYWtlIG1vcmUgZ3JhbnVsYXIgY29sbGlkaW5nIHdpdGggY29sbGlzaW9uIHBvaW50cyBhbmQgc3VjaFxyXG5cdC8vIH1cclxuXHRcclxuXHRyZXR1cm4gcm91Z2hDb2xsaWRpbmc7XHJcbn0gLy9jb2xsaWRpbmdcclxuZXhwb3J0cy5jb2xsaWRpbmcgPSBjb2xsaWRpbmc7XHJcblxyXG5mdW5jdGlvbiBjb2xsaWRlTGluZUxpbmUobGluZTEsIGxpbmUyKSB7XHJcblxyXG5cdC8vIGNhbGN1bGF0ZSB0aGUgZGlzdGFuY2UgdG8gaW50ZXJzZWN0aW9uIHBvaW50XHJcblx0dmFyIHVBID0gKChsaW5lMi54Mi1saW5lMi54MSkqKGxpbmUxLnkxLWxpbmUyLnkxKSAtIFxyXG5cdFx0XHQgKGxpbmUyLnkyLWxpbmUyLnkxKSoobGluZTEueDEtbGluZTIueDEpKSAvIFxyXG5cdFx0XHQgKChsaW5lMi55Mi1saW5lMi55MSkqKGxpbmUxLngyLWxpbmUxLngxKSAtIFxyXG5cdFx0XHQgKGxpbmUyLngyLWxpbmUyLngxKSoobGluZTEueTItbGluZTEueTEpKTtcclxuXHR2YXIgdUIgPSAoKGxpbmUxLngyLWxpbmUxLngxKSoobGluZTEueTEtbGluZTIueTEpIC0gXHJcblx0XHRcdCAobGluZTEueTItbGluZTEueTEpKihsaW5lMS54MS1saW5lMi54MSkpIC8gXHJcblx0XHRcdCAoKGxpbmUyLnkyLWxpbmUyLnkxKSoobGluZTEueDItbGluZTEueDEpIC0gXHJcblx0XHRcdCAobGluZTIueDItbGluZTIueDEpKihsaW5lMS55Mi1saW5lMS55MSkpO1xyXG5cclxuXHQvLyBpZiB1QSBhbmQgdUIgYXJlIGJldHdlZW4gMC0xLCBsaW5lcyBhcmUgY29sbGlkaW5nXHJcblx0aWYgKHVBID49IDAgJiYgdUEgPD0gMSAmJiB1QiA+PSAwICYmIHVCIDw9IDEpIHtcclxuXHJcblx0ICB2YXIgaW50ZXJzZWN0aW9uWCA9IGxpbmUxLngxICsgKHVBICogKGxpbmUxLngyLWxpbmUxLngxKSk7XHJcblx0ICB2YXIgaW50ZXJzZWN0aW9uWSA9IGxpbmUxLnkxICsgKHVBICogKGxpbmUxLnkyLWxpbmUxLnkxKSk7XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIFwieFwiOmludGVyc2VjdGlvblgsXHJcbiAgICAgICAgXCJ5XCI6aW50ZXJzZWN0aW9uWVxyXG4gICAgICB9O1xyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2U7XHJcbn1cclxuZXhwb3J0cy5jb2xsaWRlTGluZUxpbmUgPSBjb2xsaWRlTGluZUxpbmU7XHJcblxyXG5mdW5jdGlvbiBjb2xsaWRlTGluZVJlY3QobGluZSwgcmVjKSB7Ly94MSwgeTEsIHgyLCB5MiwgICByeCwgcnksIHJ3LCByaFxyXG5cclxuICAvL2NoZWNrIGlmIHRoZSBsaW5lIGhhcyBoaXQgYW55IG9mIHRoZSByZWN0YW5nbGUncyBzaWRlcy4gdXNlcyB0aGUgY29sbGlkZUxpbmVMaW5lIGZ1bmN0aW9uIGFib3ZlXHJcblxyXG5cdGxldCBsZWZ0ID0gICB0aGlzLmNvbGxpZGVMaW5lTGluZSh4MSx5MSx4Mix5MiwgcngscnkscngsIHJ5K3JoKTtcclxuXHRsZXQgcmlnaHQgPSAgdGhpcy5jb2xsaWRlTGluZUxpbmUoeDEseTEseDIseTIsIHJ4K3J3LHJ5LCByeCtydyxyeStyaCk7XHJcblx0bGV0IHRvcCA9ICAgIHRoaXMuY29sbGlkZUxpbmVMaW5lKHgxLHkxLHgyLHkyLCByeCxyeSwgcngrcncscnkpO1xyXG5cdGxldCBib3R0b20gPSB0aGlzLmNvbGxpZGVMaW5lTGluZSh4MSx5MSx4Mix5MiwgcngscnkrcmgsIHJ4K3J3LHJ5K3JoKTtcclxuXHRsZXQgaW50ZXJzZWN0aW9uID0ge1xyXG5cdFx0XCJsZWZ0XCIgOiBsZWZ0LFxyXG5cdFx0XCJyaWdodFwiIDogcmlnaHQsXHJcblx0XHRcInRvcFwiIDogdG9wLFxyXG5cdFx0XCJib3R0b21cIiA6IGJvdHRvbVxyXG5cdH1cclxuXHJcbiAgLy9pZiBBTlkgb2YgdGhlIGFib3ZlIGFyZSB0cnVlLCB0aGUgbGluZSBoYXMgaGl0IHRoZSByZWN0YW5nbGVcclxuICBpZiAobGVmdCB8fCByaWdodCB8fCB0b3AgfHwgYm90dG9tKSB7XHJcbiAgICAgIHJldHVybiBpbnRlcnNlY3Rpb247XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5leHBvcnRzLmNvbGxpZGVMaW5lUmVjdCA9IGNvbGxpZGVMaW5lUmVjdDsiLCJleHBvcnRzLmVycm9yID0gKHN0cmluZyk9PntcclxuXHRuZXcgRXJyb3Ioc3RyaW5nKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmFuZG9tQ29sb3IoKXtcclxuXHRyZXR1cm4ge1xyXG5cdFx0cjogTWF0aC5mbG9vcigyNTUqTWF0aC5yYW5kb20oKSksXHJcblx0XHRnOiBNYXRoLmZsb29yKDI1NSpNYXRoLnJhbmRvbSgpKSxcclxuXHRcdGI6IE1hdGguZmxvb3IoMjU1Kk1hdGgucmFuZG9tKCkpXHJcblx0fVxyXG59XHJcbmV4cG9ydHMucmFuZG9tQ29sb3IgPSByYW5kb21Db2xvcjtcclxuXHJcbmV4cG9ydHMubWlkUG9pbnQgPSAocG9pbnQxLCBwb2ludDIpPT57XHJcbiAgICBsZXQgbWlkZGxlWCA9IHBvaW50Mi54IC0gKChwb2ludDIueC1wb2ludDIueCkvMik7XHJcbiAgICBsZXQgbWlkZGxlWSA9IHBvaW50Mi55IC0gKChwb2ludDIueS1wb2ludDEueSkvMik7XHJcbiAgIHJldHVybiB7eDogbWlkZGxlWCwgeTogbWlkZGxlWX07XHJcbn1cclxuXHJcbmV4cG9ydHMucm90YXRlUG9pbnQgPSAoe2NlbnRlcj17eDowLCB5OjB9LCBwb2ludD17eDowLCB5OjB9LCBhbmdsZT0wfSk9PntcclxuICAgICAgICBsZXQgcyA9IE1hdGguc2luKGFuZ2xlKTtcclxuICAgICAgICBsZXQgYyA9IE1hdGguY29zKGFuZ2xlKTtcclxuXHJcbiAgICAgICAgLy9tYWtlIGNvcHlcclxuICAgICAgICBsZXQgbmV3UG9pbnQgPSB7eDogcG9pbnQueCwgeTogcG9pbnQueX07IFxyXG5cclxuICAgICAgICAvLyB0cmFuc2xhdGUgcG9pbnQgYmFjayB0byBvcmlnaW46XHJcbiAgICAgICAgbmV3UG9pbnQueCAtPSBjZW50ZXIueDtcclxuICAgICAgICBuZXdQb2ludC55IC09IGNlbnRlci55O1xyXG5cclxuICAgICAgICAvLyByb3RhdGUgcG9pbnRcclxuICAgICAgICBsZXQgeG5ldyA9IG5ld1BvaW50LnggKiBjIC0gbmV3UG9pbnQueSAqIHM7XHJcbiAgICAgICAgbGV0IHluZXcgPSBuZXdQb2ludC54ICogcyArIG5ld1BvaW50LnkgKiBjO1xyXG5cclxuICAgICAgICAvLyB0cmFuc2xhdGUgcG9pbnQgYmFjazpcclxuICAgICAgICBuZXdQb2ludC54ID0geG5ldyArIGNlbnRlci54O1xyXG4gICAgICAgIG5ld1BvaW50LnkgPSB5bmV3ICsgY2VudGVyLnk7XHJcbiAgICAgICAgcmV0dXJuIG5ld1BvaW50O1xyXG4gICAgfVxyXG5cclxuZXhwb3J0cy5leHRlbmRFbmRQb2ludCA9ICh7c3RhcnRQb2ludCwgZW5kUG9pbnQsIGxlbmd0aH0pPT57XHJcbiAgICBsZXQgY3VycmVudGxlbmd0aCA9IE1hdGguc3FydChcclxuICAgICAgICBNYXRoLnBvdyhzdGFydFBvaW50LnggLSBlbmRQb2ludC54LCAyLjApICsgXHJcbiAgICAgICAgTWF0aC5wb3coc3RhcnRQb2ludC55IC0gZW5kUG9pbnQueSwgMi4wKVxyXG4gICAgICAgICk7XHJcbiAgICBsZXQgYW1vdW50ID0gbGVuZ3RoIC0gY3VycmVudGxlbmd0aDtcclxuICAgIGxldCBuZXdFbmRQb2ludCA9IHtcclxuICAgICAgICB4OiBlbmRQb2ludC54ICsgKChlbmRQb2ludC54IC0gc3RhcnRQb2ludC54KSAvIGN1cnJlbnRsZW5ndGggKiBhbW91bnQpLFxyXG4gICAgICAgIHk6IGVuZFBvaW50LnkgKyAoKGVuZFBvaW50LnkgLSBzdGFydFBvaW50LnkpIC8gY3VycmVudGxlbmd0aCAqIGFtb3VudClcclxuICAgIH07XHJcbiAgICByZXR1cm4gbmV3RW5kUG9pbnQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpc3QocG9pbnQxLCBwb2ludDIpe1xyXG4gICAgbGV0IGRpZmZYID0gTWF0aC5hYnMocG9pbnQxLnggLSBwb2ludDIueCk7XHJcbiAgICBsZXQgZGlmZlkgPSBNYXRoLmFicyhwb2ludDEueSAtIHBvaW50Mi55KTtcclxuICAgIGxldCBkaXN0YW5jZSA9IE1hdGguc3FydCgoTWF0aC5wb3coZGlmZlgsIDIpICsgTWF0aC5wb3coZGlmZlksMikpLCAyKTtcclxuICAgIHJldHVybiBkaXN0YW5jZTtcclxufVxyXG5leHBvcnRzLmRpc3QgPSBkaXN0O1xyXG5cclxuZXhwb3J0cy5jYWxjdWxhdGVBbmdsZSA9ICh7cG9pbnQxLCBwb2ludDIsIGNlbnRlclBvaW50PXt4OjAseTowfX0pPT57XHJcbiAgICBpZihwb2ludDEueCA9PT0gcG9pbnQyLnggJiYgcG9pbnQxLnkgPT09IHBvaW50Mi55KSByZXR1cm4gMDtcclxuXHJcbiAgICBsZXQgcDFUcmFucyA9IHt4OiBwb2ludDEueCAtIGNlbnRlclBvaW50LngsIHk6IHBvaW50MS55IC0gY2VudGVyUG9pbnQueX07XHJcbiAgICBsZXQgcDJUcmFucyA9IHt4OiBwb2ludDIueCAtIGNlbnRlclBvaW50LngsIHk6IHBvaW50Mi55IC0gY2VudGVyUG9pbnQueX07XHJcbiAgICAvLyBsZXQgZGlmZlggICA9IHAxVHJhbnMueCAtIHAyVHJhbnMueDtcclxuICAgIC8vIGxldCBkaWZmWSAgID0gcDFUcmFucy55IC0gcDJUcmFucy55O1xyXG4gICAgLy8gdmFyIGFuZ2xlUmFkaWFucyA9IE1hdGguYXRhbjIoZGlmZlksIGRpZmZYKTtcclxuICAgIGxldCBhbmdsZU9mUDEgPSBNYXRoLmF0YW4yKHAxVHJhbnMueSwgcDFUcmFucy54KTtcclxuICAgIGxldCBhbmdsZU9mUDIgPSBNYXRoLmF0YW4yKHAyVHJhbnMueSwgcDJUcmFucy54KTtcclxuICAgIGlmKGFuZ2xlT2ZQMSA8IDApIGFuZ2xlT2ZQMSA9IGFuZ2xlT2ZQMSArIE1hdGguUEkqMjtcclxuICAgIGlmKGFuZ2xlT2ZQMiA8IDApIGFuZ2xlT2ZQMiA9IGFuZ2xlT2ZQMiArIE1hdGguUEkqMjtcclxuICAgIGxldCBhbmdsZVJhZGlhbnMgPSBhbmdsZU9mUDIgLSBhbmdsZU9mUDE7XHJcbiAgICAvLyBpZihhbmdsZVJhZGlhbnMgPCAwKSBhbmdsZVJhZGlhbnMgPSAoYW5nbGVSYWRpYW5zICsgTWF0aC5QSSoyKTtcclxuICAgIHJldHVybiBhbmdsZVJhZGlhbnM7XHJcbiAgICAvLyBsZXQgYW5nbGVPZlAxID0gTWF0aC5hdGFuMihwMVRyYW5zLngsIHAxVHJhbnMueSk7XHJcbiAgICAvLyBsZXQgYW5nbGVPZlAyID0gTWF0aC5hdGFuMihwb2ludDIueSAtIGNlbnRlclBvaW50LnksIHBvaW50Mi54IC0gY2VudGVyUG9pbnQueCk7XHJcbiAgICAvLyBpZihhbmdsZU9mUDEgPCAwKSBhbmdsZU9mUDEgPSBhbmdsZU9mUDEgKyBNYXRoLlBJKjI7XHJcbiAgICAvLyBpZihhbmdsZU9mUDIgPCAwKSBhbmdsZU9mUDIgPSBhbmdsZU9mUDIgKyBNYXRoLlBJKjI7XHJcbiAgICAvL2FuZ2xlIGluIHJhZGlhbnNcclxuICAgIC8vIHJldHVybiAgYW5nbGVPZlAyIC0gYW5nbGVPZlAxO1xyXG59XHJcblxyXG5leHBvcnRzLm1hcE51bSA9ICh7aW5wdXQsIHN0YXJ0MSwgZW5kMSwgc3RhcnQyLCBlbmQyIH0pPT57XHJcbiAgICBpZihpbnB1dDxzdGFydDEpIGlucHV0ID0gc3RhcnQxO1xyXG4gICAgZWxzZSBpZihpbnB1dD5lbmQxKSBpbnB1dCA9IGVuZDE7XHJcbiAgICBsZXQgZGlmZlJhbmdlMSA9IGVuZDEgLSBzdGFydDE7XHJcbiAgICBsZXQgZnJhY3Rpb25PZkZpcnN0UmFuZ2UgPSAoaW5wdXQgLSBzdGFydDEpIC8gZGlmZlJhbmdlMTtcclxuICAgIGxldCBkaWZmUmFuZ2UyID0gZW5kMiAtIHN0YXJ0MjtcclxuICAgIHJldHVybiAoZGlmZlJhbmdlMipmcmFjdGlvbk9mRmlyc3RSYW5nZSkgKyBzdGFydDI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsb25lT2JqZWN0KG9iail7XHJcblx0Ly9tYWtlIGEgbmV3IG9iamVjdCB0byByZXR1cm5cclxuXHRsZXQgbmV3T2JqID0ge307XHJcblx0Ly9jb3B5IGFsbCBwcm9wZXJ0aWVzIG9udG8gbmV3b2JqZWN0XHJcblx0Zm9yKHZhciBpZCBpbiBvYmope1xyXG5cdFx0bGV0IHByb3BlcnkgPSBvYmpbaWRdO1xyXG5cdFx0aWYodHlwZW9mIHByb3BlcnkgPT09ICdvYmplY3QnICYmIHByb3BlcnkgIT09IG51bGwpe1xyXG5cdFx0XHRuZXdPYmpbaWRdID0gY2xvbmVPYmplY3QocHJvcGVyeSk7XHJcblx0XHR9XHJcblx0XHRpZihwcm9wZXJ5ICE9PSBudWxsKXtcclxuXHRcdFx0bmV3T2JqW2lkXSA9IHByb3Blcnk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiBuZXdPYmo7XHJcbn1cclxuZXhwb3J0cy5jbG9uZU9iamVjdCA9IGNsb25lT2JqZWN0O1xyXG5cclxuZnVuY3Rpb24gbWVtb3J5U2l6ZU9mKG9iaikge1xyXG4gICAgdmFyIGJ5dGVzID0gMDtcclxuXHJcbiAgICBmdW5jdGlvbiBzaXplT2Yob2JqKSB7XHJcbiAgICAgICAgaWYob2JqICE9PSBudWxsICYmIG9iaiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCh0eXBlb2Ygb2JqKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XHJcbiAgICAgICAgICAgICAgICBieXRlcyArPSA4O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3N0cmluZyc6XHJcbiAgICAgICAgICAgICAgICBieXRlcyArPSBvYmoubGVuZ3RoICogMjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdib29sZWFuJzpcclxuICAgICAgICAgICAgICAgIGJ5dGVzICs9IDQ7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnb2JqZWN0JzpcclxuICAgICAgICAgICAgICAgIHZhciBvYmpDbGFzcyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopLnNsaWNlKDgsIC0xKTtcclxuICAgICAgICAgICAgICAgIGlmKG9iakNsYXNzID09PSAnT2JqZWN0JyB8fCBvYmpDbGFzcyA9PT0gJ0FycmF5Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIga2V5IGluIG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZighb2JqLmhhc093blByb3BlcnR5KGtleSkpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaXplT2Yob2JqW2tleV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBieXRlcyArPSBvYmoudG9TdHJpbmcoKS5sZW5ndGggKiAyO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGJ5dGVzO1xyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBmb3JtYXRCeXRlU2l6ZShieXRlcykge1xyXG4gICAgICAgIGlmKGJ5dGVzIDwgMTAyNCkgcmV0dXJuIGJ5dGVzICsgXCIgYnl0ZXNcIjtcclxuICAgICAgICBlbHNlIGlmKGJ5dGVzIDwgMTA0ODU3NikgcmV0dXJuKGJ5dGVzIC8gMTAyNCkudG9GaXhlZCgzKSArIFwiIEtpQlwiO1xyXG4gICAgICAgIGVsc2UgaWYoYnl0ZXMgPCAxMDczNzQxODI0KSByZXR1cm4oYnl0ZXMgLyAxMDQ4NTc2KS50b0ZpeGVkKDMpICsgXCIgTWlCXCI7XHJcbiAgICAgICAgZWxzZSByZXR1cm4oYnl0ZXMgLyAxMDczNzQxODI0KS50b0ZpeGVkKDMpICsgXCIgR2lCXCI7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBmb3JtYXRCeXRlU2l6ZShzaXplT2Yob2JqKSk7XHJcbn07IC8vbWVtb3J5U2l6ZU9mIFxyXG5leHBvcnRzLm1lbW9yeVNpemVPZiA9IG1lbW9yeVNpemVPZjsiXSwic291cmNlUm9vdCI6IiJ9