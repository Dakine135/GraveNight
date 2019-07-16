var Hitbox = require('../shared/Hitbox.js');
var Utilities = require('../shared/Utilities.js');

exports.create = ({
	id=0,
	x=0,
	y=0,
	width = 50,
	height = 50,
	hitbox = Hitbox.create({
			top: -height/2,
			bottom: height/2,
			left: -width/2,
			right: width/2
		}),
	color = {r: 255, g:0, b:0}
})=>{
	return {
		id:id,
		type:"block",
		x:x,
		y:y,
		width:width,
		height:height,
		hitbox: hitbox,
		color:color
	}
} //create

exports.draw = (obj, render, CAMERA)=>{
	render.push(); // Start a new drawing state
	render.noStroke();
	let translatedLocation = CAMERA.translate({x: obj.x, y: obj.y});
	render.translate(translatedLocation.x, translatedLocation.y);
	//draw block
	render.fill(obj.color.r, obj.color.g, obj.color.b);
	render.rect (-obj.width/2, -obj.height/2, obj.width, obj.height);
	render.pop();
}//draw