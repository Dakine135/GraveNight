module.exports = class Controls {
    constructor({ debug = false, engine = null }) {
        console.log('Create Controls');
        this.debug = debug;
        this.ENGINE = engine;

        this.mouse = { x: 0, y: 0 };
        this.mouseLocationInWorld = { x: 0, y: 0 };
        this.mouseLocked = false;
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
        this.leftClickHandled = true;
        this.middleClickHandled = true;
        this.rightClickHandled = true;
        this.leftClickAction = null;
        this.middleClickAction = null;
        this.rightClickAction = null;
        window.addEventListener('mousedown', (event) => {
            if (this.debug) console.log('mousePressed:', event.button);
            switch (event.button) {
                case 0:
                    this.leftClickPressed = true;
                    this.leftClickHandled = false;
                    break;
                case 1:
                    this.middleClickPressed = true;
                    this.middleClickHandled = false;
                    break;
                case 2:
                    this.rightClickPressed = true;
                    this.rightClickHandled = false;
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
        // window.addEventListener('mousemove', this.mouseMoved.bind(this));
        // pointer lock object forking for cross browser

        this.ENGINE.HUD.canvas.requestPointerLock =
            this.ENGINE.HUD.canvas.requestPointerLock || this.ENGINE.HUD.canvas.mozRequestPointerLock;
        document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
        this.ENGINE.HUD.canvas.onclick = () => {
            // console.log('clicked hud canvas');
            this.leftClickHandled = true;
            this.ENGINE.HUD.canvas.requestPointerLock();
            this.ENGINE.HUD.canvas.onclick = null;
        };
        // Hook pointer lock state change events for different browsers
        document.addEventListener('pointerlockchange', this.lockChange.bind(this), false);
        document.addEventListener('mozpointerlockchange', this.lockChange.bind(this), false);
        // this.ENGINE.HUD.canvas.requestPointerLock();

        this.temp = {};
    } //constructor

    scrollEvent(event) {
        event.preventDefault();
        // let eventTime = this.ENGINE.STATES.serverState.time + this.ENGINE.STATES.currentDeltaTime;
        if (event.deltaY > 0) {
            if (this.debug) console.log('scroll Down');
            //zoom out
            this.ENGINE.CAMERA.zoomOut();
        } else {
            if (this.debug) console.log('scroll up');
            //zoom in
            this.ENGINE.CAMERA.zoomIn();
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
            case 49: //1
                this.ENGINE.HUD.pressButtonProgrammatically('createEnergyNode');
                break;
            case 50: //2
                this.ENGINE.HUD.pressButtonProgrammatically('saveGame');
                break;
            case 51: //3
                this.ENGINE.HUD.pressButtonProgrammatically('clearSave');
                break;
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
            case 81: //Q
                this.ENGINE.HUD.setDrawMode();
                this.setLeftClickAction();
                break;
            case 27: //escape key
                //now used to break mouse lock from game
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
            case 49: //1
            case 50: //2
            case 51: //3
                break;
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
            case 81: //Q
                break;
            case 27: //escape key
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
            // this.temp.validKey = true;
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
                // console.log(`Key Not Used Held: ${keyCode} ${typeof keyCode}`);
                // this.temp.validKey = false;
            } //switch
            // if (this.temp.validKey) {
            // }
        });
    } //handleHeldKeys

    handlePressedKeys() {
        // if (Object.keys(this.keysBeingPressed).length > 0) console.log('this.keysBeingPressed :>> ', this.keysBeingPressed);

        //handleMouseButtons
        if (this.leftClickPressed && !this.leftClickHandled) {
            if (this.leftClickAction) this.ENGINE.STATES[this.leftClickAction]();
            this.leftClickHandled = true;
        }
        if (this.middleClickPressed && !this.middleClickHandled) {
            if (this.middleClickAction) this.ENGINE.STATES[this.middleClickAction]();
            this.middleClickHandled = true;
        }
        if (this.rightClickPressed && !this.rightClickHandled) {
            if (this.rightClickAction) this.ENGINE.STATES[this.rightClickAction]();
            this.rightClickHandled = true;
        }
    } //handlePressedKeys

    update() {
        this.handleHeldKeys();
        this.handlePressedKeys();
    }

    translateScreenLocToWorld(result, x, y) {
        // let diffX = (x - this.ENGINE.width / 2) / this.ENGINE.CAMERA.zoomLevel;
        // let diffY = (y - this.ENGINE.height / 2) / this.ENGINE.CAMERA.zoomLevel;
        // let offsetWidth = diffX + this.ENGINE.CAMERA.x;
        // let offsetHeight = diffY + this.ENGINE.CAMERA.y;
        // result.x = offsetWidth;
        // result.y = offsetHeight;
        result.x = (x - this.ENGINE.width / 2) / this.ENGINE.CAMERA.zoomLevel + this.ENGINE.CAMERA.x;
        result.y = (y - this.ENGINE.height / 2) / this.ENGINE.CAMERA.zoomLevel + this.ENGINE.CAMERA.y;
    }

    moveMouseToCenterOfScreen() {
        this.mouse.x = this.ENGINE.width / 2;
        this.mouse.y = this.ENGINE.height / 2;
        this.translateScreenLocToWorld(this.mouseLocationInWorld, this.mouse.x, this.mouse.y);
    }

    mouseMoved(event) {
        if (!this.mouseLocked) return;
        this.mouse = { x: Math.round(this.mouse.x + event.movementX / 2), y: Math.round(this.mouse.y + event.movementY / 2) };
        if (this.mouse.x > this.ENGINE.width) this.mouse.x = this.ENGINE.width;
        if (this.mouse.y > this.ENGINE.height) this.mouse.y = this.ENGINE.height;
        if (this.mouse.x < 0) this.mouse.x = 0;
        if (this.mouse.y < 0) this.mouse.y = 0;
        this.translateScreenLocToWorld(this.mouseLocationInWorld, this.mouse.x, this.mouse.y);
    }

    lockChange() {
        if (document.pointerLockElement === this.ENGINE.HUD.canvas || document.mozPointerLockElement === this.ENGINE.HUD.canvas) {
            // console.log('The pointer lock status is now locked');
            document.addEventListener('mousemove', this.mouseMoved.bind(this), false);
            this.mouse = { x: Math.round(this.ENGINE.HUD.width / 2), y: Math.round(this.ENGINE.HUD.height / 2) };
            this.mouseLocked = true;
        } else {
            // console.log('The pointer lock status is now unlocked');
            document.removeEventListener('mousemove', this.mouseMoved.bind(this), false);
            this.mouseLocked = false;
            this.setLeftClickAction();
            this.ENGINE.HUD.setDrawMode();
            this.ENGINE.HUD.canvas.onclick = () => {
                // console.log('clicked hud canvas');
                this.leftClickHandled = true;
                this.ENGINE.HUD.canvas.requestPointerLock();
                this.ENGINE.HUD.canvas.onclick = null;
            };
        }
    }

    setLeftClickAction(action) {
        // if (this.debug) console.log('Setting left CLick Action:', action);
        switch (action) {
            case 'default':
            case 'clear':
            case undefined:
            case null:
            case '':
                this.leftClickAction = null;
                break;
            case 'placeEnergyNode':
                this.leftClickAction = 'placeEnergyNode';
                break;
            default:
                console.log('setLeftClickAction unknown :>> ', action);
                this.leftClickAction = null;
        }

        this.ENGINE.HUD.debugUpdate({ leftClickAction: this.leftClickAction ? this.leftClickAction : 'None' });
    } //setLeftClickAction

    updateCameraMoved() {
        this.translateScreenLocToWorld(this.mouseLocationInWorld, this.mouse.x, this.mouse.y);
    }
}; //Controls Class
