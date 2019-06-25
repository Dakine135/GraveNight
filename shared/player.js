// var Hitbox = require('./Hitbox.js');
var Utilities = require('../shared/Utilities.js');

exports.create = ({
		socketId = Utilities.error('No socketId given'),
		name = getRandomName(),
		x = 500,
		y = 500,
		cursorX = 500,
		cursorY = 500,
		vX = 0,
		vY = 0,
		speedMultiplier = 5,
		angle = 0,
		size = 50,
		color = randomColor()
	}) => {
	return {
		id: socketId, //might change later to something else more persistant
		socketId: socketId,
		type: 'Player',
		name: name,
		x: x,
		y: y,
		cursorX: cursorX,
		cursorY: cursorY,
		vX: vX,
		vY: vY,
		size: size,
		speedMultiplier: speedMultiplier,
		angle: angle,
		color: color
	};
}//create new player

exports.updateCreateNew = (obj)=>{
	//check for proper peramteres
	if(obj == null || obj == undefined) Utilities.error('Player object null or undefined');
	if(obj.type != "Player") Utilities.error('Object not of type Player');
	if(obj.x == null || obj.y == null) Utilities.error('Player object missing location');

	let newObj = Utilities.cloneObject(obj);
	//actualt do update on new object
	newObj.x = newObj.x + (newObj.vX * newObj.speedMultiplier);
	newObj.y = newObj.y + (newObj.vY * newObj.speedMultiplier);
	return newObj;
} //updateCreateNew player

exports.updateMutate = (obj)=>{
	//check for proper peramteres
	if(obj == null || obj == undefined) Utilities.error('Player object null or undefined');
	if(obj.type != "Player") Utilities.error('Object not of type Player');
	if(obj.x == null || obj.y == null) Utilities.error('Player object missing location');

	//actualt do update on new object
	obj.x = obj.x + (obj.vX * obj.speedMultiplier);
	obj.y = obj.y + (obj.vY * obj.speedMultiplier);
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

exports.setMovementMutate = (obj, action)=>{
	if(action.pressed){
		if(action.x != 0) obj.vX += action.x;
		if(action.y != 0) obj.vY += action.y;
	} else {
		if(action.x != 0) obj.vX -= action.x;
		if(action.y != 0) obj.vY -= action.y;
	}
} //set movement

exports.setAngleMutate = (obj, action)=>{
	// console.log(action);
	obj.angle = action.angle;
}

function getRandomName(){
	let names = ["Cornell", "Ward", "Perry", "Solomon", "Donnell", "Antonia", "Billie", "Grover", "Vaughn", "Jarvis", "Kenneth", "Agustin", "Rickey", "Alfonso", "Derick", "Angel", "Demarcus", "Ivory", "Heath", "Toney", "Barry", "Matthew", "Kasey", "Del", "Kirby", "Jeff", "Anibal", "Markus", "Armand", "Bernardo", "Jan", "Mckinley", "Scott", "Jerrold", "Kristofer", "Yong", "Reinaldo", "Blaine", "Leif", "Vincenzo", "Tad", "Donald", "Preston", "Harvey", "Leonel", "Eusebio", "Joseph", "Jake", "Robin", "Hollis", "Graham", "Dustin", "Alex"];
	let randomIndex = Math.floor(Math.random() * names.length);
	let randomNumber = Math.floor(Math.random() * 1000);
	return names[randomIndex] + randomNumber;
}
exports.getRandomName = getRandomName;

function randomColor(){
	return {
		r: Math.floor(255*Math.random()),
		g: Math.floor(255*Math.random()),
		b: Math.floor(255*Math.random())
	}
}
exports.randomColor = randomColor;

function calculateAngle(obj, mouseX, mouseY, sk){
	let v1 = sk.createVector(mouseX-obj.x, mouseY-obj.y);
	let v2 = sk.createVector(1,0);
	let angle = v1.angleBetween(v2);
	//angle = acos((v1.dot(v2))/(abs(v1.mag())*abs(v2.mag())));
	if(mouseY <= obj.y) angle = -angle;
	return angle;
}
exports.calculateAngle = calculateAngle;

exports.draw = (obj, render)=>{
	// console.log("drawing");
	render.push(); // Start a new drawing state
	render.noStroke();
	render.translate(obj.x, obj.y);
	render.textSize(18);
	render.fill(obj.color.r, obj.color.g, obj.color.b);
	render.textAlign(render.CENTER);
	render.text(obj.name, 0, -obj.size);
	render.rotate(obj.angle);
	render.rect (0, 0, obj.size, obj.size);
	render.fill(0, 0, 255);
	render.circle(15, 10, 10);
	render.circle(15, -10, 10);
	render.fill(0);
	render.rect(25, 25, 20, 10);
	render.pop(); // Restore original state
}