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

function colliding(hitbox1, hitbox2) {
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
	let translatedHitbox = Utilities.cloneObject(hitbox);
	translatedHitbox.top = translatedHitbox.top + y;
	translatedHitbox.bottom = translatedHitbox.bottom + y;
	translatedHitbox.left = translatedHitbox.left + x;
	translatedHitbox.right = translatedHitbox.right + x;
	return translatedHitbox;
}; //translate
exports.translate = translate;