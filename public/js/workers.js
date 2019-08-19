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

			let viewPoint = getViewPoint({
				point: collision.point, 
				edge:  !collision.collision,
				color: (collision.collision ? "green" : "yellow"),
				name: "P",
				origin: origin,
				camera: camera
			});
			listOfPoints.push(viewPoint);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50U291cmNlL2pzL2xpbmVPZlNpZ2h0Lndvcmtlci5qcyIsIndlYnBhY2s6Ly8vLi9zaGFyZWQvSGl0Ym94LmpzIiwid2VicGFjazovLy8uL3NoYXJlZC9VdGlsaXRpZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBLGtCQUFrQixtQkFBTyxDQUFDLHdEQUEyQjtBQUNyRCxlQUFlLG1CQUFPLENBQUMsa0RBQXdCOztBQUUvQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBLGVBQWUsMENBQTBDO0FBQ3pELEtBQUs7O0FBRUwsQ0FBQzs7Ozs7QUFLRDtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFD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QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxFQUFFO0FBQ0Ysb0MiLCJmaWxlIjoid29ya2Vycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vY2xpZW50U291cmNlL2pzL2xpbmVPZlNpZ2h0Lndvcmtlci5qc1wiKTtcbiIsImNvbnN0IFV0aWxpdGllcyA9IHJlcXVpcmUoJy4uLy4uL3NoYXJlZC9VdGlsaXRpZXMuanMnKTtcbmNvbnN0IEhpdGJveCA9IHJlcXVpcmUoJy4uLy4uL3NoYXJlZC9IaXRib3guanMnKTtcblxuY29uc29sZS5sb2coXCJXb3JrZXIgY3JlYXRlZFwiKTtcblxub25tZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpe1xuXHRsZXQgZGF0YSA9IGV2ZW50LmRhdGE7XG5cdC8vIGNvbnNvbGUubG9nKFwibWVzc2FnZSByZWNlaXZlZCBpbiB3b3JrZXI6XCIsIGV2ZW50LmRhdGEpO1xuXHQvLyBsZXQgdGVzdFJldHVybiA9IGV2ZW50LmRhdGEgKiAyO1xuXHQvLyBwb3N0TWVzc2FnZSh0ZXN0UmV0dXJuKTtcblx0bGV0IHBvaW50c1RvU2VuZCA9IGdldFBvaW50cyh7XG5cdFx0b2JqZWN0c0luUmFuZ2U6IGRhdGEub2JqZWN0c0luUmFuZ2UsXG5cdFx0b3JpZ2luOiAgICAgICAgIGRhdGEub3JpZ2luLFxuXHRcdHJlbmRlckRpc3RhbmNlOiBkYXRhLnJlbmRlckRpc3RhbmNlLFxuXHRcdGNhbWVyYTogICAgICAgICBkYXRhLmNhbWVyYVxuXHR9KTtcblx0Ly8gc2V0VGltZW91dCgoKT0+e1xuXHRcdHBvc3RNZXNzYWdlKHtwb2ludHM6IHBvaW50c1RvU2VuZCwgb2Zmc2V0OiBkYXRhLmNhbWVyYX0pO1xuXHQvLyB9LDUwMCk7XG5cdFxufS8vb24gbWVzc2FnZVxuXG5cblxuXG5mdW5jdGlvbiBnZXRQb2ludHMoe1xuXHRvYmplY3RzSW5SYW5nZT17fSxcblx0b3JpZ2luPW51bGwsXG5cdHJlbmRlckRpc3RhbmNlPTUwMCxcblx0Y2FtZXJhPW51bGxcbn0pe1xuXHRsZXQgbGlzdE9mUG9pbnRzID0gW107XG5cdGZvcih2YXIgaWQgaW4gb2JqZWN0c0luUmFuZ2Upe1xuXHRcdGxldCBvYmplY3QgPSBvYmplY3RzSW5SYW5nZVtpZF07XG5cdFx0bGV0IHBvaW50cyA9IEhpdGJveC5nZXRWaXN1YWxQb2ludHMoe1xuXHRcdFx0b2JqOiAgICAgICAgIG9iamVjdC5oaXRib3gsXG5cdFx0XHR2aWV3UG9pbnQ6ICAgb3JpZ2luLFxuXHRcdFx0Z2V0UG9pbnRzQWZ0ZXJFZGdlOiB0cnVlXG5cdFx0fSk7XG5cblx0XHRwb2ludHMuZm9yRWFjaChmdW5jdGlvbihwb2ludCl7XG5cblx0XHRcdGxldCBwb2ludFRvQ2hlY2sgPSBwb2ludDtcblx0XHRcdGlmKHBvaW50LmV4dGVuZCl7XG5cdFx0XHRcdHBvaW50VG9DaGVjayA9IFV0aWxpdGllcy5leHRlbmRFbmRQb2ludCh7XG5cdFx0XHRcdFx0c3RhcnRQb2ludDogb3JpZ2luLCBcblx0XHRcdFx0XHRlbmRQb2ludDogcG9pbnQsIFxuXHRcdFx0XHRcdGxlbmd0aDogcmVuZGVyRGlzdGFuY2Vcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGxldCBjb2xsaXNpb24gPSBnZXRDb2xsaXNpb24oe1xuXHRcdFx0XHRvYmplY3RzOiBvYmplY3RzSW5SYW5nZSwgXG5cdFx0XHRcdG9yaWdpbjogIG9yaWdpbiwgXG5cdFx0XHRcdHBvaW50OiAgIHBvaW50VG9DaGVja1xuXHRcdFx0fSk7XG5cblx0XHRcdGxldCB2aWV3UG9pbnQgPSBnZXRWaWV3UG9pbnQoe1xuXHRcdFx0XHRwb2ludDogY29sbGlzaW9uLnBvaW50LCBcblx0XHRcdFx0ZWRnZTogICFjb2xsaXNpb24uY29sbGlzaW9uLFxuXHRcdFx0XHRjb2xvcjogKGNvbGxpc2lvbi5jb2xsaXNpb24gPyBcImdyZWVuXCIgOiBcInllbGxvd1wiKSxcblx0XHRcdFx0bmFtZTogXCJQXCIsXG5cdFx0XHRcdG9yaWdpbjogb3JpZ2luLFxuXHRcdFx0XHRjYW1lcmE6IGNhbWVyYVxuXHRcdFx0fSk7XG5cdFx0XHRsaXN0T2ZQb2ludHMucHVzaCh2aWV3UG9pbnQpO1xuXG5cdFx0fSk7Ly9mb3IgZWFjaCBwb2ludCBpbiBvYmplY3Rcblx0fS8vZm9yIG9iamVjdHMgaW4gcmFuZ2Vcblx0cmV0dXJuIGxpc3RPZlBvaW50cztcbn0vL2dldCBQb2ludHNcblxuXG5cbmZ1bmN0aW9uIGdldENvbGxpc2lvbih7b2JqZWN0cywgb3JpZ2luLCBwb2ludCwgZGlzdGFuY2U9SW5maW5pdHl9KXtcblx0XHQvL2NoZWNrIGFsbCBvYmplY3RzIGluIHJhbmdlIGZvciBjb2xsaXNpb25cblx0XHRsZXQgY2xvc2VzdENvbGxpc2lvbiA9IGZhbHNlO1xuXHRcdGxldCBjbG9zZXN0U2VnbWVudCA9IG51bGw7XG5cdFx0bGV0IGNsb3Nlc3REaXN0ID0gSW5maW5pdHk7XG5cdFx0Ly9mb3Igb2JqZWN0IGdsb3dcblx0XHRsZXQgY2xvc2VzdE9iaiA9IG51bGw7XG5cdFx0Zm9yKHZhciBpZCBpbiBvYmplY3RzKXtcblx0XHRcdGxldCBvYmplY3QgPSBvYmplY3RzW2lkXTtcblx0XHRcdGxldCBjb2xsaXNpb24gPSBnZXRJbnRlcnNlY3Rpb24ob2JqZWN0LmhpdGJveCwge3gxOiBvcmlnaW4ueCwgIHkxOiBvcmlnaW4ueSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgICAgICAgICB4MjogcG9pbnQueCwgICB5MjogcG9pbnQueX0pO1xuXHRcdFx0aWYoY29sbGlzaW9uKXtcblx0XHRcdFx0bGV0IGRpc3QgPSBVdGlsaXRpZXMuZGlzdChjb2xsaXNpb24ucG9pbnQsIG9yaWdpbik7XG5cdFx0XHRcdGlmKGNsb3Nlc3REaXN0ID4gZGlzdCl7XG5cdFx0XHRcdFx0Y2xvc2VzdE9iaiA9IG9iamVjdDtcblx0XHRcdFx0XHRjbG9zZXN0RGlzdCA9IGRpc3Q7XG5cdFx0XHRcdFx0Y2xvc2VzdENvbGxpc2lvbiA9IGNvbGxpc2lvbi5wb2ludDtcblx0XHRcdFx0XHRjbG9zZXN0U2VnbWVudCA9IGNvbGxpc2lvbi5saW5lO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fS8vZm9yIG9iamVjdHMgaW4gcmFuZ2VcblxuXHRcdGlmKGNsb3Nlc3RDb2xsaXNpb24gJiYgY2xvc2VzdERpc3QgPCBkaXN0YW5jZSl7XG5cdFx0XHQvL21ha2UgcG9pbnRzIGF0IHRoZSBjb3JuZXJzIG9mIHRoZSBib3hcblx0XHRcdGxldCBwb2ludDEgPSB7eDogY2xvc2VzdFNlZ21lbnQueDEsIHk6IGNsb3Nlc3RTZWdtZW50LnkxfTtcblx0XHRcdGxldCBwb2ludDIgPSB7eDogY2xvc2VzdFNlZ21lbnQueDIsIHk6IGNsb3Nlc3RTZWdtZW50LnkyfTtcblx0XHRcdGxldCBhbmdsZUNvbGxpc2lvblRvUG9pbnQxID0gY2FsY3VsYXRlQW5nbGUoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvaW50MTogcG9pbnQxLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNlbnRlclBvaW50Om9yaWdpbn0pO1xuXHRcdFx0bGV0IGFuZ2xlQ29sbGlzaW9uVG9Qb2ludDIgPSBjYWxjdWxhdGVBbmdsZSh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG9pbnQxOiBwb2ludDIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCAgICBjZW50ZXJQb2ludDpvcmlnaW59KTtcblx0XHRcdGxldCBhbmdsZUNvbGxpc2lvbiA9IGNhbGN1bGF0ZUFuZ2xlKHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb2ludDE6IGNsb3Nlc3RDb2xsaXNpb24sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCAgICBjZW50ZXJQb2ludDpvcmlnaW59KTtcblxuXHRcdFx0bGV0IGN3UG9pbnQ7XG5cdFx0XHRsZXQgY2N3UG9pbnQ7XG5cdFx0XHRpZihhbmdsZUNvbGxpc2lvblRvUG9pbnQxID4gYW5nbGVDb2xsaXNpb25Ub1BvaW50Mil7XG5cdFx0XHRcdGN3UG9pbnQgID0gcG9pbnQxO1xuXHRcdFx0XHRjd1BvaW50LmFuZ2xlID0gYW5nbGVDb2xsaXNpb25Ub1BvaW50MTtcblx0XHRcdFx0Y2N3UG9pbnQgPSBwb2ludDI7XG5cdFx0XHRcdGNjd1BvaW50LmFuZ2xlID0gYW5nbGVDb2xsaXNpb25Ub1BvaW50Mjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGN3UG9pbnQgID0gcG9pbnQyO1xuXHRcdFx0XHRjd1BvaW50LmFuZ2xlID0gYW5nbGVDb2xsaXNpb25Ub1BvaW50Mjtcblx0XHRcdFx0Y2N3UG9pbnQgPSBwb2ludDE7XG5cdFx0XHRcdGNjd1BvaW50LmFuZ2xlID0gYW5nbGVDb2xsaXNpb25Ub1BvaW50MTtcblx0XHRcdH1cblxuXHRcdFx0Y2xvc2VzdENvbGxpc2lvbi5hbmdsZSA9IGFuZ2xlQ29sbGlzaW9uO1xuXG5cdFx0XHQvL21ha2Ugc3VyZSBib3ggZWRnZXMgYXJlIG5vdCBvdXQgb2YgcmFuZ2Vcblx0XHRcdC8vIGlmKGN3UG9pbnQuYW5nbGUgID49IGVuZFBvaW50QW5nbGUgfHwgY3dQb2ludC5hbmdsZSAgPD0gc3RhcnRQb2ludEFuZ2xlKXtcblx0XHRcdC8vIFx0Y3dQb2ludCA9IG51bGw7XG5cdFx0XHQvLyB9XG5cdFx0XHQvLyBpZihjY3dQb2ludC5hbmdsZSA+PSBlbmRQb2ludEFuZ2xlIHx8IGNjd1BvaW50LmFuZ2xlIDw9IHN0YXJ0UG9pbnRBbmdsZSl7XG5cdFx0XHQvLyBcdGNjd1BvaW50ID0gbnVsbDtcblx0XHRcdC8vIH1cblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0Y29sbGlzaW9uOiB0cnVlLFxuXHRcdFx0XHRwb2ludDogY2xvc2VzdENvbGxpc2lvbixcblx0XHRcdFx0ZGlzdDogY2xvc2VzdERpc3QsXG5cdFx0XHRcdGN3UG9pbnQ6IGN3UG9pbnQsXG5cdFx0XHRcdGNjd1BvaW50OiBjY3dQb2ludCxcblx0XHRcdFx0b2JqZWN0OiBjbG9zZXN0T2JqXG5cdFx0XHR9XG5cdFx0fS8vY2xvc2VzdCBDb2xsaXNpb25cblx0XHRlbHNlIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGNvbGxpc2lvbjogZmFsc2UsXG5cdFx0XHRcdHBvaW50OiBwb2ludFxuXHRcdFx0fVxuXHRcdH1cblx0fS8vZ2V0Q29sbGlzaW9uXG5cblx0ZnVuY3Rpb24gY2FsY3VsYXRlQW5nbGUoe3BvaW50MSwgcG9pbnQyPW51bGwsIGNlbnRlclBvaW50fSl7XG5cdFx0aWYocG9pbnQyPT1udWxsKSBwb2ludDIgPSB7eDogY2VudGVyUG9pbnQueCsxMCwgeTpjZW50ZXJQb2ludC55fTtcblx0XHRsZXQgcEFuZ2xlID0gVXRpbGl0aWVzLmNhbGN1bGF0ZUFuZ2xlKHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cG9pbnQxOiBwb2ludDEsIFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRwb2ludDI6IHBvaW50Mixcblx0XHRcdFx0XHRcdFx0XHRcdCAgICBjZW50ZXJQb2ludDpjZW50ZXJQb2ludH0pO1xuXHRcdC8vIGlmKHBBbmdsZSA8IDApIHBBbmdsZSA9IHBBbmdsZSArIE1hdGguUEkqMjtcblx0XHRpZihwQW5nbGUgPCAwKSBwQW5nbGUgPSBNYXRoLmFicyhwQW5nbGUpO1xuXHRcdC8vIGlmKHBBbmdsZSA+IE1hdGguUEkpIHBBbmdsZSA9IE1hdGguUEkgLSBwQW5nbGU7XG5cdFx0Ly8gaWYocEFuZ2xlID4gd2lkdGgpIHBBbmdsZSA9IE1hdGguUEkqMiAtIHBBbmdsZTtcblx0XHQvL0NvdWxkIGNhdXNlIGFuIGlzc3VlIHdoZW4gY29uZSBpcyB3aWRlciB0aGFuIFBJIGFrYSAxODAsIG1heWJlP1xuXHRcdHJldHVybiBwQW5nbGU7XG5cdH1cblxuXHRmdW5jdGlvbiBnZXRJbnRlcnNlY3Rpb24oY29ybmVycywgbGluZSl7XG5cdFx0Ly8gY29uc29sZS5sb2coXCJjb3JuZXJzOlwiLGNvcm5lcnMpO1xuXHRcdGxldCBib3hMaW5lVG9wICAgID0ge3gxOmNvcm5lcnMudG9wTGVmdC54LCAgICAgeTE6Y29ybmVycy50b3BMZWZ0LnksIFxuXHRcdFx0XHRcdFx0ICAgICB4Mjpjb3JuZXJzLnRvcFJpZ2h0LngsICAgIHkyOmNvcm5lcnMudG9wUmlnaHQueX07XG5cdFx0bGV0IGJveExpbmVSaWdodCAgPSB7eDE6Y29ybmVycy50b3BSaWdodC54LCAgICB5MTpjb3JuZXJzLnRvcFJpZ2h0LnksIFxuXHRcdFx0XHRcdFx0ICAgICB4Mjpjb3JuZXJzLmJvdHRvbVJpZ2h0LngsIHkyOmNvcm5lcnMuYm90dG9tUmlnaHQueX07XG5cdFx0bGV0IGJveExpbmVCb3R0b20gPSB7eDE6Y29ybmVycy5ib3R0b21SaWdodC54LCB5MTpjb3JuZXJzLmJvdHRvbVJpZ2h0LnksIFxuXHRcdFx0XHRcdFx0ICAgICB4Mjpjb3JuZXJzLmJvdHRvbUxlZnQueCwgIHkyOmNvcm5lcnMuYm90dG9tTGVmdC55fTtcblx0XHRsZXQgYm94TGluZUxlZnQgICA9IHt4MTpjb3JuZXJzLmJvdHRvbUxlZnQueCwgIHkxOmNvcm5lcnMuYm90dG9tTGVmdC55LCBcblx0XHRcdFx0XHRcdCAgICAgeDI6Y29ybmVycy50b3BMZWZ0LngsICAgICB5Mjpjb3JuZXJzLnRvcExlZnQueX07XG5cdFx0bGV0IGludGVyc2VjdGlvbiA9IGZhbHNlO1xuXHRcdGxldCBpbnRlcnNlY3RpbmdTZWdtZW50ID0gbnVsbDtcblx0XHRsZXQgY2xvc2VzdERpc3QgPSBJbmZpbml0eTtcblx0XHRsZXQgdG9wID0gSGl0Ym94LmNvbGxpZGVMaW5lTGluZShsaW5lLCBib3hMaW5lVG9wKTtcblx0XHRpZih0b3Ape1xuXHRcdFx0aW50ZXJzZWN0aW9uID0gdG9wO1xuXHRcdFx0aW50ZXJzZWN0aW5nU2VnbWVudCA9IGJveExpbmVUb3A7XG5cdFx0XHRjbG9zZXN0RGlzdCA9IFV0aWxpdGllcy5kaXN0KHRvcCwge3g6bGluZS54MSwgeTpsaW5lLnkxfSk7XG5cdFx0fVxuXHRcdGxldCByaWdodCA9IEhpdGJveC5jb2xsaWRlTGluZUxpbmUobGluZSwgYm94TGluZVJpZ2h0KTtcblx0XHRpZihyaWdodCl7XG5cdFx0XHRsZXQgZGlzdCA9IFV0aWxpdGllcy5kaXN0KHJpZ2h0LCB7eDpsaW5lLngxLCB5OmxpbmUueTF9KTtcblx0XHRcdGlmKGRpc3QgPCBjbG9zZXN0RGlzdCl7XG5cdFx0XHRcdGludGVyc2VjdGlvbiA9IHJpZ2h0O1xuXHRcdFx0XHRpbnRlcnNlY3RpbmdTZWdtZW50ID0gYm94TGluZVJpZ2h0O1xuXHRcdFx0XHRjbG9zZXN0RGlzdCA9IGRpc3Q7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGxldCBib3R0b20gPSBIaXRib3guY29sbGlkZUxpbmVMaW5lKGxpbmUsIGJveExpbmVCb3R0b20pO1xuXHRcdGlmKGJvdHRvbSl7XG5cdFx0XHRsZXQgZGlzdCA9IFV0aWxpdGllcy5kaXN0KGJvdHRvbSwge3g6bGluZS54MSwgeTpsaW5lLnkxfSk7XG5cdFx0XHRpZihkaXN0IDwgY2xvc2VzdERpc3Qpe1xuXHRcdFx0XHRpbnRlcnNlY3Rpb24gPSBib3R0b207XG5cdFx0XHRcdGludGVyc2VjdGluZ1NlZ21lbnQgPSBib3hMaW5lQm90dG9tO1xuXHRcdFx0XHRjbG9zZXN0RGlzdCA9IGRpc3Q7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGxldCBsZWZ0ID0gSGl0Ym94LmNvbGxpZGVMaW5lTGluZShsaW5lLCBib3hMaW5lTGVmdCk7XG5cdFx0aWYobGVmdCl7XG5cdFx0XHRsZXQgZGlzdCA9IFV0aWxpdGllcy5kaXN0KGxlZnQsIHt4OmxpbmUueDEsIHk6bGluZS55MX0pO1xuXHRcdFx0aWYoZGlzdCA8IGNsb3Nlc3REaXN0KXtcblx0XHRcdFx0aW50ZXJzZWN0aW9uID0gbGVmdDtcblx0XHRcdFx0aW50ZXJzZWN0aW5nU2VnbWVudCA9IGJveExpbmVMZWZ0O1xuXHRcdFx0XHRjbG9zZXN0RGlzdCA9IGRpc3Q7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB7cG9pbnQ6IGludGVyc2VjdGlvbiwgbGluZTogaW50ZXJzZWN0aW5nU2VnbWVudH07XG5cdH0vL2dldCBpbnRlcnNlY3Rpb25cblxuXHRmdW5jdGlvbiBnZXRWaWV3UG9pbnQoe3BvaW50LCBlZGdlPWZhbHNlLCBjb2xvcj1cInllbGxvd1wiLCBuYW1lPVwiTm8gTmFtZVwiLCBvcmlnaW4sIGNhbWVyYX0pe1xuXHRcdGxldCBwQW5nbGUgPSBjYWxjdWxhdGVBbmdsZSh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHBvaW50MTogcG9pbnQsXG5cdFx0XHRcdFx0XHRcdFx0XHQgICAgY2VudGVyUG9pbnQ6b3JpZ2lufSk7XG5cdFx0Ly90cmFuc2xhdGUgdG8gcG9pbnQgZm9yIGRpc3BsYXlcblx0XHRsZXQgdmlld1BvaW50ID0gdHJhbnNsYXRlQ2FtZXJhKHtjYW1lcmE6IGNhbWVyYSwgcG9pbnQ6IHBvaW50fSk7XG5cdFx0Ly8gdmlld1BvaW50ID0ge3g6IHBvaW50LngsIHk6IHBvaW50Lnl9O1xuXHRcdHZpZXdQb2ludC5lZGdlID0gZWRnZTtcblx0XHR2aWV3UG9pbnQuY29sb3IgPSBjb2xvcjtcblx0XHR2aWV3UG9pbnQuYW5nbGUgPSBwQW5nbGU7XG5cdFx0dmlld1BvaW50Lm5hbWUgPSBuYW1lO1xuXHRcdHZpZXdQb2ludC5jb3VudCA9IHRoaXMub3JkZXJQb2ludHNDcmVhdGVkO1xuXHRcdHRoaXMub3JkZXJQb2ludHNDcmVhdGVkKys7XG5cdFx0cmV0dXJuIHZpZXdQb2ludDtcblx0fVxuXG5cdGZ1bmN0aW9uIHRyYW5zbGF0ZUNhbWVyYSh7Y2FtZXJhLCBwb2ludH0pe1xuXHRcdGxldCBvcmdpZ2luWCA9IGNhbWVyYS54IC0gKGNhbWVyYS53aWR0aC8yKTtcblx0XHRsZXQgb3JnaWdpblkgPSBjYW1lcmEueSAtIChjYW1lcmEuaGVpZ2h0LzIpO1xuXHRcdGxldCB0eCA9IE1hdGgucm91bmQocG9pbnQueCAtIG9yZ2lnaW5YKTtcblx0XHRsZXQgdHkgPSBNYXRoLnJvdW5kKHBvaW50LnkgLSBvcmdpZ2luWSk7XG5cdFx0cmV0dXJuIHt4OnR4LCB5OnR5fTtcblx0fSIsInZhciBVdGlsaXRpZXMgPSByZXF1aXJlKCcuLi9zaGFyZWQvVXRpbGl0aWVzLmpzJyk7XG5cbmV4cG9ydHMuY3JlYXRlID0gKHtcblx0aWQ9MCxcblx0eD0wLFxuXHR5PTAsXG5cdHdpZHRoPTUwLFxuXHRoZWlnaHQ9NTAsXG5cdGFuZ2xlPTBcbn0pPT57XG5cdGxldCB0b3AgICAgPSB5IC0gKGhlaWdodC8yKTtcblx0bGV0IGJvdHRvbSA9IHkgKyAoaGVpZ2h0LzIpO1xuXHRsZXQgbGVmdCAgID0geCAtICh3aWR0aC8yKTtcblx0bGV0IHJpZ2h0ICA9IHggKyAod2lkdGgvMilcblx0cmV0dXJuIHtcblx0XHRpZDogaWQsXG5cdFx0eDogIHgsXG5cdFx0eTogIHksXG5cdFx0d2lkdGg6IHdpZHRoLFxuXHRcdGhlaWdodDpoZWlnaHQsXG5cdFx0YW5nbGU6IGFuZ2xlLFxuXHRcdHRvcDogICAgdG9wLFxuXHRcdGJvdHRvbTogYm90dG9tLFxuXHRcdGxlZnQ6ICAgbGVmdCxcblx0XHRyaWdodDogIHJpZ2h0LFxuXHRcdHRvcExlZnQ6ICAgICB7eDogbGVmdCwgeTogdG9wfSxcblx0XHR0b3BSaWdodDogICAge3g6IHJpZ2h0LCB5OiB0b3B9LFxuXHRcdGJvdHRvbUxlZnQ6ICB7eDogbGVmdCwgeTogYm90dG9tfSxcblx0XHRib3R0b21SaWdodDoge3g6IHJpZ2h0LCB5OiBib3R0b219LFxuXHRcdHBvaW50czogICAgICBbe3g6IGxlZnQsIHk6IHRvcH0sIHt4OiByaWdodCwgeTogdG9wfSwge3g6IGxlZnQsIHk6IGJvdHRvbX0sIHt4OiByaWdodCwgeTogYm90dG9tfV1cblx0fVxufSAvL2NyZWF0ZVxuXG5mdW5jdGlvbiBtb3ZlVG8ob2JqLCB4LCB5KXtcblx0b2JqLmhpdGJveC54ID0geDtcblx0b2JqLmhpdGJveC55ID0geTtcblx0dXBkYXRlKG9iaik7XG59XG5leHBvcnRzLm1vdmVUbyA9IG1vdmVUbztcblxuZnVuY3Rpb24gdXBkYXRlKG9iail7XG5cdGxldCBoaXRib3ggPSBvYmouaGl0Ym94O1xuXHRsZXQgdG9wICAgID0gaGl0Ym94LnkgLSAoaGl0Ym94LmhlaWdodC8yKTtcblx0bGV0IGJvdHRvbSA9IGhpdGJveC55ICsgKGhpdGJveC5oZWlnaHQvMik7XG5cdGxldCBsZWZ0ICAgPSBoaXRib3gueCAtIChoaXRib3gud2lkdGgvMik7XG5cdGxldCByaWdodCAgPSBoaXRib3gueCArIChoaXRib3gud2lkdGgvMik7XG5cblx0aGl0Ym94LnRvcCAgICA9IHRvcDtcblx0aGl0Ym94LmJvdHRvbSA9IGJvdHRvbTtcblx0aGl0Ym94LmxlZnQgICA9IGxlZnQ7XG5cdGhpdGJveC5yaWdodCAgPSByaWdodDtcblx0aGl0Ym94LnRvcExlZnQgICAgID0ge3g6IGxlZnQsIHk6IHRvcH07XG5cdGhpdGJveC50b3BSaWdodCAgICA9IHt4OiByaWdodCwgeTogdG9wfTtcblx0aGl0Ym94LmJvdHRvbUxlZnQgID0ge3g6IGxlZnQsIHk6IGJvdHRvbX07XG5cdGhpdGJveC5ib3R0b21SaWdodCA9IHt4OiByaWdodCwgeTogYm90dG9tfTtcblx0Ly8gaGl0Ym94LnBvaW50cyAgICAgID0gW2hpdGJveC50b3BMZWZ0LCBoaXRib3gudG9wUmlnaHQsIGhpdGJveC5ib3R0b21MZWZ0LCBoaXRib3guYm90dG9tUmlnaHRdO1xufVxuXG5mdW5jdGlvbiBnZXRWaXN1YWxQb2ludHMoe29iaiwgdmlld1BvaW50LCBnZXRQb2ludHNBZnRlckVkZ2U9ZmFsc2V9KXtcblxuXHRsZXQgcmV0dXJuUG9pbnRzID0gW107XG5cdGlmKHZpZXdQb2ludC55IDwgb2JqLnRvcCl7ICAgICAgICAgICAgICAvL05XLCBOLCBORVxuXHRcdGlmKHZpZXdQb2ludC54IDwgb2JqLmxlZnQpeyAgICAgICAgIC8vTldcblx0XHRcdHJldHVyblBvaW50cyA9IFtvYmoudG9wTGVmdCwgb2JqLnRvcFJpZ2h0LCBvYmouYm90dG9tTGVmdF07XG5cdFx0XHRsZXQgcFJvdGF0ZWRDVyA9IFV0aWxpdGllcy5yb3RhdGVQb2ludCh7XG5cdFx0XHRcdGNlbnRlcjogdmlld1BvaW50LFxuXHRcdFx0XHRwb2ludDogb2JqLmJvdHRvbUxlZnQsXG5cdFx0XHRcdGFuZ2xlOiAwLjAxfSk7XG5cdFx0XHRwUm90YXRlZENXLmV4dGVuZCA9IHRydWU7XG5cdFx0XHRyZXR1cm5Qb2ludHMucHVzaChwUm90YXRlZENXKTtcblx0XHRcdGxldCBwUm90YXRlZENDVyA9IFV0aWxpdGllcy5yb3RhdGVQb2ludCh7XG5cdFx0XHRcdGNlbnRlcjogdmlld1BvaW50LFxuXHRcdFx0XHRwb2ludDogb2JqLnRvcFJpZ2h0LFxuXHRcdFx0XHRhbmdsZTogLTAuMDF9KTtcblx0XHRcdHBSb3RhdGVkQ0NXLmV4dGVuZCA9IHRydWU7XG5cdFx0XHRyZXR1cm5Qb2ludHMucHVzaChwUm90YXRlZENDVyk7XG5cdFx0fSBlbHNlIGlmKHZpZXdQb2ludC54ID4gb2JqLnJpZ2h0KXsgLy9ORVxuXHRcdFx0cmV0dXJuUG9pbnRzID0gW29iai50b3BMZWZ0LCBvYmoudG9wUmlnaHQsIG9iai5ib3R0b21SaWdodF07XG5cdFx0XHRsZXQgcFJvdGF0ZWRDVyA9IFV0aWxpdGllcy5yb3RhdGVQb2ludCh7XG5cdFx0XHRcdGNlbnRlcjogdmlld1BvaW50LFxuXHRcdFx0XHRwb2ludDogb2JqLnRvcExlZnQsXG5cdFx0XHRcdGFuZ2xlOiAwLjAxfSk7XG5cdFx0XHRwUm90YXRlZENXLmV4dGVuZCA9IHRydWU7XG5cdFx0XHRyZXR1cm5Qb2ludHMucHVzaChwUm90YXRlZENXKTtcblx0XHRcdGxldCBwUm90YXRlZENDVyA9IFV0aWxpdGllcy5yb3RhdGVQb2ludCh7XG5cdFx0XHRcdGNlbnRlcjogdmlld1BvaW50LFxuXHRcdFx0XHRwb2ludDogb2JqLmJvdHRvbVJpZ2h0LFxuXHRcdFx0XHRhbmdsZTogLTAuMDF9KTtcblx0XHRcdHBSb3RhdGVkQ0NXLmV4dGVuZCA9IHRydWU7XG5cdFx0XHRyZXR1cm5Qb2ludHMucHVzaChwUm90YXRlZENDVyk7XG5cdFx0fSBlbHNlIHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9OXG5cdFx0XHRyZXR1cm5Qb2ludHMgPSBbb2JqLnRvcExlZnQsIG9iai50b3BSaWdodF07XG5cdFx0XHRsZXQgcFJvdGF0ZWRDVyA9IFV0aWxpdGllcy5yb3RhdGVQb2ludCh7XG5cdFx0XHRcdGNlbnRlcjogdmlld1BvaW50LFxuXHRcdFx0XHRwb2ludDogb2JqLnRvcExlZnQsXG5cdFx0XHRcdGFuZ2xlOiAwLjAxfSk7XG5cdFx0XHRwUm90YXRlZENXLmV4dGVuZCA9IHRydWU7XG5cdFx0XHRyZXR1cm5Qb2ludHMucHVzaChwUm90YXRlZENXKTtcblx0XHRcdGxldCBwUm90YXRlZENDVyA9IFV0aWxpdGllcy5yb3RhdGVQb2ludCh7XG5cdFx0XHRcdGNlbnRlcjogdmlld1BvaW50LFxuXHRcdFx0XHRwb2ludDogb2JqLnRvcFJpZ2h0LFxuXHRcdFx0XHRhbmdsZTogLTAuMDF9KTtcblx0XHRcdHBSb3RhdGVkQ0NXLmV4dGVuZCA9IHRydWU7XG5cdFx0XHRyZXR1cm5Qb2ludHMucHVzaChwUm90YXRlZENDVyk7XG5cdFx0fVxuXG5cdH0gZWxzZSBpZih2aWV3UG9pbnQueSA+IG9iai5ib3R0b20peyAgICAvL1NXLCBTLCBTRVxuXHRcdGlmKHZpZXdQb2ludC54IDwgb2JqLmxlZnQpeyAgICAgICAgIC8vU1dcblx0XHRcdHJldHVyblBvaW50cyA9IFtvYmoudG9wTGVmdCwgb2JqLmJvdHRvbUxlZnQsIG9iai5ib3R0b21SaWdodF07XG5cdFx0XHRsZXQgcFJvdGF0ZWRDVyA9IFV0aWxpdGllcy5yb3RhdGVQb2ludCh7XG5cdFx0XHRcdGNlbnRlcjogdmlld1BvaW50LFxuXHRcdFx0XHRwb2ludDogb2JqLmJvdHRvbVJpZ2h0LFxuXHRcdFx0XHRhbmdsZTogMC4wMX0pO1xuXHRcdFx0cFJvdGF0ZWRDVy5leHRlbmQgPSB0cnVlO1xuXHRcdFx0cmV0dXJuUG9pbnRzLnB1c2gocFJvdGF0ZWRDVyk7XG5cdFx0XHRsZXQgcFJvdGF0ZWRDQ1cgPSBVdGlsaXRpZXMucm90YXRlUG9pbnQoe1xuXHRcdFx0XHRjZW50ZXI6IHZpZXdQb2ludCxcblx0XHRcdFx0cG9pbnQ6IG9iai50b3BMZWZ0LFxuXHRcdFx0XHRhbmdsZTogLTAuMDF9KTtcblx0XHRcdHBSb3RhdGVkQ0NXLmV4dGVuZCA9IHRydWU7XG5cdFx0XHRyZXR1cm5Qb2ludHMucHVzaChwUm90YXRlZENDVyk7XG5cdFx0fSBlbHNlIGlmKHZpZXdQb2ludC54ID4gb2JqLnJpZ2h0KXsgLy9TRVxuXHRcdFx0cmV0dXJuUG9pbnRzID0gW29iai50b3BSaWdodCwgb2JqLmJvdHRvbUxlZnQsIG9iai5ib3R0b21SaWdodF07XG5cdFx0XHRsZXQgcFJvdGF0ZWRDVyA9IFV0aWxpdGllcy5yb3RhdGVQb2ludCh7XG5cdFx0XHRcdGNlbnRlcjogdmlld1BvaW50LFxuXHRcdFx0XHRwb2ludDogb2JqLnRvcFJpZ2h0LFxuXHRcdFx0XHRhbmdsZTogMC4wMX0pO1xuXHRcdFx0cFJvdGF0ZWRDVy5leHRlbmQgPSB0cnVlO1xuXHRcdFx0cmV0dXJuUG9pbnRzLnB1c2gocFJvdGF0ZWRDVyk7XG5cdFx0XHRsZXQgcFJvdGF0ZWRDQ1cgPSBVdGlsaXRpZXMucm90YXRlUG9pbnQoe1xuXHRcdFx0XHRjZW50ZXI6IHZpZXdQb2ludCxcblx0XHRcdFx0cG9pbnQ6IG9iai5ib3R0b21MZWZ0LFxuXHRcdFx0XHRhbmdsZTogLTAuMDF9KTtcblx0XHRcdHBSb3RhdGVkQ0NXLmV4dGVuZCA9IHRydWU7XG5cdFx0XHRyZXR1cm5Qb2ludHMucHVzaChwUm90YXRlZENDVyk7XG5cdFx0fSBlbHNlIHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9TXG5cdFx0XHRyZXR1cm5Qb2ludHMgPSBbb2JqLmJvdHRvbUxlZnQsIG9iai5ib3R0b21SaWdodF07XG5cdFx0XHRsZXQgcFJvdGF0ZWRDVyA9IFV0aWxpdGllcy5yb3RhdGVQb2ludCh7XG5cdFx0XHRcdGNlbnRlcjogdmlld1BvaW50LFxuXHRcdFx0XHRwb2ludDogb2JqLmJvdHRvbVJpZ2h0LFxuXHRcdFx0XHRhbmdsZTogMC4wMX0pO1xuXHRcdFx0cFJvdGF0ZWRDVy5leHRlbmQgPSB0cnVlO1xuXHRcdFx0cmV0dXJuUG9pbnRzLnB1c2gocFJvdGF0ZWRDVyk7XG5cdFx0XHRsZXQgcFJvdGF0ZWRDQ1cgPSBVdGlsaXRpZXMucm90YXRlUG9pbnQoe1xuXHRcdFx0XHRjZW50ZXI6IHZpZXdQb2ludCxcblx0XHRcdFx0cG9pbnQ6IG9iai5ib3R0b21MZWZ0LFxuXHRcdFx0XHRhbmdsZTogLTAuMDF9KTtcblx0XHRcdHBSb3RhdGVkQ0NXLmV4dGVuZCA9IHRydWU7XG5cdFx0XHRyZXR1cm5Qb2ludHMucHVzaChwUm90YXRlZENDVyk7XG5cdFx0fVxuXG5cdH0gZWxzZSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0Ugb3IgV1xuXHRcdGlmKHZpZXdQb2ludC54IDwgb2JqLmxlZnQpeyAgICAgICAgIC8vV1xuXHRcdFx0cmV0dXJuUG9pbnRzID0gW29iai50b3BMZWZ0LCBvYmouYm90dG9tTGVmdF07XG5cdFx0XHRsZXQgcFJvdGF0ZWRDVyA9IFV0aWxpdGllcy5yb3RhdGVQb2ludCh7XG5cdFx0XHRcdGNlbnRlcjogdmlld1BvaW50LFxuXHRcdFx0XHRwb2ludDogb2JqLmJvdHRvbUxlZnQsXG5cdFx0XHRcdGFuZ2xlOiAwLjAxfSk7XG5cdFx0XHRwUm90YXRlZENXLmV4dGVuZCA9IHRydWU7XG5cdFx0XHRyZXR1cm5Qb2ludHMucHVzaChwUm90YXRlZENXKTtcblx0XHRcdGxldCBwUm90YXRlZENDVyA9IFV0aWxpdGllcy5yb3RhdGVQb2ludCh7XG5cdFx0XHRcdGNlbnRlcjogdmlld1BvaW50LFxuXHRcdFx0XHRwb2ludDogb2JqLnRvcExlZnQsXG5cdFx0XHRcdGFuZ2xlOiAtMC4wMX0pO1xuXHRcdFx0cFJvdGF0ZWRDQ1cuZXh0ZW5kID0gdHJ1ZTtcblx0XHRcdHJldHVyblBvaW50cy5wdXNoKHBSb3RhdGVkQ0NXKTtcblx0XHR9IGVsc2UgaWYodmlld1BvaW50LnggPiBvYmoucmlnaHQpeyAvL0Vcblx0XHRcdHJldHVyblBvaW50cyA9IFtvYmoudG9wUmlnaHQsIG9iai5ib3R0b21SaWdodF07XG5cdFx0XHRsZXQgcFJvdGF0ZWRDVyA9IFV0aWxpdGllcy5yb3RhdGVQb2ludCh7XG5cdFx0XHRcdGNlbnRlcjogdmlld1BvaW50LFxuXHRcdFx0XHRwb2ludDogb2JqLnRvcFJpZ2h0LFxuXHRcdFx0XHRhbmdsZTogMC4wMX0pO1xuXHRcdFx0cFJvdGF0ZWRDVy5leHRlbmQgPSB0cnVlO1xuXHRcdFx0cmV0dXJuUG9pbnRzLnB1c2gocFJvdGF0ZWRDVyk7XG5cdFx0XHRsZXQgcFJvdGF0ZWRDQ1cgPSBVdGlsaXRpZXMucm90YXRlUG9pbnQoe1xuXHRcdFx0XHRjZW50ZXI6IHZpZXdQb2ludCxcblx0XHRcdFx0cG9pbnQ6IG9iai5ib3R0b21SaWdodCxcblx0XHRcdFx0YW5nbGU6IC0wLjAxfSk7XG5cdFx0XHRwUm90YXRlZENDVy5leHRlbmQgPSB0cnVlO1xuXHRcdFx0cmV0dXJuUG9pbnRzLnB1c2gocFJvdGF0ZWRDQ1cpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBjb25zb2xlLmxvZyhcIkNhdGNoIGluIGdldFZpc3VhbFBvaW50cywgcG9zc2libHkgdmlld1BvaW50IGlzIGluc2lkZSB0aGUgYm94XCIpO1xuXHRcdH1cblx0fVxuXG5cdC8vIGlmKHJldHVyblBvaW50cy5sZW5ndGggPCA0IHx8IHJldHVyblBvaW50cy5sZW5ndGggPiA1KSBjb25zb2xlLmxvZyhcIldyb25nIGFtb3VudCBvZiBwb2ludHM6XCIsIHJldHVyblBvaW50cy5sZW5ndGgpO1xuXG5cdHJldHVybiByZXR1cm5Qb2ludHM7XG5cbn1cbmV4cG9ydHMuZ2V0VmlzdWFsUG9pbnRzID0gZ2V0VmlzdWFsUG9pbnRzO1xuXG5mdW5jdGlvbiBjb2xsaWRpbmcob2JqMSwgb2JqMikge1xuXHQvL2RvZXNudCB0YWtlIGFuZ2xlIGludG8gYWNjb3VudCB5ZXQuXG5cdGxldCBoaXRib3gxID0gb2JqMS5oaXRib3g7XG5cdGxldCBoaXRib3gyID0gb2JqMi5oaXRib3g7XG5cblx0bGV0IHJvdWdoQ29sbGlkaW5nID0gZmFsc2U7XG5cdC8vIGNvbnNvbGUubG9nKFwiSW4gY29sbGlkaW5nOlwiLCBoaXRib3gxLCBoaXRib3gyKTtcblx0aWYoaGl0Ym94MS50b3AgPiBoaXRib3gyLmJvdHRvbSB8fFxuXHQgICBoaXRib3gxLmJvdHRvbSA8IGhpdGJveDIudG9wIHx8XG5cdCAgIGhpdGJveDEucmlnaHQgPCBoaXRib3gyLmxlZnQgfHxcblx0ICAgaGl0Ym94MS5sZWZ0ID4gaGl0Ym94Mi5yaWdodCkge1xuXHRcdHJvdWdoQ29sbGlkaW5nID0gZmFsc2U7XG5cdH0gZWxzZSByb3VnaENvbGxpZGluZyA9IHRydWU7XG5cblx0Ly8gaWYocm91Z2hDb2xsaWRpbmcpe1xuXHQvLyBcdC8vVE9ETyBtYWtlIG1vcmUgZ3JhbnVsYXIgY29sbGlkaW5nIHdpdGggY29sbGlzaW9uIHBvaW50cyBhbmQgc3VjaFxuXHQvLyB9XG5cdFxuXHRyZXR1cm4gcm91Z2hDb2xsaWRpbmc7XG59IC8vY29sbGlkaW5nXG5leHBvcnRzLmNvbGxpZGluZyA9IGNvbGxpZGluZztcblxuZnVuY3Rpb24gY29sbGlkZUxpbmVMaW5lKGxpbmUxLCBsaW5lMikge1xuXG5cdC8vIGNhbGN1bGF0ZSB0aGUgZGlzdGFuY2UgdG8gaW50ZXJzZWN0aW9uIHBvaW50XG5cdHZhciB1QSA9ICgobGluZTIueDItbGluZTIueDEpKihsaW5lMS55MS1saW5lMi55MSkgLSBcblx0XHRcdCAobGluZTIueTItbGluZTIueTEpKihsaW5lMS54MS1saW5lMi54MSkpIC8gXG5cdFx0XHQgKChsaW5lMi55Mi1saW5lMi55MSkqKGxpbmUxLngyLWxpbmUxLngxKSAtIFxuXHRcdFx0IChsaW5lMi54Mi1saW5lMi54MSkqKGxpbmUxLnkyLWxpbmUxLnkxKSk7XG5cdHZhciB1QiA9ICgobGluZTEueDItbGluZTEueDEpKihsaW5lMS55MS1saW5lMi55MSkgLSBcblx0XHRcdCAobGluZTEueTItbGluZTEueTEpKihsaW5lMS54MS1saW5lMi54MSkpIC8gXG5cdFx0XHQgKChsaW5lMi55Mi1saW5lMi55MSkqKGxpbmUxLngyLWxpbmUxLngxKSAtIFxuXHRcdFx0IChsaW5lMi54Mi1saW5lMi54MSkqKGxpbmUxLnkyLWxpbmUxLnkxKSk7XG5cblx0Ly8gaWYgdUEgYW5kIHVCIGFyZSBiZXR3ZWVuIDAtMSwgbGluZXMgYXJlIGNvbGxpZGluZ1xuXHRpZiAodUEgPj0gMCAmJiB1QSA8PSAxICYmIHVCID49IDAgJiYgdUIgPD0gMSkge1xuXG5cdCAgdmFyIGludGVyc2VjdGlvblggPSBsaW5lMS54MSArICh1QSAqIChsaW5lMS54Mi1saW5lMS54MSkpO1xuXHQgIHZhciBpbnRlcnNlY3Rpb25ZID0gbGluZTEueTEgKyAodUEgKiAobGluZTEueTItbGluZTEueTEpKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgXCJ4XCI6aW50ZXJzZWN0aW9uWCxcbiAgICAgICAgXCJ5XCI6aW50ZXJzZWN0aW9uWVxuICAgICAgfTtcblx0fVxuXHRyZXR1cm4gZmFsc2U7XG59XG5leHBvcnRzLmNvbGxpZGVMaW5lTGluZSA9IGNvbGxpZGVMaW5lTGluZTtcblxuZnVuY3Rpb24gY29sbGlkZUxpbmVSZWN0KGxpbmUsIHJlYykgey8veDEsIHkxLCB4MiwgeTIsICAgcngsIHJ5LCBydywgcmhcblxuICAvL2NoZWNrIGlmIHRoZSBsaW5lIGhhcyBoaXQgYW55IG9mIHRoZSByZWN0YW5nbGUncyBzaWRlcy4gdXNlcyB0aGUgY29sbGlkZUxpbmVMaW5lIGZ1bmN0aW9uIGFib3ZlXG5cblx0bGV0IGxlZnQgPSAgIHRoaXMuY29sbGlkZUxpbmVMaW5lKHgxLHkxLHgyLHkyLCByeCxyeSxyeCwgcnkrcmgpO1xuXHRsZXQgcmlnaHQgPSAgdGhpcy5jb2xsaWRlTGluZUxpbmUoeDEseTEseDIseTIsIHJ4K3J3LHJ5LCByeCtydyxyeStyaCk7XG5cdGxldCB0b3AgPSAgICB0aGlzLmNvbGxpZGVMaW5lTGluZSh4MSx5MSx4Mix5MiwgcngscnksIHJ4K3J3LHJ5KTtcblx0bGV0IGJvdHRvbSA9IHRoaXMuY29sbGlkZUxpbmVMaW5lKHgxLHkxLHgyLHkyLCByeCxyeStyaCwgcngrcncscnkrcmgpO1xuXHRsZXQgaW50ZXJzZWN0aW9uID0ge1xuXHRcdFwibGVmdFwiIDogbGVmdCxcblx0XHRcInJpZ2h0XCIgOiByaWdodCxcblx0XHRcInRvcFwiIDogdG9wLFxuXHRcdFwiYm90dG9tXCIgOiBib3R0b21cblx0fVxuXG4gIC8vaWYgQU5ZIG9mIHRoZSBhYm92ZSBhcmUgdHJ1ZSwgdGhlIGxpbmUgaGFzIGhpdCB0aGUgcmVjdGFuZ2xlXG4gIGlmIChsZWZ0IHx8IHJpZ2h0IHx8IHRvcCB8fCBib3R0b20pIHtcbiAgICAgIHJldHVybiBpbnRlcnNlY3Rpb247XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuZXhwb3J0cy5jb2xsaWRlTGluZVJlY3QgPSBjb2xsaWRlTGluZVJlY3Q7IiwiZXhwb3J0cy5lcnJvciA9IChzdHJpbmcpPT57XG5cdG5ldyBFcnJvcihzdHJpbmcpO1xufVxuXG5mdW5jdGlvbiByYW5kb21Db2xvcigpe1xuXHRyZXR1cm4ge1xuXHRcdHI6IE1hdGguZmxvb3IoMjU1Kk1hdGgucmFuZG9tKCkpLFxuXHRcdGc6IE1hdGguZmxvb3IoMjU1Kk1hdGgucmFuZG9tKCkpLFxuXHRcdGI6IE1hdGguZmxvb3IoMjU1Kk1hdGgucmFuZG9tKCkpXG5cdH1cbn1cbmV4cG9ydHMucmFuZG9tQ29sb3IgPSByYW5kb21Db2xvcjtcblxuZXhwb3J0cy5taWRQb2ludCA9IChwb2ludDEsIHBvaW50Mik9PntcbiAgICBsZXQgbWlkZGxlWCA9IHBvaW50Mi54IC0gKChwb2ludDIueC1wb2ludDIueCkvMik7XG4gICAgbGV0IG1pZGRsZVkgPSBwb2ludDIueSAtICgocG9pbnQyLnktcG9pbnQxLnkpLzIpO1xuICAgcmV0dXJuIHt4OiBtaWRkbGVYLCB5OiBtaWRkbGVZfTtcbn1cblxuZXhwb3J0cy5yb3RhdGVQb2ludCA9ICh7Y2VudGVyPXt4OjAsIHk6MH0sIHBvaW50PXt4OjAsIHk6MH0sIGFuZ2xlPTB9KT0+e1xuICAgICAgICBsZXQgcyA9IE1hdGguc2luKGFuZ2xlKTtcbiAgICAgICAgbGV0IGMgPSBNYXRoLmNvcyhhbmdsZSk7XG5cbiAgICAgICAgLy9tYWtlIGNvcHlcbiAgICAgICAgbGV0IG5ld1BvaW50ID0ge3g6IHBvaW50LngsIHk6IHBvaW50Lnl9OyBcblxuICAgICAgICAvLyB0cmFuc2xhdGUgcG9pbnQgYmFjayB0byBvcmlnaW46XG4gICAgICAgIG5ld1BvaW50LnggLT0gY2VudGVyLng7XG4gICAgICAgIG5ld1BvaW50LnkgLT0gY2VudGVyLnk7XG5cbiAgICAgICAgLy8gcm90YXRlIHBvaW50XG4gICAgICAgIGxldCB4bmV3ID0gbmV3UG9pbnQueCAqIGMgLSBuZXdQb2ludC55ICogcztcbiAgICAgICAgbGV0IHluZXcgPSBuZXdQb2ludC54ICogcyArIG5ld1BvaW50LnkgKiBjO1xuXG4gICAgICAgIC8vIHRyYW5zbGF0ZSBwb2ludCBiYWNrOlxuICAgICAgICBuZXdQb2ludC54ID0geG5ldyArIGNlbnRlci54O1xuICAgICAgICBuZXdQb2ludC55ID0geW5ldyArIGNlbnRlci55O1xuICAgICAgICByZXR1cm4gbmV3UG9pbnQ7XG4gICAgfVxuXG5leHBvcnRzLmV4dGVuZEVuZFBvaW50ID0gKHtzdGFydFBvaW50LCBlbmRQb2ludCwgbGVuZ3RofSk9PntcbiAgICBsZXQgY3VycmVudGxlbmd0aCA9IE1hdGguc3FydChcbiAgICAgICAgTWF0aC5wb3coc3RhcnRQb2ludC54IC0gZW5kUG9pbnQueCwgMi4wKSArIFxuICAgICAgICBNYXRoLnBvdyhzdGFydFBvaW50LnkgLSBlbmRQb2ludC55LCAyLjApXG4gICAgICAgICk7XG4gICAgbGV0IGFtb3VudCA9IGxlbmd0aCAtIGN1cnJlbnRsZW5ndGg7XG4gICAgbGV0IG5ld0VuZFBvaW50ID0ge1xuICAgICAgICB4OiBlbmRQb2ludC54ICsgKChlbmRQb2ludC54IC0gc3RhcnRQb2ludC54KSAvIGN1cnJlbnRsZW5ndGggKiBhbW91bnQpLFxuICAgICAgICB5OiBlbmRQb2ludC55ICsgKChlbmRQb2ludC55IC0gc3RhcnRQb2ludC55KSAvIGN1cnJlbnRsZW5ndGggKiBhbW91bnQpXG4gICAgfTtcbiAgICByZXR1cm4gbmV3RW5kUG9pbnQ7XG59XG5cbmZ1bmN0aW9uIGRpc3QocG9pbnQxLCBwb2ludDIpe1xuICAgIGxldCBkaWZmWCA9IE1hdGguYWJzKHBvaW50MS54IC0gcG9pbnQyLngpO1xuICAgIGxldCBkaWZmWSA9IE1hdGguYWJzKHBvaW50MS55IC0gcG9pbnQyLnkpO1xuICAgIGxldCBkaXN0YW5jZSA9IE1hdGguc3FydCgoTWF0aC5wb3coZGlmZlgsIDIpICsgTWF0aC5wb3coZGlmZlksMikpLCAyKTtcbiAgICByZXR1cm4gZGlzdGFuY2U7XG59XG5leHBvcnRzLmRpc3QgPSBkaXN0O1xuXG5leHBvcnRzLmNhbGN1bGF0ZUFuZ2xlID0gKHtwb2ludDEsIHBvaW50MiwgY2VudGVyUG9pbnQ9e3g6MCx5OjB9fSk9PntcbiAgICBpZihwb2ludDEueCA9PT0gcG9pbnQyLnggJiYgcG9pbnQxLnkgPT09IHBvaW50Mi55KSByZXR1cm4gMDtcblxuICAgIGxldCBwMVRyYW5zID0ge3g6IHBvaW50MS54IC0gY2VudGVyUG9pbnQueCwgeTogcG9pbnQxLnkgLSBjZW50ZXJQb2ludC55fTtcbiAgICBsZXQgcDJUcmFucyA9IHt4OiBwb2ludDIueCAtIGNlbnRlclBvaW50LngsIHk6IHBvaW50Mi55IC0gY2VudGVyUG9pbnQueX07XG4gICAgLy8gbGV0IGRpZmZYICAgPSBwMVRyYW5zLnggLSBwMlRyYW5zLng7XG4gICAgLy8gbGV0IGRpZmZZICAgPSBwMVRyYW5zLnkgLSBwMlRyYW5zLnk7XG4gICAgLy8gdmFyIGFuZ2xlUmFkaWFucyA9IE1hdGguYXRhbjIoZGlmZlksIGRpZmZYKTtcbiAgICBsZXQgYW5nbGVPZlAxID0gTWF0aC5hdGFuMihwMVRyYW5zLnksIHAxVHJhbnMueCk7XG4gICAgbGV0IGFuZ2xlT2ZQMiA9IE1hdGguYXRhbjIocDJUcmFucy55LCBwMlRyYW5zLngpO1xuICAgIGlmKGFuZ2xlT2ZQMSA8IDApIGFuZ2xlT2ZQMSA9IGFuZ2xlT2ZQMSArIE1hdGguUEkqMjtcbiAgICBpZihhbmdsZU9mUDIgPCAwKSBhbmdsZU9mUDIgPSBhbmdsZU9mUDIgKyBNYXRoLlBJKjI7XG4gICAgbGV0IGFuZ2xlUmFkaWFucyA9IGFuZ2xlT2ZQMiAtIGFuZ2xlT2ZQMTtcbiAgICAvLyBpZihhbmdsZVJhZGlhbnMgPCAwKSBhbmdsZVJhZGlhbnMgPSAoYW5nbGVSYWRpYW5zICsgTWF0aC5QSSoyKTtcbiAgICByZXR1cm4gYW5nbGVSYWRpYW5zO1xuICAgIC8vIGxldCBhbmdsZU9mUDEgPSBNYXRoLmF0YW4yKHAxVHJhbnMueCwgcDFUcmFucy55KTtcbiAgICAvLyBsZXQgYW5nbGVPZlAyID0gTWF0aC5hdGFuMihwb2ludDIueSAtIGNlbnRlclBvaW50LnksIHBvaW50Mi54IC0gY2VudGVyUG9pbnQueCk7XG4gICAgLy8gaWYoYW5nbGVPZlAxIDwgMCkgYW5nbGVPZlAxID0gYW5nbGVPZlAxICsgTWF0aC5QSSoyO1xuICAgIC8vIGlmKGFuZ2xlT2ZQMiA8IDApIGFuZ2xlT2ZQMiA9IGFuZ2xlT2ZQMiArIE1hdGguUEkqMjtcbiAgICAvL2FuZ2xlIGluIHJhZGlhbnNcbiAgICAvLyByZXR1cm4gIGFuZ2xlT2ZQMiAtIGFuZ2xlT2ZQMTtcbn1cblxuZXhwb3J0cy5tYXBOdW0gPSAoe2lucHV0LCBzdGFydDEsIGVuZDEsIHN0YXJ0MiwgZW5kMiB9KT0+e1xuICAgIGlmKGlucHV0PHN0YXJ0MSkgaW5wdXQgPSBzdGFydDE7XG4gICAgZWxzZSBpZihpbnB1dD5lbmQxKSBpbnB1dCA9IGVuZDE7XG4gICAgbGV0IGRpZmZSYW5nZTEgPSBlbmQxIC0gc3RhcnQxO1xuICAgIGxldCBmcmFjdGlvbk9mRmlyc3RSYW5nZSA9IChpbnB1dCAtIHN0YXJ0MSkgLyBkaWZmUmFuZ2UxO1xuICAgIGxldCBkaWZmUmFuZ2UyID0gZW5kMiAtIHN0YXJ0MjtcbiAgICByZXR1cm4gKGRpZmZSYW5nZTIqZnJhY3Rpb25PZkZpcnN0UmFuZ2UpICsgc3RhcnQyO1xufVxuXG5mdW5jdGlvbiBjbG9uZU9iamVjdChvYmope1xuXHQvL21ha2UgYSBuZXcgb2JqZWN0IHRvIHJldHVyblxuXHRsZXQgbmV3T2JqID0ge307XG5cdC8vY29weSBhbGwgcHJvcGVydGllcyBvbnRvIG5ld29iamVjdFxuXHRmb3IodmFyIGlkIGluIG9iail7XG5cdFx0bGV0IHByb3BlcnkgPSBvYmpbaWRdO1xuXHRcdGlmKHR5cGVvZiBwcm9wZXJ5ID09PSAnb2JqZWN0JyAmJiBwcm9wZXJ5ICE9PSBudWxsKXtcblx0XHRcdG5ld09ialtpZF0gPSBjbG9uZU9iamVjdChwcm9wZXJ5KTtcblx0XHR9XG5cdFx0aWYocHJvcGVyeSAhPT0gbnVsbCl7XG5cdFx0XHRuZXdPYmpbaWRdID0gcHJvcGVyeTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIG5ld09iajtcbn1cbmV4cG9ydHMuY2xvbmVPYmplY3QgPSBjbG9uZU9iamVjdDtcblxuZnVuY3Rpb24gbWVtb3J5U2l6ZU9mKG9iaikge1xuICAgIHZhciBieXRlcyA9IDA7XG5cbiAgICBmdW5jdGlvbiBzaXplT2Yob2JqKSB7XG4gICAgICAgIGlmKG9iaiAhPT0gbnVsbCAmJiBvYmogIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgc3dpdGNoKHR5cGVvZiBvYmopIHtcbiAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICAgICAgYnl0ZXMgKz0gODtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgICAgICAgICAgYnl0ZXMgKz0gb2JqLmxlbmd0aCAqIDI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgICAgICAgICBieXRlcyArPSA0O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgICAgICAgICB2YXIgb2JqQ2xhc3MgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKS5zbGljZSg4LCAtMSk7XG4gICAgICAgICAgICAgICAgaWYob2JqQ2xhc3MgPT09ICdPYmplY3QnIHx8IG9iakNsYXNzID09PSAnQXJyYXknKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIga2V5IGluIG9iaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIW9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemVPZihvYmpba2V5XSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgYnl0ZXMgKz0gb2JqLnRvU3RyaW5nKCkubGVuZ3RoICogMjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYnl0ZXM7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGZvcm1hdEJ5dGVTaXplKGJ5dGVzKSB7XG4gICAgICAgIGlmKGJ5dGVzIDwgMTAyNCkgcmV0dXJuIGJ5dGVzICsgXCIgYnl0ZXNcIjtcbiAgICAgICAgZWxzZSBpZihieXRlcyA8IDEwNDg1NzYpIHJldHVybihieXRlcyAvIDEwMjQpLnRvRml4ZWQoMykgKyBcIiBLaUJcIjtcbiAgICAgICAgZWxzZSBpZihieXRlcyA8IDEwNzM3NDE4MjQpIHJldHVybihieXRlcyAvIDEwNDg1NzYpLnRvRml4ZWQoMykgKyBcIiBNaUJcIjtcbiAgICAgICAgZWxzZSByZXR1cm4oYnl0ZXMgLyAxMDczNzQxODI0KS50b0ZpeGVkKDMpICsgXCIgR2lCXCI7XG4gICAgfTtcblxuICAgIHJldHVybiBmb3JtYXRCeXRlU2l6ZShzaXplT2Yob2JqKSk7XG59OyAvL21lbW9yeVNpemVPZiBcbmV4cG9ydHMubWVtb3J5U2l6ZU9mID0gbWVtb3J5U2l6ZU9mOyJdLCJzb3VyY2VSb290IjoiIn0=