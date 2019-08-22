var World = require('../../shared/World.js');
module.exports = class Networking{
	constructor({debug=false, STATES=null, WORLD=null}){
		console.log("Create Networking");
        if(STATES==null) throw new error("Networking Needs STATES");
        this.STATES = STATES;
        this.WORLD = WORLD;
		this.debug = debug;
		this.socket = io();
		this.mySocketId = null;
		this.ping = 100;
		this.timeDiffernce = null;
		this.timeDiffernceArray = [];

		this.socket.on('start', this.clientConnects.bind(this));
		this.socket.on('serverGameState', this.processGameState.bind(this));
        this.socket.on('world', this.reciveWorld.bind(this));

	}//constructor

    getMyPlayer(){
        return this.STATES.getPlayer(this.mySocketId);
    }

	clientConnects(data){
		//create local player with socket Id
		this.mySocketId = data.socketId;
	} //clientConnects

	processGameState(data){
		if(this.debug) console.log("Networking:",data);
		this.STATES.reciveServerState(data);
	} //processGameState

    reciveWorld(data){
        console.log("world:",data);
        World.create({
              width:data.width,
              height:data.height,
              gridSize:data.gridSize,
              saveTo: this.WORLD
        });
        this.WORLD.grid = data.grid;
        this.STATES.nextState.world = this.WORLD;
        console.log(this.WORLD.grid);
    }

	sendClientAction(data){
		this.socket.emit('clientAction', data);
	}

    sendServerNetworkInfo(){
        this.socket.emit('clientNetworkInfo', {
            ping: this.ping,
            timeDiffernce: this.timeDiffernce
        });
    }

	getServerTimeStamp(){
        return new Promise(function(resolve){
            this.socket.emit('sendPing');
            this.socket.on('pong', function(serverTimeStamp){
                //console.log("serverTimeStamp: ", serverTimeStamp);
                resolve(serverTimeStamp);
            });
        }.bind(this));
    }//end ping server

	
    updateServerTimeDiffernce(){
        if(this.timeDiffernceArray.length < 5){
            this.getServerTimeDiffernce().then((timeDiffernce) => {
                if(this.timeDiffernce == null){
                    this.timeDiffernce = timeDiffernce;
                    //still calculating
                }
                this.timeDiffernceArray.push(timeDiffernce);
                // console.log(timeDiffernce);
                setTimeout(function(){
                    this.updateServerTimeDiffernce();
                }.bind(this), 100);
            });

        } else {
            //calculate standard deviation and mean, then set timeDiffernce
            this.timeDiffernceArray.sort();
            // console.log(this.timeDiffernceArray);
            var midIndex = Math.floor(this.timeDiffernceArray.length / 2);
            var mean = this.timeDiffernceArray[midIndex];
            //console.log("Mean: ", mean);
            var squareSum = 0;
            for(var i=0; i<this.timeDiffernceArray.length; i++){
              var diff = mean - this.timeDiffernceArray[i];
              var square = Math.pow(diff, 2);
              squareSum += square;
            }
            var avgSquaredDistance = squareSum / this.timeDiffernceArray.length;
            var standardDeviation = Math.pow(avgSquaredDistance, 0.5);
            //console.log("standardDeviation: ", standardDeviation);
            var sumOfCluster = 0;
            var totalCount = 0;
            this.timeDiffernceArray.forEach((time) => {
              if(time < standardDeviation){
                sumOfCluster += time;
                totalCount++;
              }
            });
            this.timeDiffernce = sumOfCluster / totalCount;
            this.timeDiffernceArray = [];
            this.sendServerNetworkInfo();
        }
    } //end updateServerTimeDiffernce

    getServerTimeDiffernce(){
        var timeSent = new Date().getTime();
        //ping server and recieve server timestamp (time received from server's prespective)
        var serverTimePromise = this.getServerTimeStamp();
        return serverTimePromise.then((serverTime) => {
            //take time when recieved on client, this is the round-trip time
            var timeRecieved = new Date().getTime();
            var roundTripTime = timeRecieved - timeSent;
            this.ping = Math.round(0.75 * roundTripTime + (0.25) * this.ping);
            // GAMESTATE.GUI.pingText.content = "Ping: " + this.ping;
            //half that for the one-way time delay
            var delay = roundTripTime / 2;
            //subtract travel time from servers timestamp
            var adjustedServerTime = serverTime - delay;
            //now you can calculate differnce in server and client time
            var timeDiffernce = adjustedServerTime - timeSent;
            // console.log("Time Sent:          ", timeSent);
            // console.log("Time Recieved:      ", timeRecieved);
            // console.log("serverTime:         ", serverTime);
            // console.log("roundTripTime:      ", roundTripTime);
            // console.log("Delay:              ", delay);
            // console.log("adjustedServerTime: ", adjustedServerTime);
            //console.log("timeDiffernce:      ", timeDiffernce);
            return new Promise(function(resolve){
                resolve(timeDiffernce);
            });
        });
    }//end getServerTimeDiffernce

}//NETWORKING


