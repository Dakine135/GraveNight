const Utilities = require('../shared/Utilities.js');
const EnergyNode = require('./Entities/EnergyNode');

module.exports = class StatesManager {
    constructor({ debug = false, debugState = false, engine = null }) {
        console.log('Create State Manager');
        this.debug = debug;
        this.debugState = debugState;
        this.ENGINE = engine;

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
        Object.entries(this.drawableEntities).forEach(([id, entity]) => {
            entity.draw(this.ENGINE);
        });
        // let drawingState = this.getIntermediateState(deltaTime);

        // if (drawingState == null) return;
    } //draw

    getIntermediateState(deltaTime) {} // getIntermediateState

    placeEnergyNode({ x = this.ENGINE.CONTROLS.mouseLocationInWorld.x, y = this.ENGINE.CONTROLS.mouseLocationInWorld.y } = {}) {
        console.log('placeEnergyNode');
        let newEnergyNode = new EnergyNode({ id: this.currentEntityId, x, y });
        this.updatableEntities[this.currentEntityId] = newEnergyNode;
        this.drawableEntities[this.currentEntityId] = newEnergyNode;
        this.energyLinkableEntities[this.currentEntityId] = newEnergyNode;
        this.currentEntityId++;
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
