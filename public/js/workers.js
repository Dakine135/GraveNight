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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50U291cmNlL2pzL2xpbmVPZlNpZ2h0Lndvcmtlci5qcyIsIndlYnBhY2s6Ly8vLi9zaGFyZWQvSGl0Ym94LmpzIiwid2VicGFjazovLy8uL3NoYXJlZC9VdGlsaXRpZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBLGtCQUFrQixtQkFBTyxDQUFDLHdEQUEyQjtBQUNyRCxlQUFlLG1CQUFPLENBQUMsa0RBQXdCOztBQUUvQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBLGVBQWUsMENBQTBDO0FBQ3pELEtBQUs7O0FBRUwsQ0FBQzs7Ozs7QUFLRDtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7O0FBRUEsR0FBRyxFQUFFO0FBQ0wsRUFBRTtBQUNGO0FBQ0EsQ0FBQzs7OztBQUlELHVCQUF1QiwwQ0FBMEM7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1EQUFtRDtBQUNuRCxrREFBa0Q7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBLGlDQUFpQzs7QUFFakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUYsMEJBQTBCLGlDQUFpQztBQUMzRCw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyxxQkFBcUI7QUFDM0Q7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLHFCQUFxQjtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLHFCQUFxQjtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLHFCQUFxQjtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1YsRUFBRTs7QUFFRix3QkFBd0Isa0VBQWtFO0FBQzFGO0FBQ0E7QUFDQSxnQ0FBZ0M7QUFDaEM7QUFDQSxtQ0FBbUMsNkJBQTZCO0FBQ2hFLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDJCQUEyQixjQUFjO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLEU7Ozs7Ozs7Ozs7O0FDNU9BLGdCQUFnQixtQkFBTyxDQUFDLHFEQUF3Qjs7QUFFaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGdCQUFnQjtBQUNoQyxnQkFBZ0IsaUJBQWlCO0FBQ2pDLGdCQUFnQixtQkFBbUI7QUFDbkMsZ0JBQWdCLG9CQUFvQjtBQUNwQyxpQkFBaUIsZ0JBQWdCLEdBQUcsaUJBQWlCLEdBQUcsbUJBQW1CLEdBQUcsb0JBQW9CO0FBQ2xHO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCLHVCQUF1QjtBQUN2Qix1QkFBdUI7QUFDdkIsdUJBQXVCO0FBQ3ZCO0FBQ0E7O0FBRUEsMEJBQTBCLHlDQUF5Qzs7QUFFbkU7QUFDQSwyQkFBMkI7QUFDM0IsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLEdBQUcsa0NBQWtDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLEdBQUcsT0FBTztBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBOztBQUVBLEVBQUUsbUNBQW1DO0FBQ3JDLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxHQUFHLGtDQUFrQztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxHQUFHLE9BQU87QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTs7QUFFQSxFQUFFLE9BQU87QUFDVCw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsR0FBRyxrQ0FBa0M7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxDQUFDO0FBQ0Q7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFDQUFxQzs7QUFFckM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEM7Ozs7Ozs7Ozs7O0FDdFFBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDs7QUFFQSx3QkFBd0IsUUFBUSxTQUFTLFNBQVMsU0FBUyxVQUFVO0FBQ3JFO0FBQ0E7O0FBRUE7QUFDQSx3QkFBd0Isd0I7O0FBRXhCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwyQkFBMkIsNkJBQTZCO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMkJBQTJCLDZCQUE2QixTQUFTO0FBQ2pFOztBQUVBLG1CQUFtQjtBQUNuQixtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUIsbUNBQW1DO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxFQUFFO0FBQ0Ysb0MiLCJmaWxlIjoid29ya2Vycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vY2xpZW50U291cmNlL2pzL2xpbmVPZlNpZ2h0Lndvcmtlci5qc1wiKTtcbiIsImNvbnN0IFV0aWxpdGllcyA9IHJlcXVpcmUoJy4uLy4uL3NoYXJlZC9VdGlsaXRpZXMuanMnKTtcclxuY29uc3QgSGl0Ym94ID0gcmVxdWlyZSgnLi4vLi4vc2hhcmVkL0hpdGJveC5qcycpO1xyXG5cclxuY29uc29sZS5sb2coXCJXb3JrZXIgY3JlYXRlZFwiKTtcclxuXHJcbm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuXHRsZXQgZGF0YSA9IGV2ZW50LmRhdGE7XHJcblx0Ly8gY29uc29sZS5sb2coXCJtZXNzYWdlIHJlY2VpdmVkIGluIHdvcmtlcjpcIiwgZXZlbnQuZGF0YSk7XHJcblx0Ly8gbGV0IHRlc3RSZXR1cm4gPSBldmVudC5kYXRhICogMjtcclxuXHQvLyBwb3N0TWVzc2FnZSh0ZXN0UmV0dXJuKTtcclxuXHRsZXQgcG9pbnRzVG9TZW5kID0gZ2V0UG9pbnRzKHtcclxuXHRcdG9iamVjdHNJblJhbmdlOiBkYXRhLm9iamVjdHNJblJhbmdlLFxyXG5cdFx0b3JpZ2luOiAgICAgICAgIGRhdGEub3JpZ2luLFxyXG5cdFx0cmVuZGVyRGlzdGFuY2U6IGRhdGEucmVuZGVyRGlzdGFuY2UsXHJcblx0XHRjYW1lcmE6ICAgICAgICAgZGF0YS5jYW1lcmFcclxuXHR9KTtcclxuXHQvLyBzZXRUaW1lb3V0KCgpPT57XHJcblx0XHRwb3N0TWVzc2FnZSh7cG9pbnRzOiBwb2ludHNUb1NlbmQsIG9mZnNldDogZGF0YS5jYW1lcmF9KTtcclxuXHQvLyB9LDUwMCk7XHJcblx0XHJcbn0vL29uIG1lc3NhZ2VcclxuXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFBvaW50cyh7XHJcblx0b2JqZWN0c0luUmFuZ2U9e30sXHJcblx0b3JpZ2luPW51bGwsXHJcblx0cmVuZGVyRGlzdGFuY2U9NTAwLFxyXG5cdGNhbWVyYT1udWxsXHJcbn0pe1xyXG5cdGxldCBsaXN0T2ZQb2ludHMgPSBbXTtcclxuXHRmb3IodmFyIGlkIGluIG9iamVjdHNJblJhbmdlKXtcclxuXHRcdGxldCBvYmplY3QgPSBvYmplY3RzSW5SYW5nZVtpZF07XHJcblx0XHRsZXQgcG9pbnRzID0gSGl0Ym94LmdldFZpc3VhbFBvaW50cyh7XHJcblx0XHRcdG9iajogICAgICAgICBvYmplY3QuaGl0Ym94LFxyXG5cdFx0XHR2aWV3UG9pbnQ6ICAgb3JpZ2luLFxyXG5cdFx0XHRnZXRQb2ludHNBZnRlckVkZ2U6IHRydWVcclxuXHRcdH0pO1xyXG5cclxuXHRcdHBvaW50cy5mb3JFYWNoKGZ1bmN0aW9uKHBvaW50KXtcclxuXHJcblx0XHRcdGxldCBwb2ludFRvQ2hlY2sgPSBwb2ludDtcclxuXHRcdFx0aWYocG9pbnQuZXh0ZW5kKXtcclxuXHRcdFx0XHRwb2ludFRvQ2hlY2sgPSBVdGlsaXRpZXMuZXh0ZW5kRW5kUG9pbnQoe1xyXG5cdFx0XHRcdFx0c3RhcnRQb2ludDogb3JpZ2luLCBcclxuXHRcdFx0XHRcdGVuZFBvaW50OiBwb2ludCwgXHJcblx0XHRcdFx0XHRsZW5ndGg6IHJlbmRlckRpc3RhbmNlXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdGxldCBjb2xsaXNpb24gPSBnZXRDb2xsaXNpb24oe1xyXG5cdFx0XHRcdG9iamVjdHM6IG9iamVjdHNJblJhbmdlLCBcclxuXHRcdFx0XHRvcmlnaW46ICBvcmlnaW4sIFxyXG5cdFx0XHRcdHBvaW50OiAgIHBvaW50VG9DaGVja1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGxldCB2aWV3UG9pbnQgPSBnZXRWaWV3UG9pbnQoe1xyXG5cdFx0XHRcdHBvaW50OiBjb2xsaXNpb24ucG9pbnQsIFxyXG5cdFx0XHRcdGVkZ2U6ICAhY29sbGlzaW9uLmNvbGxpc2lvbixcclxuXHRcdFx0XHRjb2xvcjogKGNvbGxpc2lvbi5jb2xsaXNpb24gPyBcImdyZWVuXCIgOiBcInllbGxvd1wiKSxcclxuXHRcdFx0XHRuYW1lOiBcIlBcIixcclxuXHRcdFx0XHRvcmlnaW46IG9yaWdpbixcclxuXHRcdFx0XHRjYW1lcmE6IGNhbWVyYVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0bGlzdE9mUG9pbnRzLnB1c2godmlld1BvaW50KTtcclxuXHJcblx0XHR9KTsvL2ZvciBlYWNoIHBvaW50IGluIG9iamVjdFxyXG5cdH0vL2ZvciBvYmplY3RzIGluIHJhbmdlXHJcblx0cmV0dXJuIGxpc3RPZlBvaW50cztcclxufS8vZ2V0IFBvaW50c1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRDb2xsaXNpb24oe29iamVjdHMsIG9yaWdpbiwgcG9pbnQsIGRpc3RhbmNlPUluZmluaXR5fSl7XHJcblx0XHQvL2NoZWNrIGFsbCBvYmplY3RzIGluIHJhbmdlIGZvciBjb2xsaXNpb25cclxuXHRcdGxldCBjbG9zZXN0Q29sbGlzaW9uID0gZmFsc2U7XHJcblx0XHRsZXQgY2xvc2VzdFNlZ21lbnQgPSBudWxsO1xyXG5cdFx0bGV0IGNsb3Nlc3REaXN0ID0gSW5maW5pdHk7XHJcblx0XHQvL2ZvciBvYmplY3QgZ2xvd1xyXG5cdFx0bGV0IGNsb3Nlc3RPYmogPSBudWxsO1xyXG5cdFx0Zm9yKHZhciBpZCBpbiBvYmplY3RzKXtcclxuXHRcdFx0bGV0IG9iamVjdCA9IG9iamVjdHNbaWRdO1xyXG5cdFx0XHRsZXQgY29sbGlzaW9uID0gZ2V0SW50ZXJzZWN0aW9uKG9iamVjdC5oaXRib3gsIHt4MTogb3JpZ2luLngsICB5MTogb3JpZ2luLnksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgICAgICAgICB4MjogcG9pbnQueCwgICB5MjogcG9pbnQueX0pO1xyXG5cdFx0XHRpZihjb2xsaXNpb24pe1xyXG5cdFx0XHRcdGxldCBkaXN0ID0gVXRpbGl0aWVzLmRpc3QoY29sbGlzaW9uLnBvaW50LCBvcmlnaW4pO1xyXG5cdFx0XHRcdGlmKGNsb3Nlc3REaXN0ID4gZGlzdCl7XHJcblx0XHRcdFx0XHRjbG9zZXN0T2JqID0gb2JqZWN0O1xyXG5cdFx0XHRcdFx0Y2xvc2VzdERpc3QgPSBkaXN0O1xyXG5cdFx0XHRcdFx0Y2xvc2VzdENvbGxpc2lvbiA9IGNvbGxpc2lvbi5wb2ludDtcclxuXHRcdFx0XHRcdGNsb3Nlc3RTZWdtZW50ID0gY29sbGlzaW9uLmxpbmU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9Ly9mb3Igb2JqZWN0cyBpbiByYW5nZVxyXG5cclxuXHRcdGlmKGNsb3Nlc3RDb2xsaXNpb24gJiYgY2xvc2VzdERpc3QgPCBkaXN0YW5jZSl7XHJcblx0XHRcdC8vbWFrZSBwb2ludHMgYXQgdGhlIGNvcm5lcnMgb2YgdGhlIGJveFxyXG5cdFx0XHRsZXQgcG9pbnQxID0ge3g6IGNsb3Nlc3RTZWdtZW50LngxLCB5OiBjbG9zZXN0U2VnbWVudC55MX07XHJcblx0XHRcdGxldCBwb2ludDIgPSB7eDogY2xvc2VzdFNlZ21lbnQueDIsIHk6IGNsb3Nlc3RTZWdtZW50LnkyfTtcclxuXHRcdFx0bGV0IGFuZ2xlQ29sbGlzaW9uVG9Qb2ludDEgPSBjYWxjdWxhdGVBbmdsZSh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb2ludDE6IHBvaW50MSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNlbnRlclBvaW50Om9yaWdpbn0pO1xyXG5cdFx0XHRsZXQgYW5nbGVDb2xsaXNpb25Ub1BvaW50MiA9IGNhbGN1bGF0ZUFuZ2xlKHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvaW50MTogcG9pbnQyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCAgICBjZW50ZXJQb2ludDpvcmlnaW59KTtcclxuXHRcdFx0bGV0IGFuZ2xlQ29sbGlzaW9uID0gY2FsY3VsYXRlQW5nbGUoe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG9pbnQxOiBjbG9zZXN0Q29sbGlzaW9uLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCAgICBjZW50ZXJQb2ludDpvcmlnaW59KTtcclxuXHJcblx0XHRcdGxldCBjd1BvaW50O1xyXG5cdFx0XHRsZXQgY2N3UG9pbnQ7XHJcblx0XHRcdGlmKGFuZ2xlQ29sbGlzaW9uVG9Qb2ludDEgPiBhbmdsZUNvbGxpc2lvblRvUG9pbnQyKXtcclxuXHRcdFx0XHRjd1BvaW50ICA9IHBvaW50MTtcclxuXHRcdFx0XHRjd1BvaW50LmFuZ2xlID0gYW5nbGVDb2xsaXNpb25Ub1BvaW50MTtcclxuXHRcdFx0XHRjY3dQb2ludCA9IHBvaW50MjtcclxuXHRcdFx0XHRjY3dQb2ludC5hbmdsZSA9IGFuZ2xlQ29sbGlzaW9uVG9Qb2ludDI7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y3dQb2ludCAgPSBwb2ludDI7XHJcblx0XHRcdFx0Y3dQb2ludC5hbmdsZSA9IGFuZ2xlQ29sbGlzaW9uVG9Qb2ludDI7XHJcblx0XHRcdFx0Y2N3UG9pbnQgPSBwb2ludDE7XHJcblx0XHRcdFx0Y2N3UG9pbnQuYW5nbGUgPSBhbmdsZUNvbGxpc2lvblRvUG9pbnQxO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjbG9zZXN0Q29sbGlzaW9uLmFuZ2xlID0gYW5nbGVDb2xsaXNpb247XHJcblxyXG5cdFx0XHQvL21ha2Ugc3VyZSBib3ggZWRnZXMgYXJlIG5vdCBvdXQgb2YgcmFuZ2VcclxuXHRcdFx0Ly8gaWYoY3dQb2ludC5hbmdsZSAgPj0gZW5kUG9pbnRBbmdsZSB8fCBjd1BvaW50LmFuZ2xlICA8PSBzdGFydFBvaW50QW5nbGUpe1xyXG5cdFx0XHQvLyBcdGN3UG9pbnQgPSBudWxsO1xyXG5cdFx0XHQvLyB9XHJcblx0XHRcdC8vIGlmKGNjd1BvaW50LmFuZ2xlID49IGVuZFBvaW50QW5nbGUgfHwgY2N3UG9pbnQuYW5nbGUgPD0gc3RhcnRQb2ludEFuZ2xlKXtcclxuXHRcdFx0Ly8gXHRjY3dQb2ludCA9IG51bGw7XHJcblx0XHRcdC8vIH1cclxuXHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0Y29sbGlzaW9uOiB0cnVlLFxyXG5cdFx0XHRcdHBvaW50OiBjbG9zZXN0Q29sbGlzaW9uLFxyXG5cdFx0XHRcdGRpc3Q6IGNsb3Nlc3REaXN0LFxyXG5cdFx0XHRcdGN3UG9pbnQ6IGN3UG9pbnQsXHJcblx0XHRcdFx0Y2N3UG9pbnQ6IGNjd1BvaW50LFxyXG5cdFx0XHRcdG9iamVjdDogY2xvc2VzdE9ialxyXG5cdFx0XHR9XHJcblx0XHR9Ly9jbG9zZXN0IENvbGxpc2lvblxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0Y29sbGlzaW9uOiBmYWxzZSxcclxuXHRcdFx0XHRwb2ludDogcG9pbnRcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0vL2dldENvbGxpc2lvblxyXG5cclxuXHRmdW5jdGlvbiBjYWxjdWxhdGVBbmdsZSh7cG9pbnQxLCBwb2ludDI9bnVsbCwgY2VudGVyUG9pbnR9KXtcclxuXHRcdGlmKHBvaW50Mj09bnVsbCkgcG9pbnQyID0ge3g6IGNlbnRlclBvaW50LngrMTAsIHk6Y2VudGVyUG9pbnQueX07XHJcblx0XHRsZXQgcEFuZ2xlID0gVXRpbGl0aWVzLmNhbGN1bGF0ZUFuZ2xlKHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRwb2ludDE6IHBvaW50MSwgXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cG9pbnQyOiBwb2ludDIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdCAgICBjZW50ZXJQb2ludDpjZW50ZXJQb2ludH0pO1xyXG5cdFx0Ly8gaWYocEFuZ2xlIDwgMCkgcEFuZ2xlID0gcEFuZ2xlICsgTWF0aC5QSSoyO1xyXG5cdFx0aWYocEFuZ2xlIDwgMCkgcEFuZ2xlID0gTWF0aC5hYnMocEFuZ2xlKTtcclxuXHRcdC8vIGlmKHBBbmdsZSA+IE1hdGguUEkpIHBBbmdsZSA9IE1hdGguUEkgLSBwQW5nbGU7XHJcblx0XHQvLyBpZihwQW5nbGUgPiB3aWR0aCkgcEFuZ2xlID0gTWF0aC5QSSoyIC0gcEFuZ2xlO1xyXG5cdFx0Ly9Db3VsZCBjYXVzZSBhbiBpc3N1ZSB3aGVuIGNvbmUgaXMgd2lkZXIgdGhhbiBQSSBha2EgMTgwLCBtYXliZT9cclxuXHRcdHJldHVybiBwQW5nbGU7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRJbnRlcnNlY3Rpb24oY29ybmVycywgbGluZSl7XHJcblx0XHQvLyBjb25zb2xlLmxvZyhcImNvcm5lcnM6XCIsY29ybmVycyk7XHJcblx0XHRsZXQgYm94TGluZVRvcCAgICA9IHt4MTpjb3JuZXJzLnRvcExlZnQueCwgICAgIHkxOmNvcm5lcnMudG9wTGVmdC55LCBcclxuXHRcdFx0XHRcdFx0ICAgICB4Mjpjb3JuZXJzLnRvcFJpZ2h0LngsICAgIHkyOmNvcm5lcnMudG9wUmlnaHQueX07XHJcblx0XHRsZXQgYm94TGluZVJpZ2h0ICA9IHt4MTpjb3JuZXJzLnRvcFJpZ2h0LngsICAgIHkxOmNvcm5lcnMudG9wUmlnaHQueSwgXHJcblx0XHRcdFx0XHRcdCAgICAgeDI6Y29ybmVycy5ib3R0b21SaWdodC54LCB5Mjpjb3JuZXJzLmJvdHRvbVJpZ2h0Lnl9O1xyXG5cdFx0bGV0IGJveExpbmVCb3R0b20gPSB7eDE6Y29ybmVycy5ib3R0b21SaWdodC54LCB5MTpjb3JuZXJzLmJvdHRvbVJpZ2h0LnksIFxyXG5cdFx0XHRcdFx0XHQgICAgIHgyOmNvcm5lcnMuYm90dG9tTGVmdC54LCAgeTI6Y29ybmVycy5ib3R0b21MZWZ0Lnl9O1xyXG5cdFx0bGV0IGJveExpbmVMZWZ0ICAgPSB7eDE6Y29ybmVycy5ib3R0b21MZWZ0LngsICB5MTpjb3JuZXJzLmJvdHRvbUxlZnQueSwgXHJcblx0XHRcdFx0XHRcdCAgICAgeDI6Y29ybmVycy50b3BMZWZ0LngsICAgICB5Mjpjb3JuZXJzLnRvcExlZnQueX07XHJcblx0XHRsZXQgaW50ZXJzZWN0aW9uID0gZmFsc2U7XHJcblx0XHRsZXQgaW50ZXJzZWN0aW5nU2VnbWVudCA9IG51bGw7XHJcblx0XHRsZXQgY2xvc2VzdERpc3QgPSBJbmZpbml0eTtcclxuXHRcdGxldCB0b3AgPSBIaXRib3guY29sbGlkZUxpbmVMaW5lKGxpbmUsIGJveExpbmVUb3ApO1xyXG5cdFx0aWYodG9wKXtcclxuXHRcdFx0aW50ZXJzZWN0aW9uID0gdG9wO1xyXG5cdFx0XHRpbnRlcnNlY3RpbmdTZWdtZW50ID0gYm94TGluZVRvcDtcclxuXHRcdFx0Y2xvc2VzdERpc3QgPSBVdGlsaXRpZXMuZGlzdCh0b3AsIHt4OmxpbmUueDEsIHk6bGluZS55MX0pO1xyXG5cdFx0fVxyXG5cdFx0bGV0IHJpZ2h0ID0gSGl0Ym94LmNvbGxpZGVMaW5lTGluZShsaW5lLCBib3hMaW5lUmlnaHQpO1xyXG5cdFx0aWYocmlnaHQpe1xyXG5cdFx0XHRsZXQgZGlzdCA9IFV0aWxpdGllcy5kaXN0KHJpZ2h0LCB7eDpsaW5lLngxLCB5OmxpbmUueTF9KTtcclxuXHRcdFx0aWYoZGlzdCA8IGNsb3Nlc3REaXN0KXtcclxuXHRcdFx0XHRpbnRlcnNlY3Rpb24gPSByaWdodDtcclxuXHRcdFx0XHRpbnRlcnNlY3RpbmdTZWdtZW50ID0gYm94TGluZVJpZ2h0O1xyXG5cdFx0XHRcdGNsb3Nlc3REaXN0ID0gZGlzdDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0bGV0IGJvdHRvbSA9IEhpdGJveC5jb2xsaWRlTGluZUxpbmUobGluZSwgYm94TGluZUJvdHRvbSk7XHJcblx0XHRpZihib3R0b20pe1xyXG5cdFx0XHRsZXQgZGlzdCA9IFV0aWxpdGllcy5kaXN0KGJvdHRvbSwge3g6bGluZS54MSwgeTpsaW5lLnkxfSk7XHJcblx0XHRcdGlmKGRpc3QgPCBjbG9zZXN0RGlzdCl7XHJcblx0XHRcdFx0aW50ZXJzZWN0aW9uID0gYm90dG9tO1xyXG5cdFx0XHRcdGludGVyc2VjdGluZ1NlZ21lbnQgPSBib3hMaW5lQm90dG9tO1xyXG5cdFx0XHRcdGNsb3Nlc3REaXN0ID0gZGlzdDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0bGV0IGxlZnQgPSBIaXRib3guY29sbGlkZUxpbmVMaW5lKGxpbmUsIGJveExpbmVMZWZ0KTtcclxuXHRcdGlmKGxlZnQpe1xyXG5cdFx0XHRsZXQgZGlzdCA9IFV0aWxpdGllcy5kaXN0KGxlZnQsIHt4OmxpbmUueDEsIHk6bGluZS55MX0pO1xyXG5cdFx0XHRpZihkaXN0IDwgY2xvc2VzdERpc3Qpe1xyXG5cdFx0XHRcdGludGVyc2VjdGlvbiA9IGxlZnQ7XHJcblx0XHRcdFx0aW50ZXJzZWN0aW5nU2VnbWVudCA9IGJveExpbmVMZWZ0O1xyXG5cdFx0XHRcdGNsb3Nlc3REaXN0ID0gZGlzdDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHtwb2ludDogaW50ZXJzZWN0aW9uLCBsaW5lOiBpbnRlcnNlY3RpbmdTZWdtZW50fTtcclxuXHR9Ly9nZXQgaW50ZXJzZWN0aW9uXHJcblxyXG5cdGZ1bmN0aW9uIGdldFZpZXdQb2ludCh7cG9pbnQsIGVkZ2U9ZmFsc2UsIGNvbG9yPVwieWVsbG93XCIsIG5hbWU9XCJObyBOYW1lXCIsIG9yaWdpbiwgY2FtZXJhfSl7XHJcblx0XHRsZXQgcEFuZ2xlID0gY2FsY3VsYXRlQW5nbGUoe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHBvaW50MTogcG9pbnQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdCAgICBjZW50ZXJQb2ludDpvcmlnaW59KTtcclxuXHRcdC8vdHJhbnNsYXRlIHRvIHBvaW50IGZvciBkaXNwbGF5XHJcblx0XHRsZXQgdmlld1BvaW50ID0gdHJhbnNsYXRlQ2FtZXJhKHtjYW1lcmE6IGNhbWVyYSwgcG9pbnQ6IHBvaW50fSk7XHJcblx0XHQvLyB2aWV3UG9pbnQgPSB7eDogcG9pbnQueCwgeTogcG9pbnQueX07XHJcblx0XHR2aWV3UG9pbnQuZWRnZSA9IGVkZ2U7XHJcblx0XHR2aWV3UG9pbnQuY29sb3IgPSBjb2xvcjtcclxuXHRcdHZpZXdQb2ludC5hbmdsZSA9IHBBbmdsZTtcclxuXHRcdHZpZXdQb2ludC5uYW1lID0gbmFtZTtcclxuXHRcdHZpZXdQb2ludC5jb3VudCA9IHRoaXMub3JkZXJQb2ludHNDcmVhdGVkO1xyXG5cdFx0dGhpcy5vcmRlclBvaW50c0NyZWF0ZWQrKztcclxuXHRcdHJldHVybiB2aWV3UG9pbnQ7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiB0cmFuc2xhdGVDYW1lcmEoe2NhbWVyYSwgcG9pbnR9KXtcclxuXHRcdGxldCBvcmdpZ2luWCA9IGNhbWVyYS54IC0gKGNhbWVyYS53aWR0aC8yKTtcclxuXHRcdGxldCBvcmdpZ2luWSA9IGNhbWVyYS55IC0gKGNhbWVyYS5oZWlnaHQvMik7XHJcblx0XHRsZXQgdHggPSBNYXRoLnJvdW5kKHBvaW50LnggLSBvcmdpZ2luWCk7XHJcblx0XHRsZXQgdHkgPSBNYXRoLnJvdW5kKHBvaW50LnkgLSBvcmdpZ2luWSk7XHJcblx0XHRyZXR1cm4ge3g6dHgsIHk6dHl9O1xyXG5cdH0iLCJ2YXIgVXRpbGl0aWVzID0gcmVxdWlyZSgnLi4vc2hhcmVkL1V0aWxpdGllcy5qcycpO1xyXG5cclxuZXhwb3J0cy5jcmVhdGUgPSAoe1xyXG5cdGlkPTAsXHJcblx0eD0wLFxyXG5cdHk9MCxcclxuXHR3aWR0aD01MCxcclxuXHRoZWlnaHQ9NTAsXHJcblx0YW5nbGU9MFxyXG59KT0+e1xyXG5cdGxldCB0b3AgICAgPSB5IC0gKGhlaWdodC8yKTtcclxuXHRsZXQgYm90dG9tID0geSArIChoZWlnaHQvMik7XHJcblx0bGV0IGxlZnQgICA9IHggLSAod2lkdGgvMik7XHJcblx0bGV0IHJpZ2h0ICA9IHggKyAod2lkdGgvMilcclxuXHRyZXR1cm4ge1xyXG5cdFx0aWQ6IGlkLFxyXG5cdFx0eDogIHgsXHJcblx0XHR5OiAgeSxcclxuXHRcdHdpZHRoOiB3aWR0aCxcclxuXHRcdGhlaWdodDpoZWlnaHQsXHJcblx0XHRhbmdsZTogYW5nbGUsXHJcblx0XHR0b3A6ICAgIHRvcCxcclxuXHRcdGJvdHRvbTogYm90dG9tLFxyXG5cdFx0bGVmdDogICBsZWZ0LFxyXG5cdFx0cmlnaHQ6ICByaWdodCxcclxuXHRcdHRvcExlZnQ6ICAgICB7eDogbGVmdCwgeTogdG9wfSxcclxuXHRcdHRvcFJpZ2h0OiAgICB7eDogcmlnaHQsIHk6IHRvcH0sXHJcblx0XHRib3R0b21MZWZ0OiAge3g6IGxlZnQsIHk6IGJvdHRvbX0sXHJcblx0XHRib3R0b21SaWdodDoge3g6IHJpZ2h0LCB5OiBib3R0b219LFxyXG5cdFx0cG9pbnRzOiAgICAgIFt7eDogbGVmdCwgeTogdG9wfSwge3g6IHJpZ2h0LCB5OiB0b3B9LCB7eDogbGVmdCwgeTogYm90dG9tfSwge3g6IHJpZ2h0LCB5OiBib3R0b219XVxyXG5cdH1cclxufSAvL2NyZWF0ZVxyXG5cclxuZnVuY3Rpb24gbW92ZVRvKG9iaiwgeCwgeSl7XHJcblx0b2JqLmhpdGJveC54ID0geDtcclxuXHRvYmouaGl0Ym94LnkgPSB5O1xyXG5cdHVwZGF0ZShvYmopO1xyXG59XHJcbmV4cG9ydHMubW92ZVRvID0gbW92ZVRvO1xyXG5cclxuZnVuY3Rpb24gdXBkYXRlKG9iail7XHJcblx0bGV0IGhpdGJveCA9IG9iai5oaXRib3g7XHJcblx0bGV0IHRvcCAgICA9IGhpdGJveC55IC0gKGhpdGJveC5oZWlnaHQvMik7XHJcblx0bGV0IGJvdHRvbSA9IGhpdGJveC55ICsgKGhpdGJveC5oZWlnaHQvMik7XHJcblx0bGV0IGxlZnQgICA9IGhpdGJveC54IC0gKGhpdGJveC53aWR0aC8yKTtcclxuXHRsZXQgcmlnaHQgID0gaGl0Ym94LnggKyAoaGl0Ym94LndpZHRoLzIpO1xyXG5cclxuXHRoaXRib3gudG9wICAgID0gdG9wO1xyXG5cdGhpdGJveC5ib3R0b20gPSBib3R0b207XHJcblx0aGl0Ym94LmxlZnQgICA9IGxlZnQ7XHJcblx0aGl0Ym94LnJpZ2h0ICA9IHJpZ2h0O1xyXG5cdGhpdGJveC50b3BMZWZ0ICAgICA9IHt4OiBsZWZ0LCB5OiB0b3B9O1xyXG5cdGhpdGJveC50b3BSaWdodCAgICA9IHt4OiByaWdodCwgeTogdG9wfTtcclxuXHRoaXRib3guYm90dG9tTGVmdCAgPSB7eDogbGVmdCwgeTogYm90dG9tfTtcclxuXHRoaXRib3guYm90dG9tUmlnaHQgPSB7eDogcmlnaHQsIHk6IGJvdHRvbX07XHJcblx0Ly8gaGl0Ym94LnBvaW50cyAgICAgID0gW2hpdGJveC50b3BMZWZ0LCBoaXRib3gudG9wUmlnaHQsIGhpdGJveC5ib3R0b21MZWZ0LCBoaXRib3guYm90dG9tUmlnaHRdO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRWaXN1YWxQb2ludHMoe29iaiwgdmlld1BvaW50LCBnZXRQb2ludHNBZnRlckVkZ2U9ZmFsc2V9KXtcclxuXHJcblx0bGV0IHJldHVyblBvaW50cyA9IFtdO1xyXG5cdGlmKHZpZXdQb2ludC55IDwgb2JqLnRvcCl7ICAgICAgICAgICAgICAvL05XLCBOLCBORVxyXG5cdFx0aWYodmlld1BvaW50LnggPCBvYmoubGVmdCl7ICAgICAgICAgLy9OV1xyXG5cdFx0XHRyZXR1cm5Qb2ludHMgPSBbb2JqLnRvcExlZnQsIG9iai50b3BSaWdodCwgb2JqLmJvdHRvbUxlZnRdO1xyXG5cdFx0XHRsZXQgcFJvdGF0ZWRDVyA9IFV0aWxpdGllcy5yb3RhdGVQb2ludCh7XHJcblx0XHRcdFx0Y2VudGVyOiB2aWV3UG9pbnQsXHJcblx0XHRcdFx0cG9pbnQ6IG9iai5ib3R0b21MZWZ0LFxyXG5cdFx0XHRcdGFuZ2xlOiAwLjAxfSk7XHJcblx0XHRcdHBSb3RhdGVkQ1cuZXh0ZW5kID0gdHJ1ZTtcclxuXHRcdFx0cmV0dXJuUG9pbnRzLnB1c2gocFJvdGF0ZWRDVyk7XHJcblx0XHRcdGxldCBwUm90YXRlZENDVyA9IFV0aWxpdGllcy5yb3RhdGVQb2ludCh7XHJcblx0XHRcdFx0Y2VudGVyOiB2aWV3UG9pbnQsXHJcblx0XHRcdFx0cG9pbnQ6IG9iai50b3BSaWdodCxcclxuXHRcdFx0XHRhbmdsZTogLTAuMDF9KTtcclxuXHRcdFx0cFJvdGF0ZWRDQ1cuZXh0ZW5kID0gdHJ1ZTtcclxuXHRcdFx0cmV0dXJuUG9pbnRzLnB1c2gocFJvdGF0ZWRDQ1cpO1xyXG5cdFx0fSBlbHNlIGlmKHZpZXdQb2ludC54ID4gb2JqLnJpZ2h0KXsgLy9ORVxyXG5cdFx0XHRyZXR1cm5Qb2ludHMgPSBbb2JqLnRvcExlZnQsIG9iai50b3BSaWdodCwgb2JqLmJvdHRvbVJpZ2h0XTtcclxuXHRcdFx0bGV0IHBSb3RhdGVkQ1cgPSBVdGlsaXRpZXMucm90YXRlUG9pbnQoe1xyXG5cdFx0XHRcdGNlbnRlcjogdmlld1BvaW50LFxyXG5cdFx0XHRcdHBvaW50OiBvYmoudG9wTGVmdCxcclxuXHRcdFx0XHRhbmdsZTogMC4wMX0pO1xyXG5cdFx0XHRwUm90YXRlZENXLmV4dGVuZCA9IHRydWU7XHJcblx0XHRcdHJldHVyblBvaW50cy5wdXNoKHBSb3RhdGVkQ1cpO1xyXG5cdFx0XHRsZXQgcFJvdGF0ZWRDQ1cgPSBVdGlsaXRpZXMucm90YXRlUG9pbnQoe1xyXG5cdFx0XHRcdGNlbnRlcjogdmlld1BvaW50LFxyXG5cdFx0XHRcdHBvaW50OiBvYmouYm90dG9tUmlnaHQsXHJcblx0XHRcdFx0YW5nbGU6IC0wLjAxfSk7XHJcblx0XHRcdHBSb3RhdGVkQ0NXLmV4dGVuZCA9IHRydWU7XHJcblx0XHRcdHJldHVyblBvaW50cy5wdXNoKHBSb3RhdGVkQ0NXKTtcclxuXHRcdH0gZWxzZSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vTlxyXG5cdFx0XHRyZXR1cm5Qb2ludHMgPSBbb2JqLnRvcExlZnQsIG9iai50b3BSaWdodF07XHJcblx0XHRcdGxldCBwUm90YXRlZENXID0gVXRpbGl0aWVzLnJvdGF0ZVBvaW50KHtcclxuXHRcdFx0XHRjZW50ZXI6IHZpZXdQb2ludCxcclxuXHRcdFx0XHRwb2ludDogb2JqLnRvcExlZnQsXHJcblx0XHRcdFx0YW5nbGU6IDAuMDF9KTtcclxuXHRcdFx0cFJvdGF0ZWRDVy5leHRlbmQgPSB0cnVlO1xyXG5cdFx0XHRyZXR1cm5Qb2ludHMucHVzaChwUm90YXRlZENXKTtcclxuXHRcdFx0bGV0IHBSb3RhdGVkQ0NXID0gVXRpbGl0aWVzLnJvdGF0ZVBvaW50KHtcclxuXHRcdFx0XHRjZW50ZXI6IHZpZXdQb2ludCxcclxuXHRcdFx0XHRwb2ludDogb2JqLnRvcFJpZ2h0LFxyXG5cdFx0XHRcdGFuZ2xlOiAtMC4wMX0pO1xyXG5cdFx0XHRwUm90YXRlZENDVy5leHRlbmQgPSB0cnVlO1xyXG5cdFx0XHRyZXR1cm5Qb2ludHMucHVzaChwUm90YXRlZENDVyk7XHJcblx0XHR9XHJcblxyXG5cdH0gZWxzZSBpZih2aWV3UG9pbnQueSA+IG9iai5ib3R0b20peyAgICAvL1NXLCBTLCBTRVxyXG5cdFx0aWYodmlld1BvaW50LnggPCBvYmoubGVmdCl7ICAgICAgICAgLy9TV1xyXG5cdFx0XHRyZXR1cm5Qb2ludHMgPSBbb2JqLnRvcExlZnQsIG9iai5ib3R0b21MZWZ0LCBvYmouYm90dG9tUmlnaHRdO1xyXG5cdFx0XHRsZXQgcFJvdGF0ZWRDVyA9IFV0aWxpdGllcy5yb3RhdGVQb2ludCh7XHJcblx0XHRcdFx0Y2VudGVyOiB2aWV3UG9pbnQsXHJcblx0XHRcdFx0cG9pbnQ6IG9iai5ib3R0b21SaWdodCxcclxuXHRcdFx0XHRhbmdsZTogMC4wMX0pO1xyXG5cdFx0XHRwUm90YXRlZENXLmV4dGVuZCA9IHRydWU7XHJcblx0XHRcdHJldHVyblBvaW50cy5wdXNoKHBSb3RhdGVkQ1cpO1xyXG5cdFx0XHRsZXQgcFJvdGF0ZWRDQ1cgPSBVdGlsaXRpZXMucm90YXRlUG9pbnQoe1xyXG5cdFx0XHRcdGNlbnRlcjogdmlld1BvaW50LFxyXG5cdFx0XHRcdHBvaW50OiBvYmoudG9wTGVmdCxcclxuXHRcdFx0XHRhbmdsZTogLTAuMDF9KTtcclxuXHRcdFx0cFJvdGF0ZWRDQ1cuZXh0ZW5kID0gdHJ1ZTtcclxuXHRcdFx0cmV0dXJuUG9pbnRzLnB1c2gocFJvdGF0ZWRDQ1cpO1xyXG5cdFx0fSBlbHNlIGlmKHZpZXdQb2ludC54ID4gb2JqLnJpZ2h0KXsgLy9TRVxyXG5cdFx0XHRyZXR1cm5Qb2ludHMgPSBbb2JqLnRvcFJpZ2h0LCBvYmouYm90dG9tTGVmdCwgb2JqLmJvdHRvbVJpZ2h0XTtcclxuXHRcdFx0bGV0IHBSb3RhdGVkQ1cgPSBVdGlsaXRpZXMucm90YXRlUG9pbnQoe1xyXG5cdFx0XHRcdGNlbnRlcjogdmlld1BvaW50LFxyXG5cdFx0XHRcdHBvaW50OiBvYmoudG9wUmlnaHQsXHJcblx0XHRcdFx0YW5nbGU6IDAuMDF9KTtcclxuXHRcdFx0cFJvdGF0ZWRDVy5leHRlbmQgPSB0cnVlO1xyXG5cdFx0XHRyZXR1cm5Qb2ludHMucHVzaChwUm90YXRlZENXKTtcclxuXHRcdFx0bGV0IHBSb3RhdGVkQ0NXID0gVXRpbGl0aWVzLnJvdGF0ZVBvaW50KHtcclxuXHRcdFx0XHRjZW50ZXI6IHZpZXdQb2ludCxcclxuXHRcdFx0XHRwb2ludDogb2JqLmJvdHRvbUxlZnQsXHJcblx0XHRcdFx0YW5nbGU6IC0wLjAxfSk7XHJcblx0XHRcdHBSb3RhdGVkQ0NXLmV4dGVuZCA9IHRydWU7XHJcblx0XHRcdHJldHVyblBvaW50cy5wdXNoKHBSb3RhdGVkQ0NXKTtcclxuXHRcdH0gZWxzZSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vU1xyXG5cdFx0XHRyZXR1cm5Qb2ludHMgPSBbb2JqLmJvdHRvbUxlZnQsIG9iai5ib3R0b21SaWdodF07XHJcblx0XHRcdGxldCBwUm90YXRlZENXID0gVXRpbGl0aWVzLnJvdGF0ZVBvaW50KHtcclxuXHRcdFx0XHRjZW50ZXI6IHZpZXdQb2ludCxcclxuXHRcdFx0XHRwb2ludDogb2JqLmJvdHRvbVJpZ2h0LFxyXG5cdFx0XHRcdGFuZ2xlOiAwLjAxfSk7XHJcblx0XHRcdHBSb3RhdGVkQ1cuZXh0ZW5kID0gdHJ1ZTtcclxuXHRcdFx0cmV0dXJuUG9pbnRzLnB1c2gocFJvdGF0ZWRDVyk7XHJcblx0XHRcdGxldCBwUm90YXRlZENDVyA9IFV0aWxpdGllcy5yb3RhdGVQb2ludCh7XHJcblx0XHRcdFx0Y2VudGVyOiB2aWV3UG9pbnQsXHJcblx0XHRcdFx0cG9pbnQ6IG9iai5ib3R0b21MZWZ0LFxyXG5cdFx0XHRcdGFuZ2xlOiAtMC4wMX0pO1xyXG5cdFx0XHRwUm90YXRlZENDVy5leHRlbmQgPSB0cnVlO1xyXG5cdFx0XHRyZXR1cm5Qb2ludHMucHVzaChwUm90YXRlZENDVyk7XHJcblx0XHR9XHJcblxyXG5cdH0gZWxzZSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0Ugb3IgV1xyXG5cdFx0aWYodmlld1BvaW50LnggPCBvYmoubGVmdCl7ICAgICAgICAgLy9XXHJcblx0XHRcdHJldHVyblBvaW50cyA9IFtvYmoudG9wTGVmdCwgb2JqLmJvdHRvbUxlZnRdO1xyXG5cdFx0XHRsZXQgcFJvdGF0ZWRDVyA9IFV0aWxpdGllcy5yb3RhdGVQb2ludCh7XHJcblx0XHRcdFx0Y2VudGVyOiB2aWV3UG9pbnQsXHJcblx0XHRcdFx0cG9pbnQ6IG9iai5ib3R0b21MZWZ0LFxyXG5cdFx0XHRcdGFuZ2xlOiAwLjAxfSk7XHJcblx0XHRcdHBSb3RhdGVkQ1cuZXh0ZW5kID0gdHJ1ZTtcclxuXHRcdFx0cmV0dXJuUG9pbnRzLnB1c2gocFJvdGF0ZWRDVyk7XHJcblx0XHRcdGxldCBwUm90YXRlZENDVyA9IFV0aWxpdGllcy5yb3RhdGVQb2ludCh7XHJcblx0XHRcdFx0Y2VudGVyOiB2aWV3UG9pbnQsXHJcblx0XHRcdFx0cG9pbnQ6IG9iai50b3BMZWZ0LFxyXG5cdFx0XHRcdGFuZ2xlOiAtMC4wMX0pO1xyXG5cdFx0XHRwUm90YXRlZENDVy5leHRlbmQgPSB0cnVlO1xyXG5cdFx0XHRyZXR1cm5Qb2ludHMucHVzaChwUm90YXRlZENDVyk7XHJcblx0XHR9IGVsc2UgaWYodmlld1BvaW50LnggPiBvYmoucmlnaHQpeyAvL0VcclxuXHRcdFx0cmV0dXJuUG9pbnRzID0gW29iai50b3BSaWdodCwgb2JqLmJvdHRvbVJpZ2h0XTtcclxuXHRcdFx0bGV0IHBSb3RhdGVkQ1cgPSBVdGlsaXRpZXMucm90YXRlUG9pbnQoe1xyXG5cdFx0XHRcdGNlbnRlcjogdmlld1BvaW50LFxyXG5cdFx0XHRcdHBvaW50OiBvYmoudG9wUmlnaHQsXHJcblx0XHRcdFx0YW5nbGU6IDAuMDF9KTtcclxuXHRcdFx0cFJvdGF0ZWRDVy5leHRlbmQgPSB0cnVlO1xyXG5cdFx0XHRyZXR1cm5Qb2ludHMucHVzaChwUm90YXRlZENXKTtcclxuXHRcdFx0bGV0IHBSb3RhdGVkQ0NXID0gVXRpbGl0aWVzLnJvdGF0ZVBvaW50KHtcclxuXHRcdFx0XHRjZW50ZXI6IHZpZXdQb2ludCxcclxuXHRcdFx0XHRwb2ludDogb2JqLmJvdHRvbVJpZ2h0LFxyXG5cdFx0XHRcdGFuZ2xlOiAtMC4wMX0pO1xyXG5cdFx0XHRwUm90YXRlZENDVy5leHRlbmQgPSB0cnVlO1xyXG5cdFx0XHRyZXR1cm5Qb2ludHMucHVzaChwUm90YXRlZENDVyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZyhcIkNhdGNoIGluIGdldFZpc3VhbFBvaW50cywgcG9zc2libHkgdmlld1BvaW50IGlzIGluc2lkZSB0aGUgYm94XCIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gaWYocmV0dXJuUG9pbnRzLmxlbmd0aCA8IDQgfHwgcmV0dXJuUG9pbnRzLmxlbmd0aCA+IDUpIGNvbnNvbGUubG9nKFwiV3JvbmcgYW1vdW50IG9mIHBvaW50czpcIiwgcmV0dXJuUG9pbnRzLmxlbmd0aCk7XHJcblxyXG5cdHJldHVybiByZXR1cm5Qb2ludHM7XHJcblxyXG59XHJcbmV4cG9ydHMuZ2V0VmlzdWFsUG9pbnRzID0gZ2V0VmlzdWFsUG9pbnRzO1xyXG5cclxuZnVuY3Rpb24gY29sbGlkaW5nKG9iajEsIG9iajIpIHtcclxuXHQvL2RvZXNudCB0YWtlIGFuZ2xlIGludG8gYWNjb3VudCB5ZXQuXHJcblx0bGV0IGhpdGJveDEgPSBvYmoxLmhpdGJveDtcclxuXHRsZXQgaGl0Ym94MiA9IG9iajIuaGl0Ym94O1xyXG5cclxuXHRsZXQgcm91Z2hDb2xsaWRpbmcgPSBmYWxzZTtcclxuXHQvLyBjb25zb2xlLmxvZyhcIkluIGNvbGxpZGluZzpcIiwgaGl0Ym94MSwgaGl0Ym94Mik7XHJcblx0aWYoaGl0Ym94MS50b3AgPiBoaXRib3gyLmJvdHRvbSB8fFxyXG5cdCAgIGhpdGJveDEuYm90dG9tIDwgaGl0Ym94Mi50b3AgfHxcclxuXHQgICBoaXRib3gxLnJpZ2h0IDwgaGl0Ym94Mi5sZWZ0IHx8XHJcblx0ICAgaGl0Ym94MS5sZWZ0ID4gaGl0Ym94Mi5yaWdodCkge1xyXG5cdFx0cm91Z2hDb2xsaWRpbmcgPSBmYWxzZTtcclxuXHR9IGVsc2Ugcm91Z2hDb2xsaWRpbmcgPSB0cnVlO1xyXG5cclxuXHQvLyBpZihyb3VnaENvbGxpZGluZyl7XHJcblx0Ly8gXHQvL1RPRE8gbWFrZSBtb3JlIGdyYW51bGFyIGNvbGxpZGluZyB3aXRoIGNvbGxpc2lvbiBwb2ludHMgYW5kIHN1Y2hcclxuXHQvLyB9XHJcblx0XHJcblx0cmV0dXJuIHJvdWdoQ29sbGlkaW5nO1xyXG59IC8vY29sbGlkaW5nXHJcbmV4cG9ydHMuY29sbGlkaW5nID0gY29sbGlkaW5nO1xyXG5cclxuZnVuY3Rpb24gY29sbGlkZUxpbmVMaW5lKGxpbmUxLCBsaW5lMikge1xyXG5cclxuXHQvLyBjYWxjdWxhdGUgdGhlIGRpc3RhbmNlIHRvIGludGVyc2VjdGlvbiBwb2ludFxyXG5cdHZhciB1QSA9ICgobGluZTIueDItbGluZTIueDEpKihsaW5lMS55MS1saW5lMi55MSkgLSBcclxuXHRcdFx0IChsaW5lMi55Mi1saW5lMi55MSkqKGxpbmUxLngxLWxpbmUyLngxKSkgLyBcclxuXHRcdFx0ICgobGluZTIueTItbGluZTIueTEpKihsaW5lMS54Mi1saW5lMS54MSkgLSBcclxuXHRcdFx0IChsaW5lMi54Mi1saW5lMi54MSkqKGxpbmUxLnkyLWxpbmUxLnkxKSk7XHJcblx0dmFyIHVCID0gKChsaW5lMS54Mi1saW5lMS54MSkqKGxpbmUxLnkxLWxpbmUyLnkxKSAtIFxyXG5cdFx0XHQgKGxpbmUxLnkyLWxpbmUxLnkxKSoobGluZTEueDEtbGluZTIueDEpKSAvIFxyXG5cdFx0XHQgKChsaW5lMi55Mi1saW5lMi55MSkqKGxpbmUxLngyLWxpbmUxLngxKSAtIFxyXG5cdFx0XHQgKGxpbmUyLngyLWxpbmUyLngxKSoobGluZTEueTItbGluZTEueTEpKTtcclxuXHJcblx0Ly8gaWYgdUEgYW5kIHVCIGFyZSBiZXR3ZWVuIDAtMSwgbGluZXMgYXJlIGNvbGxpZGluZ1xyXG5cdGlmICh1QSA+PSAwICYmIHVBIDw9IDEgJiYgdUIgPj0gMCAmJiB1QiA8PSAxKSB7XHJcblxyXG5cdCAgdmFyIGludGVyc2VjdGlvblggPSBsaW5lMS54MSArICh1QSAqIChsaW5lMS54Mi1saW5lMS54MSkpO1xyXG5cdCAgdmFyIGludGVyc2VjdGlvblkgPSBsaW5lMS55MSArICh1QSAqIChsaW5lMS55Mi1saW5lMS55MSkpO1xyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBcInhcIjppbnRlcnNlY3Rpb25YLFxyXG4gICAgICAgIFwieVwiOmludGVyc2VjdGlvbllcclxuICAgICAgfTtcclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59XHJcbmV4cG9ydHMuY29sbGlkZUxpbmVMaW5lID0gY29sbGlkZUxpbmVMaW5lO1xyXG5cclxuZnVuY3Rpb24gY29sbGlkZUxpbmVSZWN0KGxpbmUsIHJlYykgey8veDEsIHkxLCB4MiwgeTIsICAgcngsIHJ5LCBydywgcmhcclxuXHJcbiAgLy9jaGVjayBpZiB0aGUgbGluZSBoYXMgaGl0IGFueSBvZiB0aGUgcmVjdGFuZ2xlJ3Mgc2lkZXMuIHVzZXMgdGhlIGNvbGxpZGVMaW5lTGluZSBmdW5jdGlvbiBhYm92ZVxyXG5cclxuXHRsZXQgbGVmdCA9ICAgdGhpcy5jb2xsaWRlTGluZUxpbmUoeDEseTEseDIseTIsIHJ4LHJ5LHJ4LCByeStyaCk7XHJcblx0bGV0IHJpZ2h0ID0gIHRoaXMuY29sbGlkZUxpbmVMaW5lKHgxLHkxLHgyLHkyLCByeCtydyxyeSwgcngrcncscnkrcmgpO1xyXG5cdGxldCB0b3AgPSAgICB0aGlzLmNvbGxpZGVMaW5lTGluZSh4MSx5MSx4Mix5MiwgcngscnksIHJ4K3J3LHJ5KTtcclxuXHRsZXQgYm90dG9tID0gdGhpcy5jb2xsaWRlTGluZUxpbmUoeDEseTEseDIseTIsIHJ4LHJ5K3JoLCByeCtydyxyeStyaCk7XHJcblx0bGV0IGludGVyc2VjdGlvbiA9IHtcclxuXHRcdFwibGVmdFwiIDogbGVmdCxcclxuXHRcdFwicmlnaHRcIiA6IHJpZ2h0LFxyXG5cdFx0XCJ0b3BcIiA6IHRvcCxcclxuXHRcdFwiYm90dG9tXCIgOiBib3R0b21cclxuXHR9XHJcblxyXG4gIC8vaWYgQU5ZIG9mIHRoZSBhYm92ZSBhcmUgdHJ1ZSwgdGhlIGxpbmUgaGFzIGhpdCB0aGUgcmVjdGFuZ2xlXHJcbiAgaWYgKGxlZnQgfHwgcmlnaHQgfHwgdG9wIHx8IGJvdHRvbSkge1xyXG4gICAgICByZXR1cm4gaW50ZXJzZWN0aW9uO1xyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuZXhwb3J0cy5jb2xsaWRlTGluZVJlY3QgPSBjb2xsaWRlTGluZVJlY3Q7IiwiZXhwb3J0cy5lcnJvciA9IChzdHJpbmcpPT57XHJcblx0bmV3IEVycm9yKHN0cmluZyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJhbmRvbUNvbG9yKCl7XHJcblx0cmV0dXJuIHtcclxuXHRcdHI6IE1hdGguZmxvb3IoMjU1Kk1hdGgucmFuZG9tKCkpLFxyXG5cdFx0ZzogTWF0aC5mbG9vcigyNTUqTWF0aC5yYW5kb20oKSksXHJcblx0XHRiOiBNYXRoLmZsb29yKDI1NSpNYXRoLnJhbmRvbSgpKVxyXG5cdH1cclxufVxyXG5leHBvcnRzLnJhbmRvbUNvbG9yID0gcmFuZG9tQ29sb3I7XHJcblxyXG5leHBvcnRzLm1pZFBvaW50ID0gKHBvaW50MSwgcG9pbnQyKT0+e1xyXG4gICAgbGV0IG1pZGRsZVggPSBwb2ludDIueCAtICgocG9pbnQyLngtcG9pbnQyLngpLzIpO1xyXG4gICAgbGV0IG1pZGRsZVkgPSBwb2ludDIueSAtICgocG9pbnQyLnktcG9pbnQxLnkpLzIpO1xyXG4gICByZXR1cm4ge3g6IG1pZGRsZVgsIHk6IG1pZGRsZVl9O1xyXG59XHJcblxyXG5leHBvcnRzLnJvdGF0ZVBvaW50ID0gKHtjZW50ZXI9e3g6MCwgeTowfSwgcG9pbnQ9e3g6MCwgeTowfSwgYW5nbGU9MH0pPT57XHJcbiAgICAgICAgbGV0IHMgPSBNYXRoLnNpbihhbmdsZSk7XHJcbiAgICAgICAgbGV0IGMgPSBNYXRoLmNvcyhhbmdsZSk7XHJcblxyXG4gICAgICAgIC8vbWFrZSBjb3B5XHJcbiAgICAgICAgbGV0IG5ld1BvaW50ID0ge3g6IHBvaW50LngsIHk6IHBvaW50Lnl9OyBcclxuXHJcbiAgICAgICAgLy8gdHJhbnNsYXRlIHBvaW50IGJhY2sgdG8gb3JpZ2luOlxyXG4gICAgICAgIG5ld1BvaW50LnggLT0gY2VudGVyLng7XHJcbiAgICAgICAgbmV3UG9pbnQueSAtPSBjZW50ZXIueTtcclxuXHJcbiAgICAgICAgLy8gcm90YXRlIHBvaW50XHJcbiAgICAgICAgbGV0IHhuZXcgPSBuZXdQb2ludC54ICogYyAtIG5ld1BvaW50LnkgKiBzO1xyXG4gICAgICAgIGxldCB5bmV3ID0gbmV3UG9pbnQueCAqIHMgKyBuZXdQb2ludC55ICogYztcclxuXHJcbiAgICAgICAgLy8gdHJhbnNsYXRlIHBvaW50IGJhY2s6XHJcbiAgICAgICAgbmV3UG9pbnQueCA9IHhuZXcgKyBjZW50ZXIueDtcclxuICAgICAgICBuZXdQb2ludC55ID0geW5ldyArIGNlbnRlci55O1xyXG4gICAgICAgIHJldHVybiBuZXdQb2ludDtcclxuICAgIH1cclxuXHJcbmV4cG9ydHMuZXh0ZW5kRW5kUG9pbnQgPSAoe3N0YXJ0UG9pbnQsIGVuZFBvaW50LCBsZW5ndGh9KT0+e1xyXG4gICAgbGV0IGN1cnJlbnRsZW5ndGggPSBNYXRoLnNxcnQoXHJcbiAgICAgICAgTWF0aC5wb3coc3RhcnRQb2ludC54IC0gZW5kUG9pbnQueCwgMi4wKSArIFxyXG4gICAgICAgIE1hdGgucG93KHN0YXJ0UG9pbnQueSAtIGVuZFBvaW50LnksIDIuMClcclxuICAgICAgICApO1xyXG4gICAgbGV0IGFtb3VudCA9IGxlbmd0aCAtIGN1cnJlbnRsZW5ndGg7XHJcbiAgICBsZXQgbmV3RW5kUG9pbnQgPSB7XHJcbiAgICAgICAgeDogZW5kUG9pbnQueCArICgoZW5kUG9pbnQueCAtIHN0YXJ0UG9pbnQueCkgLyBjdXJyZW50bGVuZ3RoICogYW1vdW50KSxcclxuICAgICAgICB5OiBlbmRQb2ludC55ICsgKChlbmRQb2ludC55IC0gc3RhcnRQb2ludC55KSAvIGN1cnJlbnRsZW5ndGggKiBhbW91bnQpXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIG5ld0VuZFBvaW50O1xyXG59XHJcblxyXG5mdW5jdGlvbiBkaXN0KHBvaW50MSwgcG9pbnQyKXtcclxuICAgIGxldCBkaWZmWCA9IE1hdGguYWJzKHBvaW50MS54IC0gcG9pbnQyLngpO1xyXG4gICAgbGV0IGRpZmZZID0gTWF0aC5hYnMocG9pbnQxLnkgLSBwb2ludDIueSk7XHJcbiAgICBsZXQgZGlzdGFuY2UgPSBNYXRoLnNxcnQoKE1hdGgucG93KGRpZmZYLCAyKSArIE1hdGgucG93KGRpZmZZLDIpKSwgMik7XHJcbiAgICByZXR1cm4gZGlzdGFuY2U7XHJcbn1cclxuZXhwb3J0cy5kaXN0ID0gZGlzdDtcclxuXHJcbmV4cG9ydHMuY2FsY3VsYXRlQW5nbGUgPSAoe3BvaW50MSwgcG9pbnQyLCBjZW50ZXJQb2ludD17eDowLHk6MH19KT0+e1xyXG4gICAgaWYocG9pbnQxLnggPT09IHBvaW50Mi54ICYmIHBvaW50MS55ID09PSBwb2ludDIueSkgcmV0dXJuIDA7XHJcblxyXG4gICAgbGV0IHAxVHJhbnMgPSB7eDogcG9pbnQxLnggLSBjZW50ZXJQb2ludC54LCB5OiBwb2ludDEueSAtIGNlbnRlclBvaW50Lnl9O1xyXG4gICAgbGV0IHAyVHJhbnMgPSB7eDogcG9pbnQyLnggLSBjZW50ZXJQb2ludC54LCB5OiBwb2ludDIueSAtIGNlbnRlclBvaW50Lnl9O1xyXG4gICAgLy8gbGV0IGRpZmZYICAgPSBwMVRyYW5zLnggLSBwMlRyYW5zLng7XHJcbiAgICAvLyBsZXQgZGlmZlkgICA9IHAxVHJhbnMueSAtIHAyVHJhbnMueTtcclxuICAgIC8vIHZhciBhbmdsZVJhZGlhbnMgPSBNYXRoLmF0YW4yKGRpZmZZLCBkaWZmWCk7XHJcbiAgICBsZXQgYW5nbGVPZlAxID0gTWF0aC5hdGFuMihwMVRyYW5zLnksIHAxVHJhbnMueCk7XHJcbiAgICBsZXQgYW5nbGVPZlAyID0gTWF0aC5hdGFuMihwMlRyYW5zLnksIHAyVHJhbnMueCk7XHJcbiAgICBpZihhbmdsZU9mUDEgPCAwKSBhbmdsZU9mUDEgPSBhbmdsZU9mUDEgKyBNYXRoLlBJKjI7XHJcbiAgICBpZihhbmdsZU9mUDIgPCAwKSBhbmdsZU9mUDIgPSBhbmdsZU9mUDIgKyBNYXRoLlBJKjI7XHJcbiAgICBsZXQgYW5nbGVSYWRpYW5zID0gYW5nbGVPZlAyIC0gYW5nbGVPZlAxO1xyXG4gICAgLy8gaWYoYW5nbGVSYWRpYW5zIDwgMCkgYW5nbGVSYWRpYW5zID0gKGFuZ2xlUmFkaWFucyArIE1hdGguUEkqMik7XHJcbiAgICByZXR1cm4gYW5nbGVSYWRpYW5zO1xyXG4gICAgLy8gbGV0IGFuZ2xlT2ZQMSA9IE1hdGguYXRhbjIocDFUcmFucy54LCBwMVRyYW5zLnkpO1xyXG4gICAgLy8gbGV0IGFuZ2xlT2ZQMiA9IE1hdGguYXRhbjIocG9pbnQyLnkgLSBjZW50ZXJQb2ludC55LCBwb2ludDIueCAtIGNlbnRlclBvaW50LngpO1xyXG4gICAgLy8gaWYoYW5nbGVPZlAxIDwgMCkgYW5nbGVPZlAxID0gYW5nbGVPZlAxICsgTWF0aC5QSSoyO1xyXG4gICAgLy8gaWYoYW5nbGVPZlAyIDwgMCkgYW5nbGVPZlAyID0gYW5nbGVPZlAyICsgTWF0aC5QSSoyO1xyXG4gICAgLy9hbmdsZSBpbiByYWRpYW5zXHJcbiAgICAvLyByZXR1cm4gIGFuZ2xlT2ZQMiAtIGFuZ2xlT2ZQMTtcclxufVxyXG5cclxuZXhwb3J0cy5tYXBOdW0gPSAoe2lucHV0LCBzdGFydDEsIGVuZDEsIHN0YXJ0MiwgZW5kMiB9KT0+e1xyXG4gICAgaWYoaW5wdXQ8c3RhcnQxKSBpbnB1dCA9IHN0YXJ0MTtcclxuICAgIGVsc2UgaWYoaW5wdXQ+ZW5kMSkgaW5wdXQgPSBlbmQxO1xyXG4gICAgbGV0IGRpZmZSYW5nZTEgPSBlbmQxIC0gc3RhcnQxO1xyXG4gICAgbGV0IGZyYWN0aW9uT2ZGaXJzdFJhbmdlID0gKGlucHV0IC0gc3RhcnQxKSAvIGRpZmZSYW5nZTE7XHJcbiAgICBsZXQgZGlmZlJhbmdlMiA9IGVuZDIgLSBzdGFydDI7XHJcbiAgICByZXR1cm4gKGRpZmZSYW5nZTIqZnJhY3Rpb25PZkZpcnN0UmFuZ2UpICsgc3RhcnQyO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbG9uZU9iamVjdChvYmope1xyXG5cdC8vbWFrZSBhIG5ldyBvYmplY3QgdG8gcmV0dXJuXHJcblx0bGV0IG5ld09iaiA9IHt9O1xyXG5cdC8vY29weSBhbGwgcHJvcGVydGllcyBvbnRvIG5ld29iamVjdFxyXG5cdGZvcih2YXIgaWQgaW4gb2JqKXtcclxuXHRcdGxldCBwcm9wZXJ5ID0gb2JqW2lkXTtcclxuXHRcdGlmKHR5cGVvZiBwcm9wZXJ5ID09PSAnb2JqZWN0JyAmJiBwcm9wZXJ5ICE9PSBudWxsKXtcclxuXHRcdFx0bmV3T2JqW2lkXSA9IGNsb25lT2JqZWN0KHByb3BlcnkpO1xyXG5cdFx0fVxyXG5cdFx0aWYocHJvcGVyeSAhPT0gbnVsbCl7XHJcblx0XHRcdG5ld09ialtpZF0gPSBwcm9wZXJ5O1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gbmV3T2JqO1xyXG59XHJcbmV4cG9ydHMuY2xvbmVPYmplY3QgPSBjbG9uZU9iamVjdDtcclxuXHJcbmZ1bmN0aW9uIG1lbW9yeVNpemVPZihvYmopIHtcclxuICAgIHZhciBieXRlcyA9IDA7XHJcblxyXG4gICAgZnVuY3Rpb24gc2l6ZU9mKG9iaikge1xyXG4gICAgICAgIGlmKG9iaiAhPT0gbnVsbCAmJiBvYmogIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBzd2l0Y2godHlwZW9mIG9iaikge1xyXG4gICAgICAgICAgICBjYXNlICdudW1iZXInOlxyXG4gICAgICAgICAgICAgICAgYnl0ZXMgKz0gODtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdzdHJpbmcnOlxyXG4gICAgICAgICAgICAgICAgYnl0ZXMgKz0gb2JqLmxlbmd0aCAqIDI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnYm9vbGVhbic6XHJcbiAgICAgICAgICAgICAgICBieXRlcyArPSA0O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ29iamVjdCc6XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqQ2xhc3MgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKS5zbGljZSg4LCAtMSk7XHJcbiAgICAgICAgICAgICAgICBpZihvYmpDbGFzcyA9PT0gJ09iamVjdCcgfHwgb2JqQ2xhc3MgPT09ICdBcnJheScpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGtleSBpbiBvYmopIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIW9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZU9mKG9ialtrZXldKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgYnl0ZXMgKz0gb2JqLnRvU3RyaW5nKCkubGVuZ3RoICogMjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBieXRlcztcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gZm9ybWF0Qnl0ZVNpemUoYnl0ZXMpIHtcclxuICAgICAgICBpZihieXRlcyA8IDEwMjQpIHJldHVybiBieXRlcyArIFwiIGJ5dGVzXCI7XHJcbiAgICAgICAgZWxzZSBpZihieXRlcyA8IDEwNDg1NzYpIHJldHVybihieXRlcyAvIDEwMjQpLnRvRml4ZWQoMykgKyBcIiBLaUJcIjtcclxuICAgICAgICBlbHNlIGlmKGJ5dGVzIDwgMTA3Mzc0MTgyNCkgcmV0dXJuKGJ5dGVzIC8gMTA0ODU3NikudG9GaXhlZCgzKSArIFwiIE1pQlwiO1xyXG4gICAgICAgIGVsc2UgcmV0dXJuKGJ5dGVzIC8gMTA3Mzc0MTgyNCkudG9GaXhlZCgzKSArIFwiIEdpQlwiO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZm9ybWF0Qnl0ZVNpemUoc2l6ZU9mKG9iaikpO1xyXG59OyAvL21lbW9yeVNpemVPZiBcclxuZXhwb3J0cy5tZW1vcnlTaXplT2YgPSBtZW1vcnlTaXplT2Y7Il0sInNvdXJjZVJvb3QiOiIifQ==