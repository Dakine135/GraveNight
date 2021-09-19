const Utilities = require('../shared/Utilities.js');
const Hitbox = require('../shared/Hitbox.js');
const EnergyNode = require('./Entities/EnergyNode');

module.exports = class StatesManager {
    constructor({ debug = false, debugState = false, engine = null }) {
        console.log('Create State Manager');
        this.debug = debug;
        this.debugState = debugState;
        this.ENGINE = engine;
        this.numberOfDrawLayers = 2;

        this.currentEntityId = 0;

        this.updatableEntities = {};
        this.drawableEntities = {};
        this.lightBlockingEntities = {};
        this.collisionEntities = {};
        this.energyLinkableEntities = {};
    } //constructor

    update(deltaTime) {
        Object.entries(this.updatableEntities).forEach(([id, entity]) => {
            entity.update(deltaTime);
        });
    }

    draw(deltaTime) {
        for (let i = 0; i < this.numberOfDrawLayers; i++) {
            Object.entries(this.drawableEntities).forEach(([id, entity]) => {
                if (entity[`draw${i}`]) entity[`draw${i}`](deltaTime);
            });
        }
        // let drawingState = this.getIntermediateState(deltaTime);

        // if (drawingState == null) return;
    } //draw

    getIntermediateState(deltaTime) {} // getIntermediateState

    placeEnergyNode({ x = this.ENGINE.CONTROLS.mouseLocationInWorld.x, y = this.ENGINE.CONTROLS.mouseLocationInWorld.y } = {}) {
        // console.log('placeEnergyNode');
        if (this.ENGINE.HUD.ghost != null) {
            (x = this.ENGINE.HUD.ghost.x), (y = this.ENGINE.HUD.ghost.y);
        }

        //get other Nodes
        //hard coded distance node radius at this time is 12
        //distance can link is 100
        let nearby = this.getEntitiesInRange('energyLinkableEntities', { x, y }, 50);
        let canBePlaced = true;
        let overlapping = false;
        nearby.forEach((otherNode) => {
            overlapping = Hitbox.collideCircleCircle({ x, y, r: 12 }, { x: otherNode.x, y: otherNode.y, r: otherNode.radius });
            if (overlapping) canBePlaced = false;
        });

        if (canBePlaced) {
            let newEnergyNode = new EnergyNode({ id: this.currentEntityId, x, y, engine: this.ENGINE });
            this.updatableEntities[this.currentEntityId] = newEnergyNode;
            this.drawableEntities[this.currentEntityId] = newEnergyNode;
            this.energyLinkableEntities[this.currentEntityId] = newEnergyNode;
            this.currentEntityId++;
        } else {
            // console.log('Something is in the way');
        }
    }

    getEntitiesInRange(type, point, distance) {
        //TODO use quad tree here to speed things along
        let result = [];
        Object.entries(this[type]).forEach(([id, entity]) => {
            if (Utilities.dist(point, { x: entity.x, y: entity.y }) <= distance) result.push(entity);
        });
        return result;
    }
}; //States class
