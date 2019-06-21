module.exports = class Hitbox{
	constructor({
		top=0,
		bottom = 0,
		left = 0,
		right=0
	}){
    this.top = top;
	this.bottom = bottom;
	this.left = left;
	this.right = right;
    }
    collision(otherHitbox) {
    	if(this.top > otherHitbox.bottom ||
    	   this.bottom < otherHitbox.top ||
    	   this.right < otherHitbox.left ||
    	   this.left > otherHitbox.right) {
	return false;
}
return true;
    }
}