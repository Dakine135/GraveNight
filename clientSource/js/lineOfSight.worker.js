const Utilities = require('../../shared/Utilities.js');
const Hitbox = require('../../shared/Hitbox.js');

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