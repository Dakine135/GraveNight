const Player = require('../shared/Player.js');

module.exports = class Controls {
    constructor({ debug = false, engine = null }) {
        console.log('Create Controls');
        this.debug = debug;
        this.ENGINE = engine;

        this.mouse = { x: 0, y: 0 };
        this.keysBeingPressed = {};
        this.cameraMovement = {
            vx: 0,
            vy: 0,
            maxVx: 20,
            maxVy: 20
        };

        this.leftClickPressed = false;
        this.middleClickPressed = false;
        this.rightClickPressed = false;
        window.addEventListener('mousedown', (event) => {
            if (this.debug) console.log('mousePressed:', event.button);
            switch (event.button) {
                case 0:
                    this.leftClickPressed = true;
                    break;
                case 1:
                    this.middleClickPressed = true;
                    break;
                case 2:
                    this.rightClickPressed = true;
                    break;
            }
        });
        window.addEventListener('mouseup', (event) => {
            if (this.debug) console.log('mouseReleased:', event.button);
            switch (event.button) {
                case 0:
                    this.leftClickPressed = false;
                    break;
                case 1:
                    this.middleClickPressed = false;
                    break;
                case 2:
                    this.rightClickPressed = false;
                    break;
            }
        });
        window.addEventListener('wheel', this.scrollEvent.bind(this));
        window.addEventListener('keydown', this.keyPressed.bind(this));
        window.addEventListener('keyup', this.keyReleased.bind(this));
        window.addEventListener('mousemove', this.mouseMoved.bind(this));
    } //constructor

    scrollEvent(event) {
        // let eventTime = this.ENGINE.STATES.serverState.time + this.ENGINE.STATES.currentDeltaTime;
        if (event.deltaY > 0) {
            if (this.debug) console.log('scroll Down');
        } else {
            if (this.debug) console.log('scroll up');
        }
    }

    keyPressed(event) {
        let keyCode = event.keyCode;
        let key = event.key;
        if (this.debug) console.log(`Pressed: ${keyCode}, ${key}`);
        if (!this.keysBeingPressed[keyCode]) this.keysBeingPressed[keyCode] = true;
        else {
            //console.log("key already pressed:", keyCode);
            return;
        }
        // let eventTime = this.ENGINE.STATES.state.time + this.ENGINE.STATES.currentDeltaTime;
        // let data = {
        //     type: 'playerMove',
        //     pressed: true,
        //     time: this.ENGINE.STATES.currentTimeInSimulation
        // };
        let validKey = true;
        switch (keyCode) {
            case 65: //A
            case 37: //left arrow
                break;
            case 68: //D
            case 39: //right arrow
                break;
            case 87: //W
            case 38: //arrow up
                break;
            case 83: //S
            case 40: //arrow down
                break;
            default:
                console.log(`Key Not Used Pressed: ${keyCode}, ${key}`);
                validKey = false;
        } //switch
        if (validKey) {
        }
    } //keyPressed

    keyReleased(event) {
        let keyCode = event.keyCode;
        let key = event.key;
        if (this.debug) console.log(`Released: ${keyCode}, ${key}`);
        if (this.keysBeingPressed[keyCode]) delete this.keysBeingPressed[keyCode];
        else {
            //console.log("key never pressed but Released:", keyCode);
            return;
        }
        // let eventTime = this.ENGINE.STATES.state.time + this.ENGINE.STATES.currentDeltaTime;
        let validKey = true;
        switch (keyCode) {
            case 65: //A
            case 37: //left arrow
                break;
            case 68: //D
            case 39: //right arrow
                break;
            case 87: //W
            case 38: //arrow up
                break;
            case 83: //S
            case 40: //arrow down
                break;
            default:
                console.log(`Key Not Used Released: ${keyCode}, ${key}`);
                validKey = false;
        }
        if (validKey) {
            // this.ENGINE.NETWORK.sendClientAction(data);
            // data.socketId = this.ENGINE.NETWORK.mySocketId;
            // this.ENGINE.STATES.addAction(data);
        }
    } // keyReleased

    handleHeldKeys() {
        // if (Object.keys(this.keysBeingPressed).length > 0) console.log('this.keysBeingPressed :>> ', this.keysBeingPressed);
        if (Object.keys(this.keysBeingPressed).length == 0) return;
        Object.keys(this.keysBeingPressed).forEach((keyCode) => {
            keyCode = parseInt(keyCode);
            let validKey = true;
            switch (keyCode) {
                case 65: //A
                case 37: //left arrow
                    this.ENGINE.CAMERA.moveGoal(-10, 0);
                    break;
                case 68: //D
                case 39: //right arrow
                    this.ENGINE.CAMERA.moveGoal(10, 0);
                    break;
                case 87: //W
                case 38: //arrow up
                    this.ENGINE.CAMERA.moveGoal(0, -10);
                    break;
                case 83: //S
                case 40: //arrow down
                    this.ENGINE.CAMERA.moveGoal(0, 10);
                    break;
                default:
                    console.log(`Key Not Used Held: ${keyCode} ${typeof keyCode}`);
                    validKey = false;
            } //switch
            if (validKey) {
            }
        });
    } //handleHeldKeys

    update() {
        this.handleHeldKeys();
    }

    translateScreenLocToWorld(x, y) {
        let offsetX = x - this.ENGINE.width / 2;
        let offsetY = y - this.ENGINE.height / 2;
        let worldX = Math.round(this.ENGINE.CAMERA.x + offsetX);
        let worldY = Math.round(this.ENGINE.CAMERA.y + offsetY);
        return { x: worldX, y: worldY };
    }

    mouseMoved(event) {
        let mouseX = event.pageX;
        let mouseY = event.pageY;
        this.mouse = { x: mouseX, y: mouseY };
        let locInWorld = this.translateScreenLocToWorld(mouseX, mouseY);
        // let eventTime = this.ENGINE.STATES.serverState.time + this.ENGINE.STATES.currentDeltaTime;
        // let data = {
        //     type: 'playerCursor',
        //     x: locInWorld.x,
        //     y: locInWorld.y,
        //     time: this.ENGINE.STATES.currentTimeInSimulation
        // };
        // this.ENGINE.NETWORK.sendClientAction(data);
        // data.socketId = this.ENGINE.NETWORK.mySocketId;
        // this.ENGINE.STATES.addAction(data);
    }
}; //Controls Class
