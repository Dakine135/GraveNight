const Utilities = require('../../shared/Utilities.js');
const Hitbox = require('../../shared/Hitbox.js');
const PIXI = require('pixi.js');
// import * as PIXI from 'pixi.js';

const type = 'EnergyNode';
const travelMax = 100.0;
const distanceCanLink = 100.0;
const maxHeat = 2000.0;
const radius = 12;
const startColor = { r: 0, g: 255, b: 0, a: 1 };
const endColor = { r: 255, g: 0, b: 0, a: 1 };
// const hotStartColor = { r: 255, g: 0, b: 255, a: 1 };
// const hotEndColor = { r: 255, g: 0, b: 0, a: 1 };
module.exports = EnergyNodeClass = {
    type,
    travelMax: travelMax,
    distanceCanLink: distanceCanLink,
    maxHeat: maxHeat,
    radius: radius,
    startColor: { r: 0, g: 255, b: 0, a: 1 },
    endColor: { r: 255, g: 0, b: 0, a: 1 },
    availableEnergyPackets: [],
    new({ id = null, x = 0, y = 0, debug = false, ENGINE = null } = {}) {
        const EnergyNodePixiContainer = new PIXI.Container();
        EnergyNodePixiContainer.x = x;
        EnergyNodePixiContainer.y = y;
        EnergyNodePixiContainer.name = `EnergyNodeContainer${id}`;

        //main EnergyNode Graphics
        ENGINE.ENTITY_CLASSES[type].createGraphics(EnergyNodePixiContainer, id);

        let newEnergyNode = {
            type,
            x: x,
            y: y,
            id: id,
            heat: 0,
            debug: debug,
            currentColor: { r: 0, g: 255, b: 0, a: 1 },
            energyPackets: [],
            selected: false,
            canBePlaced: true,
            otherLinkableEntities: [],
            currentLinkIndex: 0,
            temp: { linkTo: [], translatedLocation: { x: 0, y: 0 } },
            pixiGraphicContainer: EnergyNodePixiContainer
        };

        ENGINE.STATES.getEntitiesInRange(newEnergyNode.otherLinkableEntities, 'energyLinkableEntities', { x, y }, distanceCanLink);

        //add yourself to others linkable
        newEnergyNode.otherLinkableEntities.forEach((otherLinkable) => {
            otherLinkable.otherLinkableEntities.push(newEnergyNode);
        });

        //create energyPacket for testing, add to EnergyNode's container
        // console.log('object :>> ', object);
        let energyPacket = ENGINE.ENTITY_CLASSES[type].newEnergyPacket(newEnergyNode.pixiGraphicContainer);
        newEnergyNode.energyPackets.push(energyPacket);
        // newEnergyNode.pixiGraphicContainer.addChild(energyPacket.pixiGraphic);

        ENGINE.mainPixiContainer.addChild(EnergyNodePixiContainer);

        if (debug) console.log('Created EnergyNode at', x, y);
        return newEnergyNode;
    }, //constructor

    newEnergyPacket(
        container,
        { travel = travelMax, x = distanceCanLink, y = 0, startX = distanceCanLink, startY = 0, fromId = null } = {}
    ) {
        // this.ENGINE.pixiApp.loader.add('grassSpriteSheet', 'assets/background/grass.json').load(this.setup.bind(this));

        // const EnergyPacketPixi = new PIXI.Graphics();
        // // Circle
        // EnergyPacketPixi.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
        // EnergyPacketPixi.beginFill(0xffffff, 1);
        // EnergyPacketPixi.drawCircle(0, 0, 4);
        // EnergyPacketPixi.endFill();
        // EnergyPacketPixi.name = 'EnergyPacketGraphics';

        return {
            travel,
            x,
            y,
            startX,
            startY,
            fromId,
            pixiGraphic: window.ENGINE.ENTITY_CLASSES['EnergyNode'].createPacketGraphics(container)
        };
    },

    update(ENGINE, deltaTime) {
        //update heat and color
        this.selected = false;
        // if (this.id == 1) console.log('this.heat :>> ', this.heat);
        this.heat -= deltaTime * 10;
        if (this.heat < 0) this.heat = 0;
        if (this.heat > maxHeat) this.heat = maxHeat;
        // console.log('this.currentColor :>> ', this.currentColor);
        Utilities.colorBlend(this.currentColor, endColor, startColor, this.heat / maxHeat);
        let tintColor = PIXI.utils.rgb2hex([this.currentColor.b, this.currentColor.g, this.currentColor.r]);
        // this.pixiGraphicContainer.getChildByName(`EnergyNodeGraphicsMainBody${this.id}`).tint = 0xffffff;
        this.pixiGraphicContainer.getChildByName(`EnergyNodeGraphicsMainBody${this.id}`).tint = tintColor;
        // console.log('this.currentStartColor :>> ', this.currentStartColor);

        for (let i = this.energyPackets.length - 1; i >= 0; i--) {
            this.energyPackets[i].travel -= deltaTime;
            if (this.energyPackets[i].travel <= 0) {
                //TODO dont send, but delete if at max heat
                //TODO set to not render if going to available
                ENGINE.ENTITY_CLASSES['EnergyNode'].availableEnergyPackets.push(this.energyPackets[i]);
                ENGINE.ENTITY_CLASSES['EnergyNode'].sendPacketOut.bind(this)(ENGINE, this.energyPackets[i].fromId);
                this.energyPackets.splice(i, 1);
                continue;
            }
            this.energyPackets[i].x = (this.energyPackets[i].travel / travelMax) * this.energyPackets[i].startX;
            this.energyPackets[i].y = (this.energyPackets[i].travel / travelMax) * this.energyPackets[i].startY;
            this.energyPackets[i].pixiGraphic.setTransform(this.energyPackets[i].x, this.energyPackets[i].y);
        }
    },

    sendPacketOut(ENGINE, previouslyFromId) {
        // console.log('sendPacketOut');
        //generate heat as packets pass through EnergyNode
        this.heat += 300; //TODO re-balance
        //check for Entities in range that want to consume packets

        //else pass to next Energy Node
        if (this.otherLinkableEntities.length > 0) {
            this.temp.sendTo = this.otherLinkableEntities[this.currentLinkIndex];
            // console.log('this.temp.sendTo :>> ', this.temp.sendTo);
            // console.log('this.otherLinkableEntities :>> ', this.otherLinkableEntities);
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
            //TODO mark render-able again
            reusePacket.travel = travel;
            reusePacket.x = x - this.x;
            reusePacket.y = y - this.y;
            reusePacket.startX = x - this.x;
            reusePacket.startY = y - this.y;
            reusePacket.fromId = fromId;
            reusePacket.pixiGraphic.setParent(this.pixiGraphicContainer);
            reusePacket.pixiGraphic.setTransform(reusePacket.x, reusePacket.y);
            this.energyPackets.push(reusePacket);
        } else {
            let newPacket = ENGINE.ENTITY_CLASSES[type].newEnergyPacket(this.pixiGraphicContainer, {
                travel: travel,
                x: x - this.x,
                y: y - this.y,
                startX: x - this.x,
                startY: y - this.y,
                fromId
            });
            this.energyPackets.push(newPacket);
        }
    },

    createGraphics(container, id) {
        const EnergyNodePixi = new PIXI.Sprite(window.ENGINE.pixiApp.loader.resources.energyNodeSpriteSheet.textures[`light.png`]);
        EnergyNodePixi.name = `EnergyNodeGraphicsMainBody${id}`;
        EnergyNodePixi.anchor.set(0.5, 0.5);
        EnergyNodePixi.scale.set(0.4, 0.4);
        EnergyNodePixi.tint = 0x00ff00;

        // let mainBody = new PIXI.Graphics();
        // mainBody.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
        // mainBody.beginFill(0xde3249, 1);
        // mainBody.drawCircle(0, 0, radius);
        // mainBody.endFill();
        // mainBody.name = `EnergyNodeGraphicsMainBody${id}`;
        container.addChild(EnergyNodePixi);
        return EnergyNodePixi;
    },

    createPacketGraphics(container) {
        // console.log(
        //     'window.ENGINE.pixiApp.loader.resources.energyPacketSpriteSheet.data :>> ',
        //     window.ENGINE.pixiApp.loader.resources.energyPacketSpriteSheet.data.animations.energyPacket
        // );

        let frames = window.ENGINE.pixiApp.loader.resources.energyPacketSpriteSheet.spritesheet.animations.energyPacket;

        const EnergyPacketPixi = new PIXI.AnimatedSprite(frames);
        EnergyPacketPixi.name = 'EnergyPacketGraphics';
        EnergyPacketPixi.animationSpeed = 1;
        EnergyPacketPixi.anchor.set(0.5, 0.5);
        EnergyPacketPixi.alpha = 0.8;
        EnergyPacketPixi.play();

        // const EnergyPacketPixi = new PIXI.Graphics();
        // // Circle
        // EnergyPacketPixi.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
        // EnergyPacketPixi.beginFill(0xffffff, 1);
        // EnergyPacketPixi.drawCircle(0, 0, 4);
        // EnergyPacketPixi.endFill();
        // EnergyPacketPixi.name = 'EnergyPacketGraphics';
        container.addChild(EnergyPacketPixi);
        return EnergyPacketPixi;
    },

    toJSON() {
        return {
            type: 'EnergyNode',
            x: this.x,
            y: this.y,
            id: this.id,
            heat: this.heat,
            currentColor: this.currentColor,
            energyPackets: this.energyPackets.map((packet) => {
                return {
                    travel: packet.travel,
                    x: packet.x,
                    y: packet.y,
                    startX: packet.startX,
                    startY: packet.startY,
                    fromId: packet.fromId
                };
            }),
            otherLinkableEntities: this.otherLinkableEntities.map((other) => {
                if (other.id == null) {
                    console.log('other :>> ', other);
                }
                return other.id;
            }),
            currentLinkIndex: this.currentLinkIndex
        };
    },
    restoreFromSave(STATES, energyNode) {
        energyNode.debug = false;
        energyNode.selected = false;
        energyNode.canBePlaced = true;
        energyNode.otherLinkableEntities = energyNode.otherLinkableEntities.map((id) => {
            if (STATES.currentState.entities[id] == null) {
                console.log('energyNode.id :>> ', energyNode.id);
                console.log('id :>> ', id);
                console.log('STATES.currentState.entities[id] :>> ', STATES.currentState.entities[id]);
                console.log('energyNode.otherLinkableEntities :>> ', JSON.stringify(energyNode.otherLinkableEntities));
            }
            return STATES.currentState.entities[id];
        });

        const EnergyNodePixiContainer = new PIXI.Container();
        EnergyNodePixiContainer.x = energyNode.x;
        EnergyNodePixiContainer.y = energyNode.y;
        EnergyNodePixiContainer.name = `EnergyNodeContainer${energyNode.id}`;

        STATES.ENGINE.ENTITY_CLASSES[type].createGraphics(EnergyNodePixiContainer, energyNode.id);

        energyNode.pixiGraphicContainer = EnergyNodePixiContainer;

        energyNode.energyPackets = energyNode.energyPackets.map((packet) => {
            const EnergyPacketPixi = STATES.ENGINE.ENTITY_CLASSES[type].createPacketGraphics(energyNode.pixiGraphicContainer);
            packet.pixiGraphic = EnergyPacketPixi;
            return packet;
        });
        energyNode.temp = { linkTo: [], translatedLocation: { x: 0, y: 0 } };
        STATES.ENGINE.mainPixiContainer.addChild(EnergyNodePixiContainer);
    }
}; //end EnergyNode Class
