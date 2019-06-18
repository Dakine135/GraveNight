class Networking{
	constructor({debug=false}){
		console.log("Create Networking");
		this.debug = debug;
		this.socket = io();
		this.mySocketId = null;
		this.ping = 100;
		this.timeDiffernce = null;
		this.timeDiffernceArray = [];

		this.socket.on('start', this.clientConnects.bind(this));
		this.socket.on('serverGameState', this.processGameState.bind(this));

	}//constructor

	clientConnects(data){
		//create local player with socket Id
		this.mySocketId = data.socketId;
	} //clientConnects

	processGameState(data){
		if(this.debug) console.log("Networking:",data);
		STATES.reciveServerState(data);
	} //processGameState

	sendClientAction(data){
		data.time = new Date().getTime();
		this.socket.emit('clientAction', data);
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
                    // GAMESTATE.GUI.timeDiffernceText.content = "Time Differnce: Calculating";
                }
                this.timeDiffernceArray.push(timeDiffernce);
                //console.log(timeDiffernce);
                setTimeout(function(){
                    this.updateServerTimeDiffernce();
                }, 3000);
            });

        } else {
            //calculate standard deviation and mean, then set timeDiffernce
            this.timeDiffernceArray.sort();
            console.log(this.timeDiffernceArray);
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
            totalCount = 0;
            this.timeDiffernceArray.forEach((time) => {
              if(time < standardDeviation){
                sumOfCluster += time;
                totalCount++;
              }
            });
            this.timeDiffernce = sumOfCluster / totalCount;
            // GAMESTATE.GUI.timeDiffernceText.content = "Time Differnce: " + this.timeDiffernce;
            //console.log("this.timeDiffernce: ",this.timeDiffernce);
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


