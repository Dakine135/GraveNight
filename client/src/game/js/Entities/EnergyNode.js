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
    new({ id = null, x = 0, y = 0, debug = false, engine = null } = {}) {
        let newEnergyNode = {
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
            otherLinkableEntities: this.ENGINE.STATES.getEntitiesInRange('energyLinkableEntities', this, this.distanceCanLink),
            currentLinkIndex: 0
        };

        //add yourself to others linkable
        newEnergyNode.otherLinkableEntities.forEach((otherLinkable) => {
            otherLinkable.otherLinkableEntities.push(this);
        });

        if (debug) console.log('Created EnergyNode at', x, y);
        return newEnergyNode;
    }, //constructor

    update(deltaTime) {
        //update heat and color
        this.selected = false;
        this.heat -= deltaTime;
        if (this.heat < 0) this.heat = 0;
        if (this.heat > this.maxHeat) this.heat = this.maxHeat;
        this.currentStartColor = Utilities.colorBlend(this.startColor, this.hotStartColor, this.heat / this.maxHeat);
        this.currentEndColor = Utilities.colorBlend(this.endColor, this.hotEndColor, this.heat / this.maxHeat);

        for (let i = this.energyPackets.length - 1; i >= 0; i--) {
            this.energyPackets[i].travel -= deltaTime;
            if (this.energyPackets[i].travel <= 0) {
                //TODO dont send, but delete if at max heat
                this.sendPacketOut(this.energyPackets[i].fromId);
                this.energyPackets.splice(i, 1);
                continue;
            }
            this.energyPackets[i].x = (this.energyPackets[i].travel / this.travelMax) * this.energyPackets[i].startX;
            this.energyPackets[i].y = (this.energyPackets[i].travel / this.travelMax) * this.energyPackets[i].startY;
        }
    },

    sendPacketOut(previouslyFromId) {
        // console.log('sendPacketOut');
        //generate heat as packets pass through EnergyNode
        this.heat += 500; //TODO re-balance
        //check for Entities in range that want to consume packets

        //else pass to next Energy Node
        if (this.otherLinkableEntities.length > 0) {
            let sendTo = this.otherLinkableEntities[this.currentLinkIndex];
            this.currentLinkIndex++;
            if (this.currentLinkIndex >= this.otherLinkableEntities.length) this.currentLinkIndex = 0;
            if (sendTo.id == previouslyFromId && this.otherLinkableEntities.length > 1) {
                this.sendPacketOut(previouslyFromId);
                return;
            }
            sendTo.receivePacket(this.x, this.y, this.id);
        }

        //If nowhere to pass, send back, else dont spawn packet, aka lost energy
    },

    receivePacket(x, y, fromId) {
        let travel = Math.round((Utilities.dist({ x, y }, { x: this.x, y: this.y }) / this.distanceCanLink) * this.travelMax);
        // console.log('receivePacket, travel, fromId,x,y :>> ', travel, fromId, x, y);
        let newPacket = { travel: travel, x: x - this.x, y: y - this.y, startX: x - this.x, startY: y - this.y, fromId };
        this.energyPackets.push(newPacket);
    },

    draw0(deltaTime) {
        // Start a new drawing state
        this.ENGINE.render.save();
        let translatedLocation = this.ENGINE.CAMERA.translate({ x: this.x, y: this.y });
        this.ENGINE.render.translate(translatedLocation.x, translatedLocation.y);
        this.ENGINE.render.scale(this.ENGINE.CAMERA.zoomLevel, this.ENGINE.CAMERA.zoomLevel);

        //EnergyNode location for debugging
        if (this.debug) {
            this.ENGINE.render.fillStyle = 'black';
            this.ENGINE.render.fillText(Math.round(this.x) + ',' + Math.round(this.y), this.radius + 2, this.radius + 2);
        }

        //show distance to link
        if (this.selected) {
            this.ENGINE.render.beginPath();
            this.ENGINE.render.strokeStyle = 'blue';
            this.ENGINE.render.lineWidth = 1;
            this.ENGINE.render.arc(0, 0, this.distanceCanLink, 0, 2 * Math.PI);
            this.ENGINE.render.stroke();
            this.ENGINE.render.closePath();
            this.ENGINE.render.beginPath();
            this.ENGINE.render.strokeStyle = 'orange';
            this.ENGINE.render.lineWidth = 1;
            this.ENGINE.render.arc(0, 0, this.distanceCanLink + this.ENGINE.HUD.snappingBuffer, 0, 2 * Math.PI);
            this.ENGINE.render.stroke();
            this.ENGINE.render.closePath();
        }

        //draw main body
        this.ENGINE.render.beginPath();
        // 	context.createRadialGradient(x0,y0,r0,x1,y1,r1);
        if (this.ENGINE.CAMERA.zoomLevel <= 0.5) {
            this.ENGINE.render.fillStyle = `rgba(${this.currentEndColor.r},${this.currentEndColor.g},${this.currentEndColor.b},${this.currentEndColor.a})`;
            this.ENGINE.render.arc(0, 0, this.radius, 0, 2 * Math.PI);
            this.ENGINE.render.fill();
            this.ENGINE.render.closePath();
        } else {
            let gradient = this.ENGINE.render.createRadialGradient(0, 0, 0, 0, 0, this.radius);
            gradient.addColorStop(0, `rgba(${this.currentStartColor.r},${this.currentStartColor.g},${this.currentStartColor.b},${this.currentStartColor.a})`);
            gradient.addColorStop(1, `rgba(${this.currentEndColor.r},${this.currentEndColor.g},${this.currentEndColor.b},${this.currentEndColor.a})`);
            this.ENGINE.render.fillStyle = gradient;
            //void ctx.arc(x, y, radius, startAngle, endAngle [, counterclockwise]);
            this.ENGINE.render.arc(0, 0, this.radius, 0, 2 * Math.PI);
            this.ENGINE.render.fill();
            this.ENGINE.render.closePath();
        }

        this.ENGINE.render.restore(); // Restore original state
    }, //end Draw

    draw1(deltaTime) {
        //draw energyPackets
        if (this.ENGINE.CAMERA.zoomLevel >= 0.5) {
            this.ENGINE.render.save();
            let translatedLocation = this.ENGINE.CAMERA.translate({ x: this.x, y: this.y });
            this.ENGINE.render.translate(translatedLocation.x, translatedLocation.y);
            this.ENGINE.render.scale(this.ENGINE.CAMERA.zoomLevel, this.ENGINE.CAMERA.zoomLevel);
            this.energyPackets.forEach((packet) => {
                this.ENGINE.render.beginPath();
                this.ENGINE.render.fillStyle = 'white';
                this.ENGINE.render.arc(packet.x, packet.y, 4, 0, 2 * Math.PI);
                this.ENGINE.render.fill();
                this.ENGINE.render.closePath();
            });
            this.ENGINE.render.restore(); // Restore original state
        }
    },

    drawGhost() {
        // Start a new drawing state
        this.ENGINE.render.save();
        let translatedLocation = this.ENGINE.CAMERA.translate({ x: this.x, y: this.y });
        this.ENGINE.render.translate(translatedLocation.x, translatedLocation.y);
        this.ENGINE.render.scale(this.ENGINE.CAMERA.zoomLevel, this.ENGINE.CAMERA.zoomLevel);

        //EnergyNode location for debugging
        if (this.debug) {
            this.ENGINE.render.fillStyle = 'black';
            this.ENGINE.render.fillText(Math.round(this.x) + ',' + Math.round(this.y), this.radius + 2, this.radius + 2);
        }

        this.ENGINE.render.strokeStyle = 'blue';
        if (!this.canBePlaced) this.ENGINE.render.strokeStyle = 'red';
        this.ENGINE.render.lineWidth = 1;

        //get linkable Nodes
        let linkTo = this.ENGINE.STATES.getEntitiesInRange('energyLinkableEntities', this, this.distanceCanLink);
        let relativeLocation;
        this.canBePlaced = true;
        let overlapping = false;
        linkTo.forEach((otherNode) => {
            overlapping = Hitbox.collideCircleCircle({ x: this.x, y: this.y, r: this.radius }, { x: otherNode.x, y: otherNode.y, r: otherNode.radius });
            if (overlapping) this.canBePlaced = false;
            relativeLocation = { x: otherNode.x - this.x, y: otherNode.y - this.y };
            this.ENGINE.render.beginPath();
            this.ENGINE.render.moveTo(0, 0);
            this.ENGINE.render.lineTo(relativeLocation.x, relativeLocation.y);
            this.ENGINE.render.stroke();
            this.ENGINE.render.closePath();
        });
        //not sure if helpful to speed up GC
        linkTo = undefined;
        relativeLocation = undefined;

        //show distance to link
        this.ENGINE.render.beginPath();
        this.ENGINE.render.strokeStyle = 'blue';
        if (!this.canBePlaced) this.ENGINE.render.strokeStyle = 'red';
        this.ENGINE.render.lineWidth = 1;
        this.ENGINE.render.arc(0, 0, this.distanceCanLink, 0, 2 * Math.PI);
        this.ENGINE.render.stroke();
        this.ENGINE.render.closePath();
        //main body
        this.ENGINE.render.beginPath();
        let gradient = this.ENGINE.render.createRadialGradient(0, 0, 0, 0, 0, this.radius);
        gradient.addColorStop(0, `rgba(${this.currentStartColor.r},${this.currentStartColor.g},${this.currentStartColor.b},${this.currentStartColor.a / 2})`);
        gradient.addColorStop(1, `rgba(${this.currentEndColor.r},${this.currentEndColor.g},${this.currentEndColor.b},${this.currentEndColor.a / 2})`);
        this.ENGINE.render.fillStyle = gradient;
        this.ENGINE.render.arc(0, 0, this.radius, 0, 2 * Math.PI);
        this.ENGINE.render.fill();
        this.ENGINE.render.closePath();

        this.ENGINE.render.restore(); // Restore original state
    } //draw ghost
}; //end EnergyNode Class
