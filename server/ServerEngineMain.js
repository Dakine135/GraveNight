var StateManager = require('./StateManager.js');

module.exports = class Engine {
  constructor({
    ticRate=20,
    debugEngine=false,
    debugStateManager=false,
    debugStates=false,
    verbose=false,
    io=this.throwError("socket io not provided to server")
  }){
    console.log("create game instance tickRate is %s",ticRate);
    this.id = null;
    this.io = io;
    this.tickCount = 0;
    this.timeStep = 1000 / this.ticRate;
    this.running = false;
    this.debug = debugEngine;
    this.verbose = verbose;

    this.secondsIntoNanoseconds = 1e9;
    this.nanosecondsIntoSeconds = 1 / this.secondsIntoNanoseconds;
    this.millisecondsIntoNanoseconds = 1e6;
    this.nanosecondsIntoMiliseconds = 1/this.millisecondsIntoNanoseconds;

    //for MainLoop
    this.ticRate = ticRate * this.millisecondsIntoNanoseconds;
    this.previousTime = this.getCurrentTimeInNanoseconds();
    this.targertNextTickTime = this.getCurrentTimeInNanoseconds();
    this.acumulatedTime = 0;

    //StateManager
    this.stateManager = new StateManager({debug:debugStateManager, debugStates:debugStates, verbose:verbose});
  }//constructor

  getCurrentTimeInNanoseconds() {
    //see https://nodejs.org/api/process.html#process_process_hrtime_time
    var hrtime = process.hrtime();
    return (+hrtime[0]) * this.secondsIntoNanoseconds + (+hrtime[1]);
  }

  mainLoop(){
    if(!this.running) return;

    let now = this.getCurrentTimeInNanoseconds();

    if(now >= this.targertNextTickTime){
      let deltaTime = now - this.previousTime;
      this.acumulatedTime = this.acumulatedTime + deltaTime;

      this.previousTime = now;
      this.targertNextTickTime = now + this.ticRate;
      //run update
      while(this.acumulatedTime >= this.ticRate){
        this.tickCount++;
        this.acumulatedTime = this.acumulatedTime - this.ticRate;
        if((this.tickCount % 1) == 0){
          if(this.debug) console.log(`GameTick=${this.tickCount}, deltaTime=${(deltaTime * this.nanosecondsIntoMiliseconds)}`);
        }
        this.update();

      }
    }

    let remainingTimeInTick = this.targertNextTickTime - this.getCurrentTimeInNanoseconds();
		setTimeout(this.mainLoop.bind(this), (this.tickRate * this.nanosecondsIntoMiliseconds));

  }//end mainLoop

  start(){
    this.running = true;
    console.log('start Engine MainLoop');
    this.mainLoop();
  }//end start function

  stop(){
    //stop the loop
    console.log('start Engine MainLoop');
    this.running = false;
  }

  update(){
    this.stateManager.createNextState(this.tickCount);
    this.sendGameStateToClients(this.tickCount);
  }

  sendGameStateToClients(tick){
    //current state is none specified
    this.io.emit('serverGameState', this.stateManager.package({tick:tick})); 
  }

  updatePlayerNetworkData(data){
    if(this.debug) console.log(`network update:`,data);
    this.stateManager.updatePlayerNetworkData(data);
  }

  addPlayer(info){
    this.stateManager.addPlayer(info);
  }

  removePlayer(info){
    this.stateManager.removePlayer(info);
  }

  clientAction(data){
    if(this.debug) console.log(`clientAction:`,data);
    this.stateManager.addAction(data);
  }

  throwError(error){
    throw new Error(error);
  }

}//end class Engine