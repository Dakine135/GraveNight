exports.error = (string)=>{
	new Error(string);
}

exports.cloneObject = (obj)=>{
	//make a new object to return
	let newObj = {};
	//copy all properties onto newobject
	for(var id in obj){
		newObj[id] = obj[id];
	}
	return newObj;
}