// var Hitbox = require('./Hitbox.js');
var Utilities = require('../shared/Utilities.js');
var Hitbox = require('../shared/Hitbox.js');
var State = require('../shared/State.js');

exports.create = ({
		socketId = Utilities.error('No socketId given'),
		name = getRandomName(),
		//TODO BUG, Currently you can spawn inside a box and get stuck
		x = ((Math.random()*950)-450),
		y = ((Math.random()*950)-450),
		cursorX = 500,
		cursorY = 500,
		speedMultiplier = 300, //increments "pixels" per second
		angle = 0,
		width = 32,
		height = 32,
		color = Utilities.randomColor(),
		energy = 600,
		flashlightFocus = 0.5
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
		hitbox: Hitbox.create({
			id:socketId,
			x:x,
			y:y,
			width:width,
			height:height,
			angle:angle,
		}),
		speedMultiplier: speedMultiplier,
		angle: angle,
		color: color,
		energy:energy,
		flashlightFocus:flashlightFocus,
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
	Hitbox.moveTo(newObj, newObj.x, newObj.y);
	//reset accumulated movement
	newObj.moveByX = 0;
	newObj.moveByY = 0;
	if(newObj.energy>0){
	// newObj.energy = newObj.energy-0.05;
	}
	//update Angle of player based on cursor location relative to player
	calculateAndSetAngleMutate(newObj);
	return newObj;
} //updateCreateNew player

exports.updateMutate = (obj, currentTime)=>{
	// console.log("updateMutate");
	//check for proper parameters
	if(obj == null || obj == undefined) Utilities.error('Player object null or undefined');
	if(obj.type != "Player")            Utilities.error('Object not of type Player');
	if(obj.x == null || obj.y == null)  Utilities.error('Player object missing location');
	
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
	if(newObj.energy>0){
	// newObj.energy = newObj.energy-0.05;
	}
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

exports.focusFlashLightMutate = (obj, action)=>{
	let step = 0.1;
	obj.flashlightFocus = obj.flashlightFocus + (step*action.direction);
	if(obj.flashlightFocus < 0) obj.flashlightFocus = 0;
	else if(obj.flashlightFocus > 1) obj.flashlightFocus = 1;
} // focusFlashLightMutate

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
	if(angleRadians < 0) angleRadians = (angleRadians + Math.PI*2);
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

	// Start a new drawing state
	render.save();
	render.beginPath();
	let translatedLocation = CAMERA.translate({x: obj.x, y: obj.y});
	render.translate(translatedLocation.x, translatedLocation.y);
	//player Name
	render.font = "18px Arial";
	render.fillStyle = `rgba(${obj.color.r}, ${obj.color.g}, ${obj.color.b}, 1)`;
	render.textAlign = "center";
	render.fillText(obj.name, 0, -obj.height);
	//player location for debugging
	render.fillStyle = "black";
	render.fillText(Math.round(obj.x)+","+Math.round(obj.y), 0, obj.height);
	let angleText = Math.round(obj.angle*100)/100+"";
	if(obj.angle < 0) angleText += " ("+(Math.round((obj.angle + Math.PI*2)*100)/100)+")";
	render.fillText(angleText, 0, obj.height*1.5);

	//rotate for player direction facing
	render.rotate(obj.angle);
	//draw main body
	render.fillStyle = `rgba(${obj.color.r}, ${obj.color.g}, ${obj.color.b}, 1)`;
	render.fillRect(-obj.width/2, -obj.width/2, obj.width, obj.height);
	//draw eyes
	render.fillStyle = "blue";
	render.arc(obj.width*0.3, obj.height*0.2,  obj.height/10, 0, 2*Math.PI);
	render.fill();
	render.arc(obj.width*0.3, -obj.height*0.2, obj.height/10, 0, 2*Math.PI);
	render.fill();
	//draw flashlight
	render.fillStyle = "black";
	render.fillRect(obj.width/4, obj.height/2, obj.width/2, obj.height/4);
	//second light
	// render.fillStyle = "black";
	// render.fillRect(15, -30, 20, 10);
	render.closePath();
	render.restore(); // Restore original state
}