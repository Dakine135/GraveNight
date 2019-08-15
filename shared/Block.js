var Hitbox = require('../shared/Hitbox.js');
var Utilities = require('../shared/Utilities.js');

exports.create = ({
	id=0,
	x=0,
	y=0,
	width = 50,
	height = 50,
	angle=0,
	color = Utilities.randomColor() //{r:0, g:0, b:0}
})=>{
	return {
		id:id,
		type:"block",
		x:x,
		y:y,
		width:width,
		height:height,
		hitbox: Hitbox.create({
			id:id,
			x:x,
			y:y,
			width:width,
			height:height,
			angle:angle,
		}),
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