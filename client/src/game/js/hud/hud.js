const EnergyNode = require('../Entities/EnergyNode.js');
const Button = require('./button.js');

module.exports = class HUD {
    constructor({ debug = false, debugButton = false, fontSize = 20, engine = null, canvas = null }) {
        this.ENGINE = engine;
        // this.canvas = document.getElementById(divId);
        this.canvas = canvas;
        this.render = this.canvas.getContext('2d');
        this.canvas.width = this.ENGINE.width;
        this.canvas.height = this.ENGINE.height;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.debug = debug;
        this.debugButton = debugButton;
        this.crossHairSize = 10;

        this.drawMode = 'drawCrossHair';
        this.ghost = null;

        this.fontSize = fontSize;
        this.startX = 10;
        this.startY = this.fontSize;
        this.debugVars = {};
        this.buttons = [];
        this.createButtons();
        if (debug) console.log('Created hud-layer', this.ENGINE.width, this.ENGINE.height);
    } //constructor

    resize({ width, height }) {
        this.ENGINE.width = width;
        this.ENGINE.height = height;
        this.canvas.width = this.ENGINE.width;
        this.canvas.height = this.ENGINE.height;
        this.width = width;
        this.height = height;
        this.createButtons();
    }

    createButtons() {
        let newButton = new Button({
            x: 50,
            y: this.height - 50,
            label: 'Create Energy Node',
            debug: this.debugButton,
            click: () => {
                // console.log('Create Energy Node Mode');
                this.ENGINE.CONTROLS.leftClickHandled = true;
                this.ENGINE.CONTROLS.leftClickAction = 'placeEnergyNode';
                this.drawMode = 'drawGhost';
                this.debugUpdate({ hudDrawMode: this.drawMode });
                this.ghost = new EnergyNode({ x: this.ENGINE.CONTROLS.mouse.x, y: this.ENGINE.CONTROLS.mouse.y });
                this.ENGINE.HUD.debugUpdate({ leftClickAction: this.ENGINE.CONTROLS.leftClickAction });
            }
        });
        this.buttons.push(newButton);
    }

    update() {
        this.updateButtons();
        if (this.drawMode == 'drawGhost' && this.ghost) {
            this.ghost.x = this.ENGINE.CONTROLS.mouseLocationInWorld.x;
            this.ghost.y = this.ENGINE.CONTROLS.mouseLocationInWorld.y;
        }
    }

    debugUpdate(obj) {
        //update debugText based on debug vars
        for (let id in obj) {
            this.debugVars[id] = obj[id];
        }
    }

    drawDebugText() {
        this.render.save();
        this.render.font = this.fontSize + 'px Arial';
        this.render.fillStyle = 'yellow';
        this.render.strokeStyle = 'blue';
        this.render.textAlign = 'left';
        let offset = 0;
        for (let id in this.debugVars) {
            let text = id + ': ' + this.debugVars[id];
            this.render.fillText(text, this.startX, this.startY + offset);
            this.render.strokeText(text, this.startX, this.startY + offset);
            offset += this.fontSize;
        }
        this.render.restore();
    }

    drawCrossHair() {
        //draw cross-hair
        this.render.save();

        //main CrossHair
        this.render.strokeStyle = 'blue';
        this.render.beginPath();
        this.render.moveTo(this.ENGINE.CONTROLS.mouse.x - this.crossHairSize, this.ENGINE.CONTROLS.mouse.y);
        this.render.lineTo(this.ENGINE.CONTROLS.mouse.x + this.crossHairSize, this.ENGINE.CONTROLS.mouse.y);
        this.render.stroke();
        this.render.moveTo(this.ENGINE.CONTROLS.mouse.x, this.ENGINE.CONTROLS.mouse.y - this.crossHairSize);
        this.render.lineTo(this.ENGINE.CONTROLS.mouse.x, this.ENGINE.CONTROLS.mouse.y + this.crossHairSize);
        this.render.stroke();

        if (this.debug) {
            this.render.font = this.fontSize + 'px Arial';
            this.render.fillStyle = 'yellow';
            this.render.textAlign = 'left';
            if (this.ENGINE.CONTROLS.rightClickPressed) {
                this.render.beginPath();
                this.render.arc(this.ENGINE.CONTROLS.mouse.x, this.ENGINE.CONTROLS.mouse.y, this.crossHairSize * 2, 0, Math.PI * 2);
                this.render.stroke();
            }
            if (this.ENGINE.CONTROLS.leftClickPressed) {
                this.render.beginPath();
                this.render.arc(this.ENGINE.CONTROLS.mouse.x, this.ENGINE.CONTROLS.mouse.y, this.crossHairSize / 2, 0, Math.PI * 2);
                this.render.stroke();
            }

            this.render.font = this.crossHairSize + 'px Arial';
            this.render.strokeStyle = 'white';
            this.render.textAlign = 'center';
            //location on screen
            this.render.fillText(
                this.ENGINE.CONTROLS.mouse.x + ',' + this.ENGINE.CONTROLS.mouse.y,
                this.ENGINE.CONTROLS.mouse.x,
                this.ENGINE.CONTROLS.mouse.y - this.crossHairSize
            );
            //location in world
            let mouseWorld = this.ENGINE.CONTROLS.translateScreenLocToWorld(this.ENGINE.CONTROLS.mouse.x, this.ENGINE.CONTROLS.mouse.y);
            this.render.fillText(mouseWorld.x + ',' + mouseWorld.y, this.ENGINE.CONTROLS.mouse.x, this.ENGINE.CONTROLS.mouse.y + this.crossHairSize * 2);
        }

        this.render.restore();
    }

    drawGhost() {
        if (!this.ghost) return;
        this.render.save();
        this.ghost.draw(this.render, this.ENGINE.CAMERA, true);
        this.render.restore();
    }

    drawButtons() {
        this.buttons.forEach((button) => {
            button.draw(this.render);
        });
    }

    updateButtons() {
        this.buttons.forEach((button) => {
            button.update({
                mouseX: this.ENGINE.CONTROLS.mouse.x,
                mouseY: this.ENGINE.CONTROLS.mouse.y,
                leftClick: this.ENGINE.CONTROLS.leftClickPressed,
                rightClick: this.ENGINE.CONTROLS.rightClickPressed
            });
        });
    }

    draw() {
        //clear the canvas
        this.render.save();
        this.render.setTransform(1, 0, 0, 1, 0, 0);
        this.render.clearRect(0, 0, this.ENGINE.width, this.ENGINE.height);
        this.render.beginPath();

        if (this.debug) this.drawDebugText();
        this.drawButtons();
        this[this.drawMode]();

        this.render.restore();
    } //draw
}; //HUD
