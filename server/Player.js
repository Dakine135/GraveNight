module.exports = class Player{
	constructor({
		socketId = this.throwError('No socketId given'),
		name = this.getRandomName(),
		x = 500,
		y = 500,
		vX = 0,
		vY = 0,
		speedMultiplier = 5
	}){
		this.socketId = socketId;
		this.name = name;
		this.x = x;
		this.y = y;
		this.vX = vX;
		this.vY = vY;
		this.speedMultiplier = speedMultiplier;
	}

	getRandomName(){
		let names = ["Cornell", "Ward", "Perry", "Solomon", "Donnell", "Antonia", "Billie", "Grover", "Vaughn", "Jarvis", "Kenneth", "Agustin", "Rickey", "Alfonso", "Derick", "Angel", "Demarcus", "Ivory", "Heath", "Toney", "Barry", "Matthew", "Kasey", "Del", "Kirby", "Jeff", "Anibal", "Markus", "Armand", "Bernardo", "Jan", "Mckinley", "Scott", "Jerrold", "Kristofer", "Yong", "Reinaldo", "Blaine", "Leif", "Vincenzo", "Tad", "Donald", "Preston", "Harvey", "Leonel", "Eusebio", "Joseph", "Jake", "Robin", "Hollis"];
		let randomIndex = Math.floor(Math.random() * names.length);
		let randomNumber = Math.floor(Math.random() * 1000);
		return names[randomIndex] + randomNumber;
	}

	setMovement(action){
		if(action.pressed){
			if(action.x != 0) this.vX += action.x;
			if(action.y != 0) this.vY += action.y;
		} else {
			if(action.x != 0) this.vX -= action.x;
			if(action.y != 0) this.vY -= action.y;
		}
	}

	update(){
		this.x = this.x + (this.vX * this.speedMultiplier);
		this.y = this.y + (this.vY * this.speedMultiplier);
	}

	throwError(error){
    	throw new Error(error);
  	}
}//end player class