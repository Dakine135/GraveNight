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
	console.log("hitbox: ",hitbox);
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