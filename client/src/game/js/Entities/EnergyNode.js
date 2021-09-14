const Utilities = require('../../shared/Utilities.js');
module.exports = class EnergyNode {
    constructor({ id = null, x = 0, y = 0, debug = false, engine = null } = {}) {
        this.ENGINE = engine;
        this.x = x;
        this.y = y;
        this.id = id;
        this.heat = 0;
        this.maxHeat = 2000;
        this.radius = 12;
        this.distanceCanLink = 100;
        this.travelMax = 2000;
        this.debug = debug;
        this.startColor = { r: 0, g: 255, b: 0, a: 1 };
        this.endColor = { r: 255, g: 255, b: 0, a: 1 };
        this.currentStartColor = { r: 0, g: 255, b: 0, a: 1 };
        this.currentEndColor = { r: 255, g: 255, b: 0, a: 1 };
        this.hotStartColor = { r: 255, g: 0, b: 255, a: 1 };
        this.hotEndColor = { r: 255, g: 0, b: 0, a: 1 };
        this.energyPackets = [{ travel: this.travelMax, x: this.distanceCanLink, y: 0, startX: this.distanceCanLink, startY: 0, fromId: null }];
        this.selected = false;

        this.otherLinkableEntities = this.ENGINE.STATES.getEntitiesInRange('energyLinkableEntities', this, this.distanceCanLink);
        this.currentLinkIndex = 0;

        //add yourself to others linkable
        this.otherLinkableEntities.forEach((otherLinkable) => {
            otherLinkable.otherLinkableEntities.push(this);
        });

        if (debug) console.log('Created EnergyNode at', this.x, this.y);
    } //constructor

    update(deltaTime) {
        //update heat and color
        this.heat -= deltaTime;
        if (this.heat < 0) this.heat = 0;
        if (this.heat > this.maxHeat) this.heat = this.maxHeat;
        this.currentStartColor = Utilities.colorBlend(this.startColor, this.hotStartColor, this.heat / this.maxHeat);
        this.currentEndColor = Utilities.colorBlend(this.endColor, this.hotEndColor, this.heat / this.maxHeat);

        for (let i = this.energyPackets.length - 1; i >= 0; i--) {
            this.energyPackets[i].travel -= deltaTime;
            if (this.energyPackets[i].travel <= 0) {
                //TODO dont send, but delete if at max heat
                this.sendPacketOut();
                this.energyPackets.splice(i, 1);
                continue;
            }
            this.energyPackets[i].x = (this.energyPackets[i].travel / this.travelMax) * this.energyPackets[i].startX;
            this.energyPackets[i].y = (this.energyPackets[i].travel / this.travelMax) * this.energyPackets[i].startY;
        }
    }

    sendPacketOut() {
        // console.log('sendPacketOut');
        //generate heat as packets pass through EnergyNode
        this.heat += 500; //TODO re-balance
        //check for Entities in range that want to consume packets

        //else pass to next Energy Node
        if (this.otherLinkableEntities.length > 0) {
            let sendTo = this.otherLinkableEntities[this.currentLinkIndex];
            this.currentLinkIndex++;
            if (this.currentLinkIndex >= this.otherLinkableEntities.length) this.currentLinkIndex = 0;
            sendTo.receivePacket(this.x, this.y, this.id);
        }

        //If nowhere to pass, send back, else dont spawn packet, aka lost energy
    }

    receivePacket(x, y, fromId) {
        let travel = Math.round((Utilities.dist({ x, y }, { x: this.x, y: this.y }) / this.distanceCanLink) * this.travelMax);
        // console.log('receivePacket, travel, fromId,x,y :>> ', travel, fromId, x, y);
        let newPacket = { travel: travel, x: x - this.x, y: y - this.y, startX: x - this.x, startY: y - this.y, fromId };
        this.energyPackets.push(newPacket);
    }

    draw(ENGINE, ghost = false) {
        // Start a new drawing state
        ENGINE.render.save();
        let translatedLocation = ENGINE.CAMERA.translate({ x: this.x, y: this.y });
        ENGINE.render.scale(ENGINE.CAMERA.zoomLevel, ENGINE.CAMERA.zoomLevel);
        ENGINE.render.translate(translatedLocation.x, translatedLocation.y);

        //EnergyNode location for debugging
        if (this.debug) {
            ENGINE.render.fillStyle = 'black';
            ENGINE.render.fillText(Math.round(this.x) + ',' + Math.round(this.y), this.radius + 2, this.radius + 2);
        }

        if (ghost) {
            ENGINE.render.strokeStyle = 'blue';
            ENGINE.render.lineWidth = 1;

            //get linkable Nodes
            let linkTo = ENGINE.STATES.getEntitiesInRange('energyLinkableEntities', this, this.distanceCanLink);
            linkTo.forEach((otherNode) => {
                let relativeLocation = { x: otherNode.x - this.x, y: otherNode.y - this.y };
                ENGINE.render.beginPath();
                ENGINE.render.moveTo(0, 0);
                ENGINE.render.lineTo(relativeLocation.x, relativeLocation.y);
                ENGINE.render.stroke();
                ENGINE.render.closePath();
            });

            //show distance to link
            ENGINE.render.beginPath();
            ENGINE.render.strokeStyle = 'blue';
            ENGINE.render.lineWidth = 1;
            ENGINE.render.arc(0, 0, this.distanceCanLink, 0, 2 * Math.PI);
            ENGINE.render.stroke();
            ENGINE.render.closePath();
            //main body
            ENGINE.render.beginPath();
            let gradient = ENGINE.render.createRadialGradient(0, 0, 0, 0, 0, this.radius);
            gradient.addColorStop(
                0,
                `rgba(${this.currentStartColor.r},${this.currentStartColor.g},${this.currentStartColor.b},${this.currentStartColor.a / 2})`
            );
            gradient.addColorStop(1, `rgba(${this.currentEndColor.r},${this.currentEndColor.g},${this.currentEndColor.b},${this.currentEndColor.a / 2})`);
            ENGINE.render.fillStyle = gradient;
            ENGINE.render.arc(0, 0, this.radius, 0, 2 * Math.PI);
            ENGINE.render.fill();
            ENGINE.render.closePath();
        } else {
            //draw main body
            ENGINE.render.beginPath();
            // 	context.createRadialGradient(x0,y0,r0,x1,y1,r1);
            if (this.ENGINE.CAMERA.zoomLevel <= 0.5) {
                ENGINE.render.fillStyle = `rgba(${this.currentEndColor.r},${this.currentEndColor.g},${this.currentEndColor.b},${this.currentEndColor.a})`;
                ENGINE.render.arc(0, 0, this.radius, 0, 2 * Math.PI);
                ENGINE.render.fill();
                ENGINE.render.closePath();
            } else {
                let gradient = ENGINE.render.createRadialGradient(0, 0, 0, 0, 0, this.radius);
                gradient.addColorStop(
                    0,
                    `rgba(${this.currentStartColor.r},${this.currentStartColor.g},${this.currentStartColor.b},${this.currentStartColor.a})`
                );
                gradient.addColorStop(1, `rgba(${this.currentEndColor.r},${this.currentEndColor.g},${this.currentEndColor.b},${this.currentEndColor.a})`);
                ENGINE.render.fillStyle = gradient;
                //void ctx.arc(x, y, radius, startAngle, endAngle [, counterclockwise]);
                ENGINE.render.arc(0, 0, this.radius, 0, 2 * Math.PI);
                ENGINE.render.fill();
                ENGINE.render.closePath();

                //draw energyPackets
                this.energyPackets.forEach((packet) => {
                    ENGINE.render.beginPath();
                    ENGINE.render.fillStyle = 'white';
                    ENGINE.render.arc(packet.x, packet.y, 4, 0, 2 * Math.PI);
                    ENGINE.render.fill();
                    ENGINE.render.closePath();
                });
            }
        }

        ENGINE.render.restore(); // Restore original state
    }
}; //end EnergyNode Class
