const StatesManager = require('./StateManagerClient.js');
const Controls = require('./clientControls.js');
// const Networking = require('./networking.js');
const Camera = require('./Camera.js');
// const Lighting = require('./lighting.js');
// const LineOfSight = require('./lineOfSight.js');
const Hud = require('./hud.js');
const Background = require('./background.js');
const World = require('../shared/World.js');
const Block = require('../shared/Block.js');

module.exports = class clientEngine {
    constructor({
        FRAMERATE = 60,
        DARKNESS = 0.5, //1 full dark, 0 full light
        BRIGHTNESS = 0.5, //1 full white, 0 no light
        gridSize = 32,
        mainCanvas = null,
        backgroundCanvas = null,
        lightingCanvas = null,
        lineOfSightCanvas = null,
        hudCanvas = null,
        stage = null
    }) {
        this.STATES = {};
        this.CONTROLS = {};
        this.NETWORK = {};
        this.CAMERA = {};
        // this.LIGHTING = {};
        // this.LINEOFSIGHT = {};
        this.HUD = {};
        this.BACKGROUND = {};
        this.WORLD = {};
        this.FRAMERATE = FRAMERATE;
        this.DARKNESS = DARKNESS; //1 full dark, 0 full light
        this.BRIGHTNESS = BRIGHTNESS; //1 full white, 0 no light
        this.gridSize = gridSize;

        //main layer with players and walls
        // let divId = 'main-layer';
        // this.canvas = document.getElementById(divId);
        this.canvas = mainCanvas;
        this.render = this.canvas.getContext('2d');
        // this.stage = document.getElementById('stage');
        this.stage = stage;

        this.currentTime = new Date().getTime();
        this.lastFrame = this.currentTime;
        this.lastSecond = this.currentTime;
        this.lastFrames = 60;
        this.frames = 0;

        let scale = 80;
        this.width = 16 * scale;
        this.height = 9 * scale;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.renderDistance = Math.ceil(Math.max(this.width, this.height) * 0.6);
        this.windowResized();
        window.addEventListener('resize', this.windowResized.bind(this));

        this.myPlayerId = null;

        this.CAMERA = new Camera({
            debug: false,
            x: 0,
            y: 0,
            speed: 0.1,
            engine: this
        });
        this.STATES = new StatesManager({
            debug: false,
            debugState: false,
            stateInterpolation: false,
            clientSimulation: true,
            engine: this
        });
        // this.NETWORK = new Networking({
        //     debug: false,
        //     engine: this
        // });
        this.CONTROLS = new Controls({
            debug: false,
            engine: this
        });
        this.HUD = new Hud({
            engine: this,
            canvas: hudCanvas
        });
        // this.LIGHTING = new Lighting({
        //     debug: false,
        //     engine: this,
        //     darkness: this.DARKNESS, //darkness level 0-1
        //     brightness: this.BRIGHTNESS
        // });
        // // this.LIGHTING.createLightSource({intensity:500}); //defaults to 0,0
        // this.LINEOFSIGHT = new LineOfSight({
        //     debug: false,
        //     engine: this
        // });
        this.BACKGROUND = new Background({
            debug: false,
            engine: this,
            canvas: backgroundCanvas
        });
        // this.NETWORK.updateServerTimeDiffernce();

        //generate world on client
        this.WORLD = World.create({
            width: 10000,
            height: 10000,
            gridSize: 32
        });
        World.createBoundaries(this.WORLD);
        World.randomWorld(this.WORLD);
    } //constructor

    windowResized() {
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        this.scaleX = this.screenWidth / this.width;
        this.scaleY = this.screenHeight / this.height;
        // this.stage = document.getElementById('stage');
        this.stage.style.transformOrigin = '0 0';
        // var scaleToFit = Math.min(scaleX, scaleY);
        // var scaleToCover = Math.max(scaleX, scaleY);
        // this.stage.style.transform = 'scale(' + scaleToCover + ')';
        // this.stage.style.transform = 'scale(' + scaleToFit + ')';
        this.stage.style.transform = 'scale(' + this.scaleX + ',' + this.scaleY + ')';
    } //window Resized

    update() {
        this.CONTROLS.update();
    } //update

    draw() {
        //background "wipes" the screen every frame
        //clear the canvas
        this.render.save();
        this.render.setTransform(1, 0, 0, 1, 0, 0);
        this.render.clearRect(0, 0, this.width, this.height);
        this.render.beginPath();
        this.render.restore();

        this.currentTime = new Date().getTime();
        let deltaTime = this.currentTime - this.lastFrame;
        this.lastFrame = this.currentTime;
        this.frames++;

        // let myPlayer = this.NETWORK.getMyPlayer();
        // if (myPlayer != null) {
        //     this.CAMERA.setGoal(myPlayer.x, myPlayer.y);
        //     if (this.myPlayerId == null) this.myPlayerId = myPlayer.id;
        // }
        this.CAMERA.update();
        let timeAfterCamera = new Date().getTime();
        let deltaCamera = timeAfterCamera - this.currentTime;

        this.BACKGROUND.draw();
        let timeAfterBackground = new Date().getTime();
        let deltaBackground = timeAfterBackground - timeAfterCamera;

        //square at 0,0
        let origin = this.CAMERA.translate({ x: 0, y: 0 });
        this.render.save();
        this.render.strokeStyle = 'black';
        this.render.strokeRect(origin.x - 10, origin.y - 10, 20, 20);
        // render.font = "px Arial";
        this.render.textAlign = 'center';
        this.render.fillText(0 + ',' + 0, origin.x, origin.y);
        this.render.restore();

        //Main state, players
        // this.STATES.update(deltaTime);
        let timeAfterStateUpdate = new Date().getTime();
        let deltaStateUpdate = timeAfterStateUpdate - timeAfterBackground;

        // this.STATES.draw(deltaTime);
        let timeAfterStateDraw = new Date().getTime();
        let deltaStateDraw = timeAfterStateDraw - timeAfterStateUpdate;

        //World drawing
        let objectsToDraw = {};
        if (this.WORLD != null && this.WORLD.grid != null) {
            objectsToDraw = World.getObjects({
                world: this.WORLD,
                x: this.CAMERA.x,
                y: this.CAMERA.y,
                distance: this.renderDistance,
                //angle: myPlayer.angle,
                fieldOfView: Math.PI / 2 //90 degrees
            });
            // console.log("objectsToDraw:",objectsToDraw);
            for (var id in objectsToDraw) {
                let object = objectsToDraw[id];
                switch (object.type) {
                    case 'block':
                        Block.draw(object, this.render, this.CAMERA);
                        break;
                    default:
                        console.log('Object not recognized to Draw');
                }
            }
            if (!this.BACKGROUND.backgroundGenerated) this.BACKGROUND.updateWithWorldData(this.WORLD);
        } //if World has been received from Server
        let timeAfterWorldDraw = new Date().getTime();
        let deltaWorldDraw = timeAfterWorldDraw - timeAfterStateDraw;

        let playersInRange = {};
        // if (myPlayer != null) {
        //     playersInRange = this.STATES.getPlayersInRange({
        //         x: myPlayer.x,
        //         y: myPlayer.y,
        //         distance: this.renderDistance
        //     });
        // }

        //Line of sight Stuff
        // this.LINEOFSIGHT.update(deltaTime, objectsToDraw, myPlayer, playersInRange);
        // let timeAfterSightUpdate = new Date().getTime();
        // let deltaSightUpdate = timeAfterSightUpdate - timeAfterWorldDraw;

        // this.LINEOFSIGHT.draw(this.STATES.frameState);
        // let timeAfterSightDraw = new Date().getTime();
        // let deltaSightDraw = timeAfterSightDraw - timeAfterSightUpdate;

        // //Lighting Stuff
        // this.LIGHTING.update(deltaTime, objectsToDraw, myPlayer, playersInRange);
        // let timeAfterLightUpdate = new Date().getTime();
        // let deltaLightUpdate = timeAfterLightUpdate - timeAfterSightDraw;

        // this.LIGHTING.draw(this.STATES.frameState);
        // let timeAfterLightDraw = new Date().getTime();
        // let deltaLightDraw = timeAfterLightDraw - timeAfterLightUpdate;

        //once a second
        if (this.currentTime % this.lastSecond >= 1000) {
            // console.log(STATES.state);
            // this.NETWORK.updateServerTimeDiffernce();
            this.HUD.debugUpdate({
                FrameRate: Math.round(this.lastFrames * 0.8 + this.frames * 0.2),
                GameResolution: this.width + ', ' + this.height,
                WindowSize: this.screenWidth + ', ' + this.screenHeight,
                // Ping: this.NETWORK.ping,
                // timeDiffernce: this.NETWORK.timeDiffernce,
                objectsToDraw: Object.keys(objectsToDraw).length,
                renderDistance: this.renderDistance,
                CAMERA: this.CAMERA.x + ', ' + this.CAMERA.y,
                deltaTime: deltaTime,
                timeCamera: Math.round((deltaCamera / deltaTime) * 100) + '%',
                timeBackground: Math.round((deltaBackground / deltaTime) * 100) + '%',
                timeStateUpdate: Math.round((deltaStateUpdate / deltaTime) * 100) + '%',
                timeStateDraw: Math.round((deltaStateDraw / deltaTime) * 100) + '%',
                timeWorldDraw: Math.round((deltaWorldDraw / deltaTime) * 100) + '%'
                // timeSightUpdate: Math.round((deltaSightUpdate / deltaTime) * 100) + '%',
                // timeSightDraw: Math.round((deltaSightDraw / deltaTime) * 100) + '%',
                // timeLightUpdate: Math.round((deltaLightUpdate / deltaTime) * 100) + '%',
                // timeLightDraw: Math.round((deltaLightDraw / deltaTime) * 100) + '%'
            });
            this.lastSecond = this.currentTime;
            this.lastFrames = this.frames;
            this.frames = 0;
        }

        this.HUD.draw();
    } //draw
}; //clientEngine class
