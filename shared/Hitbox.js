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