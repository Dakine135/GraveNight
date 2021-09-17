module.exports = class Controls {
    constructor({ debug = false, engine = null }) {
        console.log('Create Controls');
        this.debug = debug;
        this.ENGINE = engine;

        this.mouse = { x: 0, y: 0 };
        this.mouseLocked = false;
        this.mouseLocationInWorld = { x: 0, y: 0 };
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

        this.ENGINE.HUD.canvas.requestPointerLock = this.ENGINE.HUD.canvas.requestPointerLock || this.ENGINE.HUD.canvas.mozRequestPointerLock;
        document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
        this.ENGINE.HUD.canvas.onclick = () => {
            // console.log('clicked hud canvas');
            this.ENGINE.HUD.canvas.requestPointerLock();
            this.ENGINE.HUD.canvas.onclick = null;
        };
        // Hook pointer lock state change events for different browsers
        document.addEventListener('pointerlockchange', this.lockChange.bind(this), false);
        document.addEventListener('mozpointerlockchange', this.lockChange.bind(this), false);
        // this.ENGINE.HUD.canvas.requestPointerLock();
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
                this.ENGINE.HUD.setDrawMode('');
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
                    // console.log(`Key Not Used Held: ${keyCode} ${typeof keyCode}`);
                    validKey = false;
            } //switch
            if (validKey) {
            }
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

    translateScreenLocToWorld(x, y) {
        // let offsetX = x - this.ENGINE.width;
        // let offsetY = y - this.ENGINE.height;
        // let diffInWidth = (this.ENGINE.CAMERA.worldViewWidth - this.ENGINE.width) / 2;
        // let diffInHeight = (this.ENGINE.CAMERA.worldViewHeight - this.ENGINE.height) / 2;
        // let worldX = Math.round(this.ENGINE.CAMERA.x - this.ENGINE.width / 2); /// this.ENGINE.CAMERA.zoomLevel
        // let worldY = Math.round(this.ENGINE.CAMERA.y - this.ENGINE.height / 2);

        return {
            // x: Math.round(x * this.zoomLevel + this.engine.width / 2 - this.x),
            // y: Math.round(y * this.zoomLevel + this.engine.height / 2 - this.y)
            x: Math.round((x - this.ENGINE.width / 2 + this.ENGINE.CAMERA.x) / this.ENGINE.CAMERA.zoomLevel),
            y: Math.round((y - this.ENGINE.height / 2 + this.ENGINE.CAMERA.y) / this.ENGINE.CAMERA.zoomLevel)
        };
    }

    mouseMoved(event) {
        if (!this.mouseLocked) return;
        this.mouse = { x: Math.round(this.mouse.x + event.movementX / 2), y: Math.round(this.mouse.y + event.movementY / 2) };
        if (this.mouse.x > this.ENGINE.width) this.mouse.x = this.ENGINE.width;
        if (this.mouse.y > this.ENGINE.height) this.mouse.y = this.ENGINE.height;
        if (this.mouse.x < 0) this.mouse.x = 0;
        if (this.mouse.y < 0) this.mouse.y = 0;
        this.mouseLocationInWorld = this.translateScreenLocToWorld(this.mouse.x, this.mouse.y);
    }

    lockChange() {
        if (document.pointerLockElement === this.ENGINE.HUD.canvas || document.mozPointerLockElement === this.ENGINE.HUD.canvas) {
            // console.log('The pointer lock status is now locked');
            document.addEventListener('mousemove', this.mouseMoved.bind(this), false);
            this.mouseLocked = true;
        } else {
            // console.log('The pointer lock status is now unlocked');
            document.removeEventListener('mousemove', this.mouseMoved.bind(this), false);
            this.mouseLocked = false;
            this.ENGINE.HUD.canvas.onclick = () => {
                // console.log('clicked hud canvas');
                this.ENGINE.HUD.canvas.requestPointerLock();
                this.ENGINE.HUD.canvas.onclick = null;
            };
        }
    }

    setLeftClickAction(action) {
        if (this.debug) console.log('Setting left CLick Action:', action);
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
        this.mouseLocationInWorld = this.translateScreenLocToWorld(this.mouse.x, this.mouse.y);
    }
}; //Controls Class
