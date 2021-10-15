const StatesManager = require('./StateManager.js');
const Controls = require('./clientControls.js');
// const Networking = require('./networking.js');
const Camera = require('./Camera.js');
const Lighting = require('./lighting.js');
// const LineOfSight = require('./lineOfSight.js');
const Hud = require('./hud/hud.js');
const Background = require('./background.js');
const World = require('../shared/World.js');
const Block = require('../shared/Block.js');
const PIXI = require('pixi.js');

//EntityClasses
const EnergyNodeClass = require('./Entities/EnergyNode.js');

module.exports = class clientEngine {
    constructor({
        FRAMERATE = 60,
        DARKNESS = 1, //1 full dark, 0 full light
        BRIGHTNESS = 1, //1 full white, 0 no light
        gridSize = 32,
        // mainCanvas = null,
        pixiAppDiv = null,
        // backgroundCanvas = null,
        // lightingCanvas = null,
        // lineOfSightCanvas = null,
        // hudCanvas = null,
        stage = null
    }) {
        this.STATES = {};
        this.CONTROLS = {};
        this.NETWORK = {};
        this.CAMERA = {};
        this.LIGHTING = {};
        // this.LINEOFSIGHT = {};
        this.HUD = {};
        this.BACKGROUND = {};
        this.WORLD = {};
        this.FRAMERATE = FRAMERATE;
        this.DARKNESS = DARKNESS; //1 full dark, 0 full light
        this.BRIGHTNESS = BRIGHTNESS; //1 full white, 0 no light
        this.gridSize = gridSize;

        this.ENTITY_CLASSES = { EnergyNode: EnergyNodeClass };

        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        this.width = this.screenWidth;
        this.height = this.screenHeight;

        this.pixiApp = new PIXI.Application({ width: this.screenWidth, height: this.screenHeight, backgroundColor: 0x1aa32f });

        //preload all assets
        this.pixiApp.loader
            .add('grassSpriteSheet', 'assets/background/grass.json')
            .add('energyPacketSpriteSheet', 'assets/sprites/EnergyPacket/EnergyPacket.json')
            .add('energyNodeSpriteSheet', 'assets/sprites/EnergyNode/EnergyNode.json');

        this.pixiApp.loader.onProgress.add(this.showLoadingProgress.bind(this));
        this.pixiApp.loader.onComplete.add(this.doneLoading.bind(this));
        this.pixiApp.loader.onError.add(this.errorLoading.bind(this));
        this.pixiApp.loader.load();

        this.pixiApp.stage.sortableChildren = true;
        pixiAppDiv.appendChild(this.pixiApp.view);
        window.__PIXI_INSPECTOR_GLOBAL_HOOK__ && window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });
        this.mainPixiContainer = new PIXI.Container();
        this.mainPixiContainer.name = 'mainContainer';
        this.mainPixiContainer.zIndex = 1;
        this.pixiApp.stage.addChild(this.mainPixiContainer);
        // console.log('this.mainPixiContainer :>> ', this.mainPixiContainer);

        this.elapsed = 0.0;
        // Listen for frame updates
        this.pixiApp.ticker.add((deltaTime) => {
            this.elapsed += deltaTime;
            // each frame we spin the logo around a bit
            // logo.rotation += Math.cos(this.elapsed / 1000.0) * 360;
        });
        // this.canvas = mainCanvas;
        // this.render = this.canvas.getContext('2d');
        // this.stage = document.getElementById('stage');
        this.stage = stage;

        //drawingTimes
        this.currentTime = new Date().getTime();
        this.lastFrame = this.currentTime;
        this.lastSecond = this.currentTime;
        this.lastFrames = 60;
        this.frames = 0;

        this.isProduction = process.env.NODE_ENV == 'production';
        this.debug = this.isProduction ? false : true;

        //performance
        this.startOfDrawPerformance = performance.now();
        this.endOfDrawPerformance = performance.now();
        this.lastTimeStampPerformance = performance.now();
        this.performanceMetrics = {};

        //update Times
        this.lastUpdateTime = new Date().getTime();
        this.deltaTime = 0;
        this.deltaTimeUpdate = 0;
        this.targetDeltaTime = 50; //20 updates per 1000ms or 1s
        this.accumulatedDeltaTime = 0;
        this.timeTakenToUpdate = 0;

        this.useRealScreenSize = false;

        // this.windowResized();
        // if (this.useRealScreenSize) {
        //     this.width = this.screenWidth;
        //     this.height = this.screenHeight;
        // } else {
        //     let scale = 80;
        //     this.width = 16 * scale;
        //     this.height = 9 * scale;
        // }
        // this.canvas.width = this.width;
        // this.canvas.height = this.height;
        this.renderDistance = Math.ceil(Math.max(this.width, this.height) * 0.6);
        window.addEventListener('resize', this.windowResized.bind(this));

        this.temp = { translatedLocation: { x: 0, y: 0 } };
    } //constructor

    showLoadingProgress(event) {
        console.log('Loading :>> ', event.progress);
    }
    errorLoading(event) {
        console.log('Error :>> ', event.message);
    }
    doneLoading(event) {
        console.log('DONE LOADING');
        this.setup();
    }

    setup() {
        this.CAMERA = new Camera({
            debug: this.isProduction ? false : false,
            x: 0,
            y: 0,
            speed: 0.5,
            engine: this
        });

        //camera position translation
        let cameraTranslation = { x: 0, y: 0 };
        this.CAMERA.translate(cameraTranslation, 0, 0);
        // console.log('cameraTranslation :>> ', cameraTranslation);
        // this.translateMainPixiContainer = new PIXI.ObservablePoint(
        //     () => {
        //         // console.log('position :>> ', this);
        //         this.mainPixiContainer.position = this.translateMainPixiContainer;
        //     },
        //     this,
        //     cameraTranslation.x,
        //     cameraTranslation.y
        // );
        // this.mainPixiContainer.position = this.translateMainPixiContainer;

        this.STATES = new StatesManager({
            debug: this.isProduction ? false : false,
            debugState: this.isProduction ? false : false,
            engine: this
        });
        // this.NETWORK = new Networking({
        //     debug: false,
        //     engine: this
        // });
        this.HUD = new Hud({
            engine: this,
            // canvas: hudCanvas,
            debug: this.isProduction ? false : true,
            debugButton: this.isProduction ? false : false,
            debugCursor: this.isProduction ? false : false
        });
        this.CONTROLS = new Controls({
            debug: this.isProduction ? false : false,
            engine: this
        });
        // this.LIGHTING = new Lighting({
        //     debug: this.isProduction ? false : false,
        //     canvas: lightingCanvas,
        //     engine: this,
        //     darkness: this.DARKNESS, //darkness level 0-1
        //     brightness: this.BRIGHTNESS
        // });
        // // this.LIGHTING.createLightSource({intensity:500}); //defaults to 0,0
        // this.LINEOFSIGHT = new LineOfSight({
        //     debug: this.isProduction ? false : false,
        //     engine: this
        // });
        this.BACKGROUND = new Background({
            debug: this.isProduction ? false : false,
            engine: this
        });
        // this.NETWORK.updateServerTimeDiffernce();

        //generate world on client
        this.WORLD = World.create({
            width: 10000,
            height: 10000,
            gridSize: 32
        });
        // World.createBoundaries(this.WORLD);
        // World.randomWorld(this.WORLD);
    }

    windowResized() {
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        if (this.useRealScreenSize) {
            this.width = this.screenWidth;
            this.height = this.screenHeight;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.renderDistance = Math.ceil(Math.max(this.width, this.height) * 0.6);
        }
        this.scaleX = this.screenWidth / this.width;
        this.scaleY = this.screenHeight / this.height;
        this.stage.style.transformOrigin = '0 0';
        let scaleToFit = Math.min(this.scaleX, this.scaleY);
        // let scaleToCover = Math.max(this.scaleX, this.scaleY);
        // this.stage.style.transform = 'scale(' + scaleToCover + ')';
        this.stage.style.transform = 'scale(' + scaleToFit + ')';
        // this.stage.style.transform = 'scale(' + this.scaleX + ',' + this.scaleY + ')';

        //other canvases
        if (this.HUD.resize) this.HUD.resize();
        if (this.BACKGROUND.resize) this.BACKGROUND.resize();
    } //window Resized

    // update() {
    //updateTimings
    // let performanceStart = performance.now();
    // this.deltaTimeUpdate = this.currentTime - this.lastUpdateTime;
    // this.accumulatedDeltaTime += this.deltaTimeUpdate;

    // this.CAMERA.update();
    // this.HUD.update();
    // this.CONTROLS.update();

    // while (this.accumulatedDeltaTime >= this.targetDeltaTime) {
    //     this.accumulatedDeltaTime -= this.targetDeltaTime;
    //     this.STATES.update(this.targetDeltaTime);
    //     this.lastUpdateTime = new Date().getTime();
    // }

    // let timeTaken = performance.now() - performanceStart;
    // if (this.debug && this.HUD.debug && timeTaken > 2) {
    //     this.HUD.debugUpdate({
    //         timeTakenToUpdate: timeTaken + 'ms'
    //     });
    // }
    // } //update

    performanceCheckPoint(name) {
        this.performanceMetrics[name] = performance.now() - this.lastTimeStampPerformance;
        this.lastTimeStampPerformance = performance.now();
    }

    // draw() {
    //background "wipes" the screen every frame
    //clear the canvas
    // this.render.save();
    // this.render.setTransform(1, 0, 0, 1, 0, 0);
    // this.render.clearRect(0, 0, this.width, this.height);
    // this.render.beginPath();
    // this.render.restore();
    // this.currentTime = new Date().getTime();
    // if (this.debug) {
    //     this.startOfDrawPerformance = performance.now();
    //     this.lastTimeStampPerformance = performance.now();
    // }
    // this.deltaTime = this.currentTime - this.lastFrame;
    // this.lastFrame = this.currentTime;
    // this.frames++;
    // this.BACKGROUND.draw();
    // if (this.debug) this.performanceCheckPoint('backgroundDraw');
    //square at 0,0
    // if (this.debug) {
    //     this.CAMERA.translate(this.temp.translatedLocation, 0, 0);
    // this.render.save();
    // this.render.translate(this.temp.translatedLocation.x, this.temp.translatedLocation.y);
    // this.render.scale(this.CAMERA.zoomLevel, this.CAMERA.zoomLevel);
    // this.render.strokeStyle = 'black';
    // this.render.strokeRect(-10, -10, 20, 20);
    // // render.font = "px Arial";
    // this.render.textAlign = 'center';
    // this.render.fillText('0,0', 0, 0);
    // this.render.restore();
    // }
    // this.STATES.draw(this.deltaTime);
    // if (this.debug) this.performanceCheckPoint('statesDraw');
    // this.LIGHTING.draw(this.deltaTime);
    // if (this.debug) this.performanceCheckPoint('lightingDraw');
    //World drawing
    // let objectsToDraw = {};
    // if (this.WORLD != null && this.WORLD.grid != null) {
    //     objectsToDraw = World.getObjects({
    //         world: this.WORLD,
    //         x: this.CAMERA.x,
    //         y: this.CAMERA.y,
    //         distance: this.renderDistance,
    //         //angle: myPlayer.angle,
    //         fieldOfView: Math.PI / 2 //90 degrees
    //     });
    //     // console.log("objectsToDraw:",objectsToDraw);
    //     for (var id in objectsToDraw) {
    //         let object = objectsToDraw[id];
    //         switch (object.type) {
    //             case 'block':
    //                 Block.draw(object, this.render, this.CAMERA);
    //                 break;
    //             default:
    //                 console.log('Object not recognized to Draw');
    //         }
    //     }
    //     if (!this.BACKGROUND.backgroundGenerated) this.BACKGROUND.updateWithWorldData(this.WORLD);
    // } //if World has been received from Server
    // if (this.debug) this.performanceCheckPoint('worldDraw');
    // if (!this.BACKGROUND.backgroundGenerated) this.BACKGROUND.updateWithWorldData(this.WORLD);
    // this.HUD.draw();
    // if (this.debug) this.performanceCheckPoint('hudDraw');
    //once a second
    // if (this.currentTime % this.lastSecond >= 1000) {
    //     // console.log('origin =>', origin);
    //     // console.log(STATES.state);
    //     // this.NETWORK.updateServerTimeDiffernce();
    //     this.endOfDrawPerformance = performance.now();
    //     if (this.debug && this.HUD.debug) {
    //         this.HUD.debugUpdate({
    //             FrameRate: Math.round(this.lastFrames * 0.8 + this.frames * 0.2),
    //             GameResolution: this.width + ', ' + this.height,
    //             WindowSize: this.screenWidth + ', ' + this.screenHeight,
    //             // Ping: this.NETWORK.ping,
    //             // timeDiffernce: this.NETWORK.timeDiffernce,
    //             // objectsToDraw: Object.keys(objectsToDraw).length,
    //             // renderDistance: this.renderDistance,
    //             CAMERA: this.CAMERA.x + ', ' + this.CAMERA.y,
    //             deltaTime: this.deltaTime,
    //             timeBackground: Math.round(this.performanceMetrics['backgroundDraw']) + 'ms',
    //             // timeStateDraw: Math.round(this.performanceMetrics['statesDraw']) + 'ms',
    //             // timeLightingDrawDraw: Math.round(this.performanceMetrics['lightingDraw']) + 'ms',
    //             // timeWorldDraw:
    //             //     Math.round(
    //             //         (this.performanceMetrics['worldDraw'] / (this.endOfDrawPerformance - this.startOfDrawPerformance)) * 100
    //             //     ) + '%',
    //             timeHudDraw: Math.round(this.performanceMetrics['hudDraw']) + 'ms'
    //         });
    //     }
    //     this.lastSecond = this.currentTime;
    //     this.lastFrames = this.frames;
    //     this.frames = 0;
    // }
    // } //draw
}; //clientEngine class
