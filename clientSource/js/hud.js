function HUD({
	debug=false
}){
	this.canvas = null;
	this.render = null;
	this.viewWidth = 0;
	this.viewHeight = 0;
	this.debug = debug;
	this.debugVars = {};
	this.debugTemplateText = function(){return "";};
	this.debugText = "";

}//HUD

exports.HUD = HUD;