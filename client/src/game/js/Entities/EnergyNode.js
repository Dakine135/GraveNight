module.exports = class EnergyNode {
    constructor({ id = null, x = 0, y = 0, debug = false } = {}) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.radius = 15;
        this.distanceCanLink = 100;
        this.debug = debug;
        this.startColor = { r: 0, g: 255, b: 0, a: 1 };
        this.endColor = { r: 255, g: 255, b: 0, a: 1 };
        this.currentStartColor = { r: 0, g: 255, b: 0, a: 1 };
        this.currentEndColor = { r: 255, g: 255, b: 0, a: 1 };
        this.hotStartColor = { r: 255, g: 0, b: 255, a: 1 };
        this.hotEndColor = { r: 255, g: 0, b: 0, a: 1 };
        this.energyPackets = [{ travel: 1000, x: this.x + this.distanceCanLink, y: 0, angle: 0 }];
        this.selected = false;

        if (debug) console.log('Created EnergyNode at', this.x, this.y);
    } //constructor

    update(deltaTime) {
        for (let i = this.energyPackets.length - 1; i >= 0; i--) {
            this.energyPackets[i].travel -= deltaTime;
            if (this.energyPackets[i].travel <= 0) {
                this.sendPacketOut();
                this.energyPackets.splice(i, 1);
                continue;
            }
        }
    }

    sendPacketOut() {
        console.log('sendPacketOut');
    }

    draw(ENGINE, ghost = false) {
        // Start a new drawing state
        ENGINE.render.save();
        let translatedLocation = ENGINE.CAMERA.translate({ x: this.x, y: this.y });
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
            let gradient = ENGINE.render.createRadialGradient(0, 0, 0, 0, 0, this.radius);
            gradient.addColorStop(0, `rgba(${this.currentStartColor.r},${this.currentStartColor.g},${this.currentStartColor.b},${this.currentStartColor.a})`);
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
                ENGINE.render.arc(packet.x, packet.y, 2, 0, 2 * Math.PI);
                ENGINE.render.fill();
                ENGINE.render.closePath();
            });
        }

        ENGINE.render.restore(); // Restore original state
    }
}; //end EnergyNode Class
