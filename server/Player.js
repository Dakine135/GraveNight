module.exports = class Player{
	constructor({
		socketId = 0,
		name = getRandomName(),
		x = 500,
		y = 500
	}){
		this.socketId = socketId;
		this.name = name;
		this.x = x,
		this.y = y
	}

	getRandomName(){
		let names = ["Cornell", "Ward", "Perry", "Solomon", "Donnell", "Antonia", "Billie", "Grover", "Vaughn", "Jarvis", "Kenneth", "Agustin", "Rickey", "Alfonso", "Derick", "Angel", "Demarcus", "Ivory", "Heath", "Toney", "Barry", "Matthew", "Kasey", "Del", "Kirby", "Jeff", "Anibal", "Markus", "Armand", "Bernardo", "Jan", "Mckinley", "Scott", "Jerrold", "Kristofer", "Yong", "Reinaldo", "Blaine", "Leif", "Vincenzo", "Tad", "Donald", "Preston", "Harvey", "Leonel", "Eusebio", "Joseph", "Jake", "Robin", "Hollis"];
		let randomIndex = Math.floor(Math.random() * names.length);
		let randomNumber = Math.floor(Math.random() * 1000);
		return names[randomIndex] + randomNumber;

	}
}//end player class