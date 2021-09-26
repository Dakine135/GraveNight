const Utilities = require('../../shared/Utilities.js');
const Hitbox = require('../../shared/Hitbox.js');

const travelMax = 2000;
const distanceCanLink = 100;
const maxHeat = 2000;
const radius = 12;
const startColor = { r: 0, g: 255, b: 0, a: 1 };
const endColor = { r: 255, g: 255, b: 0, a: 1 };
const hotStartColor = { r: 255, g: 0, b: 255, a: 1 };
const hotEndColor = { r: 255, g: 0, b: 0, a: 1 };
module.exports = EnergyNodeClass = {
    type: 'EnergyNode',
    travelMax: 2000,
    distanceCanLink: 100,
    maxHeat: 2000,
    radius: 12,
    startColor: { r: 0, g: 255, b: 0, a: 1 },
    endColor: { r: 255, g: 255, b: 0, a: 1 },
    hotStartColor: { r: 255, g: 0, b: 255, a: 1 },
    hotEndColor: { r: 255, g: 0, b: 0, a: 1 },
    availableEnergyPackets: [],
    new({ id = null, x = 0, y = 0, debug = false, ENGINE = null } = {}) {
        let newEnergyNode = {
            type: 'EnergyNode',
            x: x,
            y: y,
            id: id,
            heat: 0,
            debug: debug,
            currentStartColor: { r: 0, g: 255, b: 0, a: 1 },
            currentEndColor: { r: 255, g: 255, b: 0, a: 1 },
            energyPackets: [
                {
                    travel: travelMax,
                    x: distanceCanLink,
                    y: 0,
                    startX: distanceCanLink,
                    startY: 0,
                    fromId: null
                }
            ],
            selected: false,
            canBePlaced: true,
            otherLinkableEntities: [],
            currentLinkIndex: 0,
            temp: { linkTo: [] }
        };

        ENGINE.STATES.getEntitiesInRange(newEnergyNode.otherLinkableEntities, 'energyLinkableEntities', { x, y }, distanceCanLink);

        //add yourself to others linkable
        newEnergyNode.otherLinkableEntities.forEach((otherLinkable) => {
            otherLinkable.otherLinkableEntities.push(newEnergyNode);
        });

        if (debug) console.log('Created EnergyNode at', x, y);
        return newEnergyNode;
    }, //constructor

    update(ENGINE, deltaTime) {
        //update heat and color
        this.selected = false;
        this.heat -= deltaTime;
        if (this.heat < 0) this.heat = 0;
        if (this.heat > maxHeat) this.heat = maxHeat;
        this.currentStartColor = Utilities.colorBlend(startColor, hotStartColor, this.heat / maxHeat);
        this.currentEndColor = Utilities.colorBlend(endColor, hotEndColor, this.heat / maxHeat);
        // console.log('this.currentStartColor :>> ', this.currentStartColor);

        for (let i = this.energyPackets.length - 1; i >= 0; i--) {
            this.energyPackets[i].travel -= deltaTime;
            if (this.energyPackets[i].travel <= 0) {
                //TODO dont send, but delete if at max heat
                ENGINE.ENTITY_CLASSES['EnergyNode'].availableEnergyPackets.push(this.energyPackets[i]);
                ENGINE.ENTITY_CLASSES['EnergyNode'].sendPacketOut.bind(this)(ENGINE, this.energyPackets[i].fromId);
                this.energyPackets.splice(i, 1);
                continue;
            }
            this.energyPackets[i].x = (this.energyPackets[i].travel / travelMax) * this.energyPackets[i].startX;
            this.energyPackets[i].y = (this.energyPackets[i].travel / travelMax) * this.energyPackets[i].startY;
        }
    },

    sendPacketOut(ENGINE, previouslyFromId) {
        // console.log('sendPacketOut');
        //generate heat as packets pass through EnergyNode
        this.heat += 500; //TODO re-balance
        //check for Entities in range that want to consume packets

        //else pass to next Energy Node
        if (this.otherLinkableEntities.length > 0) {
            this.temp.sendTo = this.otherLinkableEntities[this.currentLinkIndex];
            this.currentLinkIndex++;
            if (this.currentLinkIndex >= this.otherLinkableEntities.length) this.currentLinkIndex = 0;
            if (this.temp.sendTo.id == previouslyFromId && this.otherLinkableEntities.length > 1) {
                ENGINE.ENTITY_CLASSES['EnergyNode'].sendPacketOut.bind(this)(ENGINE, previouslyFromId);
                return;
            }
            ENGINE.ENTITY_CLASSES['EnergyNode'].receivePacket.bind(this.temp.sendTo)(ENGINE, this.x, this.y, this.id);
        }

        //If nowhere to pass, send back, else dont spawn packet, aka lost energy
    },

    receivePacket(ENGINE, x, y, fromId) {
        let travel = Math.round((Utilities.dist({ x, y }, { x: this.x, y: this.y }) / distanceCanLink) * travelMax);
        // console.log('receivePacket, travel, fromId,x,y :>> ', travel, fromId, x, y);
        // availableEnergyPackets
        if (ENGINE.ENTITY_CLASSES['EnergyNode'].availableEnergyPackets.length > 0) {
            let reusePacket = ENGINE.ENTITY_CLASSES['EnergyNode'].availableEnergyPackets.pop();
            (reusePacket.travel = travel),
                (reusePacket.x = x - this.x),
                (reusePacket.y = y - this.y),
                (reusePacket.startX = x - this.x),
                (reusePacket.startY = y - this.y),
                (reusePacket.fromId = fromId);
            this.energyPackets.push(reusePacket);
        } else {
            let newPacket = { travel: travel, x: x - this.x, y: y - this.y, startX: x - this.x, startY: y - this.y, fromId };
            this.energyPackets.push(newPacket);
        }
    },

    draw0(ENGINE) {
        // Start a new drawing state
        ENGINE.render.save();
        let translatedLocation = ENGINE.CAMERA.translate({ x: this.x, y: this.y });
        ENGINE.render.translate(translatedLocation.x, translatedLocation.y);
        ENGINE.render.scale(ENGINE.CAMERA.zoomLevel, ENGINE.CAMERA.zoomLevel);

        //EnergyNode location for debugging
        if (this.debug) {
            ENGINE.render.fillStyle = 'black';
            ENGINE.render.fillText(Math.round(this.x) + ',' + Math.round(this.y), radius + 2, radius + 2);
        }

        //show distance to link
        if (this.selected) {
            ENGINE.render.beginPath();
            ENGINE.render.strokeStyle = 'blue';
            ENGINE.render.lineWidth = 1;
            ENGINE.render.arc(0, 0, distanceCanLink, 0, 2 * Math.PI);
            ENGINE.render.stroke();
            ENGINE.render.closePath();
            ENGINE.render.beginPath();
            ENGINE.render.strokeStyle = 'orange';
            ENGINE.render.lineWidth = 1;
            ENGINE.render.arc(0, 0, distanceCanLink + ENGINE.HUD.snappingBuffer, 0, 2 * Math.PI);
            ENGINE.render.stroke();
            ENGINE.render.closePath();
        }

        //draw main body
        ENGINE.render.beginPath();
        // 	context.createRadialGradient(x0,y0,r0,x1,y1,r1);
        if (ENGINE.CAMERA.zoomLevel <= 0.5) {
            ENGINE.render.fillStyle = `rgba(${this.currentEndColor.r},${this.currentEndColor.g},${this.currentEndColor.b},${this.currentEndColor.a})`;
            ENGINE.render.arc(0, 0, radius, 0, 2 * Math.PI);
            ENGINE.render.fill();
            ENGINE.render.closePath();
        } else {
            let gradient = ENGINE.render.createRadialGradient(0, 0, 0, 0, 0, radius);
            gradient.addColorStop(
                0,
                `rgba(${this.currentStartColor.r},${this.currentStartColor.g},${this.currentStartColor.b},${this.currentStartColor.a})`
            );
            gradient.addColorStop(
                1,
                `rgba(${this.currentEndColor.r},${this.currentEndColor.g},${this.currentEndColor.b},${this.currentEndColor.a})`
            );
            ENGINE.render.fillStyle = gradient;
            //void ctx.arc(x, y, radius, startAngle, endAngle [, counterclockwise]);
            ENGINE.render.arc(0, 0, radius, 0, 2 * Math.PI);
            ENGINE.render.fill();
            ENGINE.render.closePath();
        }

        ENGINE.render.restore(); // Restore original state
    }, //end Draw

    draw1(ENGINE) {
        //draw energyPackets
        if (ENGINE.CAMERA.zoomLevel >= 0.5) {
            ENGINE.render.save();
            let translatedLocation = ENGINE.CAMERA.translate({ x: this.x, y: this.y });
            ENGINE.render.translate(translatedLocation.x, translatedLocation.y);
            ENGINE.render.scale(ENGINE.CAMERA.zoomLevel, ENGINE.CAMERA.zoomLevel);
            this.energyPackets.forEach((packet) => {
                ENGINE.render.beginPath();
                ENGINE.render.fillStyle = 'white';
                ENGINE.render.arc(packet.x, packet.y, 4, 0, 2 * Math.PI);
                ENGINE.render.fill();
                ENGINE.render.closePath();
            });
            ENGINE.render.restore(); // Restore original state
        }
    },

    drawGhost(ENGINE) {
        // console.log('ENGINE :>> ', ENGINE);
        // Start a new drawing state
        ENGINE.render.save();
        let translatedLocation = ENGINE.CAMERA.translate({ x: this.x, y: this.y });
        ENGINE.render.translate(translatedLocation.x, translatedLocation.y);
        ENGINE.render.scale(ENGINE.CAMERA.zoomLevel, ENGINE.CAMERA.zoomLevel);

        //EnergyNode location for debugging
        if (this.debug) {
            ENGINE.render.fillStyle = 'black';
            ENGINE.render.fillText(Math.round(this.x) + ',' + Math.round(this.y), radius + 2, radius + 2);
        }

        ENGINE.render.strokeStyle = 'blue';
        if (!this.canBePlaced) ENGINE.render.strokeStyle = 'red';
        ENGINE.render.lineWidth = 1;

        //get linkable Nodes
        ENGINE.STATES.getEntitiesInRange(this.temp.linkTo, 'energyLinkableEntities', this, distanceCanLink);
        this.canBePlaced = true;
        this.temp.overlapping = false;
        this.temp.linkTo.forEach((otherNode) => {
            this.temp.overlapping = Hitbox.collideCircleCircle(
                { x: this.x, y: this.y, r: radius },
                { x: otherNode.x, y: otherNode.y, r: radius }
            );
            if (this.temp.overlapping) this.canBePlaced = false;
            this.temp.relativeLocation = { x: otherNode.x - this.x, y: otherNode.y - this.y };
            ENGINE.render.beginPath();
            ENGINE.render.moveTo(0, 0);
            ENGINE.render.lineTo(this.temp.relativeLocation.x, this.temp.relativeLocation.y);
            ENGINE.render.stroke();
            ENGINE.render.closePath();
        });

        //show distance to link
        ENGINE.render.beginPath();
        ENGINE.render.strokeStyle = 'blue';
        if (!this.canBePlaced) ENGINE.render.strokeStyle = 'red';
        ENGINE.render.lineWidth = 1;
        ENGINE.render.arc(0, 0, distanceCanLink, 0, 2 * Math.PI);
        ENGINE.render.stroke();
        ENGINE.render.closePath();
        //main body
        ENGINE.render.beginPath();
        let gradient = ENGINE.render.createRadialGradient(0, 0, 0, 0, 0, radius);
        gradient.addColorStop(
            0,
            `rgba(${this.currentStartColor.r},${this.currentStartColor.g},${this.currentStartColor.b},${this.currentStartColor.a / 2})`
        );
        gradient.addColorStop(
            1,
            `rgba(${this.currentEndColor.r},${this.currentEndColor.g},${this.currentEndColor.b},${this.currentEndColor.a / 2})`
        );
        ENGINE.render.fillStyle = gradient;
        ENGINE.render.arc(0, 0, radius, 0, 2 * Math.PI);
        ENGINE.render.fill();
        ENGINE.render.closePath();

        ENGINE.render.restore(); // Restore original state
    }, //draw ghost

    toJSON() {
        return {
            type: 'EnergyNode',
            x: this.x,
            y: this.y,
            id: this.id,
            heat: this.heat,
            currentStartColor: this.currentStartColor,
            currentEndColor: this.currentEndColor,
            energyPackets: this.energyPackets,
            otherLinkableEntities: this.otherLinkableEntities.map((other) => other.id),
            currentLinkIndex: this.currentLinkIndex
        };
    },
    restoreFromSave(STATES, energyNode) {
        (energyNode.debug = false),
            (energyNode.selected = false),
            (energyNode.canBePlaced = true),
            (energyNode.otherLinkableEntities = energyNode.otherLinkableEntities.map((id) => STATES.currentState.entities[id])),
            (energyNode.temp = { linkTo: [] });
    }
}; //end EnergyNode Class
