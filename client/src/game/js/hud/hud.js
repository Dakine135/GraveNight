const EnergyNode = require('../Entities/EnergyNode.js');
const Button = require('./button.js');
const Hitbox = require('../../shared/Hitbox.js');
const Utilities = require('../../shared/Utilities.js');

module.exports = class HUD {
    constructor({ debug = false, debugCursor = false, debugButton = false, fontSize = 20, engine = null, canvas = null }) {
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
        this.debugCursor = debugCursor;
        this.crossHairSize = 10;

        this.drawMode = 'drawCrossHair';
        this.ghost = null;
        this.snappingEnabled = false;
        this.snappingBuffer = 50;

        this.fontSize = fontSize;
        this.startX = 10;
        this.startY = this.fontSize;
        this.debugVars = {};
        this.buttons = {};
        this.createButtons();
        if (debug) console.log('Created hud-layer', this.ENGINE.width, this.ENGINE.height);
    } //constructor

    setDrawMode({ mode, ghostEntity, snapping = false } = {}) {
        if (this.debug) console.log('Setting Hud draw mode:', mode);
        if (snapping != null) this.snappingEnabled = snapping;
        switch (mode) {
            case 'default':
            case 'clear':
            case null:
            case '':
            case 'drawCrossHair':
                this.drawMode = 'drawCrossHair';
                this.ghost = null;
                break;
            case 'drawGhost':
                if (ghostEntity == null) {
                    throw Error('ghostEntity Null in Hud.setDrawMode');
                }
                this.drawMode = 'drawGhost';
                this.ghost = ghostEntity;
                break;
            default:
                console.log('setDrawMode unknown :>> ', mode);
                this.drawMode = 'drawCrossHair';
        }
        this.debugUpdate({ hudDrawMode: this.drawMode });
    } //setDrawMode

    resize() {
        this.canvas.width = this.ENGINE.width;
        this.canvas.height = this.ENGINE.height;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.createButtons();
    }

    createButtons() {
        let createEnergyNodeButton = new Button({
            x: 50,
            y: this.height - 50,
            width: 150,
            label: 'Create Energy Node',
            shortCutText: '1',
            debug: this.debugButton,
            click: () => {
                // console.log('Create Energy Node Mode');
                this.ENGINE.CONTROLS.leftClickHandled = true;
                this.ENGINE.CONTROLS.setLeftClickAction('placeEnergyNode');
                this.setDrawMode({
                    mode: 'drawGhost',
                    ghostEntity: new EnergyNode({ x: this.ENGINE.CONTROLS.mouse.x, y: this.ENGINE.CONTROLS.mouse.y, engine: this.ENGINE }),
                    snapping: true
                });
            }
        });
        this.buttons['createEnergyNode'] = createEnergyNodeButton;
    }

    pressButtonProgrammatically(buttonId) {
        if (buttonId in this.buttons) {
            this.buttons[buttonId].onClick();
        }
    }

    update() {
        this.updateButtons();
        if (this.drawMode == 'drawGhost' && this.ghost) {
            if (this.snappingEnabled) {
                //get nodes in range of linking + snapping buffer
                let nearby = this.ENGINE.STATES.getEntitiesInRange('energyLinkableEntities', this.ghost, this.ghost.distanceCanLink + this.snappingBuffer);
                let insideLinkable = false;
                let inSnapRange = false;
                let shouldSnapArray = [];
                let snappedPoint = { x: this.ENGINE.CONTROLS.mouseLocationInWorld.x, y: this.ENGINE.CONTROLS.mouseLocationInWorld.y };
                // console.log('nearby :>> ', nearby);
                nearby.forEach((other) => {
                    insideLinkable = Hitbox.collidePointCircle(
                        { x: this.ENGINE.CONTROLS.mouseLocationInWorld.x, y: this.ENGINE.CONTROLS.mouseLocationInWorld.y },
                        {
                            x: other.x,
                            y: other.y,
                            r: this.ghost.distanceCanLink
                        }
                    )
                        ? true
                        : insideLinkable;
                    inSnapRange = Hitbox.collidePointCircle(
                        { x: this.ENGINE.CONTROLS.mouseLocationInWorld.x, y: this.ENGINE.CONTROLS.mouseLocationInWorld.y },
                        { x: other.x, y: other.y, r: this.ghost.distanceCanLink + this.snappingBuffer }
                    );
                    if (inSnapRange && !insideLinkable) {
                        shouldSnapArray.push(other);
                    }
                }); //loop of nearby

                if (!insideLinkable && shouldSnapArray.length > 0) {
                    let closest = null;
                    let closestDist = Infinity;
                    shouldSnapArray.forEach((other) => {
                        let dist = Utilities.dist(other, { x: this.ENGINE.CONTROLS.mouseLocationInWorld.x, y: this.ENGINE.CONTROLS.mouseLocationInWorld.y });
                        if (dist < closestDist) {
                            closest = other;
                            closestDist = dist;
                        }
                    });
                    let angle = Utilities.calculateAngle({
                        point1: { x: closest.x, y: closest.y },
                        point2: { x: this.ENGINE.CONTROLS.mouseLocationInWorld.x, y: this.ENGINE.CONTROLS.mouseLocationInWorld.y },
                        centerPoint: { x: closest.x, y: closest.y }
                    });
                    snappedPoint = Utilities.rotatePoint({
                        center: { x: closest.x, y: closest.y },
                        point: { x: closest.x + this.ghost.distanceCanLink - 1, y: closest.y },
                        angle: angle
                    });
                }

                this.ghost.x = snappedPoint.x;
                this.ghost.y = snappedPoint.y;
            } else {
                this.ghost.x = this.ENGINE.CONTROLS.mouseLocationInWorld.x;
                this.ghost.y = this.ENGINE.CONTROLS.mouseLocationInWorld.y;
            }
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
            this.render.fillText(`${id}: ${this.debugVars[id]}`, this.startX, this.startY + offset);
            this.render.strokeText(`${id}: ${this.debugVars[id]}`, this.startX, this.startY + offset);
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

        if (this.debugCursor) {
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
            // let mouseWorld = this.ENGINE.CONTROLS.translateScreenLocToWorld(this.ENGINE.CONTROLS.mouse.x, this.ENGINE.CONTROLS.mouse.y);

            this.render.save();
            let translatedLocation = this.ENGINE.CAMERA.translate({
                x: this.ENGINE.CONTROLS.mouseLocationInWorld.x,
                y: this.ENGINE.CONTROLS.mouseLocationInWorld.y
            });
            this.render.translate(translatedLocation.x, translatedLocation.y);
            this.render.beginPath();
            this.render.fillText(this.ENGINE.CONTROLS.mouseLocationInWorld.x + ',' + this.ENGINE.CONTROLS.mouseLocationInWorld.y, 0, this.crossHairSize * 2);
            this.render.strokeStyle = 'red';
            this.render.moveTo(-this.crossHairSize, 0);
            this.render.lineTo(+this.crossHairSize, 0);
            this.render.stroke();
            this.render.moveTo(0, -this.crossHairSize);
            this.render.lineTo(0, +this.crossHairSize);
            this.render.stroke();
            this.render.restore();
        }

        this.render.restore();
    }

    drawGhost() {
        if (!this.ghost) return;
        this.render.save();
        this.ghost.drawGhost();

        this.render.strokeStyle = 'rgba(0,0,255,0.3)';
        this.render.beginPath();
        this.render.moveTo(this.ENGINE.CONTROLS.mouse.x - this.crossHairSize / 2, this.ENGINE.CONTROLS.mouse.y);
        this.render.lineTo(this.ENGINE.CONTROLS.mouse.x + this.crossHairSize / 2, this.ENGINE.CONTROLS.mouse.y);
        this.render.stroke();
        this.render.moveTo(this.ENGINE.CONTROLS.mouse.x, this.ENGINE.CONTROLS.mouse.y - this.crossHairSize / 2);
        this.render.lineTo(this.ENGINE.CONTROLS.mouse.x, this.ENGINE.CONTROLS.mouse.y + this.crossHairSize / 2);
        this.render.stroke();

        this.render.restore();
    }

    drawButtons() {
        Object.entries(this.buttons).forEach(([name, button]) => {
            button.draw(this.render);
        });
    }

    updateButtons() {
        Object.entries(this.buttons).forEach(([name, button]) => {
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
