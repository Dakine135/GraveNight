// var Hitbox = require('./Hitbox.js');
var Utilities = require('../shared/Utilities.js');
var Hitbox = require('../shared/Hitbox.js');
var State = require('../shared/State.js');

exports.create = ({
		socketId = Utilities.error('No socketId given'),
		name = getRandomName(),
		x = ((Math.random()*1900)-1000),
		y = ((Math.random()*1900)-1000),
		cursorX = 500,
		cursorY = 500,
		speedMultiplier = 300, //increments "pixels" per second
		angle = 0,
		width = 50,
		height = 50,
		hitbox = Hitbox.create({
			top: -height/2,
			bottom: height/2,
			left: -width/2,
			right: width/2
		}),
		color = Utilities.randomColor(),
		energy = 200
	}) => {
	return {
		id: socketId, //might change later to something else more persistent
		socketId: socketId,
		type: 'player',
		name: name,
		x: x,
		y: y,
		cursorX: cursorX,
		cursorY: cursorY,
		vX: 0,
		vY: 0,
		width: width,
		height: height,
		hitbox: hitbox,
		speedMultiplier: speedMultiplier,
		angle: angle,
		color: color,
		energy:energy,
		//just server stuff
		ping: 0,
		timeDiffernce: 0,
		//accumulate total movement for tick based on time stamps of client actions
		moveByX: 0, 
		moveByY: 0,
		lastActionTime: 0
	};
}//create new player

exports.updateCreateNew = (obj, currentTime)=>{
	//check for proper peramteres
	if(obj == null || obj == undefined) Utilities.error('Player object null or undefined');
	if(obj.type != "Player") Utilities.error('Object not of type Player');
	if(obj.x == null || obj.y == null) Utilities.error('Player object missing location');

	let newObj = Utilities.cloneObject(obj);
	//actually do update on new object
	//do final calculations on movement to account for buttons held for the duration of the tick
	let deltaTime = currentTime - newObj.lastActionTime;
	newObj.lastActionTime = currentTime;
	if(deltaTime > 0) accumulateMovementMutate(newObj, deltaTime);
	//apply movement
	newObj.x += newObj.moveByX;
	newObj.y += newObj.moveByY;
	newObj.cursorX += newObj.moveByX;
	newObj.cursorY += newObj.moveByY;
	//reset accumulated movement
	newObj.moveByX = 0;
	newObj.moveByY = 0;
	//update Angle of player based on cursor location relative to player
	calculateAndSetAngleMutate(newObj);
	return newObj;
} //updateCreateNew player

exports.updateMutate = (obj, currentTime)=>{
	// console.log("updateMutate");
	//check for proper parameters
	if(obj == null || obj == undefined) Utilities.error('Player object null or undefined');
	if(obj.type != "Player") Utilities.error('Object not of type Player');
	if(obj.x == null || obj.y == null) Utilities.error('Player object missing location');
	
	//actually do update on new object
	//do final calculations on movement to account for buttons held for the duration of the tick
	let deltaTime = currentTime - obj.lastActionTime;
	// if(deltaTime <= 0) console.log(`${currentTime} - ${obj.lastActionTime} = ${deltaTime}`);
	obj.lastActionTime = currentTime;
	if(deltaTime > 0) accumulateMovementMutate(obj, deltaTime);

	//check new location for collision
	// let nextX = obj.x + obj.moveByX;
	// let nextY = obj.y + obj.moveByY;
	// let myHitbox = Hitbox.translate(nextX, nextY, obj.hitbox);
	//get object you are colliding with or null
	// let colliding = State.getColliding(state, myHitbox);
	//handle collision


	//apply movement
	obj.x += obj.moveByX;
	obj.y += obj.moveByY;
	obj.cursorX += obj.moveByX;
	obj.cursorY += obj.moveByY;
	//reset accumulated movement
	obj.moveByX = 0;
	obj.moveByY = 0;
	//update Angle of player based on cursor location relative to player
	calculateAndSetAngleMutate(obj);

} //updateMutate player

exports.updateFromPlayerMutate = (playerObj, newData)=>{
	for(var id in newData){
		playerObj[id] = newData[id];
	}
}

exports.updateFromPlayerCreateNew = (playerObj, newData)=>{
	let newObj = Utilities.cloneObject(playerObj);
	for(var id in newData){
		newObj[id] = newData[id];
	}
	return newObj;
}

exports.setMovementDirectionMutate = (obj, action)=>{
	// console.log(action);
	let deltaTime = action.time - obj.lastActionTime;
	obj.lastActionTime = action.time;
	if(deltaTime > 0) accumulateMovementMutate(obj, deltaTime);

	//change direction based on new action
	if(action.pressed){ //adding movement
		if(action.x != 0) obj.vX += action.x;
		if(action.y != 0) obj.vY += action.y;
	} else { //stopping movement
		if(action.x != 0) obj.vX -= action.x;
		if(action.y != 0) obj.vY -= action.y;
	}
} //set setMovementMutate

/*
Input:
	obj = Player object
Output:
	NONE, mutates object input
Description:
	accumulates any movement changes within a tick to account for multiple button presses within a tick to properly apply the effect instead of just the last action
*/
function accumulateMovementMutate(obj, deltaTime){
	//set Movement by time since last change based on current direction
	// console.log("accumulateMovementMutate deltaTime:",deltaTime);
	if(deltaTime <= 0){ console.log("deltaTime not positive", deltaTime); return;}
	let amountToMove = obj.speedMultiplier * (deltaTime/1000);
	obj.moveByX = obj.moveByX + (obj.vX * amountToMove);
	obj.moveByY = obj.moveByY + (obj.vY * amountToMove);
	// console.log(`moveByX:${obj.moveByX}, moveByY:${obj.moveByY}`);
}

exports.setCursorMutate = (obj, action)=>{
	// console.log(action);
	obj.cursorX = action.x;
	obj.cursorY = action.y;
}

function calculateAndSetAngleMutate(obj){
	let diffX = obj.cursorX - obj.x;
	let diffY = obj.cursorY - obj.y;
	// angle in radians
	var angleRadians = Math.atan2(diffY, diffX);
	// angle in degrees
	// var angleDeg = angleRadians * 180 / Math.PI;
	obj.angle = angleRadians;
}
exports.calculateAndSetAngleMutate = calculateAndSetAngleMutate;

function getRandomName(){
	let names = ["Cornell", "Ward", "Perry", "Solomon", "Donnell", "Antonia", "Billie", "Grover", "Vaughn", "Jarvis", "Kenneth", "Agustin", "Rickey", "Alfonso", "Derick", "Angel", "Demarcus", "Ivory", "Heath", "Toney", "Barry", "Matthew", "Kasey", "Del", "Kirby", "Jeff", "Anibal", "Markus", "Armand", "Bernardo", "Jan", "Mckinley", "Scott", "Jerrold", "Kristofer", "Yong", "Reinaldo", "Blaine", "Leif", "Vincenzo", "Tad", "Donald", "Preston", "Harvey", "Leonel", "Eusebio", "Joseph", "Jake", "Robin", "Hollis", "Graham", "Dustin", "Alex"];
	let randomIndex = Math.floor(Math.random() * names.length);
	let randomNumber = Math.floor(Math.random() * 1000);
	return names[randomIndex] + randomNumber;
}
exports.getRandomName = getRandomName;

exports.draw = (obj, render, CAMERA)=>{
	// console.log("drawing");
	// console.log("drawing player:", CAMERA);
	render.push(); // Start a new drawing state
	render.noStroke();
	// render.translate(obj.x, obj.y);
	let translatedLocation = CAMERA.translate(obj.x, obj.y);
	render.translate(translatedLocation.x, translatedLocation.y);
	//player Name
	render.textSize(18);
	render.fill(obj.color.r, obj.color.g, obj.color.b);
	render.textAlign(render.CENTER);
	render.text(obj.name, 0, -obj.height);
	//player location for debugging
	render.fill(0);
	render.text(Math.round(obj.x)+","+Math.round(obj.y), 0, obj.height);

	//rotate for player direction facing
	render.rotate(obj.angle);
	//draw main body
	render.fill(obj.color.r, obj.color.g, obj.color.b);
	render.rect (0, 0, obj.width, obj.height);
	//draw eyes
	render.fill(0, 0, 255);
	render.circle(15, 10, 10);
	render.circle(15, -10, 10);
	//draw flashlight
	render.fill(0);
	render.rect(25, 25, 20, 10);
	render.pop(); // Restore original state
}