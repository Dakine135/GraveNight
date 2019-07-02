function HUD({
	debug=false
}){
	this.canvas = null;
	this.render = null;
	this.viewWidth = 0;
	this.viewHeight = 0;
	this.debug = debug;
	this.debugTemplateText = "";

	this.updateDebugTextTemplate = (variables,text)=>{

	}
}//HUD

exports.HUD = HUD;