exports.error = (string)=>{
	new Error(string);
}

function randomColor(){
	return {
		r: Math.floor(255*Math.random()),
		g: Math.floor(255*Math.random()),
		b: Math.floor(255*Math.random())
	}
}
exports.randomColor = randomColor;

exports.midPoint = (point1, point2)=>{
    let middleX = point2.x - ((point2.x-point2.x)/2);
    let middleY = point2.y - ((point2.y-point1.y)/2);
   return {x: middleX, y: middleY};
}

function cloneObject(obj){
	//make a new object to return
	let newObj = {};
	//copy all properties onto newobject
	for(var id in obj){
		let propery = obj[id];
		if(typeof propery === 'object' && propery !== null){
			newObj[id] = cloneObject(propery);
		}
		if(propery !== null){
			newObj[id] = propery;
		}
	}
	return newObj;
}
exports.cloneObject = cloneObject;

function memorySizeOf(obj) {
    var bytes = 0;

    function sizeOf(obj) {
        if(obj !== null && obj !== undefined) {
            switch(typeof obj) {
            case 'number':
                bytes += 8;
                break;
            case 'string':
                bytes += obj.length * 2;
                break;
            case 'boolean':
                bytes += 4;
                break;
            case 'object':
                var objClass = Object.prototype.toString.call(obj).slice(8, -1);
                if(objClass === 'Object' || objClass === 'Array') {
                    for(var key in obj) {
                        if(!obj.hasOwnProperty(key)) continue;
                        sizeOf(obj[key]);
                    }
                } else bytes += obj.toString().length * 2;
                break;
            }
        }
        return bytes;
    };

    function formatByteSize(bytes) {
        if(bytes < 1024) return bytes + " bytes";
        else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KiB";
        else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MiB";
        else return(bytes / 1073741824).toFixed(3) + " GiB";
    };

    return formatByteSize(sizeOf(obj));
}; //memorySizeOf 
exports.memorySizeOf = memorySizeOf;